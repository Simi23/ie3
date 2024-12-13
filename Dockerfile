FROM node:22 AS build
WORKDIR /home/node/app
COPY package*.json ./
COPY prisma ./prisma/
RUN yarn install
RUN npx prisma generate
COPY . .
RUN yarn build

FROM node:22 AS final
WORKDIR /app/
COPY --from=build /home/node/app/.output ./
COPY --from=build /home/node/app/package*.json ./
COPY --from=build /home/node/app/prisma ./prisma
RUN yarn global add prisma

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
CMD ["yarn", "run", "start:migrate:prod"]
