# NH-DevicesMonitoring

This project monitors printer devices. The user interface now runs on
[Next.js](https://nextjs.org/) while the existing Express routes are kept for
API functionality.

## Development

- `npm run next:dev` – start the Next.js app in development mode
- `npm run start` – start the Express API server (optional)

The server can run without a database installed. Database interactions are
skipped when the connection is unavailable.

### Authentication

User accounts are stored in Redis. When the server starts an `Administrator`
account is created with password `1q2w3e4r`. The Express routes under `/auth`
provide registration and login endpoints used by the Next.js interface.
