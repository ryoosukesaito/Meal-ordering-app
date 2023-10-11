import { UserHeader } from '@/app/Components/UserHeader.tsx/UserHeader'
import { UserItems } from '@/app/Components/UserItems/UserItems'

export function page() {
	return (
		<div>
			<UserHeader />
			<UserItems />
		</div>
	)
}

export default page
