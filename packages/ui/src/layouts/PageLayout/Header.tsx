// packages/ui/src/components/layouts/PageLayout/Header.tsx

import React from 'react'
import { SectionLayout } from './SectionLayout'
import { HEADER_BACKGROUND } from './constants'

interface HeaderProps {
	title: string
	subtitle?: string
}

export const Header: React.FC<HeaderProps> = (props) => {
	return <SectionLayout {...props} backgroundColor={HEADER_BACKGROUND} />
}