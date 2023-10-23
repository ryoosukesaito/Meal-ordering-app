interface ItemsType {
  id: string
  title: string
  price: string
  allergies: string[]
  image: string
}

interface CartItem {
  id: string
  title: string
  price: string
  image: string
  count: number
}

interface OrderType {
  id: string
  tableName: string
  order: CartItem[]
  time: string
  checked: boolean
  timestamp: string
}
