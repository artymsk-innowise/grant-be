## Description

Backend for Grants Dashboard

## Installation

```bash
$ npm install
```

## Application start up steps

```bash
# 1) Build an app
$ npm run build

# 2) Create docker image. 
# This command will create a postgres, api and adminer images
$ docker-compose up
```

## Application service scripts

To restart an app by npm scripts,
stop a docker api image, and run the following script
```bash
$ npm run start
```

Run tests
```bash
$ npm run test
```

Add data to DB.
This script runs sequelize seeds
```bash
$ npm run seed
```

To refresh DB with new seeds:
1) set env variable ```FORCE_SYNC_SEQUELIZE``` to ```true```
2) restart an app 
3) run seeds by running: 
```bash
$ npm run seed
```

## API access
Application is available on localhost:3000/graphql

## GraphQL request examples
1) getAllGrants
```
query {
  getAllGrants(input: {after: "Mw=="}) {
    edges {
      cursor
      node {
        id
        foundationName
        grantName
        averageAmount
        deadline
        location
        area
        isActive
      }
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

2) createUserGrant
```
mutation{
  createUserGrant(input: {feedback: "test", grantId: 2, userId: 1, isApproved: true}){
    status,
    averageAmount,
    deadline,
    grantName,
    foundationName,
    matchDate
  }
}
```

3) getUserGrants
```
query{
  getUserGrants(input: {userId: 1, first: 1, after: "Mg=="}){
    edges {
      cursor
      node {
        id
        foundationName
        grantName
        averageAmount
        deadline
        status
      }
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

We have an encoding of ids to base64 format. 
It's done for better convenience of requests which have pointer (cursor). 