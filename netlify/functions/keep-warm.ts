import fetch from 'node-fetch'

export const handler = async () => {
  try {
    const response = await fetch(
      'https://sgw-project-manager.netlify.app/api/projects'
    )
    const data = await response.json()

    if (Array.isArray(data)) {
      console.log('✅ Keep-warm success:', data.length || 'No data')
    } else {
      console.warn('⚠️ Keep-warm: Response is not an array', data)
    }
    

    return {
      statusCode: 200,
      body: 'Keep warm pinged successfully',
    }
  } catch (error) {
    console.error('❌ Keep-warm failed:', error)

    return {
      statusCode: 500,
      body: 'Keep warm failed',
    }
  }
}
