# How to create a simple Hello World app with GraphQL Editor and Stucco.js in 2023

## Benefits of using GraphQL and stucco-js

GraphQL is a query language for APIs that allows users to request the exact data they need in a flexible and efficient way. Stucco.js is a GraphQL backend runtime that makes it easy to develop and deploy GraphQL APIs.

## Requirements

- Account on [GraphQL Editor website](https://app.graphqleditor.com/)
- node.js [Node.js](https://nodejs.org/en/download)
- graphql-editor-cli as global library [gecli](https://github.com/graphql-editor/graphql-editor-cli)

## First things first

Enter on website graphqleditor and create your first project by clicking on the middle page "Create", name your Workspace as you like, for now you can skip adding members, but remember, colaborating is fun.

Next step is creating our project, so click `new project` and name it `Hello-world-app`, after this step paste to your code area this simple schema

```graphql
type Query {
  helloworld: String!
}

schema {
  query: Query
}
```

:warning: The schema defines the types of data that your GraphQL API can return. It is important to define the schema before you start developing your resolvers!

The gecli command generates resolvers for the types defined in your schema. This saves you time from having to write the resolvers yourself.

```
gecli create backend
gecli codegen resolve
```

The code in the src/Query/Helloworld.ts file defines the resolver for the Hellloworld query. The resolver is a function that returns the data requested by the query.

```ts
import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'Helloworld', async (args) => {})(input.arguments);
```

We can generate now our return code, add in brackets this snippet

```ts
return 'Hello World!';
```

To start the server, run the following command in your terminal:

```sh
npm run start
```

Open again browser and type `localhost:8080/graphql`, as you see, you created your first backend application !

To test the resolver, enter the following query into the left-hand side panel:

```graphql
{
  Helloworld
}
```

and click run icon, Yay we got our message !

## Conclusions

In this blog article, you learned how to create a simple Hello World app with GraphQL Editor and Stucco.js. You also learned how to generate resolvers using the gecli command and how to test the resolvers using the GraphQL Editor website.

## Sources

If you wanna extend your first project check our projec
:octocat: [Github Project](https://github.com/TakSeBiegam/Hello-world-stucco-app/)  
:chart_with_upwards_trend: [GraphQL Editor Project](https://app.graphqleditor.com/this-is-my-first-app/hello-world-app)
