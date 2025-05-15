"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Save,
  RefreshCcw,
  Atom,
  Info,
  Scissors,
  Pipette
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Feature = {
  id: string;
  name: string;
  type: "gene" | "promoter" | "terminator" | "ori" | "marker" | "misc";
  start: number;
  end: number;
  direction: "forward" | "reverse";
  color: string;
}

type Enzyme = {
  name: string;
  sites: number[];
  sequence: string;
}

// Colors for different feature types
const featureColors = {
  gene: "#4CAF50",        // Green
  promoter: "#2196F3",    // Blue
  terminator: "#F44336",  // Red
  ori: "#9C27B0",         // Purple
  marker: "#FF9800",      // Orange
  misc: "#607D8B"         // Gray-Blue
}

export default function PlasmidViewerPage() {
  const [plasmidName, setPlasmidName] = useState<string>("Unnamed Plasmid")
  const [plasmidSize, setPlasmidSize] = useState<number>(0)
  const [plasmidSequence, setPlasmidSequence] = useState<string>("")
  const [features, setFeatures] = useState<Feature[]>([])
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [newFeature, setNewFeature] = useState<{
    name: string;
    type: "gene" | "promoter" | "terminator" | "ori" | "marker" | "misc";
    start: string;
    end: string;
    direction: "forward" | "reverse";
  }>({
    name: "",
    type: "gene",
    start: "",
    end: "",
    direction: "forward"
  })
  
  const [enzymes, setEnzymes] = useState<Enzyme[]>([])
  const [selectedEnzymes, setSelectedEnzymes] = useState<string[]>([])
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Initialize common restriction enzymes
  useEffect(() => {
    // In a real implementation, we would compute these dynamically from the sequence
    // For now, we're using a static list
    const commonEnzymes: Enzyme[] = [
      { name: "EcoRI", sites: [], sequence: "GAATTC" },
      { name: "BamHI", sites: [], sequence: "GGATCC" },
      { name: "HindIII", sites: [], sequence: "AAGCTT" },
      { name: "XbaI", sites: [], sequence: "TCTAGA" },
      { name: "PstI", sites: [], sequence: "CTGCAG" },
      { name: "SalI", sites: [], sequence: "GTCGAC" },
      { name: "NotI", sites: [], sequence: "GCGGCCGC" },
      { name: "XhoI", sites: [], sequence: "CTCGAG" }
    ]
    
    setEnzymes(commonEnzymes)
  }, [])
  
  // Find restriction sites in sequence
  useEffect(() => {
    if (!plasmidSequence) return
    
    const updatedEnzymes = enzymes.map(enzyme => {
      const sites: number[] = []
      const seq = plasmidSequence.toUpperCase()
      const pattern = enzyme.sequence.toUpperCase()
      
      let position = seq.indexOf(pattern)
      while (position !== -1) {
        sites.push(position + 1) // 1-based index for biologists
        position = seq.indexOf(pattern, position + 1)
      }
      
      return { ...enzyme, sites }
    })
    
    setEnzymes(updatedEnzymes)
  }, [plasmidSequence, enzymes.length])
  
  // Draw plasmid on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Calculate dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8
    
    // Draw plasmid circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw size marker
    ctx.font = '12px Arial'
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText(`${plasmidSize} bp`, centerX, centerY + radius + 20)
    
    // Draw features if sequence length is known
    if (plasmidSize > 0) {
      features.forEach(feature => {
        const startAngle = (feature.start / plasmidSize) * (2 * Math.PI) - (Math.PI / 2)
        const endAngle = (feature.end / plasmidSize) * (2 * Math.PI) - (Math.PI / 2)
        
        // Draw arc for feature
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.strokeStyle = feature.color
        ctx.lineWidth = 8
        ctx.stroke()
        
        // Draw direction arrow
        if (feature.direction === "forward") {
          const midAngle = (startAngle + endAngle) / 2
          const arrowOuterX = centerX + (radius + 10) * Math.cos(midAngle)
          const arrowOuterY = centerY + (radius + 10) * Math.sin(midAngle)
          
          ctx.beginPath()
          ctx.moveTo(centerX + radius * Math.cos(midAngle), centerY + radius * Math.sin(midAngle))
          ctx.lineTo(arrowOuterX, arrowOuterY)
          ctx.strokeStyle = feature.color
          ctx.lineWidth = 2
          ctx.stroke()
          
          // Arrow head
          ctx.beginPath()
          ctx.moveTo(arrowOuterX, arrowOuterY)
          ctx.lineTo(arrowOuterX - 5 * Math.cos(midAngle - Math.PI/6), arrowOuterY - 5 * Math.sin(midAngle - Math.PI/6))
          ctx.lineTo(arrowOuterX - 5 * Math.cos(midAngle + Math.PI/6), arrowOuterY - 5 * Math.sin(midAngle + Math.PI/6))
          ctx.closePath()
          ctx.fillStyle = feature.color
          ctx.fill()
        }
        
        // Draw feature label
        const labelAngle = (startAngle + endAngle) / 2
        const labelRadius = radius + 25
        const labelX = centerX + labelRadius * Math.cos(labelAngle)
        const labelY = centerY + labelRadius * Math.sin(labelAngle)
        
        ctx.font = '10px Arial'
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        ctx.fillText(feature.name, labelX, labelY)
      })
      
      // Draw restriction sites for selected enzymes
      selectedEnzymes.forEach(enzymeName => {
        const enzyme = enzymes.find(e => e.name === enzymeName)
        if (!enzyme) return
        
        enzyme.sites.forEach(site => {
          const siteAngle = (site / plasmidSize) * (2 * Math.PI) - (Math.PI / 2)
          
          // Draw site marker
          ctx.beginPath()
          ctx.moveTo(centerX + (radius - 10) * Math.cos(siteAngle), centerY + (radius - 10) * Math.sin(siteAngle))
          ctx.lineTo(centerX + (radius + 10) * Math.cos(siteAngle), centerY + (radius + 10) * Math.sin(siteAngle))
          ctx.strokeStyle = '#FF0000'
          ctx.lineWidth = 1
          ctx.stroke()
          
          // Draw site label
          const labelX = centerX + (radius + 15) * Math.cos(siteAngle)
          const labelY = centerY + (radius + 15) * Math.sin(siteAngle)
          
          ctx.font = '10px Arial'
          ctx.fillStyle = '#FF0000'
          ctx.textAlign = 'center'
          ctx.fillText(enzyme.name, labelX, labelY)
        })
      })
    }
  }, [plasmidSize, features, selectedEnzymes, enzymes])
  
  // Handle sequence input change
  const handleSequenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sequence = e.target.value.replace(/[^ATGCatgc]/g, '')
    setPlasmidSequence(sequence)
    setPlasmidSize(sequence.length)
  }
  
  // Add a new feature
  const addFeature = () => {
    if (!newFeature.name || !newFeature.start || !newFeature.end) return
    
    const start = parseInt(newFeature.start)
    const end = parseInt(newFeature.end)
    
    if (isNaN(start) || isNaN(end) || start < 1 || end > plasmidSize || start > end) {
      alert("Invalid feature coordinates")
      return
    }
    
    const feature: Feature = {
      id: `feature-${Date.now()}`,
      name: newFeature.name,
      type: newFeature.type,
      start,
      end,
      direction: newFeature.direction,
      color: featureColors[newFeature.type]
    }
    
    setFeatures([...features, feature])
    setNewFeature({
      name: "",
      type: "gene",
      start: "",
      end: "",
      direction: "forward"
    })
  }
  
  // Remove a feature
  const removeFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id))
    if (selectedFeature?.id === id) {
      setSelectedFeature(null)
    }
  }
  
  // Download plasmid map as image
  const downloadPlasmidMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `${plasmidName.replace(/\s+/g, '_')}_map.png`
    a.click()
  }
  
  // Load example plasmid
  const loadExamplePlasmid = () => {
    setPlasmidName("pUC19")
    setPlasmidSize(2686)
    setFeatures([
      { 
        id: "f1", 
        name: "lacZ", 
        type: "gene", 
        start: 217, 
        end: 816, 
        direction: "forward", 
        color: featureColors.gene 
      },
      { 
        id: "f2", 
        name: "AmpR", 
        type: "marker", 
        start: 1934, 
        end: 2791, 
        direction: "reverse", 
        color: featureColors.marker 
      },
      { 
        id: "f3", 
        name: "pUC ori", 
        type: "ori", 
        start: 865, 
        end: 1461, 
        direction: "forward", 
        color: featureColors.ori 
      },
      { 
        id: "f4", 
        name: "lac promoter", 
        type: "promoter", 
        start: 95, 
        end: 216, 
        direction: "forward", 
        color: featureColors.promoter 
      }
    ])
  }
  
  // Toggle enzyme selection
  const toggleEnzyme = (enzymeName: string) => {
    if (selectedEnzymes.includes(enzymeName)) {
      setSelectedEnzymes(selectedEnzymes.filter(name => name !== enzymeName))
    } else {
      setSelectedEnzymes([...selectedEnzymes, enzymeName])
    }
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
          <h1 className="text-2xl font-bold">Plasmid-Viewer</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plasmid-Map</CardTitle>
              <CardDescription>
                Visualisierung des Plasmids mit Features und Restriktionsstellen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Plasmid Name"
                  value={plasmidName}
                  onChange={(e) => setPlasmidName(e.target.value)}
                  className="text-lg font-medium mb-2"
                />
                <div className="text-sm text-muted-foreground">Größe: {plasmidSize} bp</div>
              </div>
              
              <div className="bg-card border rounded-md p-4 flex justify-center">
                <canvas ref={canvasRef} width={500} height={500} className="max-w-full" />
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={loadExamplePlasmid}>
                  <Atom className="h-4 w-4 mr-2" />
                  pUC19 Beispiel
                </Button>
                <Button variant="outline" onClick={downloadPlasmidMap}>
                  <Download className="h-4 w-4 mr-2" />
                  Als Bild speichern
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plasmid-Features</CardTitle>
              <CardDescription>
                Gene, Promotoren, Terminatoren und andere Elemente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="features">
                <TabsList className="mb-4">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="sequence">Sequenz</TabsTrigger>
                  <TabsTrigger value="enzymes">Restriktionsenzyme</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="feature-name">Name</Label>
                      <Input
                        id="feature-name"
                        placeholder="z.B. GFP"
                        value={newFeature.name}
                        onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="feature-type">Typ</Label>
                      <select
                        id="feature-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={newFeature.type}
                        onChange={(e) => setNewFeature({...newFeature, type: e.target.value as any})}
                      >
                        <option value="gene">Gen</option>
                        <option value="promoter">Promotor</option>
                        <option value="terminator">Terminator</option>
                        <option value="ori">Origin</option>
                        <option value="marker">Marker</option>
                        <option value="misc">Sonstiges</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="feature-start">Start</Label>
                      <Input
                        id="feature-start"
                        type="number"
                        min="1"
                        max={plasmidSize.toString()}
                        placeholder="1"
                        value={newFeature.start}
                        onChange={(e) => setNewFeature({...newFeature, start: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="feature-end">Ende</Label>
                      <Input
                        id="feature-end"
                        type="number"
                        min="1"
                        max={plasmidSize.toString()}
                        placeholder={plasmidSize ? plasmidSize.toString() : "100"}
                        value={newFeature.end}
                        onChange={(e) => setNewFeature({...newFeature, end: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="direction-forward"
                          checked={newFeature.direction === "forward"}
                          onChange={() => setNewFeature({...newFeature, direction: "forward"})}
                        />
                        <Label htmlFor="direction-forward">→</Label>
                        <input
                          type="radio"
                          id="direction-reverse"
                          checked={newFeature.direction === "reverse"}
                          onChange={() => setNewFeature({...newFeature, direction: "reverse"})}
                        />
                        <Label htmlFor="direction-reverse">←</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={addFeature} 
                    disabled={!newFeature.name || !newFeature.start || !newFeature.end || plasmidSize === 0}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Feature hinzufügen
                  </Button>
                  
                  {features.length > 0 && (
                    <div className="mt-4 border rounded-md divide-y">
                      {features.map(feature => (
                        <div key={feature.id} className="p-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: feature.color }}
                              />
                              <span className="font-medium">{feature.name}</span>
                              <span className="ml-2 text-xs bg-muted rounded-full px-2 py-0.5">
                                {feature.type}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {feature.start}-{feature.end} ({feature.direction === "forward" ? "→" : "←"})
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(feature.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="sequence">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plasmid-sequence">DNA-Sequenz</Label>
                      <Textarea
                        id="plasmid-sequence"
                        placeholder="Geben Sie die Plasmid-Sequenz ein (nur A, T, G, C)"
                        className="font-mono h-40"
                        value={plasmidSequence}
                        onChange={handleSequenceChange}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plasmidSequence ? `Länge: ${plasmidSize} bp` : "Keine Sequenz eingegeben"}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="enzymes">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Wählen Sie Restriktionsenzyme aus, um ihre Schnittstellen auf der Plasmid-Karte anzuzeigen:
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {enzymes.map(enzyme => (
                        <div key={enzyme.name} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`enzyme-${enzyme.name}`}
                            checked={selectedEnzymes.includes(enzyme.name)}
                            onChange={() => toggleEnzyme(enzyme.name)}
                          />
                          <Label htmlFor={`enzyme-${enzyme.name}`} className="flex items-center">
                            <Scissors className="h-3 w-3 mr-1" />
                            {enzyme.name}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {enzyme.sites.length > 0 ? `(${enzyme.sites.length})` : ""}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    {selectedEnzymes.length > 0 && (
                      <div className="mt-4 border rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Ausgewählte Enzyme:</h3>
                        <div className="space-y-2">
                          {selectedEnzymes.map(enzymeName => {
                            const enzyme = enzymes.find(e => e.name === enzymeName)
                            if (!enzyme) return null
                            
                            return (
                              <div key={enzyme.name} className="text-sm">
                                <div className="font-medium">{enzyme.name} ({enzyme.sequence})</div>
                                {enzyme.sites.length > 0 ? (
                                  <div className="text-muted-foreground">
                                    Schnittstellen: {enzyme.sites.join(", ")}
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground italic">
                                    Keine Schnittstellen gefunden
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Anleitung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Plasmid Map erstellen:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Geben Sie einen Namen für das Plasmid ein</li>
                  <li>Optional: Geben Sie die DNA-Sequenz ein</li>
                  <li>Fügen Sie Features wie Gene, Promotoren, etc. hinzu</li>
                  <li>Wählen Sie Restriktionsenzyme zur Anzeige aus</li>
                  <li>Speichern Sie die Map als Bild, wenn gewünscht</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Feature-Typen:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(featureColors).map(([type, color]) => (
                    <div key={type} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tipps:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Koordinaten beginnen bei Position 1</li>
                  <li>Für einen vollständigen Kreis können Start-/Endpositionen die Grenze überschreiten</li>
                  <li>Laden Sie das pUC19-Beispiel, um die Funktionalität zu testen</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-8 bg-black" />
                  <span className="text-sm">Plasmid-Rückgrat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-8 bg-red-500" />
                  <span className="text-sm">Restriktionsschnittstelle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: featureColors.gene }} />
                  <span className="text-sm">Gen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: featureColors.marker }} />
                  <span className="text-sm">Marker</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: featureColors.ori }} />
                  <span className="text-sm">Origin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: featureColors.promoter }} />
                  <span className="text-sm">Promotor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
