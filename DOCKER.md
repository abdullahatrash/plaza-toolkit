# Docker Setup Guide

This guide explains how to build and run the PLAZA Toolkit application using Docker.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Initialize the database (first time only):**
   ```bash
   docker-compose exec web sh -c "cd /app/packages/database && pnpm db:push && pnpm db:seed"
   ```

4. **Access the application:**
   - Open http://localhost:3000 in your browser

5. **Stop the container:**
   ```bash
   docker-compose down
   ```

### Using Docker Directly

1. **Build the image:**
   ```bash
   docker build -t plaza-toolkit .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name plaza-toolkit \
     -p 3000:3000 \
     -v $(pwd)/packages/database/prisma:/app/packages/database/prisma \
     plaza-toolkit
   ```

3. **Initialize the database (first time only):**
   ```bash
   docker exec -it plaza-toolkit sh -c "cd /app/packages/database && pnpm db:push && pnpm db:seed"
   ```

4. **View logs:**
   ```bash
   docker logs -f plaza-toolkit
   ```

5. **Stop and remove the container:**
   ```bash
   docker stop plaza-toolkit
   docker rm plaza-toolkit
   ```

## Database Persistence

The SQLite database is persisted using Docker volumes. The database file (`dev.db`) is stored in:
- **Local path:** `./packages/database/prisma/dev.db`
- **Container path:** `/app/packages/database/prisma/dev.db`

This ensures your data persists across container restarts.

## Environment Variables

You can customize the application behavior using environment variables. Create a `.env` file or modify `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=file:./dev.db
  # Add other environment variables as needed
```

## Database Management

### Run Prisma Studio (Database GUI)

```bash
docker-compose exec web sh -c "cd /app/packages/database && pnpm db:studio"
```

Then access Prisma Studio at the URL shown in the logs (typically requires port forwarding).

### Reset Database

```bash
docker-compose exec web sh -c "cd /app/packages/database && pnpm db:reset"
```

### Generate Prisma Client

```bash
docker-compose exec web sh -c "cd /app/packages/database && pnpm db:generate"
```

## Troubleshooting

### Database not found or corrupted

If you encounter database issues, you can reset it:

```bash
# Stop the container
docker-compose down

# Remove the database file (optional - this will delete all data)
rm packages/database/prisma/dev.db

# Start the container
docker-compose up -d

# Initialize the database
docker-compose exec web sh -c "cd /app/packages/database && pnpm db:push && pnpm db:seed"
```

### Permission Issues

If you encounter permission issues with the database file:

```bash
# Fix permissions
sudo chown -R $USER:$USER packages/database/prisma/
chmod -R 755 packages/database/prisma/
```

### Build Issues

If the Docker build fails:

1. **Clear Docker cache:**
   ```bash
   docker builder prune
   ```

2. **Rebuild without cache:**
   ```bash
   docker-compose build --no-cache
   ```

### Container Won't Start

Check the logs for errors:
```bash
docker-compose logs web
```

Common issues:
- Port 3000 already in use: Change the port mapping in `docker-compose.yml`
- Database path issues: Ensure the volume mount is correct
- Missing dependencies: Rebuild the image

## Production Considerations

For production deployments, consider:

1. **Use PostgreSQL instead of SQLite** for better performance and concurrent access
2. **Set up proper environment variables** for sensitive data
3. **Use Docker secrets** for API keys and passwords
4. **Set up proper logging** and monitoring
5. **Configure reverse proxy** (nginx) for HTTPS
6. **Use a process manager** like PM2 if needed
7. **Set up database backups** for SQLite or use managed PostgreSQL

## Next Steps

- Review the [Next.js Docker documentation](https://nextjs.org/docs/deployment#docker-image)
- Consider using [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/) for optimization
- Set up CI/CD pipelines for automated deployments

