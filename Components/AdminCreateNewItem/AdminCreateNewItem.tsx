'use client'

import { doc, setDoc } from 'firebase/firestore'
import Image from 'next/image'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/firebase'
import { useItemsStore } from '@/store/ItemsStore'

import { AllergiesInput } from './AllergiesInput/AllergiesInput'
import { ImageInput } from './ImageInput/ImageInput'
import { Input } from './Input/Input'

export function AdminCreateNewItem() {
  const [
    title,
    setTitle,
    price,
    setPrice,
    allergies,
    setAllergies,
    setImage,
    setImageFileToUpload
  ] = useItemsStore((state) => [
    state.title,
    state.setTitle,
    state.price,
    state.setPrice,
    state.allergies,
    state.setAllergies,
    state.setImage,
    state.setImageFileToUpload
  ])

  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Create a new item
      if (file) {
        const imageURL = await setImageFileToUpload(file)
        const id = uuidv4()

        await setDoc(doc(db, 'items', id), {
          id: id,
          title: title,
          price: price,
          allergies: allergies,
          image: imageURL
        })
      }

      setLoading(false)
      window.location.replace('/admin/edit')
    } catch (error) {
      console.log('There is something wrong in addNewItem >> ', error)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setImage('')
    window.location.replace('/admin/edit')
  }

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-2xl font-bold">loading...</div>
        <div className="bg-white opacity-10" />
      </div>
    )

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mx-16 my-10 flex h-5/6 w-full flex-col items-center justify-center rounded-xl border border-gray-500 p-10 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="mb-3 flex h-full w-full flex-col items-center py-2"
        >
          {/* top container */}
          <div className="grid h-80 w-full grid-flow-row grid-cols-2 gap-5">
            <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-300">
              {file ? (
                <Image
                  alt="item-image"
                  className="h-auto w-full cursor-not-allowed hover:grayscale"
                  width={600}
                  height={600}
                  src={URL.createObjectURL(file)}
                  onClick={() => {
                    setFile(null)
                  }}
                />
              ) : (
                <div className="text-gray-600">No image..</div>
              )}
            </div>

            <div className="flex flex-col pl-6">
              {/* image */}
              <ImageInput setFile={setFile} />

              {/* title */}
              <Input id={0} />

              {/* Price */}
              <Input id={1} />
            </div>
          </div>

          {/* Allergies Input */}

          <AllergiesInput />

          <button
            type="submit"
            className="cursor-pointer rounded bg-[#FF7474] px-8 py-2 text-white hover:bg-[#FFB9B9] hover:text-[#8D8D8D]"
          >
            Update
          </button>
        </form>

        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
