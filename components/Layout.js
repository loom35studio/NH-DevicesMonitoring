import Link from 'next/link';

const menu = [
  { href: '/', icon: 'fas fa-chart-line', label: 'Dashboard' },
  { href: '/societa', icon: 'fas fa-building', label: 'Societá' },
  { href: '/storico', icon: 'fas fa-clock-rotate-left', label: 'Storico Consegne' },
  { href: '/admin', icon: 'fas fa-user-cog', label: 'Amministrazione' }
];

export default function Layout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">NH Monitoring</div>
        <nav className="nav">
          <ul>
            {menu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="sidebar_item">
                  <i className={item.icon} aria-hidden="true" />
                  <span className="tooltip">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a href="/api/download" className="sidebar_item download">
          <i className="fas fa-download" aria-hidden="true" />
          <span className="tooltip">Download</span>
        </a>
        <div className="user">
          <i className="fas fa-user-circle" aria-hidden="true" />
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
