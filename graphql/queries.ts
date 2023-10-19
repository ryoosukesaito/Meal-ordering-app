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

export const SET_NEW_ORDER = gql`
  mutation SetNewOrder(
    $id: String!
    $customerId: String!
    $tableName: String!
    $order: [OrderInput]!
    $time: String!
    $checked: Boolean!
  ) {
    setNewOrder(
      id: $id
      customerId: $customerId
      tableName: $tableName
      order: $order
      time: $time
      checked: $checked
    ) {
      id
      customerId
      tableName
      order {
        id
        image
        price
        title
        count
      }
      time
      checked
    }
  }
`
export const ORDER_ADDED = gql`
  subscription OrderAdded {
    orderAdded {
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
