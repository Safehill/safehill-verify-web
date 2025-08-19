# 🧹 Code Quality & Linting Guide

This project uses a comprehensive set of linting and code quality tools to maintain high code standards.

## 🚀 Quick Start

### Local Development
```bash
# Check all code quality issues
pnpm check-all

# Fix all auto-fixable issues
pnpm fix-all

# Run individual checks
pnpm lint          # ESLint
pnpm format        # Prettier check
pnpm type-check    # TypeScript check
```

### Git Hooks (Automatic)
- **Pre-commit**: Runs all linters before each commit
- **Commit-msg**: Enforces conventional commit message format

## 🛠️ Tools Overview

### 1. **ESLint** - JavaScript/TypeScript Linting
- **Purpose**: Catches code quality issues and enforces best practices
- **Configuration**: `.eslintrc.json`
- **Auto-fix**: `pnpm lint:fix`

**Key Rules:**
- Unused imports/variables detection
- React hooks dependency checking
- Code style consistency
- Performance warnings (e.g., `<img>` vs `<Image>`)

### 2. **Prettier** - Code Formatting
- **Purpose**: Ensures consistent code formatting across the project
- **Configuration**: `prettier.config.js`
- **Auto-format**: `pnpm format:write`

### 3. **TypeScript** - Type Checking
- **Purpose**: Catches type errors and provides better IDE support
- **Configuration**: `tsconfig.json`
- **Check**: `pnpm type-check`

### 4. **Husky** - Git Hooks
- **Purpose**: Automatically runs linters before commits
- **Configuration**: `.husky/` directory

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm check-all` | Run all linters (format + lint + type-check) |
| `pnpm fix-all` | Fix all auto-fixable issues |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Check Prettier formatting |
| `pnpm format:write` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript type checking |

## 🔧 IDE Integration

### VS Code Settings
The project includes `.vscode/settings.json` with:
- **Auto-save on focus change**
- **ESLint auto-fix on save**
- **Prettier formatting on save**
- **Import organization on save**

### Extensions Required
- ESLint
- Prettier
- TypeScript

## 🚨 Common Issues & Solutions

### 1. **Unused Imports**
```bash
# Auto-fix
pnpm lint:fix

# Manual fix: Remove unused imports
import { used, unused } from 'module'; // ❌
import { used } from 'module'; // ✅
```

### 2. **Console Statements**
```bash
# Replace with proper logging
console.log('debug info'); // ❌
// Use proper logging service or remove
```

### 3. **React Hook Dependencies**
```javascript
// ❌ Missing dependencies
useEffect(() => {
  doSomething(value);
}, []); // Missing 'value'

// ✅ Correct dependencies
useEffect(() => {
  doSomething(value);
}, [value]);
```

### 4. **Image Optimization**
```jsx
// ❌ Regular img tag
<img src="/image.jpg" alt="description" />

// ✅ Next.js optimized Image
import Image from 'next/image';
<Image src="/image.jpg" alt="description" width={500} height={300} />
```

## 🔄 GitHub Actions

The project includes GitHub Actions workflows that run on every push and pull request:

### Workflow: `.github/workflows/lint.yml`
- **Triggers**: Push to main/develop, Pull requests
- **Checks**:
  - Prettier formatting
  - ESLint
  - TypeScript type checking
  - Unused dependencies check

### Workflow Features
- **Caching**: pnpm store and dependencies
- **Parallel jobs**: Separate lint and format checks
- **Detailed feedback**: Clear error messages and suggestions

## 📝 Commit Message Convention

The project enforces conventional commit messages:

```bash
# ✅ Valid formats
feat: add new authentication feature
fix(auth): resolve login issue
docs: update README
style: format code with prettier
refactor: improve component structure
test: add unit tests for auth
build: update dependencies
ci: fix GitHub Actions workflow
chore: update package.json
revert: revert previous commit

# ❌ Invalid formats
added new feature
fixed bug
updated stuff
```

## 🎯 Best Practices

### 1. **Before Committing**
```bash
# Always run checks before committing
pnpm check-all

# If issues found, fix them
pnpm fix-all
```

### 2. **IDE Setup**
- Install required extensions
- Enable auto-save
- Configure ESLint and Prettier

### 3. **Team Workflow**
- Pull requests trigger automatic checks
- Fix all linting issues before merging
- Use conventional commit messages

### 4. **Performance**
- Replace `<img>` tags with Next.js `<Image>`
- Remove unused imports and variables
- Fix React hook dependencies

## 🆘 Troubleshooting

### Common Issues

1. **Husky hooks not working**
   ```bash
   # Reinstall hooks
   npx husky install
   chmod +x .husky/pre-commit .husky/commit-msg
   ```

2. **ESLint configuration issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules
   pnpm install
   ```

3. **TypeScript errors**
   ```bash
   # Check for type issues
   pnpm type-check

   # Rebuild types
   pnpm build
   ```

### Getting Help
- Check the GitHub Actions logs for detailed error messages
- Run `pnpm check-all` locally to reproduce issues
- Review the specific linter documentation for rule explanations

## 📚 Additional Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
