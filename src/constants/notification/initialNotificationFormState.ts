export const initialNotificationFormState = {
  title: '',
  detail: '',
  notifyDate: new Date().toISOString().slice(0, 10), // today in 'YYYY-MM-DD' format
  notifyBeforeDays: '',
  createdBy: '',
}
