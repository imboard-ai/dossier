# Review Fixes Plan

Prioritized fixes from the developer quality + user experience reviews.
MCP server excluded (being rewritten separately).

## Tasks

### 1. Fix broken links in README and quickstart -- DONE
- [x] Root README links to nonexistent `./PROTOCOL.md`, `./FAQ.md`, `./SCHEMA.md`, `./SPECIFICATION.md`, `./QUICK_START.md`
- [x] `docs/getting-started/installation.md` has relative links that resolve to wrong paths
- [x] Fix all to point to correct locations in `docs/`
- [x] Also fixed broken links in `docs/reference/specification.md`, `docs/guides/adopter-playbooks.md`, `docs/guides/claude-code-integration.md`, `docs/explanation/security-model.md`, `mcp-server/README.md`

### 2. Resolve license inconsistency (ELv2 vs MIT) -- DONE
- [x] `docs/index.md` says MIT — fixed to ELv2
- [x] `ARCHITECTURE.md` says MIT — fixed to ELv2
- [x] `mcp-server/README.md` says MIT — fixed to ELv2
- [x] `docs/contributing/README.md` says MIT — fixed to ELv2
- [x] `templates/dossier-template.md` `"license": "MIT"` — kept as-is (placeholder for user dossiers)

### 3. Lower Node.js requirement to >=18 -- DONE
- [x] `cli/package.json` changed from `>=24.0.0` to `>=18.0.0`
- [x] `.nvmrc` changed from 24 to 22
- [x] CI matrix changed to test on [18, 20, 22]
- [x] Publish workflows changed from Node 24 to 22
- [x] `CONTRIBUTING.md` already says "Node.js 18+" — now consistent

### 4. Remove/implement "NOT IMPLEMENTED" verification stages -- DONE
- [x] Removed misleading "NOT IMPLEMENTED" console output from stages 2-5 in `helpers.ts`
- [x] Stages still tracked as skipped in results, but no longer print false UI to users
- [x] Removed "MVP: Audit log" and "Future: Would send to audit server" messages from `run.ts`
- [x] All 280 CLI tests pass

### 5. Deduplicate frontmatter parsing — use core's parser everywhere -- DONE
- [x] Replaced duplicated regex with `parseDossierContent()` from `@ai-dossier/core` in: `checksum.ts`, `publish.ts`, `info.ts`, `validate.ts`, `run.ts`, `helpers.ts`
- [x] Fixed core regex to not eat leading whitespace from body (`\s*` → `[^\S\n]*`)
- [x] All 280 CLI tests + 91 core tests pass

### 6. Split the README to ~300 lines -- DONE
- [x] README reduced from 1321 to 277 lines
- [x] Extracted deep content to `docs/guides/dossier-guide.md` (concepts, schema, security, self-improvement, best practices, troubleshooting)
- [x] Fixed Option C "30-sec demo" to use actual `---dossier` JSON format instead of fake YAML
- [x] Added compact "Learn More" section with links to all key docs

### 7. Add README to @ai-dossier/core -- DONE
- [x] Created `packages/core/README.md` with installation, API examples (parsing, checksum, signature, linting, formatting)
- [x] Added `README.md` to `files` array in `package.json` so it's included in npm package

### 8. Fix status enum inconsistency across packages -- DONE (merged with task 5)
- [x] Core's `validateFrontmatter`: added `experimental`, now `['draft', 'stable', 'deprecated', 'experimental']`
- [x] CLI `helpers.ts` VALID_STATUSES: changed to lowercase `['draft', 'stable', 'deprecated', 'experimental']`
- [x] CLI `publish.ts`: simplified to lowercase list with case-insensitive comparison
- [x] CLI `validate.ts`: added `.toLowerCase()` for status comparison
- [x] All comparisons now case-insensitive

### 9. Write at least one real tutorial in docs/tutorials/ -- DONE
- [x] Created `docs/tutorials/your-first-dossier.md` — install, create, validate, checksum, execute, verify
- [x] Updated `docs/tutorials/README.md` to link to the new tutorial
