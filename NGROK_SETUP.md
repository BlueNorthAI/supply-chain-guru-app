# Ngrok Setup Guide for Shopify OAuth

Follow these steps to set up ngrok for local Shopify OAuth development.

## Step 1: Sign up for ngrok (Free)

1. Go to https://dashboard.ngrok.com/signup
2. Sign up with your email or GitHub account
3. It's completely free for basic usage

## Step 2: Get your ngrok authtoken

1. After signing in, go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your authtoken (it looks like: `2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z`)

## Step 3: Configure ngrok with your authtoken

Run this command in your terminal (replace `YOUR_AUTHTOKEN` with the actual token):

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

## Step 4: Start ngrok tunnel

In a **separate terminal window**, run:

```bash
ngrok http 3000
```

You should see output like:
```
Session Status                online
Account                       your-email@example.com (Plan: Free)
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123xyz.ngrok-free.app`)

## Step 5: Update your .env.local

Replace the `NEXT_PUBLIC_APP_URL` in your `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=https://abc123xyz.ngrok-free.app
```

**Important**: Use the HTTPS URL, not HTTP!

## Step 6: Restart your Next.js dev server

Stop your dev server (Ctrl+C) and restart it:

```bash
pnpm dev
```

## Step 7: Update your Shopify Partner App

1. Go to https://partners.shopify.com
2. Navigate to **Apps** → Select your app
3. Go to **App Setup** or **Configuration**
4. Update these URLs:
   - **App URL**: `https://abc123xyz.ngrok-free.app`
   - **Allowed redirection URL(s)**: `https://abc123xyz.ngrok-free.app/api/shopify/callback`
5. Click **Save**

## Step 8: Test the OAuth flow

1. Go to your app: `https://abc123xyz.ngrok-free.app`
   - You may see an ngrok warning page - click "Visit Site"
2. Navigate to your Shopify integration page
3. Click "Connect Store"
4. You should be redirected to Shopify for authorization!

## Important Notes

### Free ngrok limitations:
- ✅ HTTPS tunnels work perfectly
- ✅ No time limit
- ⚠️ URL changes every time you restart ngrok
- ⚠️ Shows an interstitial warning page on first visit

### When ngrok URL changes:
If you stop and restart ngrok, you'll get a new URL. You'll need to:
1. Update `NEXT_PUBLIC_APP_URL` in `.env.local`
2. Restart your dev server
3. Update the URLs in Shopify Partner dashboard

### Alternative: Get a static domain (Optional)
- Ngrok offers static domains on their paid plans
- Or use a different tunnel service like Cloudflare Tunnel (free static URLs)

## Troubleshooting

### "ERR_NGROK_4018" error
- You haven't configured your authtoken
- Run: `ngrok config add-authtoken YOUR_AUTHTOKEN`

### "Unauthorized Access" on Shopify
- Make sure redirect URI in Shopify Partner App **exactly matches** ngrok URL
- Use HTTPS, not HTTP
- No trailing slashes
- Wait a few minutes after updating Shopify Partner App config

### Connection refused
- Make sure your Next.js dev server is running on port 3000
- Make sure ngrok is pointing to port 3000

## Quick Reference Commands

```bash
# Configure ngrok (one-time)
ngrok config add-authtoken YOUR_AUTHTOKEN

# Start ngrok tunnel
ngrok http 3000

# Start dev server (in another terminal)
pnpm dev
```

---

Need help? Check the terminal logs for detailed error messages!
