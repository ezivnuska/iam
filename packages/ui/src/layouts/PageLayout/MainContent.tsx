// packages/ui/src/components/layouts/PageLayout/MainContent.tsx

import React, { ReactNode } from 'react'
import { View, StyleSheet, ScrollView, ViewStyle, StyleProp } from 'react-native'
import { MAX_WIDTH } from './constants'

export interface MainContentProps {
    children: ReactNode,
    style?: StyleProp<ViewStyle>
}

export const MainContent: React.FC<MainContentProps> = ({ children, style }) => {
    return (
        <ScrollView
            style={styles.main}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollView, styles.maxWidthContainer]}
        >
            <View style={style}>
                {children}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    scrollView: {
        flex: 1,
        paddingVertical: 20,
    },
    main: {
        flexGrow: 1,
        backgroundColor: 'yellow',
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: MAX_WIDTH,
        paddingHorizontal: 10,
        alignSelf: 'center',
    },
})