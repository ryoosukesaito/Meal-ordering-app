import { ApolloServer, gql } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { AdminDB } from './firebaseBackend'
import { PubSub } from 'graphql-subscriptions'
import cors from 'cors'
import { json } from 'body-parser'

dotenv.config()
const app = express()
// Crete server for using GraphQL subscriptions
const httpServer = createServer(app)
const pubsub = new PubSub()

interface Order {
  id: string
  title: string
  price: string
  image: string
  count: number
}
interface Orders {
  id: string
  customerId: string
  tableName: string
  order: Order[]
  time: string
  checked: boolean
  timestamp: string
}

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
    customerId: String!
    order: [Order]!
    time: String!
    checked: Boolean!
    timestamp: String!
  }

  type Query {
    items: [Items]
    orders: [Orders]
    getAllergiesById(id: String!): Allergies
    getHistoriesById(id: String!): Histories
  }

  input OrderInput {
    id: String!
    image: String!
    price: String!
    title: String!
    count: Int!
  }

  type Mutation {
    setNewOrder(
      id: String!
      customerId: String!
      tableName: String!
      order: [OrderInput]!
      time: String!
      checked: Boolean!
      timestamp: String!
    ): Orders
  }

  type Subscription {
    orderAdded: Orders!
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

        return ordersSnapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.checked === false)
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
  },
  Mutation: {
    setNewOrder: async (_: any, args: Orders) => {
      // DB manipulation
      const { id, customerId, tableName, order, time, checked, timestamp } =
        args
      await AdminDB.collection('orders').doc(id).set({
        id: id!,
        customerId: customerId!,
        tableName: tableName!,
        order: order!,
        time: time!,
        checked: checked!,
        timestamp: timestamp!
      })

      const snapshot = await AdminDB.collection('orders').doc(id).get()
      const ordersData = snapshot.data()

      // call subscription
      pubsub.publish('ORDER_ADDED', { orderAdded: ordersData })

      return ordersData
    }
  },
  Subscription: {
    orderAdded: {
      subscribe: () => pubsub.asyncIterator(['ORDER_ADDED'])
    }
  }
}

// Making Two value of schema to subscriptions together
const schema = makeExecutableSchema<PubSub>({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      // Proper shutdown for the WebSocket server.
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
  // context: ({ req, res }) => ({ req, res, pubsub })
})

//Creating the Websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subscriptions'
})

// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer)

async function startApolloServer() {
  await server.start()
  server.applyMiddleware({ app })
}
startApolloServer()

const PORT = process.env.PORT || 4000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 4001
app.use('/check', (_, res) =>
  res.json({ response: 'Health Check' }).status(200)
)

app.use(
  '/graphql',
  cors<cors.CorsRequest>({
    origin: [CLIENT_URL, 'https://studio.apollographql.com']
  }),
  json()
)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`)
})
httpServer.listen(WEBSOCKET_PORT, () => {
  console.log(
    `WebSocket server running on ws://localhost:${WEBSOCKET_PORT}/subscriptions`
  )
})
