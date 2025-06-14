import simpleGit from 'simple-git';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

async function loadServerModule(relPath) {
  const full = resolve(process.cwd(), relPath);
  try {
    const mod = await import(pathToFileURL(full).href);
    return mod.default || mod;
  } catch (err) {
    console.error('Failed loading', full, err);
    throw new Error('Unable to load ' + relPath);
  }
}


export async function getServerSideProps({ params }) {
  const printerList = await loadServerModule('routes/printerList.js');
  const generateTxt = await loadServerModule('routes/generateTxt.js');

  const allPrinters = await printerList();
  const printers = allPrinters.filter(p =>
    p[0].society && p[0].society.toLowerCase() === params.society.toLowerCase()
  );
  const txt = await generateTxt(printers);
  const git = simpleGit();
  const log = await git.log();
  const commits = log.all.map(c => ({
    hash: c.hash,
    date: c.date,
    message: c.message,
    author: c.author_name,
  }));
  return { props: { printers, txt, commits, company: params.society } };
}

export default function Company({ company, printers }) {
  return (
    <main className="container">
      <header>
        <h1>{company}</h1>
      </header>
      <ul className="device_container">
        {printers.map((prnt) => (
          <li key={prnt[0].ID}>{prnt[0].name} {prnt[0].model}</li>
        ))}
      </ul>
    </main>
  );
}
