import { CLD } from '@/app/cloudinary/cloudinaryConfig'

const uploadImage = async (file: File) => {
	const formData = new FormData()
	const url = `${CLD.URL}/upload`
	formData.append('file', file)
	formData.append('upload_preset', `${CLD.UPLOAD_PRESET}`)
	formData.append('cloud_name', `${CLD.NAME}`)
	formData.append('folder', 'order-meal-app')

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: formData
		})
		const res = await response.json()
		return res.public_id
	} catch (error) {
		console.error('uploading error >>> ', error)
	}
}

export default uploadImage
