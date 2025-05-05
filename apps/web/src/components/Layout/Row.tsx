// apps/web/src/components/Layout/Row.tsx

import React from 'react'
import FlexBox, { FlexBoxProps } from './FlexBox'

const Row: React.FC<FlexBoxProps> = (props) => {
	return <FlexBox {...props} direction="row" align="center" wrap />
}

export default Row