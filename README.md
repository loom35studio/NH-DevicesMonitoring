# NH-DevicesMonitoring

This project monitors printer devices. The interface is built with
[Next.js](https://nextjs.org/) (tested on **14.2.5**). Express is still used
for some backend API routes but no longer serves any HTML views.

## Development

- `npm run next:dev` – start the Next.js app in development mode
- `npm run build` – create a production build of the Next.js interface
- `npm run start` – start the Next.js server
- `npm run express` – start the optional Express API server

The backend relies on MySQL via the `mysql2` driver. If the connection fails the
server falls back to a stub database so it can still start.

Global styles are located under `next/styles/` and are imported in
`next/pages/_app.js`.

The layout includes a sidebar with icon links to the main sections of the
dashboard. Hovering an icon reveals a tooltip with the section name.

### Authentication

User accounts are stored in the MySQL database. The project no longer requires
Redis for sessions or authentication.

### Login table

Create a table named `users` with a simple schema:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

Insert your administrator account as needed. The login page POSTs to
`/api/login` and checks credentials against this table.

### Testing

Run `npm test` to execute a very small test suite. The test checks that
key application files exist and can be read. It does not start the server
or perform integration tests, but it helps validate that the repository is
set up correctly.
