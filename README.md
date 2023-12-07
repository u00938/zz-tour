# zz-tour

## Installation

```bash
$ npm install
```

## DB 생성 script

[sql 파일](https://github.com/u00938/zz-tour/blob/main/zz_tour.sql)

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

## API

문서화하려고 했지만 시간 부족 이슈

만들어진 API 목록은 [여기서](https://github.com/u00938/zz-tour/blob/main/test.http) 보실 수 있습니다.

추후 업데이트

