import { getMyProfile } from '@lib/profile'
import ProfileClient from './ProfileClient'

export default async function AccountPage() {
  const { profile } = await getMyProfile()
  return (
    <div style={{ padding: 16 }}>
      <h1>Account</h1>
      <ProfileClient initialProfile={profile} />
    </div>
  )
}
