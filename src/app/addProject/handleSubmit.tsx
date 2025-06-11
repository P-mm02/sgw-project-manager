export async function handleSubmit(
  formData: any,
  setSubmitted: (val: boolean) => void,
  setPreview: (val: boolean) => void
) {
  const payload = {
    ...formData,
    projectWorth: Number(formData.projectWorth),
    latlng: {
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    },
    tags: formData.tags.split(',').map((t: string) => t.trim()),
    documents: formData.documents.split(',').map((d: string) => d.trim()),
  }

  const res = await fetch('/api/add-project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (res.ok) {
    setSubmitted(true)
    setPreview(false)
  }
}
