# 📊 Ilio Sauna Order Flow System

## Order Status Progression

The customer journey from purchase to completion follows these sequential stages:

### 1️⃣ **Order Placed** 
- Customer completes payment via Stripe
- Order confirmation email sent
- Order appears in customer dashboard
- **CRM Trigger:** New order created in GHL

### 2️⃣ **Processing**
- Payment verified
- Order details reviewed by team
- Customer contacted for site measurements
- **CRM Trigger:** Move to "Processing" stage

### 3️⃣ **Manufacturing**
- Sauna construction begins
- Artisans craft the unit in BC workshop
- Quality checks performed
- **Duration:** 2-3 weeks typically
- **CRM Trigger:** Update to "Manufacturing" with progress %

### 4️⃣ **Shipped**
- Unit completed and packaged
- Handed to shipping carrier
- Tracking number provided to customer
- **CRM Trigger:** Add tracking info, move to "Shipped"

### 5️⃣ **Delivered**
- Unit arrives at customer property
- Customer notified of delivery
- Installation scheduling initiated
- **CRM Trigger:** Confirm delivery, schedule installation

### 6️⃣ **Installation**
- Professional team arrives on-site
- Sauna assembled and connected
- Customer walkthrough and training
- **CRM Trigger:** Installation in progress

### 7️⃣ **Completed**
- Final inspection and sign-off
- Warranty activated
- Maintenance schedule provided
- **CRM Trigger:** Order completed, activate warranty

## Visual Timeline Components

### Status Badge Colors
- **Order Placed:** `#9B8B7E` (Brand brown)
- **Processing:** `#FF9800` (Orange)
- **Manufacturing:** `#2196F3` (Blue)
- **Shipped:** `#9C27B0` (Purple)
- **Delivered:** `#4CAF50` (Green)
- **Installation:** `#00BCD4` (Cyan)
- **Completed:** `#4CAF50` (Green)

### Progress Indicators
- Completed stages: Solid color with checkmark
- Current stage: Pulsing/animated indicator
- Upcoming stages: Grayed out

## CRM Integration Requirements

### GHL Webhook Events
```javascript
// Order status update webhook
POST /api/webhooks/order-status
{
  "orderId": "uuid",
  "status": "manufacturing",
  "progress": 65,
  "estimatedCompletion": "2024-02-15",
  "notes": "Frame assembly complete"
}
```

### Database Schema Updates
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_stage VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stage_progress INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_completion DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stage_notes TEXT;
```

## Customer Dashboard Features

### Active Orders Section
- Visual timeline showing current stage
- Percentage complete for manufacturing
- Estimated dates for each upcoming stage
- Live tracking for shipped orders

### Notifications
- Email on stage change
- SMS for delivery and installation
- In-app notifications for updates

### Actions by Stage
- **Processing:** Upload site photos
- **Manufacturing:** View progress photos
- **Shipped:** Track package
- **Delivered:** Schedule installation
- **Installation:** Confirm appointment
- **Completed:** Download warranty, leave review

## Implementation Priority

1. **Phase 1:** Visual timeline in order detail page
2. **Phase 2:** GHL webhook receiver
3. **Phase 3:** Real-time updates via WebSocket
4. **Phase 4:** Customer notifications
5. **Phase 5:** Progress photos and documentation

## Testing Scenarios

### Happy Path
- Order moves smoothly through all stages
- Customer receives all notifications
- Installation scheduled and completed

### Edge Cases
- Manufacturing delay
- Shipping issues
- Installation rescheduling
- Weather delays
- Customer unavailable

## Success Metrics
- Customer satisfaction with transparency
- Reduced support tickets about order status
- Faster resolution of issues
- Higher completion rates