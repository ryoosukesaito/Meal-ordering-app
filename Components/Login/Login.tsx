'use client'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/firebase'
import { useAuthStore } from '@/store/AuthStore'

export function Login() {
	const [people, setPeople] = useState<number>(1)
	const [tableName, setTableName] = useState<string>(TABLE_DATA[0].name)

	const [customer, setCustomer] = useAuthStore((state) => [
		state.customer,
		state.setCustomer
	])

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const id = uuidv4()
			await setDoc(doc(db, 'customer', id), {
				id: id!,
				people: people!,
				tableName: tableName!,
				order: []
			})

			const customerSnapshot = await getDoc(doc(db, 'customer', id))
			const customerData = customerSnapshot.data()
			if (customerData) setCustomer(customerData.id, customerData.tableName)
			window.location.replace('/user')
		} catch (error) {
			console.error('There is something wrong in user Login >> ', error)
		}
	}

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="absolute z-0 h-screen w-full">
				<Image
					src={'/assets/bg-image.jpg'}
					className="h-screen w-full bg-white opacity-70"
					alt="bg-image"
					width={500}
					height={500}
				/>
			</div>
			<div className="z-20 min-w-fit p-10">
				{/* Admin login link */}
				<Link
					href={'/admin/login'}
					className="absolute right-5 top-3 rounded-xl bg-gray-400 bg-opacity-70 p-2 text-white underline underline-offset-2"
				>
					<p>Admin Login</p>
				</Link>

				<div className="mb-12 flex items-center justify-center text-4xl font-semibold">
					<h1 className="text-white">Order Meal</h1>
				</div>
				<form
					onSubmit={handleLogin}
					id="login"
					className="flex flex-col justify-center rounded-xl bg-white p-10 shadow-md"
				>
					<div className="mb-4 flex items-center justify-center text-2xl">
						<h1>{"Let's Take Order"}</h1>
					</div>

					<div className="flex flex-col px-8 py-5">
						<div className="mb-7 inline-flex w-full items-center">
							<p className="font-georama w-1/3 text-lg">How many: </p>
							<input
								className="ml-5 w-1/4 border-b px-5 py-3 text-lg focus:outline-none"
								type="number"
								value={people}
								onChange={(e) => {
									const inputValue = Number(e.target.value)
									if (inputValue >= 0) {
										setPeople(inputValue)
									}
								}}
								required
							/>
						</div>

						<div className="mb-7 inline-flex w-full items-center">
							<p className="font-georama w-1/3 text-lg">Table: </p>
							<select
								className="ml-3 border-b px-3 py-3 text-lg focus:outline-none"
								name="tableName"
								id="tableName"
								value={tableName}
								onChange={(e) => setTableName(e.target.value)}
							>
								{TABLE_DATA.map((data, index) => (
									<option value={data.name} key={index}>
										{data.name}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="relative rounded-full text-center">
						<button
							className="group absolute right-[50%] h-20 w-20 translate-x-1/2 transform cursor-pointer rounded-full border-4 border-white bg-[#FF7474] p-3 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] "
							type="submit"
						>
							<Image
								src={'/assets/fork-knife-icon.png'}
								alt="icon"
								width={100}
								height={100}
								className="h-full w-full group-hover:hidden"
							/>
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
const TABLE_DATA = [
	{ name: 'A1' },
	{ name: 'A2' },
	{ name: 'B1' },
	{ name: 'B2' },
	{ name: 'C1' },
	{ name: 'C2' }
]

// admin@admin.com - email
// admin123456789 - password
