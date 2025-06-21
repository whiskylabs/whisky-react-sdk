import { useWhisky } from '../hooks/useWhisky'
import React from 'react'
import { Select } from './Select'
import { TokenValue } from './TokenValue'

export interface WagerSelectProps {
  options: number[]
  value: number
  onChange: (value: number) => void
  className?: string
}

/**
 * @deprecated Use WagerInput with "options" prop
 */
export function WagerSelect(props: WagerSelectProps) {
  const whisky = useWhisky()
  return (
    <Select
      className={props.className}
      options={props.options}
      value={props.value}
      onChange={props.onChange}
      disabled={whisky.isPlaying}
      label={(value) => (
        <TokenValue amount={value} />
      )}
    />
  )
}
