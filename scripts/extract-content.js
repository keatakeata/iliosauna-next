#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
try {
  const { sanityFetch } = require(path.join(__dirname, '..', 'sanity', 'lib', 'client.js'));
} catch (e) {
  console.log('Warning: Could not load Sanity client, using mock functions for testing');
  var sanityFetch = async (query) => {
    console.log('Mock query:', query);
    return {
      heroSection: { title: 'Mock Title', subtitle: 'Mock Subtitle' }
    };
  };
}
const fetch = require('node-fetch');

// Content patterns to extract from components
const CONTENT_PATTERNS = {
  'our-story': {
    heroSection: {
      title: /title:\s*['"]([^'"]*)['"]/,
      subtitle: /subtitle:\s*['"](Test:\s*)?([^'"]*)['"]/
    },
    passionSection: {
      title: /title:\s*['"]([^'"]*)['"]/,
      paragraph1: /paragraph1:\s*['"]([^'"]*)['"]/,
      paragraph2: /paragraph2:\s*['"]([^'"]*)['"]/,
      quote: /quote:\s*['"]([^'"]*)['"]/
    },
    builtInCanadaSection: {
      title: /title:\s*['"]([^'"]*)['"]/,
      paragraph1: /paragraph1:\s*['"]([^'"]*)['"]/,
      paragraph2: /paragraph2:\s*['"]([^'"]*)['"]/
    },
    craftsmanshipSection: {
      title: /title:\s*['"]([^'"]*)['"]/,
      description: /description:\s*['"]([^'"]*)['"]/
    },
    valuesSection: {
      title: /title:\s*['"]([^'"]*)['"]/,
      paragraph1: /paragraph1:\s*['"]([^'"]*)['"]/,
      paragraph2: /paragraph2:\s*['"]([^'"]*)['"]/,
      paragraph3: /paragraph3:\s*['"]([^'"]*)['"]/
    },
    ctaSection: {
      title: /title:\s*['"]([^'"]*)['"]/,
      description: /description:\s*['"]([^'"]*)['"]/,
      primaryButtonText: /primaryButtonText:\s*['"]([^'"]*)['"]/,
      primaryButtonLink: /primaryButtonLink:\s*['"]([^'"]*)['"]/,
      secondaryButtonText: /secondaryButtonText:\s*['"]([^'"]*)['"]/,
      secondaryButtonLink: /secondaryButtonLink:\s*['"]([^'"]*)['"]/
    }
  }
};

async function extractContent() {
  console.log('🔍 Extracting content from source files...');

  const srcDir = path.join(__dirname, '..', 'src');
  const extractedContent = {};

  // Scan our-story page
  const ourStoryPath = path.join(srcDir, 'app', 'our-story', 'page.tsx');
  if (fs.existsSync(ourStoryPath)) {
    const content = fs.readFileSync(ourStoryPath, 'utf8');
    extractedContent['our-story'] = extractOurStoryContent(content);
  }

  return extractedContent;
}

function extractOurStoryContent(content) {
  const extracted = {};

  // Extract each section
  Object.keys(CONTENT_PATTERNS['our-story']).forEach(sectionKey => {
    const sectionPatterns = CONTENT_PATTERNS['our-story'][sectionKey];
    const sectionContent = {};

    Object.keys(sectionPatterns).forEach(fieldKey => {
      const pattern = sectionPatterns[fieldKey];
      const match = content.match(pattern);
      if (match) {
        if (fieldKey === 'subtitle' && match[1]) {
          // For subtitle, capture group 2 (after "Test: ")
          sectionContent[fieldKey] = match[2];
        } else if (match[1]) {
          // For other fields, use capture group 1
          sectionContent[fieldKey] = match[1];
        }
      }
    });

    if (Object.keys(sectionContent).length > 0) {
      extracted[sectionKey] = sectionContent;
    }
  });

  return extracted;
}

async function getCurrentSanityContent() {
  console.log('📥 Fetching current Sanity content...');

  try {
    const query = `*[_type == "ourstory-final"][0]{
      _id,
      heroSection,
      passionSection,
      builtInCanadaSection,
      craftsmanshipSection,
      valuesSection,
      ctaSection
    }`;

    const result = await sanityFetch(query);
    return result;
  } catch (error) {
    console.error('❌ Error fetching Sanity content:', error.message);
    return null;
  }
}

function compareAndDetectChanges(extracted, current) {
  const changes = [];
  const sections = Object.keys(extracted);

  sections.forEach(sectionKey => {
    if (!current[sectionKey]) return;

    const extractedSection = extracted[sectionKey];
    const currentSection = current[sectionKey];

    Object.keys(extractedSection).forEach(fieldKey => {
      const extractedValue = extractedSection[fieldKey];
      const currentValue = currentSection[fieldKey];

      if (extractedValue !== currentValue && extractedValue && currentValue) {
        changes.push({
          section: sectionKey,
          field: fieldKey,
          oldValue: currentValue,
          newValue: extractedValue
        });
      }
    });
  });

  return changes;
}

async function syncToSanity(changes) {
  if (changes.length === 0) {
    console.log('✅ No changes detected - content is in sync');
    return;
  }

  console.log(`🔄 Found ${changes.length} changes to sync:`);

  changes.forEach(change => {
    console.log(`  ${change.section}.${change.field}:`);
    console.log(`    Old: "${change.oldValue}"`);
    console.log(`    New: "${change.newValue}"`);
  });

  // Build update object for API
  const updateObj = {};

  changes.forEach(change => {
    if (!updateObj[change.section]) updateObj[change.section] = {};
    updateObj[change.section][change.field] = change.newValue;
  });

  try {
    console.log('🔄 Syncing changes to Sanity via API...');

    // Check if dev server is running
    const devServerUrl = 'http://localhost:4448/api/content/sync';

    const response = await fetch(devServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: updateObj,
        pageType: 'our-story'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = await response.json();
    console.log('✅ Sync completed successfully!');
    console.log('📄 Document ID:', result.documentId);

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.log('\n💡 Make sure your development server is running:');
    console.log('   npm run dev');
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting content synchronization...\n');

    const extracted = await extractContent();
    const current = await getCurrentSanityContent();

    if (!current) {
      console.error('❌ Could not fetch current Sanity content');
      process.exit(1);
    }

    const changes = compareAndDetectChanges(extracted, current);
    await syncToSanity(changes);

    console.log('\n✨ Content sync complete!');
    console.log('💡 CMS now reflects your latest code changes');

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractContent, extractOurStoryContent, compareAndDetectChanges };
