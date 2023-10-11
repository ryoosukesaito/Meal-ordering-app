import crypto from 'crypto'

import { CLD } from '@/cloudinary/cloudinaryConfig'

const generateSHA1 = (data: string) => {
	const hash = crypto.createHash('sha1')
	hash.update(data)
	return hash.digest('hex')
}

const generateSignature = (publicId: string, apiSecret: string) => {
	const timestamp = new Date().getTime()
	return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
}
const deleteImage = async (image: string) => {
	const publicId = image

	const timestamp = new Date().getTime().toString()
	const apiKey = CLD.KEY
	const apiSecret = CLD.SECRET
	const signature = generateSHA1(generateSignature(publicId, apiSecret))
	const url = `${CLD.URL}/destroy`

	const formData = new FormData()
	formData.append('public_id', publicId)
	formData.append('signature', signature)
	formData.append('api_key', apiKey)
	formData.append('timestamp', timestamp)

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: formData
		})
	} catch (error) {
		console.log('error from deleteImage.ts >>> ', error)
	}
}

export default deleteImage
