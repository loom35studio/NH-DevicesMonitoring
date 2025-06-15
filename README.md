# NH-DevicesMonitoring

This project monitors printer devices with a user interface built entirely with [Next.js](https://nextjs.org/). The application no longer relies on Express; all pages and API routes live inside Next.js.

## Development

- `npm run dev` – start the Next.js app in development mode
- `npm run build` – create a production build
- `npm start` – run the production server

The backend connects to MySQL via the `mysql2` driver. If the database is unavailable, a stub pool is used so the app can still start.
Server-side helpers in `routes/` are imported using the `@routes` alias configured in `next.config.js`. This alias points to the root `routes` folder so the modules can be statically imported from Next.js pages.

Global styles are in `styles/` and loaded in `pages/_app.js`. The layout uses a light glass effect with a sidebar on the left. Each menu item shows an icon with a tooltip and the active item is highlighted in blue. At the bottom of the sidebar a small download link is followed by the user section that links to the `/user` page.

The interface uses these main colors:

- Background: `#F0F2F9`
- Active elements: `#0004ff`
- Secondary text: `#a3a4c4`
- Titles: dark blue (`#003366`)

The home page now serves as the dashboard. Breadcrumbs indicate where you are. The company selection page at `/societa` presents clickable cards for Elite, Pewex and Gruppo Stefanelli.

### Authentication

User accounts are stored in a MySQL table `users`:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

The login page POSTs to `/api/login` and checks credentials against this table.

### Testing

Run `npm test` to execute a very small test suite that verifies key files exist and the `start` script launches Next.js.
