# NH-DevicesMonitoring

This project monitors printer devices using a Node.js backend.  
Work has begun on migrating the frontend to [Next.js](https://nextjs.org/).

## Development

- `npm run start` – start the existing Express server
- `npm run next:dev` – run the Next.js frontend in development mode

The server can run without a database installed. Database interactions are
skipped when the connection is unavailable.
