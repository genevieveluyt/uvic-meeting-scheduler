# Uvic Meeting Scheduler [WIP]

## Prerequisites

- postgres
- python 3
- pipenv

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
```

## Start the Backend

```bash
export FLASK_APP=app.py
pipenv run flask run
```