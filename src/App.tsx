import { useState, useCallback } from 'react'
import Orrery from './components/scene/Orrery'
import TimeControls from './components/ui/TimeControls'
import InfoPanel from './components/ui/InfoPanel'
import PlanetDetail from './components/ui/PlanetDetail'
import HarmonicPanel from './components/ui/HarmonicPanel'
import SettingsBar from './components/ui/SettingsBar'
import BirthChartModal from './components/ui/BirthChartModal'
import { useAnimation } from './hooks/useAnimation'
import { useChart } from './hooks/useChart'
import { usePositions } from './hooks/usePositions'
import { useHarmonics } from './hooks/useHarmonics'
import type { AppSettings, BirthChartData } from './types'

export default function App() {
  const animation = useAnimation()
  const { date } = animation

  const [settings, setSettings] = useState<AppSettings>({
    houseSystem: 'whole-sign',
    sidereal: false,
    showMinorAspects: false,
    showHarmonics: false,
    latitude: 40.7128,  // New York
    longitude: -74.006,
  })

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null)
  const [showBirthChartModal, setShowBirthChartModal] = useState(false)

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }))
  }, [])

  const handleApplyBirthChart = useCallback((data: BirthChartData) => {
    setBirthChart(data)
    animation.setDate(data.date)
    updateSettings({ latitude: data.latitude, longitude: data.longitude })
    setShowBirthChartModal(false)
  }, [animation, updateSettings])

  const handleClearBirthChart = useCallback(() => {
    setBirthChart(null)
    setShowBirthChartModal(false)
  }, [])

  const chartData = useChart(
    date,
    settings.latitude,
    settings.longitude,
    settings.houseSystem,
    !settings.showMinorAspects,
  )
  const positions = usePositions(date)
  const harmonics = useHarmonics(chartData.chart)

  const selectedPlanetData = selectedPlanet
    ? positions.find(p => p.key === selectedPlanet)
    : null

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene */}
      <Orrery
        positions={positions}
        chart={chartData.chart}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
        harmonicClusters={harmonics.clusters}
        showHarmonics={settings.showHarmonics}
      />

      {/* UI Overlays */}
      <SettingsBar
        settings={settings}
        date={date}
        onUpdate={updateSettings}
        birthChart={birthChart}
        onOpenBirthChart={() => setShowBirthChartModal(true)}
      />
      <TimeControls animation={animation} />
      <InfoPanel
        chart={chartData.chart}
        positions={positions}
        aspects={chartData.aspects}
        balance={chartData.balance}
        patterns={chartData.patterns}
        lots={chartData.lots}
      />
      {selectedPlanetData && (
        <PlanetDetail
          planet={selectedPlanetData}
          date={date}
          onClose={() => setSelectedPlanet(null)}
        />
      )}
      <HarmonicPanel harmonics={harmonics} visible={settings.showHarmonics} />
      {showBirthChartModal && (
        <BirthChartModal
          current={birthChart}
          onApply={handleApplyBirthChart}
          onClear={handleClearBirthChart}
          onClose={() => setShowBirthChartModal(false)}
        />
      )}
    </div>
  )
}
