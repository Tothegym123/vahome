import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vahome2026'

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  if (pw !== ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const supabase = sb()
    const { data, error } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, source, source_detail, pipeline_stage, lead_score, last_touch, created_at')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ leads: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  if (pw !== ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }) }
  const { id, pipeline_stage } = body
  if (!id || !pipeline_stage) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  try {
    const supabase = sb()
    const { error } = await supabase.from('contacts').update({
      pipeline_stage,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
