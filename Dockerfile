FROM node:22 AS build
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY package*.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --production
RUN npx prisma generate
COPY . .
RUN yarn build

FROM node:22-bookworm-slim AS final
ENV NODE_ENV=production
RUN apt update -y && apt install -y openssl
WORKDIR /app/
COPY --from=build /home/node/app/.output ./
COPY --from=build /home/node/app/package*.json ./
COPY --from=build /home/node/app/prisma ./prisma
RUN yarn global add prisma

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
CMD ["yarn", "run", "start:migrate:prod"]
