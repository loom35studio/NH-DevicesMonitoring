import printerList from '../../routes/printerList';
import generateTxt from '../../routes/generateTxt';
import simpleGit from 'simple-git';

export async function getServerSideProps({ params }) {
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
