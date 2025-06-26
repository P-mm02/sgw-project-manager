export async function deleteProject(
  id: string,
  confirmMessage: string = 'คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจคนี้?'
): Promise<boolean> {
  const confirmDelete = window.confirm(confirmMessage)
  if (!confirmDelete) return false

  try {
    const res = await fetch(`/api/projects/${id}/delete`, {
      method: 'DELETE',
    })

    if (res.ok) {
      return true
    } else {
      console.error('❌ Failed to delete project')
      return false
    }
  } catch (err) {
    console.error('❌ Error deleting project:', err)
    return false
  }
}
