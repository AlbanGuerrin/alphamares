# 22027-Alpha-Mares

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Folder-Organisation](#folder-organisation)
4. [Deploy](#deploy)
4. [Licenses](#licenses)
6. [FAQs](#faqs)

## General Info
This project was developed with the aim of allowing the development of the commercial activity of the company Alpha Mares in the sale of horse embryos. This project consists of the developpement of the front-end and back-end of alphamares.com. The chief of project was Amélie Meunier and the developper was Alexandre JOLY for the SEIO. The development started in december 2022.

## Technologies
This project use a MERN stack : MongoDB, Express, React and Node.
The project is serve by a NGINX docker.

**Back-end :**
- Node.js 18
- MongoDB v3

**Front-end :**
- React v18

**Server :**
- NGINX

## Folder Organisation 

```
|
|-- client          // react app
|-- config          // contains config files
|-- controllers     // API controllers
|-- mailTemplates   // Mail templates
|-- middleware      // API middlewares
|-- models          // API models (mongo)
|-- nginx           // contains conf and certificate of NGINX
|-- routes          // API routes
|-- uploads         // API static directory for uploads
|-- utils
|-- docker-compose.yml
|-- Dockerfile
|-- package.json
|-- README.md
|-- server.js       // API entry file
```

## Deploy
This repo contains the project ready to deploy.

For deploiement we use docker-compose, it uses 3 services :
- **api:** docker of the API
- **mongo:** docker of the MongoDB server
- **nginx:** docker of NGINX server 

**__Only__** the **NGINX** docker is exposed.
The MongoDB server must **not be exposed to internet** (unless adequately secured).

The **NGINX** server has 2 roles :
- **Host** the react build
- **Redirect** request to the API container 

All the services communicate throught the docker-compose network.

Note that I choose not to use a react docker to build the image in order to reduce the docker-compose build size.

### How to deploy :

1. Create the `.env` for the client (in */client*) and complete it:
    ```
    REACT_APP_API_URL=http://<URL_OF_API>/
    REACT_APP_URL=http://<URL_OF_CLIENT>/
    ```
2. Build the React production build *(node and react-script required)*
    ```js
    cd client
    npm run build // will create a folder : /client/build
    ```
3. Create the `.env` for the docker-compose (in *.*) and complete it:
    ```
    NODE_ENV=production
    DOMAIN_NAME=<DOMAIN_URL>

    # API
    API_PORT=5000
    API_TOKEN_SECRET=<YOUR_JSON_WEB_TOKEN>

    # MONGO
    MONGO_PORT=27017
    MONGO_USER=<USER>           // if set in the DB
    MONGO_PASSWORD=<PASSWORD>   // if set in the DB
    MONGO_DB_NAME=alphamares
    ```
4. Create the SSL certificates for **NGINX** (*fullchain.pem* and *privkey.pem*).
    Update the `./nginx/templates/nginx.conf.template` with the correct path to these certificates.
5. Build the docker-compose:
    ```
    docker-compose build
    ```
6. Run the docker-compose:
    ```
    docker-compose up -d
    ```


## Licenses
This software was developed by Alexandre JOLY for the SEIO.

This software is under *Creative Commons BY-ND*.

*This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.*

This software is protected by the *Code de la propriété intellectuelle* from the French law :

*L’Étudiant cède au Client l'intégralité des droits patrimoniaux sur l'ensemble des travaux définis précédemment en 
exclusivité et de façon définitive, dès lors que le Client a procédé au paiement de ces derniers. L’Étudiant conserve son 
droit moral sur les travaux réalisés.*

### FAQs
Some questions ?
