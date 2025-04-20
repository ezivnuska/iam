// packages/ui/src/components/layouts/PageLayout/Header.tsx

import React from 'react'
import { SectionLayout } from './SectionLayout'

interface HeaderProps {
	title: string
	subtitle?: string
}

export const Header: React.FC<HeaderProps> = (props) => {
	return <SectionLayout {...props} backgroundColor='red' />
}