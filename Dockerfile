# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /workspace

# Copy astrokit and build it
COPY astrokit/ astrokit/
RUN cd astrokit && npm install && npm run build

# Copy astroscope package files and install deps
COPY astroscope/package.json astroscope/package-lock.json* astroscope/
RUN cd astroscope && npm install --legacy-peer-deps

# Copy astroscope source and build
COPY astroscope/ astroscope/
RUN cd astroscope && npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=build /workspace/astroscope/dist /usr/share/nginx/html
COPY astroscope/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
