# Base image using Micromamba for managing Python dependencies
FROM mambaorg/micromamba:0.25.1 AS ember

USER root
WORKDIR /ember

# Set environment variables for Mamba
ENV MAMBA_ROOT_PREFIX=/opt/mamba
ENV CONDA_PKGS_DIRS=$MAMBA_ROOT_PREFIX/pkgs
ENV MAMBA_EXE=/bin/micromamba
ENV MAMBA_NO_BANNER=1
ENV PATH=/opt/mamba/bin:$PATH

# Create the directory for Mamba and ensure it is writable
RUN mkdir -p $MAMBA_ROOT_PREFIX/pkgs && \
    chmod -R ugo+w $MAMBA_ROOT_PREFIX

# Install dependencies
COPY requirements_conda.txt .
RUN micromamba install -y -n base --channel conda-forge --file requirements_conda.txt && \
    micromamba install -y -n base --channel conda-forge python scikit-learn==1.5.2 numpy=1.19 pandas==1.3.5 xgboost lightgbm pefile flask flask-cors sqlalchemy Flask-SQLAlchemy Werkzeug && \
    micromamba clean --all --yes

# Copy all EMBER files
COPY ./ember_lib /ember
RUN /opt/mamba/bin/python setup.py install

# Stage 2: Final runtime with Python 3.10
FROM python:3.10-slim AS runtime

# Set the working directory
WORKDIR /app

# Copy installed packages from Ember stage
COPY --from=ember /opt/mamba /opt/conda

# Ensure the environment is activated and PATH is correctly set
ENV PATH=/opt/conda/bin:$PATH

RUN /opt/conda/bin/python -m pip install --upgrade pip && \
    /opt/conda/bin/python -m pip install --no-cache-dir lief==0.12.3

# Copy the application files
COPY . .

# Expose the port the Flask app will run on
EXPOSE 5001

# Ensure Flask runs on the correct host and port
ENV FLASK_APP=run.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

# Command to run the Flask server
CMD ["/opt/conda/bin/python", "run.py"]
