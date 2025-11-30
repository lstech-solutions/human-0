# Publishing Guide

This guide explains how to publish new versions of `@human-0/posh-sdk` to npm.

## Prerequisites

1. **npm Access**: You must be a maintainer of the `@human-0/posh-sdk` package
2. **GitHub Access**: Push access to the repository
3. **NPM_TOKEN**: Set up in GitHub repository secrets (for CI)

## Quick Release

The easiest way to release is using the automated script:

```bash
# Navigate to posh-sdk directory
cd packages/posh-sdk

# Run release script
pnpm run release:patch   # For bug fixes (1.0.0 → 1.0.1)
pnpm run release:minor   # For new features (1.0.0 → 1.1.0)
pnpm run release:major   # For breaking changes (1.0.0 → 2.0.0)
```

## What Happens

### 1. Local Checks (Automated by script)
- ✅ Verifies clean working directory
- ✅ Ensures you're on main branch
- ✅ Pulls latest changes
- ✅ Runs tests
- ✅ Runs linter
- ✅ Builds package
- ✅ Bumps version in package.json

### 2. Manual Step
- ⏸️ **You update CHANGELOG.md** with release notes
- Press Enter to continue

### 3. Git Operations (Automated by script)
- 💾 Commits version bump and changelog
- 🏷️ Creates git tag: `posh-sdk-vX.Y.Z`
- ⬆️ Pushes to GitHub

### 4. CI/CD (Automated by GitHub Actions)
- 🔨 Builds package
- 🧪 Runs tests
- 🔍 Runs linter
- 📦 Publishes to npm with provenance
- 📝 Creates GitHub release

## Manual Release (Advanced)

If you need more control:

```bash
# 1. Bump version
npm version patch  # or minor, or major

# 2. Update CHANGELOG.md
vim CHANGELOG.md

# 3. Commit changes
git add package.json CHANGELOG.md
git commit -m "chore(posh-sdk): release vX.Y.Z"

# 4. Create and push tag
git tag posh-sdk-vX.Y.Z
git push origin main
git push origin posh-sdk-vX.Y.Z
```

## CI Configuration

The CI workflow (`.github/workflows/publish-posh-sdk.yml`) is triggered by tags matching `posh-sdk-v*.*.*`.

### Required GitHub Secrets

- `NPM_TOKEN`: npm authentication token with publish access
  - Get from: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
  - Type: Automation token
  - Add to: Repository Settings → Secrets → Actions

### Workflow Features

- ✅ Version verification (tag matches package.json)
- ✅ Build and test before publish
- ✅ npm provenance for supply chain security
- ✅ Automatic GitHub release creation
- ✅ Failure notifications

## Troubleshooting

### "Version mismatch" error
The tag version must match package.json version:
```bash
# Tag: posh-sdk-v1.2.3
# package.json: "version": "1.2.3"
```

### "NPM_TOKEN not found"
Ensure the secret is set in GitHub repository settings.

### "Tests failed"
Fix tests locally before releasing:
```bash
pnpm run test
pnpm run lint
```

### "Already published"
You cannot republish the same version. Bump to a new version:
```bash
pnpm run release:patch
```

## Deprecating Versions

If you need to deprecate a version:

```bash
npm deprecate @human-0/posh-sdk@X.Y.Z "Reason for deprecation"
```

## Rollback

If a release has issues:

1. **Deprecate the bad version**:
   ```bash
   npm deprecate @human-0/posh-sdk@X.Y.Z "This version has issues. Use vX.Y.Z-1 instead."
   ```

2. **Publish a patch fix**:
   ```bash
   pnpm run release:patch
   ```

## Best Practices

1. **Always update CHANGELOG.md** with meaningful release notes
2. **Test thoroughly** before releasing
3. **Use semantic versioning** correctly:
   - Patch: Bug fixes only
   - Minor: New features, backward compatible
   - Major: Breaking changes
4. **Review the diff** before pushing tags
5. **Monitor CI** after pushing to ensure successful publish

## Support

For issues with publishing, contact the maintainers or open an issue on GitHub.
