# Contributing to Dossier MCP Server

Thank you for your interest in contributing to the Dossier MCP Server! This project is critical infrastructure for making dossier automation frictionless, and we welcome all contributions.

---

## 🚀 Quick Start for Contributors

### 1. Choose a Task

Check [IMPLEMENTATION.md](./IMPLEMENTATION.md) for current phase and available tasks.

We organize work into phases - pick any unchecked task from the current phase or future phases!

### 2. Set Up Your Environment

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/dossier.git
cd dossier/mcp-server

# Install dependencies
npm install

# Run tests
npm test

# Start development mode
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b phase-N/your-feature-name

# Examples:
git checkout -b phase-2/implement-dossier-parser
git checkout -b phase-3/add-list-dossiers-tool
```

### 4. Make Your Changes

- Write code following our [Code Style](#code-style)
- Add tests for new functionality
- Update documentation as needed
- Update IMPLEMENTATION.md Progress Log

### 5. Test Your Changes

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

### 6. Submit a Pull Request

```bash
git add .
git commit -m "[Phase N] Your descriptive commit message"
git push origin your-branch-name
```

Then open a PR on GitHub using our [PR template](#pr-template).

---

## 📋 What Can I Contribute?

### Priority Areas

1. **Core Implementation** (Phases 2-5)
   - Parser logic
   - Tool implementations
   - Validation rules
   - Registry support

2. **Testing** (All phases)
   - Unit tests
   - Integration tests
   - Edge case coverage
   - Test fixtures

3. **Documentation**
   - Code comments
   - User guides
   - API documentation
   - Examples

4. **Bug Fixes**
   - Check [issues](https://github.com/imboard-ai/dossier/issues)
   - Report new bugs
   - Fix existing bugs

5. **Performance**
   - Optimization
   - Benchmarking
   - Load testing

---

## 🏗️ Development Workflow

### Project Structure

See [IMPLEMENTATION.md - Architecture](./IMPLEMENTATION.md#architecture) for full details.

```
mcp-server/
├── src/
│   ├── index.ts                 # Entry point
│   ├── server/                  # MCP server setup
│   ├── tools/                   # Tool implementations
│   ├── resources/               # Resource providers
│   ├── prompts/                 # Prompt templates
│   ├── core/                    # Core logic
│   │   ├── parser/             # Dossier parsing
│   │   ├── validator/          # Validation
│   │   ├── registry/           # Registry support
│   │   └── filesystem/         # File operations
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utilities
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
└── docs/                        # Additional documentation
```

### Available Scripts

```bash
# Development
npm run dev           # Watch mode with hot reload
npm run build         # Compile TypeScript
npm run start         # Run compiled server

# Testing
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:unit     # Unit tests only
npm run test:integration # Integration tests only

# Quality
npm run lint          # ESLint
npm run lint:fix      # Fix linting issues
npm run format        # Prettier
npm run type-check    # TypeScript check

# Documentation
npm run docs          # Generate API docs
```

---

## 🧪 Testing Guidelines

### Test Coverage Requirements

- **Unit tests**: >90% coverage
- **Integration tests**: All tools, resources, prompts
- **E2E tests**: Critical user paths

### Writing Tests

**Unit Test Example**:
```typescript
import { describe, it, expect } from 'vitest';
import { parseDossier } from '../core/parser/DossierParser';

describe('DossierParser', () => {
  describe('parseMetadata', () => {
    it('should extract version from header', () => {
      const content = `
# Dossier: Test Dossier

**Version**: 1.2.3
**Protocol Version**: 1.0
**Status**: Stable
      `.trim();

      const result = parseDossier(content);

      expect(result.metadata.version).toBe('1.2.3');
      expect(result.metadata.protocol).toBe('1.0');
      expect(result.metadata.status).toBe('Stable');
    });

    it('should throw ParseError on invalid format', () => {
      const content = 'Invalid dossier content';

      expect(() => parseDossier(content)).toThrow(ParseError);
    });
  });
});
```

**Integration Test Example**:
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { listDossiers } from '../tools/listDossiers';

describe('listDossiers tool', () => {
  const testProjectPath = './tests/fixtures/basic-project';

  it('should find all dossiers in directory', async () => {
    const result = await listDossiers({ path: testProjectPath });

    expect(result.dossiers).toHaveLength(3);
    expect(result.dossiers[0].name).toBe('project-init');
    expect(result.dossiers[0].version).toBe('1.0.0');
  });

  it('should filter by glob pattern', async () => {
    const result = await listDossiers({
      path: testProjectPath,
      filter: '**/deploy-*.md',
    });

    expect(result.dossiers).toHaveLength(1);
    expect(result.dossiers[0].name).toContain('deploy');
  });
});
```

### Test Fixtures

Create realistic test data in `tests/fixtures/`:

```
tests/fixtures/
├── basic-project/
│   └── dossiers/
│       ├── project-init.md
│       ├── deploy.md
│       └── cleanup.md
├── complex-project/
│   ├── dossiers/
│   │   └── [20+ dossiers]
│   └── dossiers-registry.md
└── invalid-project/
    └── dossiers/
        └── malformed.md
```

---

## 📝 Code Style

### TypeScript Guidelines

**Use strict types**:
```typescript
// ✅ Good
function parseDossier(content: string): ParsedDossier {
  // ...
}

// ❌ Bad
function parseDossier(content: any): any {
  // ...
}
```

**Explicit return types on public APIs**:
```typescript
// ✅ Good
export function listDossiers(options: ListOptions): Promise<DossierList> {
  // ...
}

// ❌ Bad (inferred return type)
export function listDossiers(options: ListOptions) {
  // ...
}
```

**Prefer interfaces for objects**:
```typescript
// ✅ Good
interface DossierMetadata {
  name: string;
  version: string;
  protocol: string;
}

// ❌ Less preferred
type DossierMetadata = {
  name: string;
  version: string;
  protocol: string;
}
```

### Error Handling

**Use custom error types**:
```typescript
export class DossierError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'DossierError';
  }
}

export class ParseError extends DossierError {
  constructor(message: string, details?: unknown) {
    super(message, 'PARSE_ERROR', details);
    this.name = 'ParseError';
  }
}

// Usage
throw new ParseError('Invalid dossier format', { line: 10, column: 5 });
```

### Naming Conventions

- **Classes**: `PascalCase` (e.g., `DossierParser`)
- **Functions**: `camelCase` (e.g., `parseDossier`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_TIMEOUT`)
- **Interfaces**: `PascalCase` (e.g., `DossierMetadata`)
- **Types**: `PascalCase` (e.g., `ParseResult`)
- **Files**: Match export name (e.g., `DossierParser.ts`)

### Documentation

**JSDoc on all public APIs**:
```typescript
/**
 * Parses a dossier markdown file and extracts its structure.
 *
 * This function validates the dossier format, extracts metadata from the
 * header, and parses all standard sections (objective, prerequisites, etc.).
 *
 * @param content - Raw markdown content of the dossier file
 * @param options - Optional parsing configuration
 * @returns Structured dossier object with metadata and sections
 * @throws {ParseError} If the markdown is malformed or missing required sections
 *
 * @example
 * ```typescript
 * const content = fs.readFileSync('dossier.md', 'utf-8');
 * const dossier = parseDossier(content);
 * console.log(dossier.metadata.version); // "1.0.0"
 * ```
 */
export function parseDossier(
  content: string,
  options?: ParseOptions
): ParsedDossier {
  // Implementation
}
```

**Inline comments for complex logic**:
```typescript
// Extract the header section (everything before first H2)
const headerEndIndex = content.indexOf('\n## ');
if (headerEndIndex === -1) {
  throw new ParseError('No sections found - missing ## headers');
}

// Parse metadata from header using regex patterns
const header = content.slice(0, headerEndIndex);
const versionMatch = header.match(/\*\*Version\*\*:\s*(.+)/);
```

---

## 🔄 Pull Request Process

### PR Template

Use this template when opening a PR:

```markdown
## Phase & Task
Phase [N]: [Task name from IMPLEMENTATION.md]

## Summary
Brief description of what this PR does.

## Changes
- Implemented X
- Added Y
- Fixed Z
- Updated documentation

## Testing
- Added unit tests for X (coverage: Y%)
- Tested with example dossiers
- Manual testing: [describe what you tested]

## Progress Log Entry

Add this to IMPLEMENTATION.md:

### YYYY-MM-DD - [Title]

**Completed**:
- [List completed tasks]

**Status**: Phase [N]: [X]% complete

**Next Steps**: [What should be done next]

**Notes**: [Any important discoveries or decisions]

## Checklist
- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] IMPLEMENTATION.md Progress Log updated
- [ ] No breaking changes (or documented in CHANGELOG)
- [ ] Lint passes (`npm run lint`)
- [ ] Types check (`npm run type-check`)

## Screenshots / Examples
[If applicable, add screenshots or example output]
```

### Review Process

1. **Automated Checks**: CI must pass (tests, lint, types)
2. **Code Review**: At least one maintainer approves
3. **Testing**: Reviewer tests changes locally if needed
4. **Documentation**: Check that docs are updated
5. **Merge**: Squash and merge with clean commit message

### Commit Message Format

```
[Phase N] Brief description (50 chars or less)

Optional longer description explaining:
- Why this change is needed
- How it works
- Any important context

Closes #123
```

**Examples**:
```
[Phase 2] Implement DossierParser with section extraction

Adds core parsing logic to extract metadata and sections from dossier
markdown files. Uses marked library for markdown parsing with custom
renderer to identify section boundaries.

Includes comprehensive tests and fixtures.
```

---

## 🐛 Bug Reports

### How to Report a Bug

1. **Check existing issues** - May already be reported
2. **Create detailed issue** using this template:

```markdown
## Bug Description
Clear description of what's wrong.

## Steps to Reproduce
1. Configure MCP server with...
2. Run command...
3. See error...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Node version: [e.g., 18.16.0]
- OS: [e.g., macOS 13.4]
- MCP Server version: [e.g., 0.2.0]
- Client: [e.g., Claude Desktop 1.2.3]

## Additional Context
- Error logs
- Screenshots
- Config files (sanitized)
```

---

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. Check IMPLEMENTATION.md to see if already planned
2. Open an issue with:
   - Clear use case
   - Proposed solution
   - Alternatives considered
   - Impact on existing functionality

---

## 📖 Documentation Contributions

Documentation is just as important as code! Help by:

- **Improving clarity** - Simplify complex explanations
- **Adding examples** - More examples always help
- **Fixing typos** - Even small fixes matter
- **Adding guides** - Tutorials, how-tos, etc.

No PR too small for documentation improvements!

---

## 🎯 First-Time Contributors

New to the project? Welcome! Here are good first tasks:

- Add tests to existing code
- Improve error messages
- Fix typos in documentation
- Add code comments
- Create test fixtures

Look for issues labeled `good-first-issue` in GitHub.

---

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Maintainers may remove comments, commits, or contributors who violate these standards.

Report issues to: [project maintainers]

---

## 📞 Getting Help

### Questions?

- **Implementation questions**: Open a discussion on GitHub
- **Bug help**: Open an issue
- **General questions**: Start a discussion
- **Security issues**: Email maintainers privately

### Resources

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Full implementation plan
- [SPECIFICATION.md](./SPECIFICATION.md) - Technical specification
- [README.md](./README.md) - User-facing documentation
- [MCP Protocol Docs](https://spec.modelcontextprotocol.io/)

---

## 🎉 Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Credited in release notes
- Added to contributors list
- Celebrated in announcements!

Every contribution matters, no matter how small. Thank you for helping make dossier automation frictionless! 🚀

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
