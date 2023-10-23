'use client'

import { CldImage } from 'next-cloudinary'

import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'
type Props = {
  item: ItemsType
}

export function UserItem({ item }: Props) {
  const [setItemAsProps, setId] = useItemsStore((state) => [
    state.setItemAsProps,
    state.setId
  ])
  const openUserModal = useModalStore((state) => state.openUserModal)

  const handleModalOpen = () => {
    setItemAsProps(item)
    openUserModal()
  }

  return (
    <>
      <button onClick={handleModalOpen}>
        <div className="h-full rounded-lg shadow-lg hover:cursor-pointer ">
          <section className="h-28 rounded-t-md sm:h-52  lg:h-64">
            <CldImage
              className="h-full w-full  rounded-t-md object-cover "
              alt="item-image"
              src={item.image}
              width={800}
              height={800}
            />
          </section>
          <section className="flex h-28 flex-col justify-between py-4 lg:p-5 ">
            <div className="flex h-full  flex-col justify-between">
              <div className="md:text-md px-3 text-xs lg:text-lg">
                {item.title}
              </div>
              <div className="sm:text-md px-3 text-sm font-bold text-gray-600 lg:text-xl">
                $ {item.price}
              </div>
            </div>
          </section>
        </div>
      </button>
    </>
  )
}
