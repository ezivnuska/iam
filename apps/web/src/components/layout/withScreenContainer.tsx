// apps/web/src/components/layout/withScreenContainer.tsx

import React from 'react'
import { ScreenContainer } from './ScreenContainer'

interface WithScreenContainerOptions<HProps extends object = {}> {
  header?: React.ComponentType<HProps>
  headerProps?: HProps
}

export function withScreenContainer<SProps extends object = {}, HProps extends object = {}>(
  ScreenComponent: React.ComponentType<SProps>,
  options?: WithScreenContainerOptions<HProps>
) {
  const WrappedComponent: React.FC<SProps> = (props) => {
    return (
      <ScreenContainer
        header={options?.header}
        headerProps={options?.headerProps}
        screen={ScreenComponent}
        screenProps={props}
      />
    )
  }

  WrappedComponent.displayName = `withScreenContainer(${ScreenComponent.displayName || ScreenComponent.name || 'Component'})`
  return WrappedComponent
}
