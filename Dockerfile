FROM node:10
ENV YARN_VERSION 1.17.3

RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz

WORKDIR /home/node

COPY package.json ./

COPY yarn.lock ./

USER node

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "server.js"]
