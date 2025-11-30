# Versioning Strategy

The `@human-0/posh-sdk` package follows **independent versioning** separate from the monorepo.

## Why Independent Versioning?

- **NPM Publishing**: As a published npm package, it needs semantic versioning that reflects SDK changes, not monorepo changes
- **Consumer Clarity**: Developers using the SDK need clear version signals about breaking changes, features, and fixes
- **Release Cadence**: SDK releases may not align with monorepo releases

## Version Management

### Manual Versioning

Use npm's built-in version commands:

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features, backward compatible)
npm version minor

# Major release (breaking changes)
npm version major
```

### Publishing

```bash
# Build, test, and publish
npm publish --access public
```

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
