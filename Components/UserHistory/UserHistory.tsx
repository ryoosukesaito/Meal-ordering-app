'use client'
import { useQuery } from '@apollo/client'
import { UsersIcon } from '@heroicons/react/20/solid'
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
        <div className="my-5 grid h-[90%] w-full grid-flow-row grid-cols-1 rounded-xl bg-white py-2 md:grid-rows-3 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1">
          {/* Ordered Items */}
          <div className="row-span-2 overflow-y-scroll px-3 lg:col-span-2">
            {orders?.map((order, idx) => (
              <div
                key={idx}
                className="my-5 flex flex-row space-y-2 rounded-2xl shadow-lg sm:space-y-3"
              >
                <div className="h-24 w-24 overflow-hidden rounded-l-2xl sm:h-32 sm:w-32">
                  <CldImage
                    height={600}
                    width={600}
                    alt="image"
                    src={order.image}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="inline-flex w-2/3 flex-col space-x-4 pl-3 text-sm sm:text-base">
                  <p>{order.title}</p>
                  <p>${order.price}</p>
                  <p>Count: {order.count}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Price Calculator */}

          <div className="grid grid-flow-row grid-cols-2 grid-rows-1 gap-3 pt-3 md:row-span-1 md:mx-8 lg:flex lg:flex-col lg:justify-end">
            <div className="inline-flex w-full flex-col rounded-2xl bg-slate-500/5 py-5 text-sm md:px-5 md:text-xl">
              <div className="grid grid-flow-row grid-cols-2 items-center">
                <p>People:</p>
                <p>{data?.getHistoriesById?.people}</p>
              </div>
              <div className="grid grid-flow-row grid-cols-2 items-center">
                <p>Items:</p>
                <p>{quantity} </p>
              </div>
              <div className="grid grid-flow-row grid-cols-2 items-center">
                <p>Subtotal:</p>
                <p className="font-bold">$ {price}</p>
              </div>
            </div>

            {/* Total Price */}
            <div className="inline-flex w-full flex-col border-black/50 pt-3 md:text-xl lg:border-t">
              <div className="grid grid-flow-row grid-cols-3 gap-3 sm:grid-cols-2">
                <p className="inline-flex items-center ">Total:</p>
                <p className="col-span-2 font-bold sm:col-span-1">${price}</p>
              </div>

              {/* Each price */}
              <div>
                {splitBillPerPerson !== null ? (
                  <div className="inline-flex w-full flex-col space-x-9 sm:inline-grid sm:grid-cols-2 sm:gap-3 sm:space-x-0 ">
                    <p>Each:</p>
                    <div className="flex flex-col">
                      {splitBillPerPerson.map((data, idx) => (
                        <div key={idx}>
                          <p className="inline-flex items-center text-sm md:text-base ">
                            $ {data.bill} x {data.ppl}
                            <UsersIcon className=" h-4 w-4 text-slate-500" />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-flow-row grid-cols-3 gap-3 sm:grid-cols-2">
                    <p>Each:</p>
                    <p className="col-span-2 col-start-3 sm:col-span-1 sm:col-start-auto">
                      ${eachPrice}
                    </p>
                  </div>
                )}
              </div>
              {/* Checkout button */}
              <div className="flex w-full items-center md:justify-center">
                <button
                  className="inline-flex cursor-pointer flex-row items-center rounded bg-[#FF7474] px-4 py-1  text-sm text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] disabled:cursor-not-allowed disabled:bg-gray-200
									disabled:text-gray-400
									sm:px-8
                  sm:py-2
                  sm:text-base
									"
                  onClick={() => {
                    window.location.replace('/')
                  }}
                >
                  Check out
                  <CheckCircleIcon className="ml-3 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
