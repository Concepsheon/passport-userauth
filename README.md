# user-authentication

This API uses JSON Web Tokens and the Passport module for authentication

#### Clone project
```
clone https://github.com/Concepsheon/passport-userauth.git
```
Before running servers run command ```npm install``` to install all dependencies and run ```mongo``` in background


#### Authorization with JSON Web Token
```
node jwtauth-server
```
Create a new user name and password to access protected routes. 
May have to use Postman or another REST client to use POST to create new user and set token


#### Authorization with passport and JWT
```
node passport-auth
```
User authoriaztion with Passport using a JWT instead of server sessions to store user information

#### OAuth with Github
```
node index
```
Runs a simple API that allows a user to sign in with their Github account
