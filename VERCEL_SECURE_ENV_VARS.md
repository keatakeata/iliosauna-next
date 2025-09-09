# 🔒 SECURE Vercel Environment Variables Setup

## ⚠️ CRITICAL SECURITY NOTICE
**NEVER commit these values to GitHub!** Only add them in the Vercel Dashboard.

## 📝 Steps to Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **Environment Variables**
4. Add each variable below
5. Select: **Production**, **Preview**, and **Development** environments

## 🔑 Required Environment Variables

### GoHighLevel (GHL) - CRITICAL
```
Variable Name: GHL_ACCESS_TOKEN
Value: [GET FROM YOUR SECURE LOCATION - DO NOT COMMIT]
Type: Encrypted (Sensitive)

Variable Name: GHL_LOCATION_ID  
Value: GCSgKFx6fTLWG5qmWqeN
Type: Plain Text

Variable Name: GHL_API_BASE
Value: https://services.leadconnectorhq.com
Type: Plain Text
```

### Sanity CMS
```
Variable Name: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: bxybmggj
Type: Plain Text

Variable Name: NEXT_PUBLIC_SANITY_DATASET
Value: production
Type: Plain Text

Variable Name: NEXT_PUBLIC_SANITY_API_VERSION
Value: 2024-01-01
Type: Plain Text
```

### Mixpanel Analytics
```
Variable Name: NEXT_PUBLIC_MIXPANEL_TOKEN
Value: 81a70e969056e31b905499ba402c763b
Type: Plain Text

Variable Name: MIXPANEL_API_SECRET
Value: a696770516e7aa6d4a874472bb4cfc5b
Type: Encrypted (Sensitive)

Variable Name: MIXPANEL_PROJECT_ID
Value: 3411339
Type: Plain Text

Variable Name: NEXT_PUBLIC_MIXPANEL_ENV
Value: production
Type: Plain Text
```

### Clerk (Optional - Currently Disabled)
```
Variable Name: NEXT_PUBLIC_CLERK_ENABLED
Value: false
Type: Plain Text
```

## 🛡️ Security Best Practices

1. **Mark as Sensitive**: Toggle "Sensitive" for API keys in Vercel
2. **Never Screenshot**: Don't share screenshots of these values
3. **Rotate Regularly**: Change PIT tokens every 6-12 months
4. **Monitor Usage**: Check GHL logs for unauthorized access
5. **Limit Permissions**: Only grant necessary scopes to tokens

## ✅ Verification After Setup

1. Deploy your site
2. Check Vercel Function logs for any errors
3. Test the contact form at `/contact`
4. Verify contacts appear in GHL

## 🚨 If Token Gets Exposed

1. Immediately revoke in GHL dashboard
2. Generate new token
3. Update in Vercel dashboard
4. Check GHL logs for unauthorized usage

## 📞 Support

- **Your GHL Sub-Account ID**: GCSgKFx6fTLWG5qmWqeN
- **GHL Support**: support@gohighlevel.com
- **Security Incident**: Revoke token immediately, then contact support

---

**Remember**: These credentials give full API access to your GHL account. Keep them secure!