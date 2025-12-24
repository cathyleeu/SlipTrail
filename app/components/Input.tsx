'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null
  setValue?: (value: string) => void // Allow setValue but don't pass to DOM
}

export const Input = (props: InputProps) => {
  const { error, setValue, ...rest } = props
  return (
    <>
      <input {...rest} />
      {error && <span className="text-red-500">{error}</span>}
    </>
  )
}
