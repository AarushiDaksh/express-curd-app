
FROM node

WORKDIR /app


COPY . /app


ARG NODE_ENV
RUN if [ "${NODE_ENV}" = "development" ]; \
then npm install; \
else npm install --only=production; \
fi

EXPOSE 3000


CMD ["node", "server.js"]