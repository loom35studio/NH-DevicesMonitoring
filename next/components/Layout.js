import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link href="/">Board</Link></li>
            <li><Link href="/company/Elite">Societá</Link></li>
            <li><Link href="/logs">Storico</Link></li>
            <li><Link href="/admin">Amministrazione</Link></li>
          </ul>
        </nav>
        <div className="download">
          <a href="/download/report.txt">Download</a>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
