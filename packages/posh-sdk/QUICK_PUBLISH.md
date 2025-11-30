# Quick Publishing Guide

## Step 1: Check Authentication

Run the authentication checker:

```bash
./scripts/check-auth.sh
```

If you see "✗ Not authenticated", follow the instructions to authenticate.

## Step 2: Authenticate with NPM

### Option A: Interactive Login (Easiest)

```bash
npm login
```

Enter your npm credentials when prompted.

### Option B: Use Access Token

1. Go to https://www.npmjs.com/settings/[your-username]/tokens
2. Click "Generate New Token"
3. Choose "**Automation**" type (important!)
4. Copy the full token
5. Run:
   ```bash
   echo '//registry.npmjs.org/:_authToken=YOUR_TOKEN' > ~/.npmrc
   ```

## Step 3: Verify Authentication

```bash
./scripts/check-auth.sh
```

You should see: "✓ Authenticated as: [your-username]"

## Step 4: Publish

Run the verification and publishing script:

```bash
./scripts/verify-and-publish.sh
```

This script will:
- ✓ Verify you're authenticated
- ✓ Check package name availability
- ✓ Validate package.json
- ✓ Run all tests
- ✓ Build the package
- ✓ Create a tarball
- ✓ Show you what will be published
- ✓ Ask for confirmation
- ✓ Publish to NPM

## Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
npm test          # Run tests
npm run build     # Build package
npm pack          # Create tarball (optional, for inspection)
npm publish --access public
```

## After Publishing

Once published successfully, your package will be available at:
- https://www.npmjs.com/package/posh-sdk

Users can install it with:
```bash
npm install posh-sdk
```

## Troubleshooting

### "401 Unauthorized"
Your credentials are invalid. Re-authenticate using `npm login`.

### "404 Not Found"
You're not authenticated. Run `./scripts/check-auth.sh` to verify.

### "403 Forbidden"
- Package name might be taken
- You might not have publish permissions
- Try a different package name

### "You must verify your email"
Check your email and verify your npm account at https://www.npmjs.com/

## Current Status

- ✅ Package built and tested
- ✅ Package name `posh-sdk` is available
- ✅ All 46 tests passing
- ✅ Tarball created (66.7 kB)
- ⏳ Waiting for authentication

**Next step**: Authenticate with npm, then run `./scripts/verify-and-publish.sh`
