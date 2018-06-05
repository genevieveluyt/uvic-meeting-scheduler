FROM python:3

# Set working directory
WORKDIR /app

# Copy current host directory to container working directory
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["flask", "run"]
