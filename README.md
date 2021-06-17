# ptit-friends

1. Setup env
  Create .env file in root folder (folder contain "package.json")
  Copy + paste below content to .env file:
  
  PGHOST = localhost
  PGUSER = <postgresql_account>
  PGPASSWORD = <postgresql_password>
  PGDATABASE = <db_name>
  PGPORT = 5432
  PORT = 3000
  SALT_LENGTH = 12
  SESSION_SECRET = jrVdb=9gn"y-A'[A'x/=
  HOBBY_WEIGHT = 1.0
  MAJOR_WEIGHT = 1.0
  AGE_WEIGHT = 0.5
  
 2. Install dependency
  In "package.json"
    + With "dependencies": "npm i <depen_name>@<depen_ver>"
    + With "devDependencies": "npm i <depen_name>@<depen_ver> --save-dev"
    Open terminal -> cd to project folder
    -> Type in install command above
    -> replace "depen_name" and "depen_ver" with dependency's info in package.json
    -> remove "<",">" before press "enter"
