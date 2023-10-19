'use client'

import { useQuery, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'

import { client } from '@/graphql/apollo-client'
import { GET_ALL_ORDERS, ORDER_ADDED } from '@/graphql/queries'

interface OrderType {
  id: string
  tableName: string
  order: CartItem[]
  time: string
  checked: boolean
}

export const AdminOrderLog = () => {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS, { client })
  const { data: subscriptionData } = useSubscription(ORDER_ADDED, { client })

  const [orders, setOrders] = useState<OrderType[]>([])
  const getOrder = () => {
    if (data) {
      setOrders(data.orders)
    }
  }

  useEffect(() => {
    getOrder()
  }, [data])

  useEffect(() => {
    if (subscriptionData) {
      const newOrder: OrderType = subscriptionData.orderAdded
      setOrders((prev) => [...prev, newOrder])
    }
  }, [subscriptionData])
  return (
    <div className="flex h-screen w-full items-center justify-center px-14 pb-5 pt-16">
      <div className="h-full w-full rounded-xl bg-white">
        <div className="flex flex-col p-10">
          <section id="title" className="text-4xl font-bold">
            <p>Order</p>
          </section>

          <section id="order" className="flex flex-row flex-wrap">
            {orders?.map((order, idx) => (
              <div
                key={idx}
                className="m-3 inline-flex w-fit flex-col  rounded-xl shadow-xl "
              >
                <div className="rounded-t-xl border-b border-gray-500/50 bg-gray-200 px-5 py-2">
                  <p>Table: {order.tableName}</p>
                  <p>Time: {order.time}</p>
                </div>
                <div className="flex flex-col px-5 py-2">
                  {order.order.map((item, id) => (
                    <div
                      key={id}
                      className="inline-flex items-center justify-between "
                    >
                      <input type="checkbox" />
                      <p>{item.title}</p>
                      <p>{item.count}</p>
                    </div>
                  ))}

                  <button
                    className="mb-12 cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]"
                    value="Serve"
                    onClick={() => window.location.reload()}
                  >
                    serve
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
