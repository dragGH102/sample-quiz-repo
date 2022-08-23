How to: (first installation)
- cd server
- *install global dependencies: npm i -g prisma nodemon
- *cp .env-example .env # also change the db url with the correct user/pwd
- *install depedencies: yarn
- run the db: npm run run-local-db
- *init the db: npm run db:init
- run the server node index.js

On subsequent run just run the server and client as usual - without needing to install depdencies/db/etc.*

Stop Docker: npm run stop-local-db

Migration (Whenever you update your schema you must run this command): prisma migrate dev --name X