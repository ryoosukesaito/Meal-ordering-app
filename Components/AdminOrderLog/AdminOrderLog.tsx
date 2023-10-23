'use client'

import { useQuery, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'

import { client } from '@/graphql/apollo-client'
import { GET_ALL_ORDERS, ORDER_ADDED } from '@/graphql/queries'

import { AdminOrderItem } from './AdminOrderItem.tsx/AdminOrderItem'

export const AdminOrderLog = () => {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS, { client })
  const { data: subscriptionData } = useSubscription(ORDER_ADDED, { client })

  const [orders, setOrders] = useState<OrderType[]>([])
  const [checkedState, setCheckedState] = useState<Map<string, boolean[]>>(
    new Map()
  )

  const getOrder = () => {
    if (data) {
      const sortedOrders = getSortTimeOfOrder(data.orders)
      setOrders(sortedOrders)
    }
  }

  const setCheckedOrderFunc = () => {
    //Set initial checkedState
    if (orders.length > 0 && checkedState.size === 0) {
      const newStateMap = new Map()
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i]
        newStateMap.set(order.id, Array(order.order.length).fill(false))
      }
      // data should be this,if items were 3. '[false, false, false]'
      setCheckedState(newStateMap)
    }
  }

  const getSortTimeOfOrder = (data: OrderType[]) => {
    const ordersData = [...data].sort((a, b) => {
      const olderOrder = new Date(a.timestamp)
      const laterOrder = new Date(b.timestamp)
      // Sorting order from older to later
      return olderOrder < laterOrder ? -1 : 1
    })
    return ordersData
  }

  const handleRemoveOrder = (index: number, id: string) => {
    // Remove order from state
    const temp = [...orders]
    temp.splice(index, 1)
    setOrders(temp)

    // Remove checkedState data from Map State
    const tempStateMap = checkedState
    tempStateMap.delete(id)
    setCheckedState(tempStateMap)
  }

  useEffect(() => {
    getOrder()
  }, [data])

  useEffect(() => {
    setCheckedOrderFunc()
  }, [orders])

  useEffect(() => {
    if (subscriptionData) {
      // When subscription run, set subscription data to State
      const newOrder: OrderType = subscriptionData.orderAdded
      setOrders((prev) => [...prev, newOrder])

      // Create new Checked State in checkedStateMap
      setCheckedState(
        checkedState.set(newOrder.id, Array(newOrder.order.length).fill(false))
      )
    }
  }, [subscriptionData])
  return (
    <div className="flex h-screen w-full items-center justify-center px-3 pb-5 pt-16 md:px-14">
      <div className="h-full w-full rounded-xl bg-white">
        <div className="flex h-full flex-col md:p-10">
          <section id="title" className="text-4xl font-bold">
            <p>Order</p>
          </section>

          <section
            id="order"
            className="flex flex-row flex-wrap justify-center overflow-y-scroll md:justify-start"
          >
            {orders?.map((order, idx) => (
              <div key={idx}>
                <AdminOrderItem
                  idx={idx}
                  order={order}
                  checkedState={checkedState}
                  setCheckedState={setCheckedState}
                  handleRemoveOrder={handleRemoveOrder}
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
