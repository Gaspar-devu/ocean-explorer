import pathlib, re
root = pathlib.Path('d:/Code/azure/ocean-explorer')
patterns = [re.compile(r'^[ \t]*//'), re.compile(r'/\*'), re.compile(r'\*/'), re.compile(r'<!--'), re.compile(r'-->')]
for p in root.rglob('*'):
    if p.is_file() and p.suffix in ['.js','.vue','.html'] and 'node_modules' not in p.parts:
        text = p.read_text(encoding='utf-8')
        for i,line in enumerate(text.splitlines(),1):
            for pat in patterns:
                if pat.search(line):
                    print(f'{p}:{i}:{line}')
                    break
        # to keep output short, historic break? none
