import React from 'react'
import { View, Text } from 'react-native'

const App = () => {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'green'
            }}
        >
            <View>
                <Text>Hello World</Text>
            </View>
        </View>
    )
}

export default App