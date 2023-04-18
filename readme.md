# User Management Demo

App based on React with a Symfony 6 backend.

### Install dependencies:
`npm i`

`composer install`


### Apply migrations:

`bin/console doctrine:migrations:migrate`

## For development you'd need two terminal tabs:
### API
`symfony serve`

### Frontend dev server
`npm run dev-server`


### After registering, you can assign a user Admin permissions via:
` bin/console user:add-role --email=test@test.com --role=ROLE_ADMIN`
