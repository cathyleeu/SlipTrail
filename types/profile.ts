export type ProfileRow = {
  id: string
  name: string | null
  created_at?: string
  updated_at?: string
}

export type UpdateProfileInput = {
  name?: string | null
}
