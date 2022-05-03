# request_bin_clone 

This is a tool to collect and inspect incoming HTTP requests
in order to develop and debug webhooks, or simply to consume them. Create a bin, and then tell setup the webhook to send notifications to the given URL. For example, a bin URL might be `http://localhost:3003/qz0z`. If you tell the webhook to send notifications to that URL, any such webhooks will be available to view at `http://localhost:3003/qz0z/view`.

Create a .env file with the following values
- PORT
- MONGO_URI (typically "mongodb://localhost:27017")
- DOMAIN (where you will host the app; users' bins will be assigned a specific path at this domain, where they will view them)

Before creating your first request bin, click the `initialize/reset database` button on the homepage. This will create a `request_bin` database in postgres with the proper relations, if it does not already exist.

Improvements to Make:
- Time to live for individual bin and requests
- Improve CSS for bin view