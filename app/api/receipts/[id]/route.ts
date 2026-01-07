import { apiError, apiSuccess } from '@lib/apiResponse'
import { requireAuth } from '@lib/auth'
import { supabaseServer } from '@lib/supabase/server'
import type { ParsedReceipt } from '@types'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: Params) {
  try {
    const supabase = await supabaseServer()
    const { id } = await params
    const auth = await requireAuth(supabase)

    if (!auth.ok) return auth.response

    // 특정 영수증 조회
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (error) {
      console.error('Error fetching receipt:', error)
      return apiError(error.message, { status: 500 })
    }

    if (!data) {
      return apiError('Receipt not found', { status: 404 })
    }

    return apiSuccess(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiError('Unauthorized', { status: 401 })
    }
    return apiError('Unexpected error occurred', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const supabase = await supabaseServer()
    const { id } = await params
    const auth = await requireAuth(supabase)

    if (!auth.ok) return auth.response

    // 요청 body 파싱
    const body = await req.json()
    const { receipt, location } = body as {
      receipt?: Partial<ParsedReceipt>
      location?: { latitude: number; longitude: number } | null
    }

    if (!receipt && !location) {
      return apiError('No data to update', { status: 400 })
    }

    // 업데이트할 데이터 준비
    const allowedFields = [
      'vendor',
      'address',
      'phone',
      'purchased_at',
      'currency',
      'subtotal',
      'total',
      'raw_text',
      'items',
      'charges',
    ] as const

    const updateData = Object.fromEntries(
      Object.entries({ ...receipt, ...location }).filter(
        ([key, value]) =>
          value !== undefined &&
          (allowedFields.includes(key as any) || key === 'latitude' || key === 'longitude')
      )
    )

    // 영수증 업데이트
    const { data, error } = await supabase
      .from('receipts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating receipt:', error)
      return apiError(error.message, { status: 500 })
    }

    if (!data) {
      return apiError('Receipt not found', { status: 404 })
    }

    return apiSuccess(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiError('Unauthorized', { status: 401 })
    }
    return apiError('Unexpected error occurred', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const supabase = await supabaseServer()
    const { id } = await params
    const auth = await requireAuth(supabase)

    if (!auth.ok) return auth.response

    // 영수증 삭제
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.user.id)

    if (error) {
      console.error('Error deleting receipt:', error)
      return apiError(error.message, { status: 500 })
    }

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return apiError('Unauthorized', { status: 401 })
    }
    return apiError('Unexpected error occurred', { status: 500 })
  }
}
