# Getting Started with Dossier

Welcome! This guide will help you get up and running with Dossier quickly.

## Recommended Learning Path

1. **Try it** (2 min) — Copy the [Hello World example](../../README.md#try-it-now) into any LLM chat
2. **Install the CLI** (2 min) — `npm install -g @ai-dossier/cli`
3. **Your first dossier** (10 min) — Follow the [tutorial](../tutorials/your-first-dossier.md)
4. **Browse examples** (5 min) — Explore [real-world dossiers](../../examples/)
5. **Go deeper** — Read the [Dossier Guide](../guides/dossier-guide.md) for concepts, schema, and security

## Installation

```bash
# Install globally
npm install -g @ai-dossier/cli

# Or use without installing
npx @ai-dossier/cli verify <dossier-file>
```

For MCP server integration, registry configuration, and authentication details, see [installation.md](installation.md).

## Verify Your First Dossier

```bash
ai-dossier verify https://raw.githubusercontent.com/imboard-ai/ai-dossier/main/examples/devops/deploy-to-aws.ds.md
```

## Next Steps

- [Create your first dossier](../tutorials/your-first-dossier.md) — Step-by-step tutorial
- [Learn about the protocol](../reference/protocol.md) — How dossiers execute
- [Explore example dossiers](../../examples/) — Real-world templates
- [Understand security model](../explanation/security-model.md) — Checksums, signatures, risk levels

## Need Help?

- Check the [FAQ](../explanation/faq.md) — Covers common questions and comparisons
- Browse [guides](../guides/) for specific tasks
- Ask questions in [GitHub Discussions](https://github.com/imboard-ai/ai-dossier/discussions)
