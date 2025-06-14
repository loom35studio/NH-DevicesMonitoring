import Link from 'next/link';
import { useRouter } from 'next/router';

const labels = {
  '': 'Dashboard',
  societa: 'Societá',
  company: 'Societá',
  admin: 'Amministrazione',
  storico: 'Storico',
  user: 'Utente',
};

export default function Breadcrumbs() {
  const router = useRouter();
  const path = router.asPath.split('?')[0];
  const segments = path.split('/').filter(Boolean);
  const crumbs = [{ href: '/', label: labels[''] }];
  let href = '';
  segments.forEach((seg) => {
    href += '/' + seg;
    let label = labels[seg] || seg;
    if (seg === router.query.society) label = router.query.society;
    crumbs.push({ href, label });
  });
  return (
    <nav className="breadcrumbs">
      {crumbs.map((c, idx) => (
        <span key={idx} className="crumb">
          {idx !== 0 && ' / '}
          <Link href={c.href}>{c.label}</Link>
        </span>
      ))}
    </nav>
  );
}
