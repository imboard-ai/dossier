import type { Command } from 'commander';
import { getClient } from '../registry-client';

export function registerSearchCommand(program: Command): void {
  program
    .command('search')
    .description('Search the registry for dossiers')
    .argument('<query>', 'Search keywords')
    .option('--category <category>', 'Filter by category (devops, database, development, security, etc.)')
    .option('--page <number>', 'Page number', '1')
    .option('--per-page <number>', 'Results per page', '20')
    .option('--json', 'Output as JSON')
    .action(async (query: string, options: { category?: string; page: string; perPage: string; json?: boolean }) => {
      const page = parseInt(options.page, 10) || 1;
      const perPage = parseInt(options.perPage, 10) || 20;

      try {
        const client = getClient();
        const result = await client.listDossiers({ category: options.category, page: 1, perPage: 100 }) as any;
        const allDossiers: any[] = result.dossiers || [];

        const queryLower = query.toLowerCase();
        const terms = queryLower.split(/\s+/).filter(Boolean);

        const matched = allDossiers.filter((d: any) => {
          const fields = [
            d.name || '',
            d.title || '',
            d.description || d.objective || '',
            ...(Array.isArray(d.category) ? d.category : [d.category || '']),
            ...(d.tags || []),
          ].map((f: string) => String(f).toLowerCase()).join(' ');

          return terms.every(term => fields.includes(term) || fields.indexOf(term) !== -1);
        });

        const total = matched.length;
        const start = (page - 1) * perPage;
        const dossiers = matched.slice(start, start + perPage);

        if (options.json) {
          console.log(JSON.stringify({ dossiers, total, page, perPage }, null, 2));
          process.exit(0);
        }

        if (dossiers.length === 0) {
          console.log(`\nNo dossiers found matching "${query}".\n`);
          process.exit(0);
        }

        console.log(`\n🔍 Found ${total} dossier(s) matching "${query}":\n`);

        for (const d of dossiers) {
          const name = d.name || '';
          const version = d.version || '';
          const title = d.title || '';
          const category = Array.isArray(d.category) ? d.category.join(', ') : (d.category || '');
          const description = d.description || d.objective || '';

          console.log(`  ${name} (v${version})${category ? '  [' + category + ']' : ''}`);
          if (title) {
            console.log(`  ${title}`);
          }
          if (description) {
            const snippet = description.length > 100 ? description.slice(0, 100) + '...' : description;
            console.log(`  ${snippet}`);
          }
          console.log('');
        }

        const totalPages = Math.ceil(total / perPage);
        if (totalPages > 1) {
          console.log(`Page ${page}/${totalPages} (${perPage} per page)`);
          if (page < totalPages) {
            console.log(`Use --page ${page + 1} to see more results`);
          }
          console.log('');
        }
      } catch (err: unknown) {
        console.error(`\n❌ Search failed: ${(err as Error).message}\n`);
        process.exit(1);
      }
    });
}
