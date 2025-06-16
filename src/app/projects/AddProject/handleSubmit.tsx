import type { ProjectFormType } from '@/types/ProjectFormType'

export async function handleSubmit(
  formData: ProjectFormType,
  setSubmitted: (val: boolean) => void,
  setPreview: (val: boolean) => void
) {
  const payload = {
    ...formData,
    projectWorth: Number(formData.projectWorth),
    tags: formData.tags.split(',').map((t) => t.trim()),
    documents: formData.documents.split(',').map((d) => d.trim()),
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
