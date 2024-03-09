FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm

RUN apt-get update && apt-get install -y git build-essential python3

COPY package*.json pnpm-lock.yaml* ./

COPY . .

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile;\
  else echo "Lockfile not found." && exit 1; \
  fi

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm rebuild sqlite3;\
  else echo "Lockfile not found." && exit 1; \
  fi

CMD [ "pnpm", "dev" ]
