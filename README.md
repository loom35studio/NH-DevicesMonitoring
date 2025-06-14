# NH-DevicesMonitoring

This project monitors printer devices. The user interface now runs on
[Next.js](https://nextjs.org/) while the existing Express routes are kept for
API functionality.

## Development

- `npm run next:dev` – start the Next.js app in development mode
- `npm run start` – start the Express API server (optional)

The backend relies on MySQL via the `mysql2` driver. If the connection fails the
server falls back to a stub database so it can still start.

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
