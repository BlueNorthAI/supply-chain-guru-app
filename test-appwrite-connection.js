const { Client, Account, Users } = require('node-appwrite');
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

async function testConnection() {
  console.log('Testing Appwrite Connection...\n');

  // Test configuration
  console.log('Configuration:');
  console.log('- Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  console.log('- Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
  console.log('- API Key exists:', !!process.env.NEXT_APPWRITE_KEY);
  console.log('- API Key length:', process.env.NEXT_APPWRITE_KEY?.length);
  console.log('');

  // Test Admin Client
  try {
    console.log('Testing Admin Client...');
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
      .setKey(process.env.NEXT_APPWRITE_KEY);

    const users = new Users(client);

    // Try to list users (this will fail if API key is invalid)
    const userList = await users.list();
    console.log('✓ Admin client connection successful!');
    console.log(`✓ Found ${userList.total} user(s) in the project`);
    console.log('');

    // Test creating a test user
    console.log('Testing user creation...');
    const testEmail = 'test@example.com';

    try {
      // Try to create a test user
      const account = new Account(client);
      await account.createEmailPasswordSession(testEmail, 'test123456');
      console.log('✓ Test user login works!');
    } catch (error) {
      if (error.code === 401) {
        console.log('✗ Test user does not exist or invalid credentials');
        console.log('  This is expected if you haven\'t created any users yet.');
      } else {
        console.log('✗ Error during authentication test:', error.message);
      }
    }

  } catch (error) {
    console.log('✗ Admin client connection failed!');
    console.log('Error:', error.message);
    console.log('');

    if (error.code === 401) {
      console.log('This means your API key is invalid or doesn\'t have the right permissions.');
      console.log('Please check:');
      console.log('1. The API key in your .env.local file');
      console.log('2. That the API key has the correct scopes in Appwrite console');
      console.log('3. That you\'re using the correct project ID');
    }
  }
}

testConnection();
