# zz-tour

## Installation

```bash
$ npm install
```

## DB 생성 script

[sql 파일] ()

## .dev.env

```
NODE_PORT=5000
DATABASE_NAME=zz_tour
DATABASE_HOST=127.0.0.1
DATABASE_USERNAME=root
DATABASE_PASSWORD=0000
TYPEORM_ENTITIES = ./src/model/entities/*.ts

ACCESS_TOKEN_SECRET=wowow
ACCESS_TOKEN_EXP=1000000

REDIS_HOST=redis://127.0.0.1:6379

SWAGGER_HOST=127.0.0.1:5000
```

## Running the app

```bash
# development(nodemon)
$ npm run start
```


## ERD

<img src="https://i.imgur.com/HQ5PKlR.png" alt="logo" width="90%" />

