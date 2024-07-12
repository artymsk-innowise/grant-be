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
$ docker compose:up

# to restart app by npm scripts,
# stop the api image, and run the following script
$ npm run start

# run tests
$ npm run test

# sequelize seeds
# to run seeds, first set env variable FORCE_SYNC_SEQUELIZE to false
# and then run the script
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