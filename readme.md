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


## Domain model:

![image](https://user-images.githubusercontent.com/11751407/232848716-df9245cb-4b86-4fb1-aed7-be65ef155945.png)

## Database model

![image](https://user-images.githubusercontent.com/11751407/232850532-1b5ecf2c-7f51-4bc8-9ef7-7bea843530c0.png)
