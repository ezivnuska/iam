// apps/web/src/components/RenderedLink.tsx

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text } from 'react-native'
import { scrape } from '@services'
import { Column } from './Layout'
import AutoSizeImage from './AutoSizeImage'

type RenderedLinkProps = {
    url: string
}

type ScraperProps = {
    title?: string
    description?: string
    image?: string
}

export const RenderedLink: React.FC<RenderedLinkProps> = ({ url }) => {
    const [data, setData] = useState<ScraperProps | null>(null)
    useEffect(() =>  {
        const init = async () => {
            const { response } = await scrape(url)
            setData(response)
        }
        init()
    }, [])

    return data ? (
        <Column spacing={12}>
            <Text>{url}</Text>
            <Text>{data.title}</Text>
            <Text>{data.description}</Text>
            <Image
                source={{ uri: data.image }}
                style={{ width: '100%', maxWidth: 300, height: undefined, aspectRatio: 1 }}
                resizeMode='contain'
            />
        </Column>
    ) : (
        <ActivityIndicator size='large' />
    )
}