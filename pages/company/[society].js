import { getPrintersBySociety } from '@routes/printerList';


export async function getServerSideProps({ params }) {
  const printers = await getPrintersBySociety(params.society);
  return { props: { printers, company: params.society } };
}

export default function Company({ company, printers }) {
  return (
    <main className="container">
      <header>
        <h1>{company}</h1>
      </header>
      {printers.length === 0 ? (
        <p>Nessuna stampante trovata</p>
      ) : (
        <table className="printers">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Modello</th>
              <th>Giallo %</th>
              <th>Magenta %</th>
              <th>Ciano %</th>
              <th>Nero %</th>
            </tr>
          </thead>
          <tbody>
            {printers.map(pr => (
              <tr key={pr.ID}>
                <td>{pr.name}</td>
                <td>{pr.model}</td>
                <td>{pr.yellow_percentage ?? '—'}</td>
                <td>{pr.magenta_percentage ?? '—'}</td>
                <td>{pr.cyan_percentage ?? '—'}</td>
                <td>{pr.black_percentage ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
