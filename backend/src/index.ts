import { ApolloServer, gql } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'

import { AdminDB } from './firebaseBackend'

dotenv.config()
const app = express()

const typeDefs = gql`
  type Items {
    id: String
    title: String!
    price: String!
    allergies: [String]!
    image: String!
  }
  type Allergies {
    allergies: [String]
  }

  type Order {
    id: String!
    image: String!
    price: String!
    title: String!
    count: Int!
  }

  type Histories {
    order: [Order]
    people: Int!
  }

  type Query {
    items: [Items]
    getAllergiesById(id: String!): Allergies
    getHistoriesById(id: String!): Histories
  }
`

const resolvers = {
  Query: {
    items: async () => {
      try {
        const itemsSnapshot = await AdminDB.collection('items').get()
        return itemsSnapshot.docs.map((doc) => doc.data())
      } catch (error) {
        return new Error()
      }
    },
    getAllergiesById: async (_: any, { id }: { id: string }) => {
      try {
        const itemSnapshot = await AdminDB.collection('items').doc(id).get()
        const itemData = itemSnapshot.data()
        return itemData
      } catch (error) {
        return new Error()
      }
    },
    getHistoriesById: async (_: any, { id }: { id: string }) => {
      try {
        const historiesSnapshot = await AdminDB.collection('customer')
          .doc(id)
          .get()
        if (historiesSnapshot) {
          const historiesData = historiesSnapshot.data()
          return historiesData
        }
      } catch (error) {
        return new Error()
      }
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
async function startApolloServer() {
  await server.start()
  server.applyMiddleware({ app })
}
startApolloServer()

const PORT = process.env.PORT || 4000

app.use('/check', (_, res) =>
  res.json({ response: 'Health Check' }).status(200)
)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`)
})
