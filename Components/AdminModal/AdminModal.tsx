'use client'

import { useMutation } from '@apollo/client'
import { Dialog, Transition } from '@headlessui/react'
import { deleteDoc, doc } from 'firebase/firestore'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary'
import { Fragment, useState } from 'react'

import { db } from '@/firebase'
import { client } from '@/graphql/apollo-client'
import { UPDATE_MENU_DATA } from '@/graphql/queries'
import { useItemsStore } from '@/store/ItemsStore'
import { useModalStore } from '@/store/ModalStore'

import deleteImage from '@/lib/deleteImage'

import { AllergiesInput } from './AllergiesInput/AllergiesInput'
import { ImageInput } from './ImageInput/ImageInput'
import { Input } from './Input/Input'

export function AdminModal() {
  const [
    item,
    title,
    price,
    setImage,
    file,
    setFile,
    allergies,
    setImageFileToUpload
  ] = useItemsStore((state) => [
    state.item,
    state.title,
    state.price,
    state.setImage,
    state.file,
    state.setFile,
    state.allergies,
    state.setImageFileToUpload
  ])

  const [updateMenuData, { loading, error }] = useMutation(UPDATE_MENU_DATA, {
    client
  })

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal
  ])

  const [confirmModal, setConfirmModal] = useState<boolean>(false)

  const handleClose = () => {
    closeModal()
    setImage('')
    setConfirmModal(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageURL = item.image
      if (file) {
        const URL = await setImageFileToUpload(file)
        imageURL = URL
      }

      // update the item
      await updateMenuData({
        variables: {
          id: item.id,
          title: title,
          price: price,
          allergies: allergies,
          image: imageURL
        }
      })

      //if Mutation has an error
      if (error) console.error(error)

      handleClose()
    } catch (err) {
      console.log('There is something wrong in updateItem >> ', err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteImage(item.image)

      // delete the item

      const response = await deleteDoc(doc(db, 'items', item.id))

      window.location.reload()
      handleClose()
    } catch (error) {
      console.error('something wrong in handleDelete', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onSubmit={handleUpdate}
        onClose={handleClose}
      >
        `
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {confirmModal && (
                  <div className="fixed inset-0 h-full w-full ">
                    <div className="flex min-h-full w-full items-center justify-center ">
                      <div className="z-10 flex w-1/3 flex-col items-center justify-center rounded-2xl bg-white px-10 pb-10 pt-5">
                        <p className="m-2 px-8 pb-8 text-lg">Are you sure?</p>
                        <div className="inline-flex w-2/3 justify-between">
                          <button onClick={() => setConfirmModal(false)}>
                            Cancel
                          </button>
                          <button
                            className="text-red-600"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 z-0 h-full w-full bg-black/10" />
                  </div>
                )}

                <Dialog.Title
                  as="h3"
                  className="flex items-center justify-between pb-2 text-xl font-bold leading-6 text-gray-900"
                >
                  Edit Item
                  <button
                    type="button"
                    className="mb-5 cursor-pointer rounded-lg bg-[#FF7474] px-6 py-2 text-sm text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setConfirmModal(true)}
                  >
                    DELETE
                  </button>
                </Dialog.Title>

                <div className="flex flex-col items-center">
                  <div className="grid w-full grid-cols-2 gap-4">
                    {/* Image size */}
                    <div className=" h-72 w-full ">
                      {file ? (
                        <Image
                          alt="item-image"
                          className="h-full w-full cursor-not-allowed rounded-2xl object-cover filter transition-all duration-150 hover:grayscale"
                          width={600}
                          height={600}
                          src={URL.createObjectURL(file)}
                          onClick={() => {
                            setFile(null)
                          }}
                        />
                      ) : (
                        <CldImage
                          alt="item-image"
                          className="h-full w-full rounded-2xl object-cover"
                          src={item.image}
                          width={600}
                          height={600}
                        />
                      )}
                    </div>

                    <section className="mx-3 w-auto px-3 lg:w-2/3">
                      {/* image input*/}
                      <ImageInput />

                      {/* title input */}
                      <Input id={0} />

                      {/* price input */}
                      <Input id={1} />
                    </section>
                  </div>

                  {/* Allergies Input */}
                  <AllergiesInput />

                  <button
                    type="submit"
                    className="flex justify-center rounded-full border bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Update
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
