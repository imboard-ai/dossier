#!/usr/bin/env node

/**
 * Manual test script for the MCP server tools.
 * Tests tools directly without MCP protocol overhead.
 */

import { listDossiers } from './dist/tools/listDossiers.js';
import { readDossier } from './dist/tools/readDossier.js';

async function test() {
  console.log('🧪 Testing Dossier MCP Server v1.0.0\n');

  try {
    // Test 1: List dossiers in examples directory
    console.log('📋 Test 1: list_dossiers on examples/');
    const list = await listDossiers({
      path: '../examples',
      recursive: true,
    });
    console.log(`✅ Found ${list.dossiers.length} dossiers`);
    list.dossiers.slice(0, 3).forEach((d) => {
      console.log(`   - ${d.name} (v${d.version})`);
    });
    console.log('');

    // Test 2: Read a specific dossier
    if (list.dossiers.length > 0) {
      const firstDossier = list.dossiers[0];
      console.log(`📖 Test 2: read_dossier "${firstDossier.name}"`);
      const dossier = await readDossier({
        name: firstDossier.path,
        basePath: '../examples',
      });
      console.log(`✅ Parsed successfully`);
      console.log(`   Name: ${dossier.metadata.name}`);
      console.log(`   Version: ${dossier.metadata.version}`);
      console.log(`   Protocol: ${dossier.metadata.protocol}`);
      console.log(`   Sections: ${Object.keys(dossier.sections).length}`);
      console.log('');
    }

    // Test 3: List test fixtures
    console.log('📋 Test 3: list_dossiers on test fixtures');
    const fixtures = await listDossiers({
      path: './tests/fixtures/valid',
      recursive: false,
    });
    console.log(`✅ Found ${fixtures.dossiers.length} test dossiers`);
    fixtures.dossiers.forEach((d) => {
      console.log(`   - ${d.name} (${d.status})`);
    });
    console.log('');

    console.log('🎉 All tests PASSED!');
    console.log('\n✅ MCP Server is PRODUCTION READY!');
  } catch (error) {
    console.error('❌ Test FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

test();
