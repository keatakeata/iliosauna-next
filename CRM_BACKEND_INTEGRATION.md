# CRM Backend Integration Guide

## GoHighLevel Integration Architecture

### Overview
This document outlines the backend integration between Ilio Sauna's order management system and GoHighLevel CRM for real-time order status synchronization.

## Authentication Setup

### API Credentials
```javascript
// Environment variables needed
GOHIGHLEVEL_API_KEY=your_api_key_here
GOHIGHLEVEL_LOCATION_ID=your_location_id
GOHIGHLEVEL_WEBHOOK_SECRET=webhook_verification_secret
```

### OAuth 2.0 Configuration
```javascript
const ghlConfig = {
  client_id: process.env.GHL_CLIENT_ID,
  client_secret: process.env.GHL_CLIENT_SECRET,
  redirect_uri: 'https://iliosauna.com/api/auth/ghl/callback',
  scopes: ['contacts.write', 'opportunities.write', 'calendars.write']
};
```

## Webhook Endpoints

### 1. Receive Status Updates from GHL
```typescript
// POST /api/webhooks/ghl/order-status
export async function POST(request: Request) {
  const signature = request.headers.get('x-ghl-signature');
  const body = await request.json();
  
  // Verify webhook signature
  if (!verifyWebhookSignature(signature, body)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const { contactId, customFields, pipelineStage } = body;
  
  // Map GHL pipeline stage to order status
  const orderStatus = mapGHLStageToOrderStatus(pipelineStage);
  
  // Update order in database
  await updateOrderStatus(contactId, orderStatus);
  
  // Notify customer
  await sendStatusNotification(contactId, orderStatus);
  
  return Response.json({ success: true });
}
```

### 2. Send Updates to GHL
```typescript
// POST /api/orders/{orderId}/status
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const order = await getOrderById(orderId);
  
  // Update GHL contact
  const ghlUpdate = {
    contactId: order.ghl_contact_id,
    customFields: [
      { id: 'order_status', value: newStatus },
      { id: 'last_updated', value: new Date().toISOString() },
      { id: 'progress_percentage', value: getProgressPercentage(newStatus) }
    ],
    tags: [`status_${newStatus}`]
  };
  
  await fetch(`https://api.gohighlevel.com/v1/contacts/${order.ghl_contact_id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${process.env.GOHIGHLEVEL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ghlUpdate)
  });
  
  // Move opportunity to new pipeline stage
  await moveOpportunityStage(order.ghl_opportunity_id, newStatus);
}
```

## Data Synchronization

### Initial Order Creation
```typescript
export async function createOrderInGHL(orderData: OrderData) {
  // 1. Create or update contact
  const contact = await createGHLContact({
    firstName: orderData.customer.firstName,
    lastName: orderData.customer.lastName,
    email: orderData.customer.email,
    phone: orderData.customer.phone,
    customFields: [
      { id: 'order_number', value: orderData.orderNumber },
      { id: 'order_total', value: orderData.totalAmount },
      { id: 'sauna_model', value: orderData.product.name }
    ]
  });
  
  // 2. Create opportunity
  const opportunity = await createGHLOpportunity({
    contactId: contact.id,
    name: `Order #${orderData.orderNumber}`,
    pipelineId: process.env.GHL_ORDERS_PIPELINE_ID,
    pipelineStageId: process.env.GHL_STAGE_ORDER_PLACED,
    monetaryValue: orderData.totalAmount,
    customFields: [
      { id: 'stripe_payment_id', value: orderData.stripePaymentId },
      { id: 'delivery_address', value: formatAddress(orderData.shippingAddress) }
    ]
  });
  
  // 3. Store GHL IDs in our database
  await updateOrder(orderData.id, {
    ghl_contact_id: contact.id,
    ghl_opportunity_id: opportunity.id
  });
  
  return { contact, opportunity };
}
```

### Status Mapping
```typescript
const STATUS_MAPPING = {
  // Our Status -> GHL Pipeline Stage
  'order_placed': 'stage_new_order',
  'processing': 'stage_processing',
  'manufacturing': 'stage_in_production',
  'shipped': 'stage_shipped',
  'delivered': 'stage_delivered',
  'installation': 'stage_installation',
  'completed': 'stage_completed'
};

const REVERSE_STATUS_MAPPING = {
  // GHL Pipeline Stage -> Our Status
  'stage_new_order': 'order_placed',
  'stage_processing': 'processing',
  'stage_in_production': 'manufacturing',
  'stage_shipped': 'shipped',
  'stage_delivered': 'delivered',
  'stage_installation': 'installation',
  'stage_completed': 'completed'
};
```

## Real-time Updates

### WebSocket Connection
```typescript
// Establish WebSocket connection for real-time updates
import { io } from 'socket.io-client';

const ghlSocket = io('wss://api.gohighlevel.com/socket', {
  auth: {
    token: process.env.GOHIGHLEVEL_API_KEY
  }
});

ghlSocket.on('contact.updated', async (data) => {
  const { contactId, customFields } = data;
  const orderStatus = customFields.find(f => f.id === 'order_status')?.value;
  
  if (orderStatus) {
    await syncOrderStatus(contactId, orderStatus);
    await notifyFrontend(contactId, orderStatus);
  }
});

ghlSocket.on('opportunity.stage.changed', async (data) => {
  const { opportunityId, newStageId, previousStageId } = data;
  await handleStageTransition(opportunityId, newStageId, previousStageId);
});
```

### Push Notifications
```typescript
export async function notifyFrontend(orderId: string, newStatus: string) {
  // Send Server-Sent Events to frontend
  const clients = getSSEClients(orderId);
  
  clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'STATUS_UPDATE',
      orderId,
      status: newStatus,
      timestamp: new Date().toISOString()
    }));
  });
  
  // Also update via Pusher/WebSocket
  pusher.trigger(`order-${orderId}`, 'status-changed', {
    status: newStatus,
    timestamp: new Date().toISOString()
  });
}
```

## Automated Workflows

### Manufacturing Progress Updates
```typescript
// Cron job to update manufacturing progress
export async function updateManufacturingProgress() {
  const ordersInManufacturing = await getOrdersByStatus('manufacturing');
  
  for (const order of ordersInManufacturing) {
    const progress = await getManufacturingProgress(order.id);
    
    // Update GHL custom field
    await updateGHLCustomField(order.ghl_contact_id, 'manufacturing_progress', progress);
    
    // Send progress notification at milestones
    if ([25, 50, 75, 100].includes(progress)) {
      await sendProgressEmail(order, progress);
    }
    
    // Move to next stage if complete
    if (progress === 100) {
      await updateOrderStatus(order.id, 'quality_check');
    }
  }
}
```

### Installation Scheduling
```typescript
export async function scheduleInstallation(orderId: string, preferredDate: string) {
  const order = await getOrderById(orderId);
  
  // Create GHL calendar appointment
  const appointment = await createGHLAppointment({
    contactId: order.ghl_contact_id,
    calendarId: process.env.GHL_INSTALLATION_CALENDAR_ID,
    startTime: preferredDate,
    endTime: addHours(preferredDate, 6),
    title: `Sauna Installation - Order #${order.order_number}`,
    address: order.shipping_address,
    assignedUserId: await getAvailableInstaller(preferredDate),
    customFields: {
      order_id: orderId,
      sauna_model: order.product.name,
      special_instructions: order.installation_notes
    }
  });
  
  // Update order with appointment
  await updateOrder(orderId, {
    installation_appointment_id: appointment.id,
    installation_date: preferredDate,
    installation_status: 'scheduled'
  });
  
  // Send confirmation
  await sendInstallationConfirmation(order, appointment);
  
  return appointment;
}
```

## Error Handling

### Retry Logic
```typescript
import { retry } from '@lifeomic/attempt';

export async function syncWithGHL(operation: () => Promise<any>) {
  return retry(
    async () => {
      try {
        return await operation();
      } catch (error) {
        // Log to monitoring service
        logger.error('GHL sync failed', error);
        
        // Check if recoverable
        if (isRecoverableError(error)) {
          throw error; // Will retry
        }
        
        // Non-recoverable, handle gracefully
        await handleSyncFailure(error);
        return null;
      }
    },
    {
      delay: 1000,
      maxAttempts: 3,
      factor: 2
    }
  );
}
```

### Webhook Verification
```typescript
import crypto from 'crypto';

export function verifyWebhookSignature(signature: string, body: any): boolean {
  const secret = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}
```

## Database Schema for CRM Integration

```sql
-- Add GHL integration columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghl_contact_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghl_opportunity_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghl_appointment_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghl_sync_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ghl_last_sync TIMESTAMP;

-- CRM sync log for debugging
CREATE TABLE crm_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  sync_type VARCHAR(50), -- 'push' or 'pull'
  sync_status VARCHAR(50), -- 'success', 'failed', 'pending'
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook events log
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100),
  source VARCHAR(50), -- 'gohighlevel', 'stripe', etc
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Testing Integration

### Test Webhook Endpoint
```typescript
// POST /api/test/webhook
export async function testWebhook() {
  const testPayload = {
    contactId: "test_contact_123",
    pipelineStage: "stage_in_production",
    customFields: [
      { id: "order_status", value: "manufacturing" },
      { id: "progress_percentage", value: 50 }
    ],
    timestamp: new Date().toISOString()
  };
  
  const response = await fetch('http://localhost:3000/api/webhooks/ghl/order-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ghl-signature': generateTestSignature(testPayload)
    },
    body: JSON.stringify(testPayload)
  });
  
  return response.json();
}
```

## Monitoring & Logging

### Health Check Endpoint
```typescript
// GET /api/health/crm
export async function GET() {
  const checks = {
    ghl_api: await checkGHLConnection(),
    webhook_listener: await checkWebhookListener(),
    sync_queue: await checkSyncQueue(),
    last_sync: await getLastSuccessfulSync()
  };
  
  const isHealthy = Object.values(checks).every(check => check.status === 'ok');
  
  return Response.json({
    status: isHealthy ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  }, { status: isHealthy ? 200 : 503 });
}
```

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure webhook URLs in GHL
- [ ] Test webhook signature verification
- [ ] Set up error monitoring (Sentry)
- [ ] Configure retry queues
- [ ] Test all status transitions
- [ ] Verify email notifications
- [ ] Load test webhook endpoints
- [ ] Set up backup sync mechanism
- [ ] Document API rate limits