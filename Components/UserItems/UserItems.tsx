'use client'

import { useQuery } from '@apollo/client'
import { useEffect } from 'react'

import { Cart } from '@/Components/Cart/Cart'
import { client } from '@/graphql/apollo-client'
import { GET_ALL_ITEMS_USER } from '@/graphql/queries'
import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'

import { UserItem } from './UserItem/UserItem'
import Header from '../Header'

export function UserItems() {
	const { loading, error, data } = useQuery(GET_ALL_ITEMS_USER, {
		client
	})
	const [itemsList, setItemsList] = useItemsStore((state) => [
		state.itemsList,
		state.setItemsList
	])

	const [cartVisible, openCart] = useModalStore((state) => [
		state.cartVisible,
		state.openCart
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
		<>
			{cartVisible && <Cart />}
			<Header />
			<div className="no-scrollbar flex max-h-[750px] w-full overflow-y-scroll">
				<button
					className="fixed top-8 rounded-full bg-blue-500 px-4 py-2 text-white"
					onClick={openCart}
				>
					Open Cart
				</button>

				<div className="flex-1 bg-white px-28 py-10">
					<div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
						{itemsList?.items?.map((data: ItemsType, id: number) => (
							<UserItem key={id} item={data} />
						))}
					</div>
				</div>
			</div>
		</>
	)
}
