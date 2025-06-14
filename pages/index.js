import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <header>
        <h1>Società</h1>
      </header>
      <div className="company_cards">
        <Link href="/company/Elite" className="company_card">Elite</Link>
        <Link href="/company/Pewex" className="company_card">Pewex</Link>
        <Link href="/company/Stefanelli" className="company_card">Gruppo Stefanelli</Link>
      </div>
    </main>
  );
}
