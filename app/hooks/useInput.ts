'use client'

import { useState } from 'react'

type UseInputOptions = {
  initialValue?: string
  type?: 'text' | 'email' | 'password'
}

export function useInput(options: UseInputOptions | string = {}) {
  // Backward compatibility: accept string as first parameter
  const config = typeof options === 'string' ? { initialValue: options } : options
  const { initialValue = '', type = 'text' } = config

  const [value, setValue] = useState(initialValue)
  const [showPassword, setShowPassword] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type

  return {
    value,
    onChange,
    setValue,
    type: inputType,
    showPassword,
    togglePasswordVisibility,
    isPasswordType: type === 'password',
  }
}
