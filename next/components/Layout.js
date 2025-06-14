import Link from 'next/link';

const menu = [
  { href: '/', icon: 'fa fa-dashboard', label: 'Board' },
  { href: '/company/Elite', icon: 'fa fa-building', label: 'Societá' },
  { href: '/logs', icon: 'fa fa-history', label: 'Storico' },
  { href: '/admin', icon: 'fa fa-user', label: 'Amministrazione' }
];

export default function Layout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            {menu.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="sidebar_item">
                  <i className={item.icon} aria-hidden="true" />
                  <span className="tooltip">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="download">
          <a href="/download/report.txt" className="sidebar_item">
            <i className="fa fa-download" aria-hidden="true" />
            <span className="tooltip">Download</span>
          </a>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
