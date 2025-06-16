export const handler = async () => {
  await fetch('https://<your-site>.netlify.app/api/projects')
  return {
    statusCode: 200,
    body: 'Keep warm pinged',
  }
}
