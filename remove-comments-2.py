import re, pathlib
files=[
  'backend/data/seed.js',
  'backend/middleware/db.js',
  'backend/routes/oceans.js',
  'backend/routes/species.js',
  'backend/__tests__/api.test.js',
  'backend/package-lock.json',
  'backend/package.json',
  'backend/server.js',
  'frontend/src/components/AddForm.vue',
  'frontend/src/components/OceanList.vue',
  'frontend/src/components/SpeciesList.vue',
  'frontend/src/App.vue',
  'frontend/src/main.js',
  'frontend/index.html',
  'frontend/package.json',
  'frontend/vite.config.js'
]
for rel in files:
    p = pathlib.Path(rel)
    text = p.read_text(encoding='utf-8')
    if p.suffix != '.json':
        # remove /* */ comments
        while '/*' in text and '*/' in text:
            text = re.sub(r'/\*[\s\S]*?\*/', '', text)
        # remove full-line // comments
        lines = []
        for line in text.splitlines(True):
            if line.lstrip().startswith('//'):
                continue
            lines.append(line)
        text = ''.join(lines)
    p.write_text(text, encoding='utf-8')
    print('Processed', rel)
