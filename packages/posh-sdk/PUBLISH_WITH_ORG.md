# Publishing to @human-0 Organization

## Package Name Changed

The package name has been changed back to `@human-0/posh-sdk` because:
- You have access to the `@human-0` organization
- Granular tokens can only publish scoped packages (`@org/package`)
- Granular tokens cannot publish unscoped packages (`package-name`)

## How to Publish

### Step 1: Authenticate with npm login

The granular token you created doesn't work for `npm whoami` authentication checks, but it should work for publishing. However, the easiest approach is to use `npm login`:

```bash
npm login
```

This will:
- Authenticate you with your npm account
- Give you access to publish to `@human-0` organization
- Work reliably for all npm operations

### Step 2: Publish the Package

```bash
npm publish --access public
```

Note: You must use `--access public` for scoped packages in organizations, otherwise they default to private (which requires a paid plan).

## Alternative: Try Publishing with the Token

Your granular token might work for publishing even though `npm whoami` fails. Try:

```bash
npm publish --access public
```

If you get a 401 error, then use `npm login` instead.

## After Publishing

The package will be available at:
- https://www.npmjs.com/package/@human-0/posh-sdk

Users can install with:
```bash
npm install @human-0/posh-sdk
```

And import like:
```typescript
import { PoshClient } from '@human-0/posh-sdk';
import { PoshProvider } from '@human-0/posh-sdk/react';
```

## Current Status

- ✅ Package name: `@human-0/posh-sdk`
- ✅ All tests passing (46/46)
- ✅ Build successful
- ✅ Ready to publish
- ⏳ Need to authenticate with `npm login`
