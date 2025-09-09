# GoHighLevel OAuth Integration - What Worked vs What Didn't

## The Problem
When implementing OAuth2 for GoHighLevel, we encountered multiple errors trying to exchange the authorization code for an access token.

## What Didn't Work (Failed Attempts)

### 1. ❌ Using marketplace.gohighlevel.com for token exchange
```javascript
// FAILED - Returns 404 "NoSuchBucket" error
const OAUTH_BASE = 'https://marketplace.gohighlevel.com/oauth';

const response = await axios.post(`${OAUTH_BASE}/token`, params);
```
**Error:** `404 Not Found - NoSuchBucket: The specified bucket does not exist`

### 2. ❌ Using application/x-www-form-urlencoded with marketplace URL
```javascript
// FAILED - Returns 400 error
const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
});

const response = await axios.post(
    'https://marketplace.gohighlevel.com/oauth/token',
    params,
    {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
);
```
**Error:** `400 Bad Request - POST object expects Content-Type multipart/form-data`

### 3. ❌ Using multipart/form-data with marketplace URL
```javascript
// FAILED - Returns 404 error
const FormData = require('form-data');
const formData = new FormData();
formData.append('client_id', CLIENT_ID);
formData.append('client_secret', CLIENT_SECRET);
formData.append('grant_type', 'authorization_code');
formData.append('code', code);
formData.append('redirect_uri', redirectUri);

const response = await axios.post(
    'https://marketplace.gohighlevel.com/oauth/token',
    formData,
    {
        headers: {
            ...formData.getHeaders()
        }
    }
);
```
**Error:** `404 Not Found - NoSuchBucket: The specified bucket does not exist`

## ✅ What Actually Worked

The solution was to use **different endpoints for different parts of the OAuth flow**:

### The Working Configuration:

```javascript
// Use marketplace URL for authorization
const OAUTH_BASE = 'https://marketplace.gohighlevel.com/oauth';

// BUT use services URL for token exchange!
const TOKEN_ENDPOINT = 'https://services.leadconnectorhq.com/oauth/token';
```

### Step 1: Authorization URL (marketplace endpoint)
```javascript
getAuthorizationUrl() {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'contacts.readonly contacts.write ...'
    });
    
    // This uses marketplace URL
    return `https://marketplace.gohighlevel.com/oauth/chooselocation?${params}`;
}
```

### Step 2: Token Exchange (services endpoint with URL-encoded)
```javascript
async exchangeCodeForToken(code, redirectUri) {
    // Use services endpoint, NOT marketplace!
    const response = await axios({
        method: 'post',
        url: 'https://services.leadconnectorhq.com/oauth/token',
        data: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    });
    
    return response.data;
}
```

## Key Discoveries

### 1. Different Endpoints for Different Operations
- **Authorization**: `https://marketplace.gohighlevel.com/oauth/chooselocation`
- **Token Exchange**: `https://services.leadconnectorhq.com/oauth/token`
- **API Calls**: `https://services.leadconnectorhq.com/`

### 2. Token Exchange Format
- GoHighLevel's token endpoint accepts standard `application/x-www-form-urlencoded`
- The error message about multipart/form-data was misleading
- The real issue was using the wrong base URL (marketplace instead of services)

### 3. OAuth Flow Summary
1. User clicks authorize → Redirect to `marketplace.gohighlevel.com`
2. User approves → Redirect back with authorization code
3. Exchange code for token → POST to `services.leadconnectorhq.com`
4. Use token for API calls → Requests to `services.leadconnectorhq.com`

## Complete Working Implementation

```javascript
// ghl-oauth.js
const axios = require('axios');

const CLIENT_ID = process.env.GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const OAUTH_BASE = 'https://marketplace.gohighlevel.com/oauth';
const TOKEN_ENDPOINT = 'https://services.leadconnectorhq.com/oauth/token';

class GHLAuth {
    // Get authorization URL
    getAuthorizationUrl(redirectUri) {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: [
                'contacts.readonly',
                'contacts.write',
                'calendars.readonly',
                'calendars.write',
                // ... other scopes
            ].join(' ')
        });
        
        return `${OAUTH_BASE}/chooselocation?${params}`;
    }
    
    // Exchange code for token (THE CRITICAL PART!)
    async exchangeCodeForToken(code, redirectUri) {
        const response = await axios({
            method: 'post',
            url: TOKEN_ENDPOINT, // services, not marketplace!
            data: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });
        
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        
        // Save tokens to .env
        await this.saveTokensToEnv(
            response.data.access_token,
            response.data.refresh_token
        );
        
        return response.data;
    }
    
    // Refresh token
    async refreshAccessToken() {
        const response = await axios({
            method: 'post',
            url: TOKEN_ENDPOINT, // services endpoint
            data: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${encodeURIComponent(this.refreshToken)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });
        
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        
        return response.data;
    }
}
```

## Error Messages Decoded

| Error Message | What It Really Means |
|--------------|---------------------|
| `NoSuchBucket` | Wrong endpoint URL (using marketplace instead of services) |
| `POST object expects Content-Type multipart/form-data` | Misleading - real issue was wrong endpoint |
| `404 Not Found` | Token endpoint doesn't exist at marketplace URL |
| `400 Bad Request` | Format issue OR wrong endpoint |

## Lessons Learned

1. **GoHighLevel uses split endpoints** - Authorization flows through marketplace, but token operations use services
2. **Error messages can be misleading** - The multipart/form-data error was a red herring
3. **Standard OAuth2 format works** - Once using the correct endpoint, standard URL-encoded format works fine
4. **Documentation gaps** - This split endpoint pattern isn't clearly documented in GHL's public docs

## Testing the Integration

After successful OAuth:
1. Tokens are saved to `.env` file
2. API can now make authenticated requests
3. Contact form submissions will create contacts in GHL
4. Custom fields (like message) are properly mapped

## Troubleshooting Checklist

✅ Authorization URL uses `marketplace.gohighlevel.com`  
✅ Token exchange uses `services.leadconnectorhq.com`  
✅ API calls use `services.leadconnectorhq.com`  
✅ Token exchange uses `application/x-www-form-urlencoded`  
✅ Redirect URI matches exactly between authorization and token exchange  
✅ All required scopes are included in authorization request