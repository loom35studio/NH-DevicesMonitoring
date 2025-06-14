import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from './Breadcrumbs';

const menu = [
  { href: '/', icon: 'fas fa-chart-line', label: 'Dashboard' },
  { href: '/societa', icon: 'fas fa-building', label: 'Societá' },
  { href: '/storico', icon: 'fas fa-clock-rotate-left', label: 'Storico Consegne' },
  { href: '/admin', icon: 'fas fa-user-cog', label: 'Amministrazione' }
];

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <div className="dashboard">
      <aside className="sidebar glass">
        <div className="logo">NH Monitoring</div>
        <nav className="nav">
          <ul>
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar_item${
                    router.pathname === item.href ? ' active' : ''
                  }`}
                >
                  <i className={item.icon} aria-hidden="true" />
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/user" className="user">
          <img src="/images/background.svg" alt="User" className="avatar" />
          <span className="username">Admin</span>
        </Link>
      </aside>
      <main className="main">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
