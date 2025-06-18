const helloHandler = async (): Promise<Response> => {
    console.log('xwwwwwwwwwwwwwwwww');
    
  return new Response('Hello from Netlify Edge!', {
    headers: { 'Content-Type': 'text/plain' },
  })
}

export default helloHandler

export const config = {
  path: '/api/hello',
}
