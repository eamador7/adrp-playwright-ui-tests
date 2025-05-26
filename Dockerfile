FROM mcr.microsoft.com/playwright:latest

WORKDIR /app

COPY package*.json ./

RUN npm install


RUN npx playwright install chromium

COPY . .


CMD ["npm", "run", "test"]