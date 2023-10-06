FROM node:18
RUN mkdir -p /usr/src/22027-Website-Alpha_Mares
WORKDIR /usr/src/22027-Website-Alpha_Mares
COPY package.json /usr/src/22027-Website-Alpha_Mares
RUN npm install
COPY . /usr/src/22027-Website-Alpha_Mares
CMD [ "node", "server"]
