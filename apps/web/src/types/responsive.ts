// packages/ui/src/types/responsive.ts

export const breakpoints = {
    sm: 0,
    md: 600,
    lg: 1024,
} as const
  
export type Breakpoint = keyof typeof breakpoints
export type ResponsiveProp<T> = T | Partial<Record<Breakpoint, T>>
  