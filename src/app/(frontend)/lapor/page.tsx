import { ReportFormExperience } from '@/components/lautbersih/ReportFormExperience'
import { getWasteCategories } from '@/lib/reports'

import { submitReport } from './actions'

export const dynamic = 'force-dynamic'

export default async function ReportFormPage() {
  const categories = await getWasteCategories()

  return <ReportFormExperience categories={categories} submitAction={submitReport} />
}
