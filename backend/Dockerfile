FROM node:16-bullseye

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  make \
  g++ \
  libc6-dev \
  libstdc++6 \
  libssl-dev \
  libffi-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --unsafe-perm

COPY . .

RUN npm rebuild bcrypt --build-from-source

EXPOSE 3838
