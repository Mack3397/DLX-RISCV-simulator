# https://medium.com/@wkrzywiec/build-and-run-angular-application-in-a-docker-container-b65dbbc50be8
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/DLX-RISCV-simulator /usr/share/nginx/html
