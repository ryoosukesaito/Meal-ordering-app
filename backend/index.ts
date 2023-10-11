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

	type Query {
		items: [Items]
		getAllergiesById(id: String!): Allergies
	}
`

const resolvers = {
	Query: {
		items: async () => {
			const itemsSnapshot = await AdminDB.collection('items').get()
			return itemsSnapshot.docs.map((doc) => doc.data())
		},
		getAllergiesById: async (_, { id }) => {
			const itemSnapshot = await AdminDB.collection('items').doc(id).get()
			const itemData = itemSnapshot.data()
			return itemData
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

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}/graphql`)
})
