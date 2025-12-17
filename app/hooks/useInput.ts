'use client'

import { useState } from 'react'

// TODO: add validation options
export function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  return { value, onChange, setValue }
}
