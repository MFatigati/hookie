# request_bin_clone

Create a postgres database called `request_bin`

Create a .env file with the following values
- PORT
- MONGO_URI (typically "mongodb://localhost:27017")
- DOMAIN (where you will host the app; users' bins will be assigned a specific path at this domain, where they will view them)