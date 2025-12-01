const fs = require('fs');
const path = require('path');

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

loadEnv();

console.log('========================================');
console.log('Shopify OAuth Configuration Verification');
console.log('========================================\n');

console.log('1. APP URL:');
console.log('   Your .env.local has:');
console.log('   ' + process.env.NEXT_PUBLIC_APP_URL);
console.log('');

console.log('2. REDIRECT URI:');
console.log('   Based on your config, the redirect URI is:');
const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;
console.log('   ' + redirectUri);
console.log('');

console.log('3. SHOPIFY PARTNER APP CONFIGURATION:');
console.log('   Go to: https://partners.shopify.com/organizations');
console.log('   Navigate to: Apps → Your App → Configuration');
console.log('');
console.log('   Verify these EXACT values:');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ App URL:                                                    │');
console.log('   │ ' + process.env.NEXT_PUBLIC_APP_URL.padEnd(58) + ' │');
console.log('   │                                                             │');
console.log('   │ Allowed redirection URL(s):                                 │');
console.log('   │ ' + redirectUri.padEnd(58) + ' │');
console.log('   └─────────────────────────────────────────────────────────────┘');
console.log('');

console.log('4. IMPORTANT CHECKS:');
console.log('   □ URLs must match EXACTLY (no trailing slashes)');
console.log('   □ Use HTTPS, not HTTP');
console.log('   □ App distribution: Set to "Unlisted" or "Custom"');
console.log('   □ Embedded app: DISABLED (very important!)');
console.log('   □ After updating, wait 1-2 minutes for changes to propagate');
console.log('');

console.log('5. CURRENT SHOPIFY CONFIG:');
console.log('   API Key: ' + process.env.SHOPIFY_API_KEY);
console.log('   Scopes: ' + process.env.SHOPIFY_SCOPES);
console.log('');

console.log('6. TEST YOUR SETUP:');
console.log('   1. Make sure ngrok is running: ngrok http 3000');
console.log('   2. Make sure your dev server is running: pnpm dev');
console.log('   3. Visit: ' + process.env.NEXT_PUBLIC_APP_URL);
console.log('   4. Navigate to Shopify integration page');
console.log('   5. Try connecting your store');
console.log('');

console.log('========================================');
console.log('Common "Unauthorized Access" Causes:');
console.log('========================================');
console.log('');
console.log('❌ Redirect URI mismatch');
console.log('   Solution: Copy the exact URL above into Shopify Partner App');
console.log('');
console.log('❌ App is embedded');
console.log('   Solution: Go to App Setup → Embedded app → Disable');
console.log('');
console.log('❌ App needs to be reinstalled');
console.log('   Solution: If you previously installed the app, uninstall it first');
console.log('   from the merchant store admin, then try again');
console.log('');
console.log('❌ ngrok URL changed');
console.log('   Solution: If you restarted ngrok and got a new URL,');
console.log('   update .env.local, Shopify Partner App, and restart dev server');
console.log('');
console.log('========================================\n');
