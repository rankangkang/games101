import type { ReactNode } from 'react'

export const Condition = (props: {
  if: unknown
  children: React.ReactNode | (() => ReactNode)
}) => {
  const { if: condition, children } = props

  if (condition) {
    return typeof children === 'function' ? children() : children
  }

  return null
}
