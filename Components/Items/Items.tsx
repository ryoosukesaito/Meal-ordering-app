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
		<div className="rounded-lg bg-white p-7">
			<Link href={'/admin/create'}>
				<button className="mb-12 cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]">
					Add
				</button>
			</Link>

			<div className="grid grid-cols-3 gap-5">
				{itemsList?.items?.map((data: ItemsType, id: number) => (
					<Item key={id} item={data} />
				))}
			</div>
		</div>
	)
}
