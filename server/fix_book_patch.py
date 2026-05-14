from pathlib import Path

path = Path('src/models/Book.ts')
text = path.read_text(encoding='utf-8')
old = "\t\t\t\tconst backendUrl = (process.env.APP_URL ?? 'http://localhost:3333').replace(/\\/+$/, '');\n            return `${backendUrl}/files/${coverUrl}`;\n"
new = "\t\t\t\tconst backendUrl = (process.env.APP_URL ?? 'http://localhost:3333').replace(/\\/+$/, '');\n\t\t\t\treturn `${backendUrl}/files/${coverUrl}`;\n"
if old in text:
    path.write_text(text.replace(old, new), encoding='utf-8')
    print('PATCHED')
else:
    print('OLD NOT FOUND')
    print(repr(old))
    print(text[text.find('const backendUrl') - 50:text.find('const backendUrl') + 120])
