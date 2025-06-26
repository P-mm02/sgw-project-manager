const handler = async (req: Request): Promise<Response> => {
  const country = (req as any).geo?.country?.code ?? 'UNKNOWN'
  const allowed = ['TH', 'UNKNOWN'] // allow TH and fallback case

  if (!allowed.includes(country)) {
    console.log('Blocked country:', country)
    return new Response(
      JSON.stringify({ message: 'Forbidden for this region' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // Forward to your existing API route
  const res = await fetch(
    'https://sgw-project-manager.netlify.app/api/projects',
    {
      headers: req.headers, // optional: forward headers
    }
  )

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  })
}

export default handler

export const config = {
  path: '/api/edge-projects',
}
