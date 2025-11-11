# Google Analytics 4 API Setup Instructions

To enable real-time data fetching from Google Analytics 4, follow these steps:

## Step 1: Create a Google Cloud Project & Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Data API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Analytics Data API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in:
   - Service account name: `iliosauna-analytics`
   - Service account ID: `iliosauna-analytics`
   - Click "Create and Continue"
4. Skip the optional steps, click "Done"

## Step 3: Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create" - this will download a JSON file
6. **Save this file securely** - you'll need it

## Step 4: Add Service Account to Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (bottom left)
3. In the "Property" column, click "Property Access Management"
4. Click the "+" button (top right)
5. Click "Add users"
6. Enter the service account email (found in the JSON file, looks like: `iliosauna-analytics@project-id.iam.gserviceaccount.com`)
7. Select "Viewer" role
8. Click "Add"

## Step 5: Get Your GA4 Property ID

1. In Google Analytics, go to "Admin"
2. In the "Property" column, click "Property Settings"
3. Copy the **Property ID** (looks like: `123456789`)

## Step 6: Add Credentials to Environment Variables

Add these to your `.env.development.local` and Vercel environment variables:

```bash
# Google Analytics 4
GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE
GA4_CREDENTIALS=PASTE_ENTIRE_JSON_FILE_CONTENT_HERE
```

Or save the JSON file to your project and reference it:
```bash
GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE
GA4_CREDENTIALS_PATH=./ga4-credentials.json
```

## That's it!

Once you've completed these steps and added the credentials, the analytics dashboard will automatically fetch real data from Google Analytics 4.
