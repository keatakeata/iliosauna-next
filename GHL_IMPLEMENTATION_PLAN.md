# GHL IMPLEMENTATION PLAN - ILIO SAUNA
## Credentials & Phased Approach

---

## 🔐 CREDENTIALS (SECURED)
```
Location ID: GCSgKFx6fTLWG5qmWqeN
API Key: [STORED SECURELY]
PIT: pit-4e15034f-bccc-4d00-af67-b0d4e9e0373d
```

---

## 📋 IMPLEMENTATION PHASES

### PHASE 1: FORMS INTEGRATION (Week 1)
**Goal:** Connect existing forms to GHL to create contacts

#### Forms to Connect:
1. **Contact Page Form** (already built)
   - Name, Email, Phone, Message
   - → Creates contact in GHL
   - → Triggers GHL automation

2. **Newsletter Signup** (homepage)
   - Email only
   - → Creates contact with "Newsletter" tag
   - → Triggers welcome sequence

3. **Contact Form** (add to homepage bottom)
   - Duplicate of contact page form
   - Same GHL integration

#### Technical Steps:
1. Create API proxy endpoint (security)
2. Add form submission handlers
3. Map form fields to GHL contact fields
4. Set up success/error messaging
5. Test contact creation
6. Add tags/custom fields

---

### PHASE 2: E-COMMERCE FOUNDATION (Week 2)
**Goal:** Product display and cart functionality

#### Page Structure:
```
/products           → Product gallery (future multiple products)
/saunas             → Current detailed sauna page (add e-commerce)
/products/ilio      → Individual product page (redirect to /saunas for now)
```

#### E-commerce Module for /saunas:
1. **Add to Cart button**
   - Floating price display
   - Quantity selector
   - Add to cart animation

2. **Buy Now button**
   - Skip cart, straight to checkout
   - Express checkout option

3. **Cart Slide-out**
   - Right side drawer
   - Update quantities
   - Remove items
   - Checkout button

#### Cart Functionality:
- LocalStorage for cart persistence
- Cart icon with item counter
- Price calculations
- Session management

---

### PHASE 3: CHECKOUT & PAYMENT (Week 3)
**Goal:** Complete purchase flow → GHL trigger

#### Checkout Flow:
```
Cart → Checkout → Payment → Confirmation → Calendar Booking
```

#### Checkout Page (/checkout):
1. **Customer Information**
   - Name, Email, Phone
   - Shipping/Installation address
   
2. **Payment Processing**
   - Stripe/PayPal integration
   - Secure payment form
   
3. **Order Creation**
   - Send to GHL as opportunity/deal
   - Trigger automation workflow
   - Create contact if new

#### Post-Purchase:
- Confirmation page with order details
- Automatic redirect to calendar booking
- Email confirmation via GHL

---

### PHASE 4: CALENDAR INTEGRATION (Week 4)
**Goal:** Post-purchase installation scheduling

#### Calendar Flow:
1. **After Payment Success:**
   - Redirect to `/schedule-installation`
   - Pass order ID as parameter
   
2. **Calendar Page:**
   - Pull availability from GHL calendar
   - Custom styled to match site
   - Installation appointment type only
   
3. **Booking Confirmation:**
   - Create event in GHL
   - Link to contact/opportunity
   - Trigger confirmation email

---

## 🏗️ TECHNICAL ARCHITECTURE

### Backend API Proxy (Node.js/Express):
```javascript
// Never expose API key to frontend
/api/
  ├── /contacts     → Create GHL contacts
  ├── /products     → Fetch products
  ├── /calendar     → Get availability
  ├── /bookings     → Create appointments
  └── /orders       → Process orders
```

### Security Setup:
1. Environment variables (.env)
2. CORS configuration
3. Rate limiting
4. Input validation
5. Error logging

### Frontend Integration:
```javascript
// Example form submission
async function submitToGHL(formData) {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  // Handle response
}
```

---

## 📁 NEW FILES TO CREATE

### Week 1 (Forms):
```
/api/
  ├── server.js         (Express server)
  ├── ghl-api.js        (GHL integration)
  └── .env              (credentials)
  
/js/
  └── form-handler.js   (Form submissions)
```

### Week 2 (E-commerce):
```
/products/
  └── index.html        (Product gallery)
  
/js/
  ├── cart.js           (Cart functionality)
  └── products.js       (Product display)
  
/css/
  └── ecommerce.css     (Cart/product styles)
```

### Week 3 (Checkout):
```
/checkout/
  └── index.html        (Checkout page)
  
/js/
  └── checkout.js       (Payment processing)
```

### Week 4 (Calendar):
```
/schedule-installation/
  └── index.html        (Calendar page)
  
/js/
  └── calendar.js       (Booking system)
```

---

## 🎯 IMMEDIATE NEXT STEPS

### Today:
1. Set up Node.js backend with Express
2. Create secure API proxy
3. Test GHL API connection
4. Create first form submission endpoint

### Tomorrow:
1. Connect contact form to GHL
2. Test contact creation
3. Add newsletter signup integration
4. Verify automations trigger

### This Week:
1. Complete all form integrations
2. Begin cart functionality
3. Design checkout flow
4. Plan calendar UI

---

## ❓ QUESTIONS TO CLARIFY

1. **Products:**
   - Just one product (Ilio Sauna) for now?
   - Price: $20,000 CAD?
   - Any variations/options?

2. **Payment:**
   - Which processor? (Stripe recommended)
   - Need test credentials?
   - Deposit or full payment?

3. **Calendar:**
   - Installation appointments only?
   - Duration? (2 hours? Full day?)
   - Available days/times?

4. **Shipping:**
   - Local delivery only?
   - Installation included?
   - Delivery zones?

---

## 🚀 LET'S START!

Ready to begin with Phase 1 - Forms Integration?

I'll need to:
1. Create a secure backend
2. Set up the API proxy
3. Test the connection
4. Then integrate your forms

Should I start setting up the backend infrastructure now?