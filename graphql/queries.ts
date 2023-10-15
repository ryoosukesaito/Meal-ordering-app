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

export const GET_HISTORIES_BY_ID_USER = gql`
  query GetHistoriesById($id: String!) {
    getHistoriesById(id: $id) {
      order {
        id
        image
        price
        title
        count
      }
      people
    }
  }
`

export const GET_ALL_ORDERS = gql`
  query {
    orders {
      id
      tableName
      order {
        id
        title
        count
      }
      time
      checked
    }
  }
`
