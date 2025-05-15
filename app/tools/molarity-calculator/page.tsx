"use client"

import { useState, useEffect } from "react"
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
import { 
  ArrowLeft, 
  Calculator,
  RefreshCcw,
  Info
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CalculationType = "mol-to-mass" | "mass-to-mol" | "dilution"

export default function MolarityCalculatorPage() {
  const [calculationType, setCalculationType] = useState<CalculationType>("mass-to-mol")
  
  // Common Fields
  const [molecularWeight, setMolecularWeight] = useState<string>("")
  
  // Mass to Mol
  const [mass, setMass] = useState<string>("")
  const [volume, setVolume] = useState<string>("")
  const [molarityResult, setMolarityResult] = useState<string>("")
  
  // Mol to Mass
  const [targetMolarity, setTargetMolarity] = useState<string>("")
  const [targetVolume, setTargetVolume] = useState<string>("")
  const [massResult, setMassResult] = useState<string>("")
  
  // Dilution
  const [stockConcentration, setStockConcentration] = useState<string>("")
  const [finalConcentration, setFinalConcentration] = useState<string>("")
  const [finalVolume, setFinalVolume] = useState<string>("")
  const [stockVolumeResult, setStockVolumeResult] = useState<string>("")

  // Calculations
  const calculateMolarity = () => {
    const massValue = parseFloat(mass)
    const mwValue = parseFloat(molecularWeight)
    const volumeValue = parseFloat(volume)
    
    if (isNaN(massValue) || isNaN(mwValue) || isNaN(volumeValue) || volumeValue === 0) {
      setMolarityResult("Ungültige Eingaben")
      return
    }
    
    // Calculate molarity in mM = (mass in mg) / (MW in g/mol * volume in mL)
    const molarityInMmol = (massValue) / (mwValue * volumeValue / 1000)
    setMolarityResult(`${molarityInMmol.toFixed(4)} mM`)
  }
  
  const calculateMass = () => {
    const molarityValue = parseFloat(targetMolarity)
    const mwValue = parseFloat(molecularWeight)
    const volumeValue = parseFloat(targetVolume)
    
    if (isNaN(molarityValue) || isNaN(mwValue) || isNaN(volumeValue)) {
      setMassResult("Ungültige Eingaben")
      return
    }
    
    // Calculate mass in mg = molarity (mM) * MW (g/mol) * volume (mL) / 1000
    const massInMg = molarityValue * mwValue * volumeValue / 1000
    setMassResult(`${massInMg.toFixed(4)} mg`)
  }
  
  const calculateDilution = () => {
    const stockValue = parseFloat(stockConcentration)
    const finalValue = parseFloat(finalConcentration)
    const finalVolumeValue = parseFloat(finalVolume)
    
    if (isNaN(stockValue) || isNaN(finalValue) || isNaN(finalVolumeValue) || stockValue === 0) {
      setStockVolumeResult("Ungültige Eingaben")
      return
    }
    
    // Calculate stock volume = (final concentration * final volume) / stock concentration
    const stockVolume = (finalValue * finalVolumeValue) / stockValue
    setStockVolumeResult(`${stockVolume.toFixed(2)} mL`)
  }
  
  const resetCalculator = () => {
    setMolecularWeight("")
    setMass("")
    setVolume("")
    setMolarityResult("")
    setTargetMolarity("")
    setTargetVolume("")
    setMassResult("")
    setStockConcentration("")
    setFinalConcentration("")
    setFinalVolume("")
    setStockVolumeResult("")
  }
  
  // Common substances and their molecular weights
  const commonSubstances = [
    { name: "NaCl (Natriumchlorid)", mw: 58.44 },
    { name: "KCl (Kaliumchlorid)", mw: 74.55 },
    { name: "CaCl₂ (Calciumchlorid)", mw: 110.98 },
    { name: "MgCl₂ (Magnesiumchlorid)", mw: 95.21 },
    { name: "NaHCO₃ (Natriumbicarbonat)", mw: 84.01 },
    { name: "Glucose", mw: 180.16 },
    { name: "Tris", mw: 121.14 },
    { name: "EDTA", mw: 292.24 }
  ]

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
          <h1 className="text-2xl font-bold">Molaritätsrechner</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Molaritätsberechnung</CardTitle>
              <CardDescription>
                Berechnen Sie die Molarität, Masse oder benötigtes Volumen für Ihre Laborlösungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs 
                defaultValue="mass-to-mol" 
                value={calculationType}
                onValueChange={(value) => setCalculationType(value as CalculationType)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="mass-to-mol">Masse ➜ Molarität</TabsTrigger>
                  <TabsTrigger value="mol-to-mass">Molarität ➜ Masse</TabsTrigger>
                  <TabsTrigger value="dilution">Verdünnung</TabsTrigger>
                </TabsList>
                
                {/* Mass to Molarity Calculator */}
                <TabsContent value="mass-to-mol" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="molecular-weight">Molekulargewicht (g/mol)</Label>
                      <Input 
                        id="molecular-weight"
                        type="number"
                        step="0.01"
                        placeholder="z.B. 58.44 für NaCl"
                        value={molecularWeight}
                        onChange={(e) => setMolecularWeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mass">Masse (mg)</Label>
                      <Input 
                        id="mass"
                        type="number"
                        step="0.01"
                        placeholder="Einwaage in mg"
                        value={mass}
                        onChange={(e) => setMass(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volumen (mL)</Label>
                      <Input 
                        id="volume"
                        type="number"
                        step="0.1"
                        placeholder="Volumen in mL"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="result">Molarität (mM)</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="result"
                          readOnly
                          value={molarityResult}
                          className="bg-muted"
                        />
                        <Button onClick={calculateMolarity}>
                          <Calculator className="h-4 w-4 mr-2" />
                          Berechnen
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Molarity to Mass Calculator */}
                <TabsContent value="mol-to-mass" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="molecular-weight-2">Molekulargewicht (g/mol)</Label>
                      <Input 
                        id="molecular-weight-2"
                        type="number"
                        step="0.01"
                        placeholder="z.B. 58.44 für NaCl"
                        value={molecularWeight}
                        onChange={(e) => setMolecularWeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-molarity">Gewünschte Molarität (mM)</Label>
                      <Input 
                        id="target-molarity"
                        type="number"
                        step="0.1"
                        placeholder="Zielkonzentration in mM"
                        value={targetMolarity}
                        onChange={(e) => setTargetMolarity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-volume">Volumen (mL)</Label>
                      <Input 
                        id="target-volume"
                        type="number"
                        step="0.1"
                        placeholder="Gewünschtes Volumen in mL"
                        value={targetVolume}
                        onChange={(e) => setTargetVolume(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mass-result">Benötigte Masse (mg)</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="mass-result"
                          readOnly
                          value={massResult}
                          className="bg-muted"
                        />
                        <Button onClick={calculateMass}>
                          <Calculator className="h-4 w-4 mr-2" />
                          Berechnen
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Dilution Calculator */}
                <TabsContent value="dilution" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock-concentration">Stammkonzentration (mM oder μM)</Label>
                      <Input 
                        id="stock-concentration"
                        type="number"
                        step="0.1"
                        placeholder="Konzentration der Stammlösung"
                        value={stockConcentration}
                        onChange={(e) => setStockConcentration(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="final-concentration">Endkonzentration (mM oder μM)</Label>
                      <Input 
                        id="final-concentration"
                        type="number"
                        step="0.1"
                        placeholder="Gewünschte Endkonzentration"
                        value={finalConcentration}
                        onChange={(e) => setFinalConcentration(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="final-volume">Endvolumen (mL)</Label>
                      <Input 
                        id="final-volume"
                        type="number"
                        step="0.1"
                        placeholder="Gewünschtes Endvolumen"
                        value={finalVolume}
                        onChange={(e) => setFinalVolume(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock-volume-result">Stammvolumen (mL)</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="stock-volume-result"
                          readOnly
                          value={stockVolumeResult}
                          className="bg-muted"
                        />
                        <Button onClick={calculateDilution}>
                          <Calculator className="h-4 w-4 mr-2" />
                          Berechnen
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetCalculator}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Zurücksetzen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Häufige Substanzen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Klicken Sie auf eine Substanz, um deren Molekulargewicht zu übernehmen:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {commonSubstances.map((substance) => (
                    <Button 
                      key={substance.name}
                      variant="outline"
                      className="justify-start h-auto py-2"
                      onClick={() => setMolecularWeight(substance.mw.toString())}
                    >
                      <div className="text-left">
                        <div className="text-sm">{substance.name}</div>
                        <div className="text-xs text-muted-foreground">{substance.mw} g/mol</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formeln</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Masse → Molarität</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Molarität (mM) = Masse (mg) / (MW (g/mol) × Volumen (mL) / 1000)
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Molarität → Masse</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Masse (mg) = Molarität (mM) × MW (g/mol) × Volumen (mL) / 1000
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Verdünnung (C₁V₁ = C₂V₂)</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  V₁ = (C₂ × V₂) / C₁
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  wobei V₁ = Volumen der Stammlösung, C₁ = Konzentration der Stammlösung, 
                  V₂ = Endvolumen, C₂ = Endkonzentration
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
