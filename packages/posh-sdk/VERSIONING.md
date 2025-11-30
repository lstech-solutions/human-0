# Versioning Strategy

The `@human-0/posh-sdk` package follows **independent versioning** separate from the monorepo.

## Why Independent Versioning?

- **NPM Publishing**: As a published npm package, it needs semantic versioning that reflects SDK changes, not monorepo changes
- **Consumer Clarity**: Developers using the SDK need clear version signals about breaking changes, features, and fixes
- **Release Cadence**: SDK releases may not align with monorepo releases

## Version Management

### Automated Release (Recommended)

Use the release script for a streamlined process:

```bash
# From the posh-sdk directory
cd packages/posh-sdk

# Patch release (bug fixes)
./scripts/release.sh patch

# Minor release (new features, backward compatible)
./scripts/release.sh minor

# Major release (breaking changes)
./scripts/release.sh major
```

The script will:
1. ✅ Verify you're on main branch with clean working directory
2. 🧪 Run tests and linter
3. 🔨 Build the package
4. 📦 Bump version in package.json
5. ⏸️  Pause for you to update CHANGELOG.md
6. 💾 Commit changes
7. 🏷️ Create and push git tag
8. 🚀 Trigger CI to publish to npm

### Manual Versioning

If you prefer manual control:

```bash
# Bump version
npm version patch  # or minor, or major

# Update CHANGELOG.md manually

# Commit and tag
git add package.json CHANGELOG.md
git commit -m "chore(posh-sdk): release vX.Y.Z"
git tag posh-sdk-vX.Y.Z
git push origin main --tags
```

### CI/CD Pipeline

Publishing is automated via GitHub Actions:
- **Trigger**: Push a tag matching `posh-sdk-v*.*.*`
- **Process**: Build → Test → Lint → Publish to npm
- **Provenance**: Includes npm provenance for supply chain security
- **Release**: Creates GitHub release with changelog

### Monorepo Integration

The monorepo's version manager script (`scripts/version-manager.js`) **excludes** `posh-sdk` from automatic version updates to preserve its independent versioning.

## Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes to the public API
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

## Current Version

See [package.json](./package.json) for the current version.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.
