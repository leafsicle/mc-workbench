import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Calculators from "@/components/pages/calculators"
import Fitness from "@/components/pages/fitness"
import SpaceStuff from "@/components/pages/spaceStuff"
import TrebuchetTool from "@/components/pages/trebuchet"
import Garden from "@/components/garden/Garden"
import DarkThemeWrapper from "@/components/appMain/DarkThemeWrapper"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "calculators", label: "Calculators", wrapDark: true, render: () => <Calculators /> },
  { id: "fitness", label: "Hevy Log", wrapDark: true, render: () => <Fitness /> },
  { id: "space", label: "Space", wrapDark: true, render: () => <SpaceStuff isThisToday /> },
  { id: "trebuchet", label: "Send It", wrapDark: true, render: () => <TrebuchetTool /> },
  { id: "garden", label: "Garden", wrapDark: false, render: () => <Garden /> }
]

const Scrapyard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get("tab")
  const [activeId, setActiveId] = useState(
    TABS.some((tab) => tab.id === initialTab) ? initialTab : TABS[0].id
  )

  const activeTab = useMemo(
    () => TABS.find((tab) => tab.id === activeId) ?? TABS[0],
    [activeId]
  )

  const selectTab = (id) => {
    setActiveId(id)
    setSearchParams({ tab: id }, { replace: true })
  }

  const panel = activeTab.render()

  return (
    <div className="scrapyard-page">
      <header className="scrapyard-header">
        <p className="scrapyard-eyebrow">Experiments left running</p>
        <h1 className="scrapyard-title">Scrapyard</h1>
        <p className="scrapyard-support">
          Pick a tab. Some of this still works. Some of it is here because I never took it down.
        </p>
      </header>

      <div className="scrapyard-tabs" role="tablist" aria-label="Scrapyard tools">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`scrapyard-tab-${tab.id}`}
            aria-selected={tab.id === activeTab.id}
            aria-controls={`scrapyard-panel-${tab.id}`}
            className={cn(
              "scrapyard-tab",
              tab.id === activeTab.id && "scrapyard-tab--active"
            )}
            onClick={() => selectTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="scrapyard-panel"
        role="tabpanel"
        id={`scrapyard-panel-${activeTab.id}`}
        aria-labelledby={`scrapyard-tab-${activeTab.id}`}>
        {activeTab.wrapDark ? <DarkThemeWrapper>{panel}</DarkThemeWrapper> : panel}
      </div>
    </div>
  )
}

export default Scrapyard
