__This is a work-in-progress!__
**Security is not implemented for the API**

What this project can currently do
- Stores tesla auth token in mongodb, Tesla password never stored in DB
- Polling service will poll Tesla API and insert vehicle data when car is charging or driving
- Hardcoded stuff: 15 minutes session gap, if you stop charging for 15 minutes, new charge session is created, etc
- Set up: it's really manual right now, but basically: Start a mongodb docker instance, put the connection string in config/.env (see config/sample.env for example)
Then start the server, create a user using the REST API, then you can start polling. Take a look at the routes, the user route is simple, I prefer to finish the UI to allow creation of accounts, etc
