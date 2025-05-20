// apps/web/src/components/FullScreenImage.tsx

import React from 'react'
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AutoSizeImage, Row } from '.'
import { resolveResponsiveProp } from '../styles'
import { useBestVariant } from '@/hooks'
import type { Image } from '@iam/types'

const FullScreenImage = ({
  image,
  onClose,
  onDelete,
  onSetAvatar,
  isAvatar,
}: {
  image: Image
  onClose: () => void
  onDelete?: () => void
  onSetAvatar?: () => void
  isAvatar?: boolean
}) => {
  const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  // Get the best variant URL using your hook
  const bestVariantUrl = useBestVariant(image)

  // You can also get the variant details (width/height) from image.variants here if needed
  // For example, find the variant matching bestVariantUrl:
  const bestVariant = image.variants.find(variant => {
    // Assuming getBestVariantUrl returns a URL that includes the variant filename
    return bestVariantUrl.includes(variant.filename)
  })

  // Calculate responsive size preserving aspect ratio
  let displayWidth = screenWidth - paddingHorizontal * 2
  let displayHeight = screenHeight - paddingHorizontal * 2

  if (bestVariant?.width && bestVariant?.height) {
    const aspectRatio = bestVariant.width / bestVariant.height
    // Adjust width and height based on screen orientation
    if (displayWidth / aspectRatio <= displayHeight) {
      displayHeight = displayWidth / aspectRatio
    } else {
      displayWidth = displayHeight * aspectRatio
    }
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
      <View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
        <View style={[styles.header, { paddingHorizontal }]}>
          <Row justify="flex-start" spacing={16}>
            {onDelete && (
              <Pressable onPress={onDelete}>
                <Ionicons name="trash-bin" size={28} color="white" />
              </Pressable>
            )}
            {!isAvatar && onSetAvatar && (
              <Pressable onPress={onSetAvatar}>
                <Ionicons name="person-circle-outline" size={28} color="white" />
              </Pressable>
            )}
          </Row>
          <Pressable onPress={onClose}>
            <Ionicons name="close-sharp" size={28} color="white" />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AutoSizeImage
            image={image}
            style={{ width: displayWidth, height: displayHeight }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default FullScreenImage
