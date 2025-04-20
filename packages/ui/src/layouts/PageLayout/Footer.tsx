// packages/ui/src/components/layouts/PageLayout/Footer.tsx

import React from 'react'
import { SectionLayout } from './SectionLayout'

interface FooterProps {
	title: string
	subtitle?: string
}

export const Footer: React.FC<FooterProps> = (props) => {
	return <SectionLayout {...props} backgroundColor='green' />
}