FROM node:20 as client
WORKDIR /src
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install
COPY ./client .
RUN yarn build

FROM node:20 as server
WORKDIR /app
EXPOSE 8000
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install
COPY ./server .
COPY --from=client /src/dist ./public
RUN yarn db:migrate && yarn db:seed
CMD ["yarn", "start"]
