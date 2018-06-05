# Uvic Meeting Scheduler [WIP]

Easily figure out when everyone on your team is free to meet based on the courses they are taking.

## Prerequisites

- Docker
- Docker Compose

## Setup

Setup the database

```bash
# Create config files
cp env.template.py env.py
cp docker/.template.env docker/.env

# Edit the config files with the necessary postgres credentials

# Create and start the database container
sudo docker-compose up -d db

# Create the tables
sudo docker-compose exec db psql -d uvicscheduler -f /scripts/uvicscheduler.sql -U uvicscheduler

# Create and start the server container
# Leave out the -d option to see the console output as the server builds
sudo docker-compose up -d server

# Populate the database with course data
# Replace $DB_USER and $DB_PASSWORD with credentials
sudo docker-compose exec server python scraper.py --user $DB_USER --password $DB_PASSWORD

# To see other options for the scraper program:
# pipenv run python scraper.py --help
```

## Running the App

Run the app
```bash
sudo docker-compose up -d web
```