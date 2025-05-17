// apps/web/src/types/responsive.ts

export const breakpoints = {
    xs: 0,
    sm: 370,
    md: 500,
    lg: 900,
} as const
  
export type Breakpoint = keyof typeof breakpoints
export type ResponsiveProp<T> = T | Partial<Record<Breakpoint, T>>
  