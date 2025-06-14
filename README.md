# NH-DevicesMonitoring

This project monitors printer devices with a user interface built entirely with [Next.js](https://nextjs.org/). The application no longer relies on Express; all pages and API routes live inside Next.js.

## Development

- `npm run dev` – start the Next.js app in development mode
- `npm run build` – create a production build
- `npm start` – run the production server

The backend connects to MySQL via the `mysql2` driver. If the database is unavailable, a stub pool is used so the app can still start.
Server-side helpers in `routes/` are loaded at runtime from absolute paths using `path.resolve` and `import()`. This lets Next.js load modules that live outside the `pages` directory.

Global styles are in `styles/` and loaded in `pages/_app.js`. The layout features a sidebar with icon links to the main sections of the dashboard.

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
