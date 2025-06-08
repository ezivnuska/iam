// apps/web/src/components/Layout/Row.tsx

import React from 'react'
import FlexBox, { FlexBoxProps } from './FlexBox'

const Row: React.FC<FlexBoxProps> = (props) => {
	return <FlexBox {...props} direction='row' wrap />
}

export default Row