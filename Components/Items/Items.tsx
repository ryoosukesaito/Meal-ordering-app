'use client'

import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { useEffect } from 'react'

import { client } from '@/graphql/apollo-client'
import { GET_ALL_ITEMS } from '@/graphql/queries'
import { useItemsStore } from '@/store/ItemsStore'

import { Item } from './Item/Item'
export function Items() {
	const { loading, error, data } = useQuery(GET_ALL_ITEMS, {
		client
	})
	const [itemsList, setItemsList] = useItemsStore((state) => [
		state.itemsList,
		state.setItemsList
	])

	const getItem = () => {
		setItemsList(data)
	}

	useEffect(() => {
		getItem()
	}, [data])

	if (loading) <p>Loading...</p>
	if (error) <p>Error: {error.message}</p>

	return (
		<div className="no-scrollbar h-full w-full overflow-y-scroll px-20 pt-20 ">
			<Link href={'/admin/create'} className="h-fit ">
				<button
					disabled={itemsList.items.length === 0}
					className="mb-3 cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
				>
					Add
				</button>
			</Link>

			{itemsList.items.length !== 0 ? (
				<div className="rounded-xl bg-white px-16 py-10 shadow-lg">
					<div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
						{itemsList?.items?.map((data: ItemsType, id: number) => (
							<Item key={id} item={data} />
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
