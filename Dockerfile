FROM node:22-alpine AS build

# Build astrokit (local file: dependency)
WORKDIR /workspace
COPY astrokit/package*.json ./astrokit/
RUN cd astrokit && npm ci
COPY astrokit/ ./astrokit/
RUN cd astrokit && npm run build

# Build astroscope
COPY astroscope/package*.json ./astroscope/
RUN cd astroscope && npm install --legacy-peer-deps
COPY astroscope/ ./astroscope/
WORKDIR /workspace/astroscope
RUN npm run build

FROM nginx:alpine
COPY astroscope/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/astroscope/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
