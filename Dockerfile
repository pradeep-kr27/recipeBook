#docker for angular

#stage 1

FROM node:16 AS recipe-app-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

#copying build from stage 1 to stage 2

#stage 2

FROM nginx:1.15-alpine
COPY --from=recipe-app-build /app/dist/my-first-app /usr/share/nginx/html
EXPOSE 80
