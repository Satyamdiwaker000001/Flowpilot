FROM python:3.12-slim

WORKDIR /app

# Install system dependencies needed for psycopg2 and other packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Make the start script executable and fix Windows line endings
RUN sed -i 's/\r$//' start.sh
RUN chmod +x start.sh

# Run the start script which handles migrations and booting the app
CMD ["./start.sh"]
