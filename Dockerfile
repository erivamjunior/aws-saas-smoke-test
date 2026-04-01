FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-lc", "npx prisma migrate deploy && npm run start -- --hostname 0.0.0.0 --port 3000"]
