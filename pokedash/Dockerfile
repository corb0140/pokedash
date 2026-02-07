FROM node:25-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
# (Optional) Build the application if it's for production
RUN npm run build
EXPOSE 3000
CMD ["npm","run","dev"]