'use client'

import { useMutation } from '@apollo/client'
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/firebase'
import { client } from '@/graphql/apollo-client'
import { SET_NEW_ORDER } from '@/graphql/queries'
import { useAuthStore } from '@/store/AuthStore'
import { useCartStore } from '@/store/CartStore'
import { useModalStore } from '@/store/ModalStore'

import { CartItem } from './CartItem/CartItem'
export const Cart = () => {
  const [setNewOrder, { error }] = useMutation(SET_NEW_ORDER, { client })

  const [cartItems, setCartItems, price, quantity, setPrice, setQuantity] =
    useCartStore((state) => [
      state.cartItems,
      state.setCartItems,
      state.price,
      state.quantity,
      state.setPrice,
      state.setQuantity
    ])
  const [cartVisible, closeCart] = useModalStore((state) => [
    state.cartVisible,
    state.closeCart
  ])

  const [customer] = useAuthStore((state) => [state.customer])

  const calculateTotalFunc = useMemo(() => {
    if (cartItems) {
      const total = cartItems.items.reduce(
        (sum, item) => {
          sum[0] += Number(item.price) * item.count
          sum[1] += item.count
          return sum
        },
        [0, 0]
      )
      setPrice(total[0].toFixed(2))
      setQuantity(total[1])
    }
  }, [cartItems])

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const date = new Date()
    const formattedDate = formatDate(date, 'WW, HH:MM/ampm')
    const id = uuidv4()

    try {
      console.log('client>>> ', client)
      await setNewOrder({
        variables: {
          id: id!,
          customerId: customer.id!,
          tableName: customer.tableName!,
          order: cartItems.items!,
          time: formattedDate!,
          checked: false!
        }
      })

      const snapshot = await getDoc(doc(db, 'customer', customer.id))
      const customerData = snapshot.data()
      let prevOrder: CartItem[] | undefined

      if (customerData?.order) {
        prevOrder = customerData?.order
      }

      const updateCustomerItems =
        prevOrder !== undefined
          ? [...prevOrder, ...cartItems.items]
          : [...cartItems.items]

      await updateDoc(doc(db, 'customer', customer.id), {
        order: updateCustomerItems
      })

      setCartItems([])
    } catch (error) {
      console.error('Order is invalid for the error', error)
    }
  }

  function formatDate(date: Date, format: string) {
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let hours = date.getHours()
    const ampm = hours < 12 ? 'AM' : 'PM'
    hours = hours % 12
    hours = hours !== 0 ? hours : 12

    format = format.replace('WW', weekday[date.getDay()])
    format = format.replace('HH', hours.toString())
    format = format.replace('MM', date.getMinutes().toString())
    format = format.replace('ampm', ampm)

    return format
  }

  return (
    <>
      {/* background layer */}
      <div className="fixed inset-0 z-40 w-full">
        {/* cart section */}
        <div
          className={`absolute h-full min-h-screen w-full bg-[#F1EEEE] px-2 py-5 shadow-2xl duration-500 ease-in-out sm:px-8 md:w-1/3 ${
            !cartVisible ? '-right-full' : 'right-0'
          }`}
        >
          <div className="flex h-full flex-col">
            <div>
              <button onClick={closeCart} className="my-3">
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            </div>
            {cartItems.items.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center ">
                <ClipboardDocumentIcon className="h-20 w-20 text-gray-400" />
                <p className="text-lg text-gray-400">No order yet...</p>
              </div>
            ) : (
              // {/* cart items */}
              <div className="no-scrollbar mb-1 h-full max-h-[550px]  overflow-y-scroll">
                {cartItems?.items.map((item: CartItem, idx: number) => (
                  <div key={idx}>
                    <CartItem item={item} idx={idx} />
                  </div>
                ))}
              </div>
            )}
            <div className="border-t-2 border-black">
              <div className="my-2 flex flex-row items-center justify-center">
                <p className="text-lg font-bold">Total</p>
                <p className="font-semibold">({`${quantity}`} items):</p>
                <p className="text-xl font-bold">$ {`${price}`}</p>
              </div>

              <div className="flex w-full items-center justify-center">
                <button
                  disabled={quantity === 0}
                  className="inline-flex cursor-pointer flex-row rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]
									disabled:cursor-not-allowed
									disabled:bg-gray-200
									disabled:text-gray-400
									"
                  onClick={handleSubmit}
                >
                  Order
                  <CheckCircleIcon className="ml-3 h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-30 bg-white bg-opacity-40 " />
    </>
  )
}
