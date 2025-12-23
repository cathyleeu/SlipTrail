import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { address } = await req.json()

  if (!address) {
    return NextResponse.json({ success: false, error: 'Address required' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', address)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'SlipTrail/1.0 (https://github.com/cathyleeu/slip-trail-web)',
    },
  })

  const data = await res.json()

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'Address not found',
    })
  }

  return NextResponse.json({
    success: true,
    data: data[0],
  })
}
