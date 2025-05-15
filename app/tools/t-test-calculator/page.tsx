"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Info, Calculator, BarChart, LayoutList } from "lucide-react"

export default function TTestCalculatorPage() {
  // Zustandsvariablen für die Eingabe
  const [group1Text, setGroup1Text] = useState<string>("")
  const [group2Text, setGroup2Text] = useState<string>("")
  const [testType, setTestType] = useState<"independent" | "paired">("independent")
  const [equalVariance, setEqualVariance] = useState<boolean>(true)
  const [significanceLevel, setSignificanceLevel] = useState<string>("0.05")

  // Zustandsvariablen für das Ergebnis
  const [results, setResults] = useState<{
    tValue: number;
    pValue: number;
    degreesOfFreedom: number;
    significant: boolean;
    meanDifference: number;
    confidenceInterval: [number, number];
    group1Stats: { mean: number; stdDev: number; n: number };
    group2Stats: { mean: number; stdDev: number; n: number };
  } | null>(null)
  
  const [error, setError] = useState<string>("")

  // Parsen der Eingaben als Zahlen
  const parseInputToNumbers = (input: string): number[] => {
    return input
      .split(/[\n,;\s]+/)
      .map(value => value.trim())
      .filter(value => value !== "")
      .map(value => {
        // Ersetzt Kommas mit Punkten für die Dezimaldarstellung
        const parsed = Number(value.replace(",", "."))
        if (isNaN(parsed)) {
          throw new Error(`"${value}" ist keine gültige Zahl.`)
        }
        return parsed
      })
  }

  // Berechnung des T-Tests
  const calculateTTest = () => {
    try {
      setError("")
      
      // Parse Eingabedaten
      const group1 = parseInputToNumbers(group1Text)
      const group2 = parseInputToNumbers(group2Text)
      const alpha = Number(significanceLevel)
      
      if (isNaN(alpha) || alpha <= 0 || alpha >= 1) {
        throw new Error("Das Signifikanzniveau muss zwischen 0 und 1 liegen.")
      }
      
      if (group1.length < 2) {
        throw new Error("Gruppe 1 muss mindestens zwei Werte enthalten.")
      }
      
      if (group2.length < 2) {
        throw new Error("Gruppe 2 muss mindestens zwei Werte enthalten.")
      }
      
      if (testType === "paired" && group1.length !== group2.length) {
        throw new Error("Für einen gepaarten T-Test müssen beide Gruppen gleich viele Werte haben.")
      }
      
      // Berechne Statistiken für jede Gruppe
      const group1Stats = calculateGroupStats(group1)
      const group2Stats = calculateGroupStats(group2)
      
      // Berechne T-Wert und p-Wert basierend auf Testtyp
      let tValue: number
      let degreesOfFreedom: number
      let pValue: number
      let confidenceInterval: [number, number]
      const meanDifference = group1Stats.mean - group2Stats.mean
      
      if (testType === "independent") {
        if (equalVariance) {
          // Student's t-Test für unabhängige Stichproben mit gleicher Varianz
          degreesOfFreedom = group1.length + group2.length - 2
          
          // Gepoolte Standardabweichung
          const pooledVariance = 
            ((group1.length - 1) * Math.pow(group1Stats.stdDev, 2) + 
            (group2.length - 1) * Math.pow(group2Stats.stdDev, 2)) / 
            degreesOfFreedom
          
          const standardError = Math.sqrt(pooledVariance * (1/group1.length + 1/group2.length))
          
          tValue = meanDifference / standardError
          
          // Berechnung des Konfidenzintervalls
          const tCritical = getTCritical(degreesOfFreedom, alpha)
          const marginOfError = tCritical * standardError
          confidenceInterval = [meanDifference - marginOfError, meanDifference + marginOfError]
        } else {
          // Welch's t-Test für unabhängige Stichproben mit ungleicher Varianz
          const variance1 = Math.pow(group1Stats.stdDev, 2) / group1.length
          const variance2 = Math.pow(group2Stats.stdDev, 2) / group2.length
          
          const standardError = Math.sqrt(variance1 + variance2)
          
          tValue = meanDifference / standardError
          
          // Welch-Satterthwaite Approximation für Freiheitsgrade
          degreesOfFreedom = Math.floor(
            Math.pow(variance1 + variance2, 2) / 
            (Math.pow(variance1, 2) / (group1.length - 1) + 
            Math.pow(variance2, 2) / (group2.length - 1))
          )
          
          // Berechnung des Konfidenzintervalls
          const tCritical = getTCritical(degreesOfFreedom, alpha)
          const marginOfError = tCritical * standardError
          confidenceInterval = [meanDifference - marginOfError, meanDifference + marginOfError]
        }
      } else {
        // Gepaarter t-Test
        const differences = group1.map((value, index) => value - group2[index])
        const diffStats = calculateGroupStats(differences)
        
        const standardError = diffStats.stdDev / Math.sqrt(differences.length)
        tValue = diffStats.mean / standardError
        degreesOfFreedom = differences.length - 1
        
        // Berechnung des Konfidenzintervalls
        const tCritical = getTCritical(degreesOfFreedom, alpha)
        const marginOfError = tCritical * standardError
        confidenceInterval = [diffStats.mean - marginOfError, diffStats.mean + marginOfError]
      }
      
      // p-Wert Berechnung (Approximation)
      pValue = calculatePValue(Math.abs(tValue), degreesOfFreedom)
      
      // Ergebnisse setzen
      setResults({
        tValue,
        pValue,
        degreesOfFreedom,
        significant: pValue < alpha,
        meanDifference,
        confidenceInterval,
        group1Stats,
        group2Stats
      })
      
    } catch (err) {
      setError((err as Error).message)
      setResults(null)
    }
  }
  
  // Statistiken für eine Gruppe berechnen
  const calculateGroupStats = (group: number[]) => {
    const n = group.length
    const mean = group.reduce((sum, value) => sum + value, 0) / n
    
    const variance = group.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1)
    const stdDev = Math.sqrt(variance)
    
    return { mean, stdDev, n }
  }
  
  // T-kritischen Wert berechnen (vereinfachte Approximation)
  const getTCritical = (df: number, alpha: number): number => {
    // Vereinfachte Approximation des t-kritischen Werts
    // Für genauere Werte sollte eine Lookup-Tabelle oder eine bessere Approximation verwendet werden
    if (df > 30) {
      // Für große Freiheitsgrade kann die Normalverteilung verwendet werden
      if (alpha === 0.05) return 1.96
      if (alpha === 0.01) return 2.576
      // Grobe Approximation für andere Alpha-Werte
      return -0.862 + Math.sqrt(0.743 - 2.404 * Math.log(alpha))
    } else {
      // Für kleinere Freiheitsgrade
      if (alpha === 0.05) return 2.042
      if (alpha === 0.01) return 2.750
      // Grobe Approximation für andere Alpha-Werte
      return -0.862 + Math.sqrt(0.743 - 2.404 * Math.log(alpha))
    }
  }
  
  // P-Wert aus t-Wert berechnen (vereinfachte Approximation)
  const calculatePValue = (tValue: number, df: number): number => {
    // Dies ist eine Approximation. Für genauere Werte sollte eine vollständige t-Verteilungsfunktion verwendet werden
    if (df > 30) {
      // Für große Freiheitsgrade kann die Normalverteilung verwendet werden
      const z = tValue
      const p = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
      return 2 * (1 - normalCDF(z))
    } else {
      // Für kleinere Freiheitsgrade
      // Eine einfache Approximation - nicht sehr genau, aber für Demonstrationszwecke ausreichend
      const p = Math.exp(-0.5 * tValue * tValue) / Math.sqrt(2 * Math.PI) * Math.sqrt(df / (df + tValue * tValue))
      return 2 * (1 - normalCDF(tValue * Math.sqrt(df / (df + 1))))
    }
  }

  // Standard-Normalverteilungs-CDF (Approximation)
  const normalCDF = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp(-x * x / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - p : p
  }

  // Beispieldaten laden
  const loadExampleData = () => {
    if (testType === "independent") {
      setGroup1Text("23.4, 25.1, 24.7, 26.3, 22.9, 24.8")
      setGroup2Text("20.6, 21.8, 22.7, 21.3, 23.1, 20.9, 21.5")
    } else {
      setGroup1Text("5.2, 4.8, 6.1, 5.3, 4.9, 5.7")
      setGroup2Text("4.8, 4.2, 5.4, 4.6, 4.3, 5.0")
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
          <h1 className="text-2xl font-bold">T-Test Rechner</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Statistische Analyse für den Vergleich von Mittelwerten zweier Gruppen
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>T-Test Eingabe</CardTitle>
              <CardDescription>
                Geben Sie die Daten für beide Gruppen ein und konfigurieren Sie den Test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-type">Testtyp</Label>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant={testType === "independent" ? "default" : "outline"}
                        onClick={() => setTestType("independent")}
                        className="flex-1"
                      >
                        Unabhängig
                      </Button>
                      <Button 
                        type="button" 
                        variant={testType === "paired" ? "default" : "outline"}
                        onClick={() => setTestType("paired")}
                        className="flex-1"
                      >
                        Gepaart
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {testType === "independent"
                        ? "Für zwei unabhängige Gruppen (z.B. Kontroll- vs. Behandlungsgruppe)"
                        : "Für verbundene Messungen (z.B. vor vs. nach Behandlung)"}
                    </p>
                  </div>

                  {testType === "independent" && (
                    <div className="space-y-2">
                      <Label htmlFor="variance-assumption">Varianz-Annahme</Label>
                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant={equalVariance ? "default" : "outline"}
                          onClick={() => setEqualVariance(true)}
                          className="flex-1"
                        >
                          Gleiche Varianzen
                        </Button>
                        <Button 
                          type="button" 
                          variant={!equalVariance ? "default" : "outline"}
                          onClick={() => setEqualVariance(false)}
                          className="flex-1"
                        >
                          Ungleiche Varianzen
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {equalVariance
                          ? "Student's t-Test (gleiche Varianzen angenommen)"
                          : "Welch's t-Test (keine gleichen Varianzen angenommen)"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="significance-level">Signifikanzniveau (α)</Label>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant={significanceLevel === "0.05" ? "default" : "outline"}
                        onClick={() => setSignificanceLevel("0.05")}
                        className="flex-1"
                      >
                        0.05 (5%)
                      </Button>
                      <Button 
                        type="button" 
                        variant={significanceLevel === "0.01" ? "default" : "outline"}
                        onClick={() => setSignificanceLevel("0.01")}
                        className="flex-1"
                      >
                        0.01 (1%)
                      </Button>
                      <div className="flex-1 flex space-x-2">
                        <Input
                          id="significance-level-custom"
                          type="number"
                          min="0.001"
                          max="0.999"
                          step="0.001"
                          value={significanceLevel !== "0.05" && significanceLevel !== "0.01" ? significanceLevel : ""}
                          onChange={(e) => setSignificanceLevel(e.target.value)}
                          placeholder="Benutzerdefiniert"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="group1">
                        {testType === "independent" ? "Gruppe 1 (z.B. Behandlung)" : "Messung 1 (z.B. vor)"}
                      </Label>
                      <Textarea
                        id="group1"
                        value={group1Text}
                        onChange={(e) => setGroup1Text(e.target.value)}
                        placeholder="Geben Sie Werte ein, getrennt durch Kommas, Leerzeichen oder Zeilenumbrüche"
                        className="h-32 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group2">
                        {testType === "independent" ? "Gruppe 2 (z.B. Kontrolle)" : "Messung 2 (z.B. nach)"}
                      </Label>
                      <Textarea
                        id="group2"
                        value={group2Text}
                        onChange={(e) => setGroup2Text(e.target.value)}
                        placeholder="Geben Sie Werte ein, getrennt durch Kommas, Leerzeichen oder Zeilenumbrüche"
                        className="h-32 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={loadExampleData}>
                      <LayoutList className="h-4 w-4 mr-2" />
                      Beispieldaten laden
                    </Button>
                    <Button onClick={calculateTTest}>
                      <Calculator className="h-4 w-4 mr-2" />
                      T-Test berechnen
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-800 dark:text-red-300">
                    {error}
                  </div>
                )}

                {results && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">Ergebnisse:</h3>
                    
                    {/* Gruppendeskriptionen */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-4 bg-muted/40">
                        <h4 className="text-sm font-medium mb-2">
                          {testType === "independent" ? "Gruppe 1" : "Messung 1"}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">n:</span>
                            <span>{results.group1Stats.n}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mittelwert:</span>
                            <span>{results.group1Stats.mean.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Standardabw.:</span>
                            <span>{results.group1Stats.stdDev.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 bg-muted/40">
                        <h4 className="text-sm font-medium mb-2">
                          {testType === "independent" ? "Gruppe 2" : "Messung 2"}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">n:</span>
                            <span>{results.group2Stats.n}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mittelwert:</span>
                            <span>{results.group2Stats.mean.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Standardabw.:</span>
                            <span>{results.group2Stats.stdDev.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* T-Test Ergebnisse */}
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">T-Test Statistiken</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mittlere Differenz:</span>
                          <span>{results.meanDifference.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">t-Wert:</span>
                          <span>{results.tValue.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Freiheitsgrade (df):</span>
                          <span>{results.degreesOfFreedom}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">p-Wert:</span>
                          <span>{results.pValue < 0.001 ? "< 0.001" : results.pValue.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {(Number(significanceLevel) * 100).toFixed(1)}% Konfidenzintervall:
                          </span>
                          <span>[{results.confidenceInterval[0].toFixed(4)}, {results.confidenceInterval[1].toFixed(4)}]</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Schlussfolgerung */}
                    <div className={`p-4 rounded-md ${
                      results.significant 
                        ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                        : "bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                    }`}>
                      <h4 className="font-medium mb-1">Schlussfolgerung:</h4>
                      <p>
                        {results.significant
                          ? `Die Mittelwerte sind statistisch signifikant unterschiedlich (p ${results.pValue < 0.001 ? "< 0.001" : "= " + results.pValue.toFixed(4)}).`
                          : `Die Mittelwerte sind nicht statistisch signifikant unterschiedlich (p ${results.pValue < 0.001 ? "< 0.001" : "= " + results.pValue.toFixed(4)}).`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Über den t-Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Was ist ein t-Test?</h3>
                <p className="text-sm text-muted-foreground">
                  Der t-Test ist ein statistisches Verfahren, um die Mittelwerte zweier Gruppen zu vergleichen 
                  und festzustellen, ob sie sich statistisch signifikant unterscheiden.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Wann verwenden?</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Unabhängiger t-Test:</strong> Für zwei verschiedene, nicht verbundene Gruppen</li>
                  <li><strong>Gepaarter t-Test:</strong> Für abhängige Messungen (z.B. vor/nach Behandlung)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Voraussetzungen:</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Daten sind annähernd normalverteilt</li>
                  <li>Bei unabhängigem t-Test mit gleichen Varianzen: Die Varianzen beider Gruppen sind ähnlich</li>
                  <li>Bei gepaarten Tests: Die Differenzen sollten normalverteilt sein</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Interpretation:</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>p-Wert &lt; α:</strong> Statistisch signifikanter Unterschied zwischen den Gruppen</li>
                  <li><strong>p-Wert ≥ α:</strong> Kein statistisch signifikanter Unterschied nachweisbar</li>
                </ul>
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
                  <li>Vergleich von Behandlungs- vs. Kontrollgruppe</li>
                  <li>Vergleich von Messwerten vor und nach einer Intervention</li>
                  <li>Überprüfung neuer Medikamente oder Behandlungsmethoden</li>
                  <li>Qualitätskontrolle in der Produktion</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hinweise:</h3>
                <p className="text-sm text-muted-foreground">
                  Ein signifikantes Ergebnis zeigt einen statistischen Unterschied an, 
                  sagt aber nichts über die praktische Relevanz des Unterschieds aus. 
                  Betrachten Sie daher immer die Effektgröße und den Kontext Ihrer Daten.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
