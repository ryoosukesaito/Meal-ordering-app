import { UserHeader } from '@/Components/UserHeader.tsx/UserHeader'
import { UserItems } from '@/Components/UserItems/UserItems'

export function page() {
	return (
		<div>
			<UserHeader />
			<UserItems />
		</div>
	)
}

export default page
