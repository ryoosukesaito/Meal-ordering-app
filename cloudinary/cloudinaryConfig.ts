export const CLD = {
	URL: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image` as string,

	UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,

	NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,

	KEY: process.env.NEXT_PUBLIC_CLOUDINARY_KEY as string,

	SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET as string
}
