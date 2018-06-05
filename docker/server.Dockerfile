FROM python:3-slim

# Set working directory
WORKDIR /app

# Copy current host directory to container working directory
COPY ./server .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["flask", "run"]
