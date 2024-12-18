# Infósok Éjszakája 3

Registration site for a LAN party.

## Features

- Solo/team competitions
- User management
- Registration with seat selection
- Finance section
- Email messaging

## Usage

Use the given `docker-compose.yml` file.

Environment variables: Look at `.env.example`

- DATABASE_URL: connection string for the Postgres database
- REDIS_URL: connection string for the Redis instance
- SITE_NAME: URL of the site, to be used for links
- TRUST_PROXY: set to `"1"` in order to read IP addresses from X-Forwarded-For header (used in session/general logging)

## Build

Run `build.sh`. The script will ask you for a version number to use for tagging the docker image. You are also prompted to push the image to docker hub.
