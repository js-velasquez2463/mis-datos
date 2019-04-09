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
<br>
A default user with email: initial.user@hotmail.com, and password: password is created in the migrations.

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
Documentation https://mochajs.org/
<br>
Run the project test cases:
```
npm run test
```
