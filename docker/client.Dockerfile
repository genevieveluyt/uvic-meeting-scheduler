FROM mhart/alpine-node

# Set working directory
WORKDIR /app

# Copy current host directory to container working directory
COPY ./client .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
