FROM python:3.11-slim

# Create the user required by Hugging Face Spaces (UID 1000)
RUN useradd -m -u 1000 user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set working directory
WORKDIR $HOME/app

# Install dependencies first for better Docker caching
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else with correct ownership
COPY --chown=user . $HOME/app

# Expose port 7860 which is required by Hugging Face Spaces
EXPOSE 7860

# Run the Flask app
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=7860

CMD ["flask", "run"]
