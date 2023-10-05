"use client";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import {
  ArrowDownTrayIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useItemsStore } from "@/store/ItemsStore";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { useMutation } from "@apollo/client";
import { DELETE_ITEM, UPDATE_ITEM } from "@/graphql/queries";
import { client } from "@/graphql/apollo-client";
import deleteImage from "@/lib/deleteImage";

export function Modal() {
  const [
    item,
    title,
    setTitle,
    price,
    setPrice,
    setImage,
    file,
    setFile,
    allergies,
    setAllergies,
    allergyInput,
    setAllergyInput,
    setImageFile,
  ] = useItemsStore((state) => [
    state.item,
    state.title,
    state.setTitle,
    state.price,
    state.setPrice,
    state.setImage,
    state.file,
    state.setFile,
    state.allergies,
    state.setAllergies,
    state.allergyInput,
    state.setAllergyInput,
    state.setImageFile,
  ]);

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const [updateItem, { loading, error }] = useMutation(UPDATE_ITEM, { client });
  const [deleteItem] = useMutation(DELETE_ITEM, { client });
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const handleAllergyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllergyInput(e.target.value);
  };

  const addAllergy = () => {
    if (allergyInput.trim() !== "") {
      setAllergies([...allergies, allergyInput]);
      setAllergyInput("");
    }
  };

  const deleteAllergy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = Number(e.currentTarget.value);
    const updateAllergy = [...allergies];
    updateAllergy.splice(id, 1);
    setAllergies(updateAllergy);
  };

  const handleClose = () => {
    closeModal();
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageURL = item.image;
      if (file) {
        const URL = await setImageFile(file);
        imageURL = URL;
      }
      await updateItem({
        variables: {
          id: item.id,
          title: title,
          price: price,
          allergies: allergies,
          image: imageURL,
        },
      });

      handleClose();
    } catch (error) {
      console.log("There is something wrong in updateItem >> ", error);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(item.image);

      const deleteSuccess = await deleteItem({
        variables: { id: imageId },
      });

      window.location.reload();
      handleClose();
    } catch (error) {
      console.error("something wrong in handleDelete", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onSubmit={handleSubmit}
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
        <div className="fixed overflow-y-auto inset-0">
          <div className="flex items-center justify-center min-h-full text-center">
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
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 pb-2 flex justify-between items-center"
                >
                  Edit Item
                  <button
                    type="button"
                    className="rounded-lg px-6 py-2 mb-5 cursor-pointer bg-[#FF7474] hover:bg-[#FFB9B9] text-white hover:text-[#8D8D8D] text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  >
                    DELETE
                  </button>
                </Dialog.Title>
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Image size */}
                    <div className=" h-72 w-full ">
                      {file ? (
                        <Image
                          alt="item-image"
                          className="w-full h-full object-cover rounded-2xl filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                          width={600}
                          height={600}
                          src={URL.createObjectURL(file)}
                          onClick={() => {
                            setFile(null);
                          }}
                        />
                      ) : (
                        <CldImage
                          alt="item-image"
                          className="w-full h-full object-cover rounded-2xl"
                          src={item.image}
                          width={600}
                          height={600}
                        />
                      )}
                    </div>

                    <section className="mx-3 px-3 w-1/2">
                      {/* image input*/}
                      <div className="w-fit mb-3">
                        <p className=" text-2xl font-bold">Image</p>

                        <button
                          type="button"
                          onClick={() => {
                            imagePickerRef.current?.click();
                          }}
                          className="border rounded-full border-gray-300 w-fit flex flex-row items-center font-medium px-5 py-2 my-3 hover:bg-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          upload image
                          <div className="mx-3">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </div>
                        </button>

                        <input
                          ref={imagePickerRef}
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (!e.target.files![0].type.startsWith("image/"))
                              return;
                            setFile(e.target.files![0]);
                          }}
                        />
                      </div>

                      {/* title input */}
                      <div className="my-3">
                        <p className=" text-2xl font-bold">Title</p>
                        <div className="max-w-md">
                          <input
                            type="text"
                            className="border border-gray-300 rounded-md outline-none py-2 px-4 w-full my-3"
                            placeholder={item.title}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* price input */}
                      <div className="my-3">
                        <p className=" text-2xl font-bold">Price</p>
                        <div className="flex flex-row items-center ">
                          <p className="font-bold mr-2">$</p>
                          <input
                            type="text"
                            className="border border-gray-300 rounded-md outline-none py-2 px-4 w-full my-3"
                            placeholder={price}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                  <section className="m-5 flex flex-col w-full ">
                    <div className="flex flex-row my-4 w-full max-w-lg justify-start flex-wrap">
                      {allergies?.map((allergy: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-row w-fit items-center rounded-full pl-6 pr-1 py-1 border-[#FF7474] text-white bg-[#FF7474] hover:bg-[#ffe3e3] hover:text-[#8D8D8D] group/btn"
                        >
                          {allergy}
                          <button
                            onClick={deleteAllergy}
                            value={idx}
                            className="text-[#FF7474] pr-1 invisible group-hover/btn:visible"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-row max-w-sm">
                      <input
                        type="text"
                        placeholder="Add allergy"
                        className="border border-gray-300 rounded-md outline-none py-2 px-4"
                        value={allergyInput}
                        onChange={handleAllergyInputChange}
                      />
                      <button
                        type="button"
                        onClick={addAllergy}
                        className="mx-3 text-green-500"
                      >
                        <PlusCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </section>

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
  );
}
