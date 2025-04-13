import React from 'react'
import { Text } from 'react-native'
import { Row, Stack } from '@ui'

const App = () => {
    return (
        <Stack
            flex={1}
            justify='center'
            align='center'
            style={{
                backgroundColor: 'green',
            }}
        >
            <Row
                flex={1}
                justify='center'
                align='center'
                style={{
                    width: '100%',
                    backgroundColor: 'yellow',
                }}
            >
                <Text>Hello World</Text>
            </Row>
            <Row
                flex={1}
                align='center'
            >
                <Text>How are you?</Text>
            </Row>
        </Stack>
    )
}

export default App