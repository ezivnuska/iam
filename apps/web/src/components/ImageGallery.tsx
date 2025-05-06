// apps/web/src/components/ImageGallery.tsx

import React from 'react'
import { Image, ScrollView } from 'react-native'
import { Button, Column } from '.'
import type { ImageItem } from '@iam/types'

type ImageGalleryProps = {
	images: ImageItem[]
	onDelete?: (id: string) => void
}
  
const ImageGallery = ({ images, onDelete }: ImageGalleryProps) => {

	return (
		<ScrollView>
			{images.map((img, index) => (
                <Column
                    key={`${index}-${img._id}`}
                    spacing={10}
                    style={{ marginBottom: 20 }}
                >
                    <Image
                        source={{ uri: img.url }}
                        style={{ width: 200, height: 200 }}
                        resizeMode='cover'
                    />
                    <Button label='Delete' onPress={() => onDelete?.(img._id)} />
                </Column>
            ))}
		</ScrollView>
	)
}
  
export default ImageGallery  