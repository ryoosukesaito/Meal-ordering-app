const uploadImage = async (file: File) => {
  let publicId = "";

  const formData = new FormData();
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  formData.append("file", file);
  formData.append(
    "upload_preset",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
  );
  formData.append(
    "cloud_name",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
  );
  formData.append("folder", "order-meal-app");

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const res = await response.json();
    publicId = res.public_id;
  } catch (error) {
    console.error("uploading error >>> ", error);
  }

  return publicId;
};

export default uploadImage;
