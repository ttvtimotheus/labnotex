"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Calculator, Info, RotateCcw, Beaker, Droplet } from "lucide-react"

type DilutionMode = "findV2" | "findC2" | "findV1" | "findC1"

export default function DilutionCalculatorPage() {
  // Allgemeine Zustände
  const [dilutionMode, setDilutionMode] = useState<DilutionMode>("findV2")
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState<string>("")
  
  // Eingabewerte
  const [c1, setC1] = useState<string>("")
  const [c2, setC2] = useState<string>("")
  const [v1, setV1] = useState<string>("")
  const [v2, setV2] = useState<string>("")
  
  // Einheiten
  const [concUnit, setConcUnit] = useState<string>("mol/L")
  const [volumeUnit, setVolumeUnit] = useState<string>("mL")
  
  // Serielle Verdünnung
  const [initialConc, setInitialConc] = useState<string>("")
  const [targetConc, setTargetConc] = useState<string>("")
  const [dilutionFactor, setDilutionFactor] = useState<string>("2")
  const [volumePerStep, setVolumePerStep] = useState<string>("10")
  const [totalVolume, setTotalVolume] = useState<string>("10")
  const [serialDilutionSteps, setSerialDilutionSteps] = useState<Array<{ step: number; conc: number; stockVol: number; diluentVol: number }>>([])

  // Handler für Eingaben
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value)
  }

  const resetError = () => {
    setError("")
  }

  // Berechnung mit C1V1 = C2V2
  const calculateDilution = () => {
    resetError()
    
    try {
      const c1Value = parseFloat(c1)
      const c2Value = parseFloat(c2)
      const v1Value = parseFloat(v1)
      const v2Value = parseFloat(v2)
      
      let resultValue: number
      let resultText: string
      
      switch (dilutionMode) {
        case "findV2":
          if (isNaN(c1Value) || isNaN(c2Value) || isNaN(v1Value)) {
            throw new Error("Bitte geben Sie gültige Werte für C1, C2 und V1 ein")
          }
          if (c2Value === 0) {
            throw new Error("C2 darf nicht 0 sein")
          }
          resultValue = (c1Value * v1Value) / c2Value
          resultText = `V2 = ${resultValue.toFixed(2)} ${volumeUnit}`
          break
          
        case "findC2":
          if (isNaN(c1Value) || isNaN(v1Value) || isNaN(v2Value)) {
            throw new Error("Bitte geben Sie gültige Werte für C1, V1 und V2 ein")
          }
          if (v2Value === 0) {
            throw new Error("V2 darf nicht 0 sein")
          }
          resultValue = (c1Value * v1Value) / v2Value
          resultText = `C2 = ${resultValue.toFixed(4)} ${concUnit}`
          break
          
        case "findV1":
          if (isNaN(c1Value) || isNaN(c2Value) || isNaN(v2Value)) {
            throw new Error("Bitte geben Sie gültige Werte für C1, C2 und V2 ein")
          }
          if (c1Value === 0) {
            throw new Error("C1 darf nicht 0 sein")
          }
          resultValue = (c2Value * v2Value) / c1Value
          resultText = `V1 = ${resultValue.toFixed(2)} ${volumeUnit}`
          break
          
        case "findC1":
          if (isNaN(c2Value) || isNaN(v1Value) || isNaN(v2Value)) {
            throw new Error("Bitte geben Sie gültige Werte für C2, V1 und V2 ein")
          }
          if (v1Value === 0) {
            throw new Error("V1 darf nicht 0 sein")
          }
          resultValue = (c2Value * v2Value) / v1Value
          resultText = `C1 = ${resultValue.toFixed(4)} ${concUnit}`
          break;
      }
      
      // Berechnetes Diluent-Volumen
      let diluentVolume: number | null = null
      if (dilutionMode !== "findV2" && !isNaN(v2Value) && !isNaN(v1Value)) {
        diluentVolume = v2Value - v1Value
      }
      
      // Vollständiges Ergebnis anzeigen
      setResult(
        diluentVolume !== null && diluentVolume >= 0
          ? `${resultText}\n\nDiluent hinzufügen: ${diluentVolume.toFixed(2)} ${volumeUnit}`
          : resultText
      )
    } catch (err) {
      setError((err as Error).message)
    }
  }
  
  // Berechnung von seriellen Verdünnungen
  const calculateSerialDilution = () => {
    resetError()
    
    try {
      const initialConcValue = parseFloat(initialConc)
      const targetConcValue = parseFloat(targetConc)
      const dilutionFactorValue = parseFloat(dilutionFactor)
      const volumePerStepValue = parseFloat(volumePerStep)
      const totalVolumeValue = parseFloat(totalVolume)
      
      if (isNaN(initialConcValue) || isNaN(targetConcValue) || isNaN(dilutionFactorValue) || 
          isNaN(volumePerStepValue) || isNaN(totalVolumeValue)) {
        throw new Error("Bitte geben Sie gültige Werte für alle Felder ein")
      }
      
      if (initialConcValue <= targetConcValue) {
        throw new Error("Die Anfangskonzentration muss größer als die Zielkonzentration sein")
      }
      
      if (dilutionFactorValue <= 1) {
        throw new Error("Der Verdünnungsfaktor muss größer als 1 sein")
      }
      
      if (volumePerStepValue <= 0 || totalVolumeValue <= 0) {
        throw new Error("Volumenwerte müssen größer als 0 sein")
      }
      
      if (volumePerStepValue > totalVolumeValue) {
        throw new Error("Das Transfer-Volumen muss kleiner als das Gesamtvolumen sein")
      }
      
      // Berechnung der Anzahl der Schritte
      const numSteps = Math.ceil(
        Math.log(targetConcValue / initialConcValue) / Math.log(1 / dilutionFactorValue)
      )
      
      if (numSteps <= 0) {
        throw new Error("Mit diesen Parametern ist keine serielle Verdünnung möglich")
      }
      
      // Berechnung für jeden Schritt
      const steps = []
      let currentConc = initialConcValue
      
      for (let i = 0; i <= numSteps; i++) {
        const stockVolume = i === 0 ? totalVolumeValue : volumePerStepValue
        const diluentVolume = i === 0 ? 0 : totalVolumeValue - volumePerStepValue
        
        steps.push({
          step: i,
          conc: currentConc,
          stockVol: stockVolume,
          diluentVol: diluentVolume
        })
        
        currentConc = currentConc / dilutionFactorValue
      }
      
      setSerialDilutionSteps(steps)
      setResult(`Eine ${numSteps}-stufige Verdünnungsreihe erreicht eine Endkonzentration von ${steps[numSteps].conc.toExponential(2)} ${concUnit}`)
    } catch (err) {
      setError((err as Error).message)
      setSerialDilutionSteps([])
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
          <h1 className="text-2xl font-bold">Verdünnungsrechner</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Berechnung von Laborverdünnungen und Verdünnungsreihen nach C₁V₁ = C₂V₂
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Einfache Verdünnung</TabsTrigger>
              <TabsTrigger value="serial">Verdünnungsreihe</TabsTrigger>
            </TabsList>
            
            {/* Einfache Verdünnung */}
            <TabsContent value="simple" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>C₁V₁ = C₂V₂ Formel</CardTitle>
                  <CardDescription>
                    Berechnen Sie eine der vier Variablen anhand der anderen drei
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Auswahloptionen */}
                    <div>
                      <Label className="mb-2 block">Was möchten Sie berechnen?</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button 
                          type="button" 
                          variant={dilutionMode === "findV2" ? "default" : "outline"} 
                          onClick={() => setDilutionMode("findV2")}
                          className="justify-start"
                        >
                          <Beaker className="mr-2 h-4 w-4" />
                          V₂ (Endvolumen)
                        </Button>
                        <Button 
                          type="button" 
                          variant={dilutionMode === "findC2" ? "default" : "outline"} 
                          onClick={() => setDilutionMode("findC2")}
                          className="justify-start"
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          C₂ (Endkonzentration)
                        </Button>
                        <Button 
                          type="button" 
                          variant={dilutionMode === "findV1" ? "default" : "outline"} 
                          onClick={() => setDilutionMode("findV1")}
                          className="justify-start"
                        >
                          <Droplet className="mr-2 h-4 w-4" />
                          V₁ (Startvolumen)
                        </Button>
                        <Button 
                          type="button" 
                          variant={dilutionMode === "findC1" ? "default" : "outline"} 
                          onClick={() => setDilutionMode("findC1")}
                          className="justify-start"
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          C₁ (Startkonzentration)
                        </Button>
                      </div>
                    </div>
                    
                    {/* Einheiten */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="concUnit">Konzentrationseinheit</Label>
                        <select 
                          id="concUnit"
                          value={concUnit}
                          onChange={(e) => setConcUnit(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="mol/L">mol/L</option>
                          <option value="mmol/L">mmol/L</option>
                          <option value="µmol/L">µmol/L</option>
                          <option value="mg/mL">mg/mL</option>
                          <option value="µg/mL">µg/mL</option>
                          <option value="%">%</option>
                          <option value="x">x (fach)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="volumeUnit">Volumeneinheit</Label>
                        <select 
                          id="volumeUnit"
                          value={volumeUnit}
                          onChange={(e) => setVolumeUnit(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="mL">mL</option>
                          <option value="µL">µL</option>
                          <option value="L">L</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Eingabefelder */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="c1" className={dilutionMode === "findC1" ? "text-muted-foreground" : ""}>
                          C₁ (Startkonzentration)
                        </Label>
                        <Input
                          id="c1"
                          type="number"
                          value={c1}
                          onChange={handleInputChange(setC1)}
                          placeholder="Wert eingeben"
                          disabled={dilutionMode === "findC1"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="v1" className={dilutionMode === "findV1" ? "text-muted-foreground" : ""}>
                          V₁ (Startvolumen)
                        </Label>
                        <Input
                          id="v1"
                          type="number"
                          value={v1}
                          onChange={handleInputChange(setV1)}
                          placeholder="Wert eingeben"
                          disabled={dilutionMode === "findV1"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="c2" className={dilutionMode === "findC2" ? "text-muted-foreground" : ""}>
                          C₂ (Endkonzentration)
                        </Label>
                        <Input
                          id="c2"
                          type="number"
                          value={c2}
                          onChange={handleInputChange(setC2)}
                          placeholder="Wert eingeben"
                          disabled={dilutionMode === "findC2"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="v2" className={dilutionMode === "findV2" ? "text-muted-foreground" : ""}>
                          V₂ (Endvolumen)
                        </Label>
                        <Input
                          id="v2"
                          type="number"
                          value={v2}
                          onChange={handleInputChange(setV2)}
                          placeholder="Wert eingeben"
                          disabled={dilutionMode === "findV2"}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={calculateDilution} className="w-full">
                      <Calculator className="mr-2 h-4 w-4" />
                      Berechnen
                    </Button>
                    
                    {/* Ergebnis und Fehler */}
                    {error && (
                      <div className="p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-800 dark:text-red-300">
                        {error}
                      </div>
                    )}
                    
                    {result && !error && (
                      <div className="p-4 border rounded-md bg-muted whitespace-pre-wrap">
                        <h3 className="text-sm font-medium mb-2">Ergebnis:</h3>
                        <div className="text-sm">
                          {result}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Verdünnungsreihe */}
            <TabsContent value="serial" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Serielle Verdünnung</CardTitle>
                  <CardDescription>
                    Berechnung von Verdünnungsreihen für mehrfache Konzentrationen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="initialConc">Anfangskonzentration</Label>
                        <Input
                          id="initialConc"
                          type="number"
                          value={initialConc}
                          onChange={handleInputChange(setInitialConc)}
                          placeholder="z.B. 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetConc">Zielkonzentration</Label>
                        <Input
                          id="targetConc"
                          type="number"
                          value={targetConc}
                          onChange={handleInputChange(setTargetConc)}
                          placeholder="z.B. 0.001"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dilutionFactor">Verdünnungsfaktor</Label>
                        <Input
                          id="dilutionFactor"
                          type="number"
                          value={dilutionFactor}
                          onChange={handleInputChange(setDilutionFactor)}
                          placeholder="z.B. 2 für 1:2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="volumePerStep">Transfervolumen</Label>
                        <Input
                          id="volumePerStep"
                          type="number"
                          value={volumePerStep}
                          onChange={handleInputChange(setVolumePerStep)}
                          placeholder="z.B. 10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalVolume">Gesamtvolumen</Label>
                        <Input
                          id="totalVolume"
                          type="number"
                          value={totalVolume}
                          onChange={handleInputChange(setTotalVolume)}
                          placeholder="z.B. 100"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={calculateSerialDilution} className="w-full">
                      <Calculator className="mr-2 h-4 w-4" />
                      Verdünnungsreihe berechnen
                    </Button>
                    
                    {/* Fehler */}
                    {error && (
                      <div className="p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-800 dark:text-red-300">
                        {error}
                      </div>
                    )}
                    
                    {/* Ergebnis - Tabelle */}
                    {serialDilutionSteps.length > 0 && !error && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Verdünnungsreihe:</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-muted">
                                <th className="p-2 text-left text-sm font-medium">Schritt</th>
                                <th className="p-2 text-left text-sm font-medium">Konzentration</th>
                                <th className="p-2 text-left text-sm font-medium">Stocklösung</th>
                                <th className="p-2 text-left text-sm font-medium">Diluent</th>
                              </tr>
                            </thead>
                            <tbody>
                              {serialDilutionSteps.map((step, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-2 text-sm">{step.step}</td>
                                  <td className="p-2 text-sm">{step.conc.toExponential(2)} {concUnit}</td>
                                  <td className="p-2 text-sm">{step.stockVol.toFixed(1)} {volumeUnit}</td>
                                  <td className="p-2 text-sm">{step.diluentVol.toFixed(1)} {volumeUnit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-4 p-4 border rounded-md bg-muted">
                          <p className="text-sm">{result}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                <h3 className="text-sm font-medium">Die C₁V₁ = C₂V₂ Formel:</h3>
                <p className="text-sm text-muted-foreground">
                  Diese Formel basiert auf dem Gesetz der Massenerhaltung und ermöglicht die Berechnung von Verdünnungen:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>C₁ = Ausgangskonzentration</li>
                  <li>V₁ = Ausgangsvolumen</li>
                  <li>C₂ = Endkonzentration</li>
                  <li>V₂ = Endvolumen</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Einfache Verdünnung:</h3>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Wählen Sie die zu berechnende Variable</li>
                  <li>Geben Sie die drei bekannten Werte ein</li>
                  <li>Klicken Sie auf "Berechnen"</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Serielle Verdünnung:</h3>
                <p className="text-sm text-muted-foreground">
                  Verdünnungsreihen werden verwendet, wenn mehrere Konzentrationen benötigt werden, z.B. für eine Standardkurve.
                </p>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Start- und Zielkonzentration eingeben</li>
                  <li>Verdünnungsfaktor wählen (z.B. 2 für 1:2)</li>
                  <li>Volumen pro Schritt und Gesamtvolumen festlegen</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anwendungsbeispiele</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Typische Anwendungen:</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Vorbereitung von Standardlösungen</li>
                  <li>Herstellung von Pufferlösungen</li>
                  <li>Erstellen von Eichkurven für ELISA</li>
                  <li>Verdünnung von Stammlösungen für Experimente</li>
                  <li>Herstellung von Medien mit unterschiedlichen Konzentrationen</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tipp:</h3>
                <p className="text-sm text-muted-foreground">
                  Bei der Herstellung einer Verdünnung ist V₁ das Volumen der Stammlösung, das entnommen wird. 
                  Das Diluent-Volumen (V₂ - V₁) ist die Menge an Lösungsmittel, die Sie zu V₁ hinzufügen müssen, 
                  um das gewünschte Endvolumen V₂ zu erreichen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
