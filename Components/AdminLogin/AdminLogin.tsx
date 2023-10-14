'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'

import { auth } from '@/firebase'

export function AdminLogin() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const admin = userCredential.user
				window.location.replace('/admin/dashboard')
			})
			.catch((err) => {
				if (err)
					console.log('There is something wrong with Email or Password.', err)
			})
	}

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="min-w-fit p-10">
				<div className="mb-24 flex items-center justify-center text-4xl font-semibold">
					<h1>Order Meal Services</h1>
				</div>
				<form
					onSubmit={handleLogin}
					id="login"
					className="rounded-xl bg-white p-10 shadow-md"
				>
					<div className="mb-12 flex items-center justify-center text-2xl">
						<h1>Admin</h1>
					</div>

					<div className=" p-5">
						<input
							className="mb-7 w-full rounded-xl border px-3 py-3"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

						<input
							className="mb-7 w-full rounded-xl border px-3 py-3"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="text-center">
						<button
							className="mb-12 cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]"
							type="submit"
						>
							Login
						</button>
					</div>
					{/* <div className="text-center underline  hover:opacity-50">
						<a href="/">Forget the password?</a>
					</div> */}
					<div className="text-center underline  hover:opacity-50">
						<a href="/">Ready to order for customer??</a>
					</div>
				</form>
			</div>
		</div>
	)
}

// admin@admin.com - email
// admin123456789 - password
