import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
export async function GET(request: NextRequest) {
  const { user } = await (await getPayload({ config })).auth({ headers: request.headers })
  if (!user) return new NextResponse('Login admin diperlukan untuk melihat draft.', { status: 401 })
  const target = request.nextUrl.searchParams.get('path') || '/'
  if (!/^\/(?:cv|blog|(?:projects|blog)\/[a-z0-9-]+)?$/.test(target)) return new NextResponse('Tujuan preview tidak valid.', { status: 400 })
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(target, request.url), { headers: { 'Cache-Control': 'private, no-store' } })
}
