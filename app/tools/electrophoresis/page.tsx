"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Save,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DNAFragment = {
  id: string;
  size: number;
  name: string;
  intensity: number;
  lane: number;
}

type Lane = {
  id: string;
  name: string;
  fragments: DNAFragment[];
}

export default function ElectrophoresisSimulatorPage() {
  const [lanes, setLanes] = useState<Lane[]>([
    { id: "0", name: "Ladder", fragments: [] },
    { id: "1", name: "Lane 1", fragments: [] },
  ])
  
  const [gelConcentration, setGelConcentration] = useState("1.0")
  const [currentLaneId, setCurrentLaneId] = useState("1")
  const [fragmentSize, setFragmentSize] = useState("")
  const [fragmentName, setFragmentName] = useState("")
  const [fragmentIntensity, setFragmentIntensity] = useState("1.0")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Predefined ladders
  const ladders = {
    "1kb": [10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 750, 500, 250, 100],
    "100bp": [1500, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
    "50bp": [800, 700, 600, 500, 450, 400, 350, 300, 250, 200, 150, 100, 50]
  }

  // Add ladder fragments when a ladder type is selected
  const selectLadder = (type: keyof typeof ladders) => {
    const ladderFragments = ladders[type].map((size, index) => ({
      id: `ladder-${index}`,
      size,
      name: `${size}bp`,
      intensity: 1.0,
      lane: 0
    }))
    
    setLanes(lanes.map(lane => 
      lane.id === "0" 
        ? { ...lane, fragments: ladderFragments }
        : lane
    ))
  }

  // Add a new lane
  const addLane = () => {
    const newLaneId = String(lanes.length)
    setLanes([...lanes, { 
      id: newLaneId, 
      name: `Lane ${lanes.length}`,
      fragments: [] 
    }])
    setCurrentLaneId(newLaneId)
  }

  // Remove a lane
  const removeLane = (id: string) => {
    if (lanes.length <= 2 || id === "0") return // Don't remove ladder or if only 2 lanes
    
    const newLanes = lanes.filter(lane => lane.id !== id)
    setLanes(newLanes)
    
    if (currentLaneId === id) {
      setCurrentLaneId(newLanes[newLanes.length - 1].id)
    }
  }

  // Add a fragment to the current lane
  const addFragment = () => {
    const size = parseInt(fragmentSize)
    if (isNaN(size) || size <= 0 || size > 50000) return
    
    const intensity = parseFloat(fragmentIntensity)
    const name = fragmentName.trim() || `${size}bp`
    
    setLanes(lanes.map(lane => {
      if (lane.id === currentLaneId) {
        return {
          ...lane,
          fragments: [
            ...lane.fragments,
            {
              id: `${currentLaneId}-${Date.now()}`,
              size,
              name,
              intensity,
              lane: parseInt(currentLaneId)
            }
          ]
        }
      }
      return lane
    }))
    
    setFragmentSize("")
    setFragmentName("")
  }

  // Remove a fragment
  const removeFragment = (laneId: string, fragmentId: string) => {
    setLanes(lanes.map(lane => {
      if (lane.id === laneId) {
        return {
          ...lane,
          fragments: lane.fragments.filter(f => f.id !== fragmentId)
        }
      }
      return lane
    }))
  }

  // Clear all fragments from a lane
  const clearLane = (laneId: string) => {
    if (laneId === "0") return // Don't clear ladder
    
    setLanes(lanes.map(lane => {
      if (lane.id === laneId) {
        return { ...lane, fragments: [] }
      }
      return lane
    }))
  }

  // Clear the entire gel
  const clearGel = () => {
    setLanes(lanes.map(lane => {
      if (lane.id === "0") return lane // Keep ladder
      return { ...lane, fragments: [] }
    }))
  }

  // Change lane name
  const changeLaneName = (laneId: string, name: string) => {
    setLanes(lanes.map(lane => {
      if (lane.id === laneId) {
        return { ...lane, name }
      }
      return lane
    }))
  }

  // Draw the gel on the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    
    // Draw gel background
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(0, 0, width, height)
    
    // Calculate lane width
    const laneWidth = width / lanes.length
    
    // Draw lanes
    for (let i = 0; i < lanes.length; i++) {
      const x = i * laneWidth
      
      // Lane background
      ctx.fillStyle = 'rgba(0,0,0,0.03)'
      ctx.fillRect(x, 0, laneWidth, height)
      
      // Lane borders
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.beginPath()
      ctx.moveTo(x + laneWidth, 0)
      ctx.lineTo(x + laneWidth, height)
      ctx.stroke()
      
      // Lane name
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(lanes[i].name, x + laneWidth / 2, 15)
    }
    
    // Find max and min fragment sizes for scaling
    const allFragments = lanes.flatMap(lane => lane.fragments)
    if (allFragments.length === 0) return
    
    const maxSize = Math.max(...allFragments.map(f => f.size))
    const minSize = Math.min(...allFragments.map(f => f.size))
    
    // Gel concentration affects migration (higher = better separation of small fragments)
    const gelConcentrationValue = parseFloat(gelConcentration)
    
    // Draw fragments
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i]
      const x = i * laneWidth + laneWidth / 2
      
      for (const fragment of lane.fragments) {
        // Calculate y position (logarithmic scale to simulate gel migration)
        // Small fragments migrate further (higher y value)
        // Adjust this formula based on gel concentration
        const migrationFactor = 1 + (gelConcentrationValue * 0.2)
        const y = 30 + (Math.log10(maxSize / fragment.size) * (height - 60) / Math.log10(maxSize / (minSize || 50))) ** migrationFactor
        
        // Draw fragment
        const width = Math.min(30, laneWidth * 0.8) * fragment.intensity
        const intensity = 0.8 * fragment.intensity
        
        // Draw band
        ctx.fillStyle = `rgba(0,0,0,${intensity})`
        ctx.beginPath()
        ctx.ellipse(x, y, width / 2, 3, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw size label for ladder
        if (lane.id === "0") {
          ctx.fillStyle = 'rgba(0,0,0,0.7)'
          ctx.font = '10px Arial'
          ctx.textAlign = 'left'
          ctx.fillText(fragment.name, x + width / 2 + 5, y + 3)
        }
      }
    }
  }, [lanes, gelConcentration])

  // Download the gel image
  const downloadGel = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = 'gel-electrophoresis.png'
    a.click()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center">
          <Link href="/tools">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Zurück zu den Tools
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Elektrophorese-Simulator</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gel-Visualisierung</CardTitle>
              <CardDescription>
                Virtuelles Agarosegel mit DNA-Banden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="gel-visualization rounded-md p-2 mb-4">
                <canvas 
                  ref={canvasRef} 
                  width={600} 
                  height={400} 
                  className="w-full border"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <Label htmlFor="gel-concentration" className="text-xs">Agarose-Konzentration</Label>
                    <Select value={gelConcentration} onValueChange={setGelConcentration}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Konzentration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5%</SelectItem>
                        <SelectItem value="0.8">0.8%</SelectItem>
                        <SelectItem value="1.0">1.0%</SelectItem>
                        <SelectItem value="1.5">1.5%</SelectItem>
                        <SelectItem value="2.0">2.0%</SelectItem>
                        <SelectItem value="3.0">3.0%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ladder-type" className="text-xs">DNA-Leiter</Label>
                    <Select defaultValue="" onValueChange={(value: keyof typeof ladders) => selectLadder(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Leiter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1kb">1 kb Leiter</SelectItem>
                        <SelectItem value="100bp">100 bp Leiter</SelectItem>
                        <SelectItem value="50bp">50 bp Leiter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearGel}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Zurücksetzen
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadGel}>
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lanes und Fragmente</CardTitle>
              <CardDescription>
                Verwaltung der Proben und DNA-Fragmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4 gap-4">
                <div className="flex-grow">
                  <Label htmlFor="current-lane">Aktuelle Lane</Label>
                  <Select value={currentLaneId} onValueChange={setCurrentLaneId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lane auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {lanes.map(lane => (
                        lane.id !== "0" ? ( // Don't allow selecting the ladder
                          <SelectItem key={lane.id} value={lane.id}>{lane.name}</SelectItem>
                        ) : null
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={addLane} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Lane
                  </Button>
                  <Button onClick={() => removeLane(currentLaneId)} variant="outline" size="sm" disabled={currentLaneId === "0" || lanes.length <= 2}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Lane
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {lanes.map(lane => (
                  lane.id === currentLaneId && (
                    <div key={lane.id} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-grow mr-4">
                          <Input
                            placeholder="Lane Name"
                            value={lane.name}
                            onChange={(e) => changeLaneName(lane.id, e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => clearLane(lane.id)}>
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Leeren
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="fragment-size">Fragment-Größe (bp)</Label>
                            <Input
                              id="fragment-size"
                              placeholder="z.B. 500"
                              value={fragmentSize}
                              onChange={(e) => setFragmentSize(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="fragment-name">Name (optional)</Label>
                            <Input
                              id="fragment-name"
                              placeholder="z.B. Gen A"
                              value={fragmentName}
                              onChange={(e) => setFragmentName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="fragment-intensity">Intensität</Label>
                            <Select value={fragmentIntensity} onValueChange={setFragmentIntensity}>
                              <SelectTrigger>
                                <SelectValue placeholder="Intensität" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.3">Schwach</SelectItem>
                                <SelectItem value="0.6">Mittel</SelectItem>
                                <SelectItem value="1.0">Stark</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button onClick={addFragment} disabled={!fragmentSize} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Fragment hinzufügen
                        </Button>
                      </div>

                      {lane.fragments.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Fragmente in {lane.name}</h3>
                          <div className="border rounded-md divide-y">
                            {lane.fragments.map(fragment => (
                              <div key={fragment.id} className="flex items-center justify-between p-2">
                                <div>
                                  <span className="font-medium">{fragment.size} bp</span>
                                  {fragment.name !== `${fragment.size}bp` && (
                                    <span className="text-sm text-muted-foreground ml-2">
                                      {fragment.name}
                                    </span>
                                  )}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeFragment(lane.id, fragment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Informationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Wie funktioniert Gel-Elektrophorese?</h3>
                <p className="text-sm text-muted-foreground">
                  Bei der Gel-Elektrophorese werden DNA-Fragmente nach Größe aufgetrennt. Kleinere Fragmente wandern schneller durch das Gel als größere Fragmente. Die Wanderungsgeschwindigkeit wird durch die Agarose-Konzentration beeinflusst.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Agarose-Konzentration</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>0.5-0.8%: Große Fragmente (5-10 kb)</li>
                  <li>1.0-1.5%: Mittlere Fragmente (0.5-5 kb)</li>
                  <li>2.0-3.0%: Kleine Fragmente (0.1-1 kb)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Anleitung</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Wählen Sie eine DNA-Leiter</li>
                  <li>Wählen Sie die Agarose-Konzentration</li>
                  <li>Fügen Sie Lanes hinzu</li>
                  <li>Fügen Sie DNA-Fragmente zu den Lanes hinzu</li>
                  <li>Speichern Sie das Bild bei Bedarf</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beispiele</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">PCR-Produkt-Analyse</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => {
                    selectLadder("100bp")
                    setGelConcentration("1.0")
                    
                    const newLanes = [
                      { ...lanes[0] }, // Keep ladder
                      {
                        id: "1",
                        name: "PCR Produkt",
                        fragments: [{ id: "1-1", size: 650, name: "Amplikon", intensity: 1.0, lane: 1 }]
                      },
                      {
                        id: "2",
                        name: "Negativkontrolle",
                        fragments: []
                      }
                    ]
                    
                    setLanes(newLanes)
                    setCurrentLaneId("1")
                  }}
                >
                  PCR mit 650bp Produkt
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Restriktionsverdau</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => {
                    selectLadder("1kb")
                    setGelConcentration("0.8")
                    
                    const newLanes = [
                      { ...lanes[0] }, // Keep ladder
                      {
                        id: "1",
                        name: "Unverdaut",
                        fragments: [{ id: "1-1", size: 5000, name: "Plasmid", intensity: 1.0, lane: 1 }]
                      },
                      {
                        id: "2",
                        name: "EcoRI",
                        fragments: [{ id: "2-1", size: 5000, name: "Linearisiert", intensity: 1.0, lane: 2 }]
                      },
                      {
                        id: "3",
                        name: "EcoRI + BamHI",
                        fragments: [
                          { id: "3-1", size: 3500, name: "Fragment 1", intensity: 1.0, lane: 3 },
                          { id: "3-2", size: 1500, name: "Fragment 2", intensity: 1.0, lane: 3 }
                        ]
                      }
                    ]
                    
                    setLanes(newLanes)
                    setCurrentLaneId("1")
                  }}
                >
                  Plasmid-Restriktionsverdau
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">DNA Extraktion</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => {
                    selectLadder("1kb")
                    setGelConcentration("0.8")
                    
                    const newLanes = [
                      { ...lanes[0] }, // Keep ladder
                      {
                        id: "1",
                        name: "Probe 1",
                        fragments: [{ id: "1-1", size: 20000, name: "Genomisch", intensity: 0.8, lane: 1 }]
                      },
                      {
                        id: "2",
                        name: "Probe 2",
                        fragments: [{ id: "2-1", size: 20000, name: "Genomisch", intensity: 0.6, lane: 2 }]
                      },
                      {
                        id: "3",
                        name: "Probe 3",
                        fragments: [{ id: "3-1", size: 20000, name: "Genomisch", intensity: 0.3, lane: 3 }]
                      }
                    ]
                    
                    setLanes(newLanes)
                    setCurrentLaneId("1")
                  }}
                >
                  Genomische DNA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
