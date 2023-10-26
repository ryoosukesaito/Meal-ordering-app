'use client'

import { useQuery, useSubscription } from '@apollo/client'
import { useEffect } from 'react'

import { client } from '@/graphql/apollo-client'
import { GET_ALL_ITEMS, MENU_UPDATED } from '@/graphql/queries'
import { useItemsStore } from '@/store/ItemsStore'

import { AdminItem } from './AdminItem/AdminItem'

export function AdminItemsList() {
  const { loading, error, data } = useQuery(GET_ALL_ITEMS, {
    client
  })
  const { data: subscriptionData } = useSubscription(MENU_UPDATED, { client })

  const [itemsList, setItemsList, setTitle, setPrice, setAllergies] =
    useItemsStore((state) => [
      state.itemsList,
      state.setItemsList,
      state.setTitle,
      state.setPrice,
      state.setAllergies
    ])

  const getItem = () => {
    setItemsList(data)
  }

  const moveToCreatePage = () => {
    setTitle('')
    setPrice('')
    setAllergies([])
    window.location.replace('/admin/create')
  }

  useEffect(() => {
    getItem()
  }, [data, subscriptionData])

  if (loading)
    return (
      <div className="no-scrollbar h-full w-full overflow-y-scroll px-20 pt-20 ">
        <p className="text-2xl font-bold text-gray-400">Loading...</p>
      </div>
    )
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="no-scrollbar h-full w-full overflow-y-scroll px-20 pt-20 ">
      <button
        disabled={itemsList.items.length === 0}
        onClick={moveToCreatePage}
        className="mb-3 cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        Add
      </button>

      {itemsList.items.length !== 0 ? (
        <div className="rounded-xl bg-white px-16 py-10 shadow-lg">
          <div className="xl:grid-cols-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {itemsList?.items?.map((data: ItemsType, id: number) => (
              <AdminItem key={id} item={data} />
            ))}
          </div>
        </div>
      ) : (
        <div className="m-1 flex h-[350px] w-full items-center justify-center rounded-2xl py-5">
          <div className="text-bold  text-2xl text-gray-600">No data...</div>
        </div>
      )}
    </div>
  )
}
