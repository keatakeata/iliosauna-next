#!/bin/bash
# Export current dataset
npx sanity dataset export production backup.tar.gz

# Create new document with our data
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./sanity-saunas-FINAL.json', 'utf8'));
const ndjson = JSON.stringify(data) + '\n';
fs.writeFileSync('saunas-update.ndjson', ndjson);
"

# Import the update
npx sanity dataset import saunas-update.ndjson production --replace
