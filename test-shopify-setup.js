const { Client, Databases } = require('node-appwrite');
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

async function testShopifySetup() {
  console.log('Testing Shopify Integration Setup...\n');

  // Test environment variables
  console.log('1. Environment Variables:');
  console.log('   ✓ NEXT_PUBLIC_APPWRITE_ENDPOINT:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  console.log('   ✓ NEXT_PUBLIC_APPWRITE_PROJECT:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
  console.log('   ✓ NEXT_PUBLIC_APPWRITE_DATABASE_ID:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
  console.log('');

  console.log('   Shopify Configuration:');
  console.log('   ✓ SHOPIFY_API_KEY exists:', !!process.env.SHOPIFY_API_KEY);
  console.log('   ✓ SHOPIFY_API_SECRET exists:', !!process.env.SHOPIFY_API_SECRET);
  console.log('   ✓ SHOPIFY_ENCRYPTION_KEY exists:', !!process.env.SHOPIFY_ENCRYPTION_KEY);
  console.log('   ✓ SHOPIFY_ENCRYPTION_KEY length:', process.env.SHOPIFY_ENCRYPTION_KEY?.length, '(should be 64)');
  console.log('');

  console.log('   Shopify Collection IDs:');
  console.log('   ✓ SHOPIFY_TENANTS_ID:', process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_TENANTS_ID);
  console.log('   ✓ SHOPIFY_SYNC_JOBS_ID:', process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_SYNC_JOBS_ID);
  console.log('   ✓ SHOPIFY_OAUTH_STATES_ID:', process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_OAUTH_STATES_ID);
  console.log('');

  // Test Appwrite connection
  console.log('2. Testing Appwrite Connection...');
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  const databases = new Databases(client);

  try {
    // Test database access
    const database = await databases.get(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
    console.log('   ✓ Database exists:', database.name);
  } catch (error) {
    console.log('   ✗ Database error:', error.message);
    return;
  }

  // Test collection access
  console.log('');
  console.log('3. Testing Shopify Collections...');

  const collections = [
    {
      name: 'shopify_tenants',
      id: process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_TENANTS_ID,
    },
    {
      name: 'shopify_sync_jobs',
      id: process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_SYNC_JOBS_ID,
    },
    {
      name: 'shopify_oauth_states',
      id: process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_OAUTH_STATES_ID,
    },
  ];

  for (const collection of collections) {
    try {
      const col = await databases.getCollection(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        collection.id
      );
      console.log(`   ✓ ${collection.name}: Found (${col.name})`);
    } catch (error) {
      console.log(`   ✗ ${collection.name}: NOT FOUND or no permission`);
      console.log(`      Error: ${error.message}`);
      console.log(`      Please create this collection in Appwrite Console`);
    }
  }

  console.log('');
  console.log('4. Summary:');
  console.log('   - If all collections show ✓, you\'re ready to test OAuth');
  console.log('   - If any show ✗, create them following SHOPIFY_SETUP.md');
  console.log('   - Make sure encryption key is exactly 64 characters (32 bytes hex)');
}

testShopifySetup();
