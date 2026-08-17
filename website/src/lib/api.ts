const API_BASE = import.meta.env.VITE_OPENNETWORKING_API_URL ?? ''

export interface ContactData {
  first_name: string
  last_name: string
  email: string
  company?: string
  phone?: string
  how_found?: string
  message: string
}

export interface JobData {
  first_name: string
  last_name: string
  email: string
  linkedin?: string
  how_found?: string
  skills: string
}

async function post(path: string, data: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao enviar')
  return res.json() as Promise<{ message: string }>
}

export const submitContact = (data: ContactData) => post('/api/public/contact', data)
export const submitJob = (data: JobData) => post('/api/public/jobs', data)
