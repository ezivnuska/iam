// packages/types/src/image.ts

export type ImageProps = {
    url: string
    username: string
    height: number
    width: number
}

export type ImageItem = {
    _id: string
    filename: string
    username: string
    alt: string
    url: string
    width: number
    height: number
  }
  