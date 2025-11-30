# Publishing Guide for @human-0/posh-sdk

## Prerequisites

1. **NPM Access**: You need access to the `@human-0` organization on npm
2. **NPM Token**: Set in `.env` file as `NPM_ACCESS_TOKEN`
3. **Git**: Clean working directory (all changes committed)
4. **Tests**: All tests must pass before publishing

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

### Current Version: 0.1.0

Since we're in initial development (0.x.x):
- **0.1.0** → **0.2.0**: New features
- **0.1.0** → **0.1.1**: Bug fixes
- **0.1.0** → **1.0.0**: First stable release

## Publishing Process

### Step 1: Prepare for Release

```bash
cd packages/posh-sdk

# Ensure clean working directory
git status

# Run tests
npm test

# Run type checking
npm run typecheck

# Build the package
npm run build
```

### Step 2: Version Bump

Choose the appropriate version bump:

#### Patch Release (Bug Fixes)
```bash
npm run release:patch
```

#### Minor Release (New Features)
```bash
npm run release:minor
```

#### Major Release (Breaking Changes)
```bash
npm run release:major
```

This will:
1. Run tests and build
2. Update version in package.json
3. Create a git commit
4. Create a git tag
5. Push to remote

### Step 3: Publish to npm

```bash
# Load environment variables
export NPM_ACCESS_TOKEN=$(grep NPM_ACCESS_TOKEN .env | cut -d '=' -f2)

# Publish to npm
npm run publish:npm
```

Or manually:
```bash
npm publish --access public
```

### Step 4: Verify Publication

```bash
# Check on npm
npm view @human-0/posh-sdk

# Test installation
npm install @human-0/posh-sdk@latest
```

## Manual Publishing (Alternative)

If you prefer manual control:

```bash
# 1. Update version manually
npm version 0.1.1 -m "chore: release v0.1.1"

# 2. Build
npm run build

# 3. Test
npm test

# 4. Publish
npm publish --access public

# 5. Push tags
git push && git push --tags
```

## Pre-Release Versions

For testing before official release:

### Alpha Release
```bash
npm version prerelease --preid=alpha
npm publish --tag alpha
```

### Beta Release
```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

### Install Pre-Release
```bash
npm install @human-0/posh-sdk@alpha
npm install @human-0/posh-sdk@beta
```

## Release Checklist

Before publishing, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] CHANGELOG.md is updated
- [ ] README.md is up to date
- [ ] Version number is appropriate
- [ ] Git working directory is clean
- [ ] All changes are committed
- [ ] NPM_ACCESS_TOKEN is set

## Changelog Management

Update `CHANGELOG.md` before each release:

```markdown
## [0.1.1] - 2025-01-15

### Added
- New feature X
- New hook Y

### Fixed
- Bug in component Z

### Changed
- Updated dependency A
```

## Rollback a Release

If you need to unpublish (within 72 hours):

```bash
npm unpublish @human-0/posh-sdk@0.1.1
```

**Warning**: Unpublishing is discouraged. Instead, publish a new patch version with fixes.

## Deprecating a Version

```bash
npm deprecate @human-0/posh-sdk@0.1.0 "Please upgrade to 0.1.1"
```

## CI/CD Publishing (Future)

For automated publishing via GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
        working-directory: packages/posh-sdk
      
      - name: Run tests
        run: npm test
        working-directory: packages/posh-sdk
      
      - name: Build
        run: npm run build
        working-directory: packages/posh-sdk
      
      - name: Publish
        run: npm publish --access public
        working-directory: packages/posh-sdk
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Version History

### 0.1.0 (Initial Release)
- Core SDK with mock implementations
- React hooks layer
- Multi-deployment support
- TypeScript support
- Comprehensive documentation

## Troubleshooting

### "You do not have permission to publish"
- Ensure you're logged in: `npm whoami`
- Check organization access: `npm org ls @human-0`
- Verify NPM_ACCESS_TOKEN is correct

### "Version already exists"
- Bump version: `npm version patch`
- Or use a different version number

### "Tests failed"
- Fix failing tests before publishing
- Run `npm test` to see errors

### "Build failed"
- Check TypeScript errors: `npm run typecheck`
- Fix build errors before publishing

## Support

For publishing issues:
1. Check npm status: https://status.npmjs.org/
2. Review npm documentation: https://docs.npmjs.com/
3. Contact npm support: https://www.npmjs.com/support
