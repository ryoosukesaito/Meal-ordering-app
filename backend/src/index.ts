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

  type Orders {
    id: String!
    tableName: String!
    order: [Order]!
    time: String!
    checked: Boolean!
  }

  type Query {
    items: [Items]
    orders: [Orders]
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
        return new Error(
          'There was an error with items on Query: ' + JSON.stringify(error)
        )
      }
    },
    getAllergiesById: async (_: any, { id }: { id: string }) => {
      try {
        const itemSnapshot = await AdminDB.collection('items').doc(id).get()
        const itemData = itemSnapshot.data()
        return itemData
      } catch (error) {
        return new Error(
          'There was an error with getAllergiesById: ' + JSON.stringify(error)
        )
      }
    },
    orders: async () => {
      try {
        const ordersSnapshot = await AdminDB.collection('orders').get()
        return ordersSnapshot.docs.map((doc) => doc.data())
      } catch (error) {
        return new Error(
          'There was an error with orders on Query: ' + JSON.stringify(error)
        )
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
        return new Error(
          'There was an error with getHistoriesById: ' + JSON.stringify(error)
        )
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
