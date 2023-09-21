require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server-express");
const { doc, getDoc, setDoc, updateDoc } = require("firebase/firestore");
const express = require("express");

import { v4 as uuidv4 } from "uuid";
const app = express();

import { AdminDB, db } from "./firebaseBackend";

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
  }
`;

const resolvers = {
  Query: {
    items: async () => {
      const itemsSnapshot = await AdminDB.collection("items").get();
      return itemsSnapshot.docs.map((doc: any) => doc.data());
    },
  },
  Mutation: {
    updateItem: async (_: any, args: any) => {
      try {
        console.log("this is args>>", args);
        const { id, title, price, allergies, image } = args;
        await updateDoc(doc(db, "items", id), {
          title: title,
          price: price,
          allergies: allergies,
          image: image,
        });

        const updatedItemSnapshot = await getDoc(doc(db, "items", id));
        const updatedItem = updatedItemSnapshot.data();

        return updatedItem;
      } catch (error: Error | any) {
        throw new Error(`Failed to update item: ${error.message}`);
      }
    },
    addNewItem: async (_: any, args: any) => {
      const { id, title, price, allergies, image } = args;

      try {
        await setDoc(doc(db, "items", id), {
          id: id,
          title: title,
          price: price,
          allergies: allergies,
          image: image,
        });

        const newSetItemSnapshot = await getDoc(doc(db, "items", id));
        const newItem = newSetItemSnapshot.data();
        return newItem;
      } catch (error) {
        throw new Error(`Failed to set new item: ${error.message}`);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startApolloServer();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
