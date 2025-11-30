# Publishing from Monorepo

## ✅ Yes, You Can Publish from a Monorepo!

The `@human-0/posh-sdk` package is configured to be published from the monorepo structure. npm fully supports this.

## How It Works

### Repository Configuration

Your `package.json` includes:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/human-0/human-0.com.git",
    "directory": "packages/posh-sdk"
  }
}
```

This tells npm:
- The package is in a monorepo
- The source code is in `packages/posh-sdk` directory
- Links on npm will point to the correct subdirectory

## Publishing Process

### Option 1: Quick Publish (Recommended)

```bash
# Navigate to the package directory
cd packages/posh-sdk

# Load environment variable
export NPM_ACCESS_TOKEN=$(grep NPM_ACCESS_TOKEN .env | cut -d '=' -f2)

# Run the publish script
chmod +x scripts/publish.sh
./scripts/publish.sh
```

### Option 2: Manual Steps

```bash
# Navigate to package
cd packages/posh-sdk

# Load token
export NPM_ACCESS_TOKEN=$(grep NPM_ACCESS_TOKEN .env | cut -d '=' -f2)

# Run tests
npm test

# Build
npm run build

# Bump version (choose one)
npm run release:patch   # 0.1.0 → 0.1.1
npm run release:minor   # 0.1.0 → 0.2.0
npm run release:major   # 0.1.0 → 1.0.0

# Publish
npm publish --access public
```

### Option 3: From Root (Using Workspaces)

If you're using npm workspaces, you can publish from root:

```bash
# From repository root
npm publish --workspace=packages/posh-sdk --access public
```

## What Gets Published

Only these files/folders are included (defined in `package.json` `files` field):

```json
"files": [
  "dist",
  "README.md",
  "LICENSE"
]
```

This means:
- ✅ Built code in `dist/`
- ✅ README.md
- ✅ LICENSE
- ❌ Source code (`src/`)
- ❌ Tests (`test/`)
- ❌ Config files
- ❌ `.env` file (never published!)

## Verification

After publishing, verify:

```bash
# Check package on npm
npm view @human-0/posh-sdk

# Check files included
npm view @human-0/posh-sdk files

# Check repository link
npm view @human-0/posh-sdk repository

# Test installation
npm install @human-0/posh-sdk
```

## npm Package Page

On npm, your package will show:
- **Repository**: Link to `https://github.com/human-0/human-0.com/tree/main/packages/posh-sdk`
- **Homepage**: Your main repo
- **Issues**: Your main repo issues
- **Source**: Direct link to the package directory

## Advantages of Monorepo Publishing

### 1. **Shared Development**
```
human-0.com/
├── apps/
│   └── web/          # Can use local SDK during development
└── packages/
    └── posh-sdk/     # Publish to npm for external use
```

### 2. **Easy Testing**
Test the SDK with your app before publishing:

```json
// apps/web/package.json
{
  "dependencies": {
    "@human-0/posh-sdk": "workspace:*"  // Local during dev
  }
}
```

### 3. **Version Management**
Keep SDK versions in sync with your app releases.

### 4. **Single CI/CD**
One GitHub Actions workflow can:
- Test the SDK
- Test the app with the SDK
- Publish the SDK
- Deploy the app

## Common Workflows

### Development Workflow

```bash
# 1. Make changes to SDK
cd packages/posh-sdk
# ... edit files ...

# 2. Test locally in your app
cd ../../apps/web
npm run dev  # Uses workspace version

# 3. When ready, publish SDK
cd ../../packages/posh-sdk
./scripts/publish.sh

# 4. Update app to use published version
cd ../../apps/web
npm install @human-0/posh-sdk@latest
```

### Release Workflow

```bash
# 1. Update SDK
cd packages/posh-sdk
# ... make changes ...
npm test
git commit -am "feat: add new feature"

# 2. Publish new version
npm run release:minor
npm publish --access public

# 3. Update app
cd ../../apps/web
npm install @human-0/posh-sdk@latest
git commit -am "chore: update posh-sdk to 0.2.0"

# 4. Deploy app
npm run build
# ... deploy ...
```

## Troubleshooting

### "Cannot find module"
Make sure you're in the correct directory:
```bash
pwd  # Should show: .../human-0.com/packages/posh-sdk
```

### "Not logged in"
Set the npm token:
```bash
export NPM_ACCESS_TOKEN=$(grep NPM_ACCESS_TOKEN .env | cut -d '=' -f2)
```

### "Version already exists"
Bump the version first:
```bash
npm version patch
```

### "Permission denied"
Make the script executable:
```bash
chmod +x scripts/publish.sh
```

## Best Practices

1. **Always test before publishing**
   ```bash
   npm test && npm run build
   ```

2. **Use semantic versioning**
   - Patch: Bug fixes
   - Minor: New features
   - Major: Breaking changes

3. **Update CHANGELOG.md**
   Document what changed in each version

4. **Tag releases in git**
   ```bash
   git tag v0.1.0
   git push --tags
   ```

5. **Test installation after publishing**
   ```bash
   npm install @human-0/posh-sdk@latest
   ```

## GitHub Integration

Your npm package page will automatically link to:
- **Source**: `https://github.com/human-0/human-0.com/tree/main/packages/posh-sdk`
- **Issues**: `https://github.com/human-0/human-0.com/issues`
- **README**: Rendered from your package README

## Summary

✅ **You can publish from monorepo** - No separate repo needed!
✅ **npm handles it natively** - Just use the `directory` field
✅ **Keep everything together** - SDK and app in one repo
✅ **Easy to maintain** - Single source of truth

Just run:
```bash
cd packages/posh-sdk
./scripts/publish.sh
```

And you're done! 🚀
