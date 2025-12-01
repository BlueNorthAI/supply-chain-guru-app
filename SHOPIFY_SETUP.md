# Shopify OAuth Integration - Setup Instructions

The full Shopify OAuth integration has been implemented. Follow these steps to complete the setup:

## ✅ Completed

All code files have been created following your existing patterns:

### Backend (Server)
- ✅ [src/features/shopify/server/route.ts](src/features/shopify/server/route.ts) - Hono API routes
- ✅ [src/features/shopify/lib/encryption.ts](src/features/shopify/lib/encryption.ts) - AES-256-GCM encryption
- ✅ [src/features/shopify/lib/hmac.ts](src/features/shopify/lib/hmac.ts) - HMAC validation
- ✅ [src/features/shopify/lib/shopify-client.ts](src/features/shopify/lib/shopify-client.ts) - Shopify API client

### Frontend (Client)
- ✅ [src/features/shopify/api/use-init-oauth.ts](src/features/shopify/api/use-init-oauth.ts) - OAuth init mutation
- ✅ [src/features/shopify/api/use-get-tenants.ts](src/features/shopify/api/use-get-tenants.ts) - Get stores query
- ✅ [src/features/shopify/api/use-disconnect-tenant.ts](src/features/shopify/api/use-disconnect-tenant.ts) - Disconnect mutation
- ✅ [src/features/shopify/api/use-trigger-sync.ts](src/features/shopify/api/use-trigger-sync.ts) - Sync trigger mutation
- ✅ [src/features/shopify/api/use-get-sync-jobs.ts](src/features/shopify/api/use-get-sync-jobs.ts) - Sync jobs query

### UI Components
- ✅ [src/features/shopify/components/connect-shop-form.tsx](src/features/shopify/components/connect-shop-form.tsx) - Connection form
- ✅ [src/features/shopify/components/connected-shops-list.tsx](src/features/shopify/components/connected-shops-list.tsx) - Stores list

### Pages
- ✅ [src/app/(dashboard)/workspaces/[workspaceId]/integrations/shopify/page.tsx](src/app/(dashboard)/workspaces/[workspaceId]/integrations/shopify/page.tsx) - Integration page
- ✅ [src/app/error/page.tsx](src/app/error/page.tsx) - OAuth error page

### Configuration
- ✅ [src/config.ts](src/config.ts) - Added Shopify collection IDs
- ✅ [src/app/api/[[...route]]/route.ts](src/app/api/[[...route]]/route.ts) - Registered Shopify routes
- ✅ [src/features/shopify/types.ts](src/features/shopify/types.ts) - TypeScript types
- ✅ [src/features/shopify/schemas.ts](src/features/shopify/schemas.ts) - Zod validation schemas
- ✅ [src/features/shopify/constants.ts](src/features/shopify/constants.ts) - Constants

---

## 🔧 Setup Steps

### 1. Create Appwrite Collections

Go to your Appwrite Console and create these 3 collections:

#### Collection 1: `shopify_tenants`

**Attributes:**
| Name | Type | Size | Required | Default | Array |
|------|------|------|----------|---------|-------|
| workspaceId | string | 36 | Yes | - | No |
| userId | string | 36 | Yes | - | No |
| shopDomain | string | 255 | Yes | - | No |
| shopId | string | 50 | Yes | - | No |
| shopName | string | 255 | Yes | - | No |
| shopEmail | string | 255 | No | null | No |
| shopCurrency | string | 10 | No | 'USD' | No |
| shopTimezone | string | 100 | No | null | No |
| accessToken | string | 1000 | Yes | - | No |
| scopes | string | 1000 | Yes | - | No |
| status | enum ['active', 'inactive', 'error', 'pending'] | - | Yes | 'pending' | No |
| installedAt | datetime | - | Yes | - | No |
| lastSyncAt | datetime | - | No | null | No |
| syncEnabled | boolean | - | Yes | true | No |
| errorMessage | string | 2000 | No | null | No |
| planName | string | 100 | No | null | No |
| shopifyPlanDisplayName | string | 100 | No | null | No |

**Indexes:**
- `workspace_idx` → workspaceId (ASC, key)
- `user_idx` → userId (ASC, key)
- `shop_domain_idx` → shopDomain (ASC, unique)
- `status_idx` → status (ASC, key)
- `workspace_status_idx` → workspaceId, status (ASC, ASC, key)

#### Collection 2: `shopify_sync_jobs`

**Attributes:**
| Name | Type | Size | Required | Default | Array |
|------|------|------|----------|---------|-------|
| tenantId | string | 36 | Yes | - | No |
| workspaceId | string | 36 | Yes | - | No |
| jobType | enum ['products', 'inventory', 'orders', 'locations', 'full'] | - | Yes | - | No |
| triggerType | enum ['manual', 'scheduled', 'webhook'] | - | Yes | 'manual' | No |
| status | enum ['pending', 'running', 'completed', 'failed', 'cancelled'] | - | Yes | 'pending' | No |
| progress | integer | - | Yes | 0 | No |
| startedAt | datetime | - | No | null | No |
| completedAt | datetime | - | No | null | No |
| recordsProcessed | integer | - | Yes | 0 | No |
| recordsFailed | integer | - | Yes | 0 | No |
| errorLog | string | 10000 | No | null | No |
| cursor | string | 500 | No | null | No |
| pageInfo | string | 1000 | No | null | No |

**Indexes:**
- `tenant_idx` → tenantId (ASC, key)
- `workspace_idx` → workspaceId (ASC, key)
- `status_idx` → status (ASC, key)
- `tenant_status_idx` → tenantId, status (ASC, ASC, key)
- `created_idx` → $createdAt (DESC, key)

#### Collection 3: `shopify_oauth_states`

**Attributes:**
| Name | Type | Size | Required | Default | Array |
|------|------|------|----------|---------|-------|
| workspaceId | string | 36 | Yes | - | No |
| userId | string | 36 | Yes | - | No |
| shopDomain | string | 255 | Yes | - | No |
| nonce | string | 64 | Yes | - | No |
| expiresAt | datetime | - | Yes | - | No |

**Indexes:**
- `expires_idx` → expiresAt (ASC, key)

### 2. Generate Encryption Key

Run this command to generate a 32-byte hex encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
### 3fafb447c7adf2e8e3fe11ee46db84875add59640d410f4832b8fd2976e2ed3d

Copy the output - you'll need it for the environment variable.

### 3. Create Shopify Partner App

1. Go to https://partners.shopify.com
2. Sign up if you don't have an account
3. Navigate to **Apps** → **Create App** → **Create app manually**
4. Configure:
   - **App name:** Supply Chain Guru
   - **App URL:** `https://your-domain.com/api/shopify/auth`
   - **Allowed redirection URLs:**
     - Development: `https://localhost:3000/api/shopify/callback`
     - Production: `https://your-domain.com/api/shopify/callback`

5. **Disable embedding:**
   - Go to **App Setup** → **Embedded app** → **Disable**

6. **Set distribution to Unlisted:**
   - Go to **Distribution** → Select "Single-merchant install link"

7. **Copy credentials:**
   - API Key (Client ID)
   - API Secret Key (Client Secret)

### 4. Add Environment Variables

Add these to your `.env.local`:

```env
# Shopify OAuth Configuration
SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
SHOPIFY_SCOPES=read_products,read_inventory,read_locations,read_orders
SHOPIFY_API_VERSION=2024-01

# For token encryption (generated in step 2)
SHOPIFY_ENCRYPTION_KEY=your_32_byte_hex_string_here

# Shopify Appwrite Collection IDs (from step 1)
NEXT_PUBLIC_APPWRITE_SHOPIFY_TENANTS_ID=shopify-tenants-key
NEXT_PUBLIC_APPWRITE_SHOPIFY_SYNC_JOBS_ID=shopify-sync-jobs-key
NEXT_PUBLIC_APPWRITE_SHOPIFY_OAUTH_STATES_ID=shopify-oauth-states-key
```

### 5. Test the Integration

1. **Start your dev server:**
   ```bash
   pnpm dev
   ```

2. **Navigate to:**
   ```
   http://localhost:3000/workspaces/[your-workspace-id]/integrations/shopify
   ```

3. **Connect a store:**
   - Enter a Shopify store domain (e.g., "mystore" or "mystore.myshopify.com")
   - Click "Connect Store"
   - Authorize on Shopify
   - You'll be redirected back with the store connected

### 6. Verify Everything Works

- [ ] OAuth flow completes successfully
- [ ] Store appears in the connected stores list
- [ ] Store status shows as "active"
- [ ] Manual sync can be triggered
- [ ] Store can be disconnected
- [ ] Error page shows when OAuth fails

---

## 📁 File Structure Created

```
src/features/shopify/
├── server/
│   └── route.ts              # Hono API routes for OAuth and data sync
├── api/
│   ├── use-init-oauth.ts     # Mutation: Start OAuth flow
│   ├── use-get-tenants.ts    # Query: List connected stores
│   ├── use-disconnect-tenant.ts # Mutation: Disconnect store
│   ├── use-trigger-sync.ts   # Mutation: Trigger sync job
│   └── use-get-sync-jobs.ts  # Query: List sync jobs
├── components/
│   ├── connect-shop-form.tsx  # Form to enter shop domain
│   └── connected-shops-list.tsx # List of connected stores
├── lib/
│   ├── encryption.ts         # AES-256-GCM token encryption
│   ├── hmac.ts              # HMAC validation for security
│   └── shopify-client.ts    # Shopify API client wrapper
├── types.ts                  # TypeScript type definitions
├── schemas.ts               # Zod validation schemas
└── constants.ts             # Shopify-related constants
```

---

## 🚀 API Endpoints Available

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/shopify/auth/init` | Initialize OAuth flow |
| GET | `/api/shopify/callback` | OAuth callback handler |
| GET | `/api/shopify/tenants` | List connected stores |
| GET | `/api/shopify/tenants/:id` | Get single store |
| DELETE | `/api/shopify/tenants/:id` | Disconnect store |
| POST | `/api/shopify/tenants/:id/sync` | Trigger sync job |
| GET | `/api/shopify/sync-jobs` | List sync jobs |

---

## 🔒 Security Features

- **CSRF Protection:** State parameter with 10-minute expiry
- **HMAC Validation:** All Shopify callbacks are verified
- **Token Encryption:** Access tokens encrypted with AES-256-GCM
- **Workspace Isolation:** All queries scoped to workspace
- **Role-Based Access:** Only admins can disconnect stores

---

## 📚 Next Steps

1. ✅ Complete the setup steps above
2. Create the Appwrite collections
3. Add environment variables
4. Test the OAuth flow
5. (Optional) Implement background sync job processing
6. (Optional) Add webhook handlers for real-time data sync

---

## 📖 Full Documentation

Refer to [docs/shopify-integration-guide.md](docs/shopify-integration-guide.md) for:
- Detailed OAuth flow architecture
- Database schema documentation
- Client onboarding experience
- UI component examples
- Testing checklist

---

## 🐛 Troubleshooting

### OAuth fails with "invalid_state"
- Check that `SHOPIFY_OAUTH_STATES_ID` collection exists
- Verify collection has correct attributes and indexes

### "Failed to fetch tenants"
- Ensure `SHOPIFY_TENANTS_ID` collection is created
- Check workspace membership

### Token encryption errors
- Verify `SHOPIFY_ENCRYPTION_KEY` is exactly 64 hex characters (32 bytes)
- Regenerate if needed using the command in step 2

### Import errors
- Run `pnpm install` to ensure all dependencies are installed
- Check that TypeScript paths are configured correctly
