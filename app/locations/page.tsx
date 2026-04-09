import { DEMO_DATA } from '@/lib/data'
import LocationCard from '@/components/LocationCard'

export default function LocationsPage() {
  const { locations } = DEMO_DATA

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#F1F5F9] text-2xl font-bold">Locations</h1>
        <p className="text-[#64748B] text-sm mt-1">April 2026 · 7 locations · Demo Data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {locations.map(loc => (
          <LocationCard key={loc.code} loc={loc} />
        ))}
      </div>
    </div>
  )
}
