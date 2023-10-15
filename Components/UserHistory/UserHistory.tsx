'use client'
import { useQuery } from '@apollo/client'
import {
  ArrowUturnLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { CldImage } from 'next-cloudinary'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { client } from '@/graphql/apollo-client'
import { GET_HISTORIES_BY_ID_USER } from '@/graphql/queries'
import { useAuthStore } from '@/store/AuthStore'

interface SplitBillData {
  bill: number
  ppl: number
}

export const UserHistory = () => {
  const [customer] = useAuthStore((state) => [state.customer])
  const [orders, setOrders] = useState<CartItem[]>([])
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(0)
  const [eachPrice, setEachPrice] = useState<number>(0)
  const [splitBillPerPerson, setSplitBillPerPerson] = useState<
    SplitBillData[] | null
  >(null)

  const { data, loading, error } = useQuery(GET_HISTORIES_BY_ID_USER, {
    client,
    variables: { id: customer.id }
  })

  const getHistories = useCallback(() => {
    if (data) setOrders(data.getHistoriesById.order)
  }, [data])

  const calculateTotalFunc = useMemo(() => {
    if (orders) {
      const total = orders.reduce(
        (sum, item) => {
          sum[0] += Number(item.price) * item.count
          sum[1] += item.count
          return sum
        },
        [0, 0]
      )
      if (data) {
        const totalAmount = Number(total[0].toFixed(2))
        const people = data.getHistoriesById.people
        const amountPerPerson = Math.round((totalAmount / people) * 100) / 100

        // if amount per person is less than total amount
        if (totalAmount > amountPerPerson * people) {
          const splitBillPerPerson: number[] =
            Array(people).fill(amountPerPerson)
          const tempTotal: number =
            Math.round(amountPerPerson * people * 100) / 100
          const diff: number = Math.round((totalAmount - tempTotal) * 100)

          for (let i = 0; i < diff; i++) {
            splitBillPerPerson[i] = splitBillPerPerson[i] + 0.01
          }

          const billResultMap: Map<number, number> = splitBillPerPerson.reduce(
            (map: Map<number, number>, bill: number) =>
              map.set(bill, (map.get(bill) || 0) + 1),
            new Map()
          )

          const billFormattedFromMap = []
          for (const [bill, ppl] of billResultMap) {
            const temp = {
              bill: bill,
              ppl: ppl
            }
            billFormattedFromMap.push(temp)
          }
          setSplitBillPerPerson(billFormattedFromMap)
        } else {
          setEachPrice(amountPerPerson)
        }
      }

      setPrice(Number(total[0].toFixed(2)))
      setQuantity(total[1])
    }
  }, [orders, data])

  useEffect(() => {
    getHistories()
  }, [data])

  return (
    <>
      <div className="h-screen w-full p-5">
        <button
          onClick={() => window.location.replace('/user')}
          className="inline-flex w-fit rounded-xl bg-gray-200 px-4 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-700"
        >
          <ArrowUturnLeftIcon className="h-6 w-6" />
          Back
        </button>
        <div className="my-5 inline-grid h-[90%] w-full grid-cols-3 rounded-xl bg-white py-2">
          {/* Ordered Items */}
          <div className="col-span-2 overflow-y-scroll px-3">
            {orders?.map((order, idx) => (
              <div
                key={idx}
                className="my-5 flex flex-row space-y-3 rounded-2xl shadow-lg"
              >
                <div className="h-32 w-32 overflow-hidden rounded-l-2xl">
                  <CldImage
                    height={100}
                    width={100}
                    alt="image"
                    src={order.image}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="inline-flex flex-col space-x-4 pl-3">
                  <p>{order.title}</p>
                  <p>${order.price}</p>
                  <p>Count: {order.count}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Price Calculator */}
          <div className="flex flex-col justify-end border-l-2">
            <div>
              <p>People: {data?.getHistoriesById?.people}</p>
              {splitBillPerPerson !== null ? (
                <>
                  {splitBillPerPerson.map((data, idx) => (
                    <div key={idx} className="inline-flex">
                      <p className="px-2">
                        $ {data.bill} : {data.ppl} (ppl)
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <p>Each: {eachPrice}</p>
              )}

              <p>Total: {price}</p>
              <p>Quantity: {quantity}</p>
            </div>
            <div className="flex w-full items-center justify-center">
              <button
                className="inline-flex cursor-pointer flex-row rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]
									disabled:cursor-not-allowed
									disabled:bg-gray-200
									disabled:text-gray-400
									"
                onClick={() => {
                  window.location.replace('/')
                }}
              >
                Check out
                <CheckCircleIcon className="ml-3 h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
