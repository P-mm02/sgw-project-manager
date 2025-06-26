import type { ProjectFormState } from '@/types/ProjectFormState'

export const initialProjectFormState: ProjectFormState = {
  projectName: '',
  location: '',
  mapLink: '',
  client: '',
  supervisor: '',
  projectWorth: '',
  status: '',
  workType: 'others',
  planWorkDayStart: '',
  planWorkDayEnd: '',
  actualWorkDayStart: '',
  actualWorkDayEnd: '',
  tags: '',
  report: '',
  documents: '',
}
