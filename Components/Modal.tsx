"use client";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
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
      window.location.reload();
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
              <Dialog.Panel className=" w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className=" text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Edit Item
                </Dialog.Title>
                <div className="flex flex-col justify-center items-center">
                  {file ? (
                    <Image
                      alt="item-image"
                      className="w-full object-cover   filter hover:grayscale transition-all duration-150 cursor-not-allowed"
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
                      src={item.image}
                      width={600}
                      height={600}
                    />
                  )}

                  {/* image */}
                  <div className="w-fit">
                    <p className=" text-2xl font-bold">Image</p>

                    <button
                      type="button"
                      onClick={() => {
                        imagePickerRef.current?.click();
                      }}
                      className="border rounded-lg border-orange-200  w-fit"
                    >
                      upload image
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

                  <input
                    type="text"
                    placeholder={item.title}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder={price}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />

                  {allergies?.map((allergy: string, idx: number) => (
                    <>
                      <div key={idx} className="flex flex-row w-full">
                        {allergy}
                        <button onClick={deleteAllergy} value={idx}>
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  ))}
                  <input
                    type="text"
                    placeholder="Add allergy"
                    value={allergyInput}
                    onChange={handleAllergyInputChange}
                  />
                  <button type="button" onClick={addAllergy}>
                    <PlusCircleIcon className="h-5 w-5" />
                  </button>

                  <button type="submit"> Update</button>
                </div>
                <button
                  type="button"
                  className="rounded px-8 py-2 mb-12 cursor-pointer bg-[#FF7474] hover:bg-[#FFB9B9] text-white hover:text-[#8D8D8D]"
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                >
                  DELETE
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
