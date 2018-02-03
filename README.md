# Uvic Meeting Scheduler [WIP]

Easily figure out when everyone on your team is free to meet based on the courses they are taking.

## Prerequisites

- postgres
- python 3
- pipenv
- node

## Setup

1. Create a database in postgres called `uvicscheduler`

2. Create tables by running the `uvicscheduler.sql` script

3. Run the following commands:

```bash
# Create virtual environment with python 3
pipenv --three

# Install python requirements
pipenv install

# Populate the database with course data
# Depending on how the db was set up, provide --user and --password options
pipenv run python scraper.py

# To see other options for the scraper program:
# pipenv run python scraper.py --help

# Create a config file
cp env.template.py env.py

# Edit env.py with the necessary postgres credentials

# Install node requirements
npm install --prefix client
```

## Start the Backend

```bash
npm start
```

## Start the Frontend

In another terminal:
```bash
npm start --prefix client
```