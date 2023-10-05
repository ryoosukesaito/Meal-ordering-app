import { ApolloServer, gql } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import { doc, deleteDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

import { AdminDB, db } from './firebaseBackend'

import 'dotenv/config'
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

	type Query {
		items: [Items]
	}

	type Mutation {
		updateItem(
			id: String!
			title: String!
			price: String!
			allergies: [String!]!
			image: String!
		): Items

		addNewItem(
			id: String!
			title: String!
			price: String!
			allergies: [String!]!
			image: String!
		): Items

		deleteItem(id: String!): Items
	}
`

const resolvers = {
	Query: {
		items: async () => {
			const itemsSnapshot = await AdminDB.collection('items').get()
			return itemsSnapshot.docs.map((doc) => doc.data())
		}
	},
	Mutation: {
		updateItem: async (_, args) => {
			try {
				const { id, title, price, allergies, image } = args
				await updateDoc(doc(db, 'items', id), {
					title: title,
					price: price,
					allergies: allergies,
					image: image
				})

				const updatedItemSnapshot = await getDoc(doc(db, 'items', id))
				const updatedItem = updatedItemSnapshot.data()

				return updatedItem
			} catch (error: Error | any) {
				throw new Error(`Failed to update item: ${error.message}`)
			}
		},
		addNewItem: async (_, args) => {
			const { id, title, price, allergies, image } = args
			try {
				await setDoc(doc(db, 'items', id), {
					id: id,
					title: title,
					price: price,
					allergies: allergies,
					image: image
				})

				const newSetItemSnapshot = await getDoc(doc(db, 'items', id))
				const newItem = newSetItemSnapshot.data()
				return newItem
			} catch (error) {
				throw new Error(`Failed to set new item: ${error.message}`)
			}
		},

		deleteItem: async (_, args) => {
			const { id } = args

			try {
				const deleteItemSnapshot = await getDoc(doc(db, 'items', id))
				const deletedItem = deleteItemSnapshot.data()
				const response = await deleteDoc(doc(db, 'items', id))

				return deletedItem
			} catch (error) {
				throw new Error(`Failed to set new item: ${error.message}`)
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

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}/graphql`)
})
