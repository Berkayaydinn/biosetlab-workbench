FROM ubuntu:20.04 AS builder-image

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install --no-install-recommends -y \
    python3.9 \
    python3.9-dev \
    python3.9-venv \
    python3.9-distutils \
    python3-pip \
    python3-wheel \
    build-essential \
    gcc \
    g++ \
    make \
    libc6-dev \
    libffi-dev \
    libssl-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Ensure python3 and pip3 point to python3.9
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1
RUN python3.9 -m pip install --upgrade pip setuptools wheel

WORKDIR /app

COPY ./requirements.txt .
RUN python3.9 -m pip install --no-cache-dir wheel
RUN python3.9 -m pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python3.9", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000", "--reload"]

EXPOSE 3000