# Note Taking App

### Frontend

Used React (+ Vite to create app) to make the frontend.

It is extremely simple, you can create, edit and delete notes. Search for relevant notes and also add tags.


### Backend

Express.js + MongoDB

Has user authentication functionality (using jwt) and ability to auto save notes, search through all parts of note, sync (kind of) between instances.


### Deployment

Originally my goal was to build docker container and deploy it, also deploying mongodb (i already have a server running docker containers), but didn't have time to fix github actions & docker issues.

So now deployed on render.com & using mongodb atlas for DB.

Deployed url: [here](https://notes-app-n2bb.onrender.com/)
