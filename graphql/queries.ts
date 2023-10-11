import { gql } from '@apollo/client'

export const GET_ALL_ITEMS = gql`
	query {
		items {
			id
			title
			price
			allergies
			image
		}
	}
`

export const GET_ALL_ITEMS_USER = gql`
	query {
		items {
			id
			title
			price
			image
		}
	}
`
export const GET_ALLERGIES_BY_ID_USER = gql`
	query GetAllergiesById($id: String!) {
		getAllergiesById(id: $id) {
			allergies
		}
	}
`

export const UPDATE_ITEM = gql`
	mutation UpdateItem(
		$id: String!
		$title: String!
		$price: String!
		$allergies: [String!]!
		$image: String!
	) {
		updateItem(
			id: $id
			title: $title
			price: $price
			allergies: $allergies
			image: $image
		) {
			id
			title
			price
			allergies
			image
		}
	}
`

export const ADD_NEW_ITEM = gql`
	mutation AddNewItem(
		$id: String!
		$title: String!
		$price: String!
		$allergies: [String!]!
		$image: String!
	) {
		addNewItem(
			id: $id
			title: $title
			price: $price
			allergies: $allergies
			image: $image
		) {
			id
			title
			price
			allergies
			image
		}
	}
`

export const DELETE_ITEM = gql`
	mutation DeleteItem($id: String!) {
		deleteItem(id: $id) {
			id
		}
	}
`
