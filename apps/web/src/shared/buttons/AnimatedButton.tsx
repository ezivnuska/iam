// apps/web/src/shared/buttons/AnimatedButton.tsx

import React, { useRef } from 'react'
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native'

type AnimatedButtonProps = {
  label?: string
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onPress,
  disabled = false,
  style,
  textStyle,
  children,
}) => {
  const animation = useRef(new Animated.Value(0)).current

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false, // required for web + color
    }).start()
  }

  const handlePressOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start()
  }

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#070', '#0a0'], // dark green to lighter green
  })

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor },
          disabled && styles.disabled,
          style,
        ]}
      >
        {children ?? (
          <Text style={[styles.text, textStyle]}>{label}</Text>
        )}
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#999',
  },
})
