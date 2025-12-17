'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null
}

export const Input = (props: InputProps) => {
  const { error, ...rest } = props
  return (
    <>
      <input {...rest} />
      {error && <span className="text-red-500">{error}</span>}
    </>
  )
}
