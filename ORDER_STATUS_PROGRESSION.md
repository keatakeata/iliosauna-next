# Order Status Progression System

## Overview
A sophisticated order tracking system that provides real-time visibility into the luxury sauna manufacturing and delivery process.

## Status Definitions

### 1. Order Placed
- **Trigger**: Payment successfully processed via Stripe
- **Customer Actions**: View order confirmation
- **Internal Actions**: 
  - Send confirmation email
  - Create order in database
  - Trigger CRM workflow
- **Duration**: Immediate

### 2. Processing
- **Trigger**: Order reviewed by team
- **Customer Actions**: Upload site photos, provide measurements
- **Internal Actions**:
  - Contact customer for site details
  - Review order specifications
  - Schedule manufacturing slot
- **Duration**: 1-2 business days

### 3. Manufacturing
- **Trigger**: Production begins
- **Customer Actions**: View progress updates
- **Internal Actions**:
  - Update progress percentage (0-100%)
  - Upload progress photos
  - Quality checks at 25%, 50%, 75%, 100%
- **Duration**: 2-3 weeks
- **Sub-stages**:
  - Frame construction (25%)
  - Wall assembly (50%)
  - Finishing work (75%)
  - Quality inspection (100%)

### 4. Shipped
- **Trigger**: Handed to carrier
- **Customer Actions**: Track shipment
- **Internal Actions**:
  - Generate tracking number
  - Send shipping notification
  - Update estimated delivery
- **Duration**: 3-7 business days

### 5. Delivered
- **Trigger**: Carrier confirms delivery
- **Customer Actions**: Confirm receipt, schedule installation
- **Internal Actions**:
  - Verify delivery
  - Open installation scheduling
  - Send installation prep guide
- **Duration**: Same day

### 6. Installation
- **Trigger**: Installation team dispatched
- **Customer Actions**: Confirm appointment
- **Internal Actions**:
  - Coordinate installation team
  - Perform installation
  - Customer training
- **Duration**: 4-6 hours

### 7. Completed
- **Trigger**: Installation sign-off
- **Customer Actions**: Leave review, access warranty
- **Internal Actions**:
  - Activate warranty
  - Send maintenance guide
  - Schedule follow-up
- **Duration**: Permanent

## Database Schema

```sql
-- Order status tracking
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  status VARCHAR(50) NOT NULL,
  status_date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  progress_percentage INTEGER,
  estimated_next_stage DATE,
  created_by VARCHAR(100)
);

-- Status metadata
CREATE TABLE status_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  tracking_number VARCHAR(100),
  carrier VARCHAR(50),
  installation_date DATE,
  installation_time TIME,
  installation_team VARCHAR(100),
  warranty_activated BOOLEAN DEFAULT FALSE,
  warranty_expiry DATE
);
```

## API Endpoints

### Get Order Status
```typescript
GET /api/orders/{orderId}/status
Response: {
  current_status: string,
  status_history: Array<{
    status: string,
    date: string,
    notes: string
  }>,
  progress: number,
  estimated_dates: {
    processing: string,
    manufacturing: string,
    shipped: string,
    delivered: string,
    installation: string,
    completed: string
  }
}
```

### Update Order Status (Admin)
```typescript
POST /api/admin/orders/{orderId}/status
Body: {
  status: string,
  notes: string,
  progress?: number,
  metadata?: {
    tracking_number?: string,
    carrier?: string,
    installation_date?: string
  }
}
```

## CRM Integration (GoHighLevel)

### Webhook Events
```javascript
// Status change webhook
{
  "event": "order.status.changed",
  "order_id": "uuid",
  "previous_status": "processing",
  "new_status": "manufacturing",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "progress": 25,
    "notes": "Frame construction started"
  }
}
```

### CRM Workflows
1. **New Order**: Create contact, add to "New Customer" pipeline
2. **Processing**: Move to "Order Processing" stage, assign team member
3. **Manufacturing**: Daily progress updates, photo uploads
4. **Shipped**: Send tracking info, prepare delivery workflow
5. **Delivered**: Trigger installation scheduling
6. **Installation**: Dispatch team, send reminder
7. **Completed**: Activate warranty, request review

## Customer Notifications

### Email Templates
- Order confirmation
- Status change notifications
- Shipping notification with tracking
- Delivery confirmation
- Installation scheduling
- Installation reminder
- Completion and warranty activation

### SMS Notifications (Critical Events)
- Order shipped
- Out for delivery
- Delivered
- Installation tomorrow
- Installation complete

## Visual Components

### Timeline Component
```typescript
interface TimelineProps {
  currentStatus: string;
  orderDate: string;
  estimatedDates: EstimatedDates;
  statusHistory: StatusHistory[];
}
```

### Progress Indicator
- Circular progress for manufacturing stage
- Linear progress for overall order
- Animated transitions between stages
- Color coding for status urgency

## Testing Scenarios

### Happy Path
```javascript
const testOrder = {
  id: "test-001",
  status_progression: [
    { status: "order_placed", date: "2024-01-01" },
    { status: "processing", date: "2024-01-02" },
    { status: "manufacturing", date: "2024-01-03", progress: 100 },
    { status: "shipped", date: "2024-01-17" },
    { status: "delivered", date: "2024-01-20" },
    { status: "installation", date: "2024-01-22" },
    { status: "completed", date: "2024-01-22" }
  ]
};
```

### Edge Cases
- Manufacturing delay (weather, materials)
- Shipping delay (carrier issue)
- Failed delivery attempt
- Installation rescheduling
- Customer unavailable
- Quality control failure (restart manufacturing)

## Performance Metrics

### KPIs
- Average time per stage
- On-time delivery rate
- Installation success rate
- Customer satisfaction per stage
- Status update frequency

### Monitoring
- Real-time status dashboard
- Alert for delayed orders
- Customer communication logs
- Stage duration analytics

## Implementation Priority

### Phase 1 (MVP)
- Basic status tracking
- Email notifications
- Simple timeline view

### Phase 2
- CRM webhook integration
- Real-time updates
- Progress tracking

### Phase 3
- SMS notifications
- Photo uploads
- Customer portal enhancements

### Phase 4
- Predictive delivery dates
- AI-powered delay detection
- Advanced analytics