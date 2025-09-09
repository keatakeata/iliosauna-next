# GoHighLevel Form Integration - Implementation Guide

## Overview
This document details the complete implementation of the multi-step contact form with GoHighLevel (GHL) integration for the Ilio Sauna website. The form uses psychological principles and CRO optimization for a $20,000 luxury sauna product targeting Vancouver Island BC and Greater Vancouver Area.

## What We Built

### 1. Multi-Step Contact Form with Progressive Disclosure
- **Location**: Integrated directly into `contact.html`
- **Structure**: 4-step form with progress bar
  - Step 1: Purchase Timeline
  - Step 2: Primary Interest
  - Step 3: Details (Budget, Previous Owner, etc.)
  - Step 4: Contact Information

### 2. Custom Fields Created in GHL
All custom fields were created programmatically and mapped with IDs stored in `api/custom-field-ids.json`:

```json
{
  "preferred_contact_method": "RyqVLvTkecrN86VyagdQ",
  "purchase_timeline": "G9gDQXto19i8jq6ogJXy",
  "budget_range": "vaBcKrouIytREqiBycNi",
  "primary_interest": "ymzA50njipuZAlW0m66w",
  "previous_sauna_owner": "vchv9aJHqZbzMUv6T4I6",
  "special_requests": "8wFhPSwbG5eV1QDJvLce",
  "lead_source": "KftOx1tXIkHNOEPfkt4O",
  "newsletter_optin": "38f6qfPzJ2ZgcseJBO5r",
  "referral_name": "OyWiJm4TJySFjK78gmiK"
}
```

## How to Recreate This Integration

### Step 1: Set Up Environment Variables
Create a `.env` file with:
```
GHL_LOCATION_ID=your_location_id
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REDIRECT_URI=http://localhost:3000/api/ghl/callback
GHL_API_BASE=https://services.leadconnectorhq.com
PORT=3000
```

### Step 2: Create Custom Fields in GHL
Run the setup script to create all custom fields:
```bash
node api/setup-custom-fields.js
```

This creates the following fields:
- **Referral Name** (TEXT)
- **Preferred Contact Method** (SINGLE_OPTIONS: Phone, Email, Text)
- **Purchase Timeline** (SINGLE_OPTIONS: ASAP, 1-3 months, 3-6 months, Just Researching)
- **Budget Range** (SINGLE_OPTIONS: Under $20k, $20k-$25k, $25k+, Unsure - want guidance)
- **Primary Interest** (SINGLE_OPTIONS: Wellness/Therapy, Family Bonding, Entertaining Guests, Retreat/Airbnb, Year-Round Outdoor Living)
- **Previous Sauna Owner** (SINGLE_OPTIONS: Yes, No)
- **Special Requests** (LARGE_TEXT)
- **Lead Source** (SINGLE_OPTIONS: Google, Instagram, Facebook, Referral, Event, Other)
- **Newsletter Opt-in** (SINGLE_OPTIONS: Yes, No)

### Step 3: Configure OAuth2 Authentication
1. Set up OAuth2 app in GHL with redirect URI
2. Run the authorization flow:
```bash
node api/setup-ghl.js
```
3. This will open browser for authorization and save tokens to `api/.ghl-token.json`

### Step 4: Start the Backend Server
```bash
node api/server.js
```
The server handles:
- OAuth token refresh
- Form submissions at `/api/contact`
- Custom field mapping
- Interest-based tagging

### Step 5: Implement the Frontend Form

#### Key Frontend Components:
1. **Multi-step form HTML structure** in `contact.html`
2. **Progress bar** showing current step
3. **Form validation** at each step
4. **Conditional logic** (e.g., referral name field appears only when "Referral" is selected)
5. **AJAX submission** to backend API

#### Critical Styling Elements:
- Primary color: `#BF5813` (burnt orange)
- Progress bar uses burnt orange for active steps
- Form fields have burnt orange border on focus
- Buttons styled with burnt orange background
- Sticky contact info sidebar on desktop

### Step 6: Form Handler Configuration
The `js/form-handler.js` handles:
1. Collecting form data from all steps
2. Mapping to GHL custom fields format
3. Adding interest-based tags:
   - Wellness → "Interest: Wellness/Therapy"
   - Family Bonding → "Interest: Family"
   - Entertaining Guests → "Interest: Entertainment"
   - Retreat/Airbnb → "Interest: Revenue Generation"
   - Year-Round Outdoor Living → "Interest: Outdoor Living"

## Key Technical Solutions

### Custom Fields Array Format (Critical!)
GHL requires custom fields as an array, not object:
```javascript
payload.customFields = [];
for (const [fieldKey, value] of Object.entries(contactData.customFields)) {
    const fieldId = customFieldIds[fieldKey];
    if (fieldId) {
        payload.customFields.push({
            id: fieldId,
            field_value: value  // Must use snake_case!
        });
    }
}
```

### Progressive Disclosure Implementation
```javascript
// Show/hide steps based on current position
document.querySelectorAll('.form-step').forEach((step, index) => {
    step.style.display = index === currentStep ? 'block' : 'none';
});

// Update progress bar
const progress = ((currentStep + 1) / totalSteps) * 100;
progressBar.style.width = progress + '%';
```

### Conditional Field Logic
```javascript
// Show referral name field only when "Referral" is selected
leadSourceField.addEventListener('change', function() {
    const referralGroup = document.getElementById('referralNameGroup');
    if (this.value === 'Referral') {
        referralGroup.style.display = 'block';
        referralGroup.querySelector('input').required = true;
    } else {
        referralGroup.style.display = 'none';
        referralGroup.querySelector('input').required = false;
    }
});
```

## CRO Optimization Features Implemented

1. **Price Anchoring**: Budget options start at "Under $20k" to anchor at the target price
2. **Progressive Disclosure**: Multi-step form reduces cognitive load
3. **Social Proof Elements**: Client experiences section remains visible
4. **Urgency Creation**: "ASAP" option first in timeline
5. **Value Reinforcement**: Interest options highlight lifestyle benefits
6. **Trust Building**: Professional design with consistent branding
7. **Friction Reduction**: Optional fields clearly marked
8. **Smart Defaults**: Pre-selected optimal choices where appropriate

## Testing the Integration

1. **Test Form Submission**:
   - Fill out all form steps
   - Submit and check console for success
   - Verify contact appears in GHL with all custom fields populated

2. **Verify Custom Field Mapping**:
   - Check each field appears in the correct GHL custom field
   - Ensure no data goes to notes field
   - Confirm interest-based tags are applied

3. **Test Conditional Logic**:
   - Select "Referral" as lead source
   - Verify referral name field appears
   - Test submission with and without referral

4. **Responsive Testing**:
   - Test on mobile devices
   - Verify sticky sidebar on desktop
   - Check button stacking on smaller screens

## Files Structure

```
.iliosauna/
├── contact.html                 # Main contact page with integrated form
├── js/
│   └── form-handler.js         # Form submission and validation logic
├── api/
│   ├── server.js               # Express server handling API endpoints
│   ├── ghl-api.js             # GHL API integration module
│   ├── ghl-oauth.js           # OAuth2 token management
│   ├── setup-custom-fields.js # Script to create custom fields
│   ├── custom-field-ids.json  # Mapping of field keys to GHL IDs
│   └── .ghl-token.json        # OAuth tokens (gitignored)
└── styles/
    └── premium-details.css     # Additional form styling
```

## Common Issues and Solutions

### Issue: "customFields must be an array"
**Solution**: Ensure custom fields are formatted as array with 'id' and 'field_value' properties

### Issue: Message field not appearing in GHL
**Solution**: Create custom field for message and map with field ID, don't use notes field

### Issue: Form styling not matching brand
**Solution**: Use CSS variable `--primary-orange: #BF5813` consistently

### Issue: OAuth token expires
**Solution**: Server automatically refreshes tokens using refresh token flow

## Future Enhancements

1. **A/B Testing**: Test different form headlines and CTAs
2. **Analytics Integration**: Track form abandonment by step
3. **Dynamic Pricing**: Show different budget ranges based on interest
4. **Appointment Booking**: Integrate GHL calendar for immediate scheduling
5. **Email Automation**: Trigger nurture sequences based on timeline and interest

## Support

For issues with:
- GHL API: Check api/server.js logs
- Custom fields: Run setup-custom-fields.js again
- OAuth: Delete .ghl-token.json and re-authorize
- Form behavior: Check browser console for errors

Last Updated: August 2024
Implementation by: Claude Code with Anthropic