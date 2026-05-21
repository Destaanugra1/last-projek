import { MapMonitoringExperience } from '@/components/lautbersih/MapMonitoringExperience'
import { getReports, getWasteCategories } from '@/lib/reports'

export const dynamic = 'force-dynamic'

export default async function MapMonitoringPage() {
  const [reports, categories] = await Promise.all([getReports(12), getWasteCategories()])

  return <MapMonitoringExperience categories={categories} reports={reports} />
}
