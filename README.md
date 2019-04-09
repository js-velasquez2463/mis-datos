# mis-datos

![Node Version] v10.15.1

This project holds the code for Mis Datos Backend.

## Installation
Fork this repository and then clone it to your local machine. To run locally you need a local MYSQL DB.

### Install dependencies
```
npm install
```
### Run migrations
```
node_modules/.bin/sequelize db:migrate --url 'mysql://<dbUser>:<dbPassword>@<dbUrl>:<dbPort>/mis-datos'
```
### Local
Run the project in development environment:
<br>
```
npm run local
```

### Staging
Run the project in staging environment:
<br>
```
npm run staging
```

### Production
Run the project in production environment:
<br>
```
npm run production
```

### Testing
Run the project test cases:
<br>
Documentation https://mochajs.org/
```
npm run test
```
