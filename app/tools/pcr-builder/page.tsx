"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Save,
  RefreshCcw,
  Thermometer,
  Info,
  Calculator
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Primer = {
  id: string;
  name: string;
  sequence: string;
  direction: 'forward' | 'reverse';
  tm: number;
  gcContent: number;
  length: number;
  notes: string;
}

// Helper functions for primer analysis
const calculateGCContent = (sequence: string): number => {
  if (!sequence) return 0
  const gc = (sequence.match(/[GC]/gi) || []).length
  return Math.round((gc / sequence.length) * 100 * 10) / 10
}

const calculateTm = (sequence: string): number => {
  if (!sequence) return 0
  const gc = calculateGCContent(sequence)
  
  // Different formulas based on primer length
  if (sequence.length < 14) {
    // Use Wallace rule for short primers
    return sequence.length * 2
  } else {
    // Use more complex formula for longer primers
    // Tm = 64.9 + 41 * (GC content - 16.4) / length
    return Math.round((64.9 + 41 * ((gc / 100 * sequence.length) - 16.4) / sequence.length) * 10) / 10
  }
}

// Reverse complement function
const reverseComplement = (sequence: string): string => {
  if (!sequence) return ""
  
  const complementMap: Record<string, string> = {
    'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
    'a': 't', 't': 'a', 'g': 'c', 'c': 'g',
    'R': 'Y', 'Y': 'R', 'M': 'K', 'K': 'M',
    'r': 'y', 'y': 'r', 'm': 'k', 'k': 'm',
    'S': 'S', 'W': 'W', 'H': 'D', 'D': 'H',
    's': 's', 'w': 'w', 'h': 'd', 'd': 'h',
    'B': 'V', 'V': 'B', 'N': 'N', 
    'b': 'v', 'v': 'b', 'n': 'n'
  }
  
  return sequence
    .split('')
    .reverse()
    .map(base => complementMap[base] || base)
    .join('')
}

export default function PCRBuilderPage() {
  const [primers, setPrimers] = useState<Primer[]>([])
  const [newPrimerName, setNewPrimerName] = useState("")
  const [newPrimerSequence, setNewPrimerSequence] = useState("")
  const [newPrimerDirection, setNewPrimerDirection] = useState<'forward' | 'reverse'>('forward')
  const [templateSequence, setTemplateSequence] = useState("")
  const [primerPairAnalysis, setPrimerPairAnalysis] = useState<{
    compatible: boolean;
    productSize?: number;
    message: string;
  } | null>(null)

  // Add a new primer
  const addPrimer = () => {
    if (!newPrimerSequence.trim()) return
    
    // Clean up the sequence - remove spaces and non-nucleotide characters
    const cleanSequence = newPrimerSequence.replace(/[^ATGCRYMKSWHDBVNatgcrymkswhdbvn]/g, '')
    
    // Calculate properties
    const tm = calculateTm(cleanSequence)
    const gcContent = calculateGCContent(cleanSequence)
    
    // Create a new primer
    const newPrimer: Primer = {
      id: `primer-${Date.now()}`,
      name: newPrimerName.trim() || `Primer ${primers.length + 1}`,
      sequence: cleanSequence,
      direction: newPrimerDirection,
      tm,
      gcContent,
      length: cleanSequence.length,
      notes: ""
    }
    
    setPrimers([...primers, newPrimer])
    setNewPrimerName("")
    setNewPrimerSequence("")
  }

  // Remove a primer
  const removePrimer = (id: string) => {
    setPrimers(primers.filter(primer => primer.id !== id))
  }

  // Analyze primer pair
  const analyzePrimerPair = () => {
    // Need at least one forward and one reverse primer
    const forwardPrimers = primers.filter(p => p.direction === 'forward')
    const reversePrimers = primers.filter(p => p.direction === 'reverse')
    
    if (forwardPrimers.length === 0 || reversePrimers.length === 0) {
      setPrimerPairAnalysis({
        compatible: false,
        message: "Mindestens ein Forward- und ein Reverse-Primer werden benötigt."
      })
      return
    }
    
    // Check template sequence
    if (!templateSequence.trim()) {
      setPrimerPairAnalysis({
        compatible: false,
        message: "Bitte geben Sie eine Template-Sequenz ein."
      })
      return
    }
    
    // Take the first pair of primers for analysis
    const forward = forwardPrimers[0]
    const reverse = reversePrimers[0]
    
    // Check Tm difference (should be within 5°C)
    const tmDiff = Math.abs(forward.tm - reverse.tm)
    const tmCompatible = tmDiff <= 5
    
    // Find primer binding sites in template
    const cleanTemplate = templateSequence.replace(/[^ATGCatgc]/g, '').toUpperCase()
    const forwardPos = cleanTemplate.indexOf(forward.sequence.toUpperCase())
    const reverseComp = reverseComplement(reverse.sequence).toUpperCase()
    const reversePos = cleanTemplate.indexOf(reverseComp)
    
    let message = ""
    let compatible = false
    let productSize = undefined
    
    if (forwardPos === -1 || reversePos === -1) {
      message = "Ein oder beide Primer binden nicht an die Template-Sequenz."
    } else if (reversePos <= forwardPos) {
      message = "Die Primer sind in falscher Orientierung oder überlappen sich."
    } else {
      // Calculate product size
      productSize = reversePos + reverse.sequence.length - forwardPos
      
      if (tmCompatible) {
        compatible = true
        message = `Die Primer bilden ein kompatibles Paar. Produkt: ${productSize} bp.`
      } else {
        message = `Tm-Unterschied (${tmDiff.toFixed(1)}°C) ist zu groß. Idealer Tm-Unterschied: <5°C.`
      }
    }
    
    setPrimerPairAnalysis({
      compatible,
      productSize,
      message
    })
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
          <h1 className="text-2xl font-bold">PCR-Builder</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Primer-Designer</CardTitle>
              <CardDescription>
                Entwerfen und analysieren Sie Primer für Ihre PCR-Experimente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primer-name">Primer-Name</Label>
                  <Input 
                    id="primer-name" 
                    placeholder="z.B. GFP-F1" 
                    value={newPrimerName}
                    onChange={(e) => setNewPrimerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="primer-sequence">Primer-Sequenz (5' → 3')</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="primer-sequence" 
                      placeholder="z.B. ATGGTGAGCAAGGGCGAGGA" 
                      className="font-mono"
                      value={newPrimerSequence}
                      onChange={(e) => setNewPrimerSequence(e.target.value)}
                    />
                    <Button onClick={addPrimer} disabled={!newPrimerSequence.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Hinzufügen
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="forward" 
                    name="direction" 
                    checked={newPrimerDirection === 'forward'} 
                    onChange={() => setNewPrimerDirection('forward')}
                  />
                  <Label htmlFor="forward">Forward</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="reverse" 
                    name="direction" 
                    checked={newPrimerDirection === 'reverse'} 
                    onChange={() => setNewPrimerDirection('reverse')}
                  />
                  <Label htmlFor="reverse">Reverse</Label>
                </div>
                
                {newPrimerSequence && (
                  <div className="ml-auto text-sm text-muted-foreground space-x-4">
                    <span>Tm: {calculateTm(newPrimerSequence)}°C</span>
                    <span>GC: {calculateGCContent(newPrimerSequence)}%</span>
                    <span>Länge: {newPrimerSequence.replace(/[^ATGCRYMKSWHDBVNatgcrymkswhdbvn]/g, '').length} nt</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {primers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Primer-Liste</CardTitle>
                <CardDescription>
                  {primers.length} Primer gespeichert
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {primers.map(primer => (
                    <div key={primer.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{primer.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {primer.direction === 'forward' ? 'Forward' : 'Reverse'}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removePrimer(primer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      
                      <div className="font-mono text-sm mb-2 break-all">{primer.sequence}</div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Thermometer className="h-3 w-3 mr-1" />
                          <span>Tm: {primer.tm}°C</span>
                        </div>
                        <div>GC: {primer.gcContent}%</div>
                        <div>Länge: {primer.length} nt</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>PCR-Analyse</CardTitle>
              <CardDescription>
                Analysieren Sie Primer-Paare und berechnen Sie PCR-Produkte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-sequence">Template-Sequenz (optional)</Label>
                <Textarea 
                  id="template-sequence" 
                  placeholder="Geben Sie die Template-DNA-Sequenz ein, um Binding-Sites und Produktgröße zu analysieren" 
                  className="font-mono h-20"
                  value={templateSequence}
                  onChange={(e) => setTemplateSequence(e.target.value)}
                />
              </div>
              
              <Button onClick={analyzePrimerPair} disabled={primers.length < 2}>
                <Calculator className="h-4 w-4 mr-2" />
                Primer-Paar analysieren
              </Button>
              
              {primerPairAnalysis && (
                <div className={`mt-4 p-3 rounded-md ${primerPairAnalysis.compatible ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                  <p className={`text-sm ${primerPairAnalysis.compatible ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>
                    {primerPairAnalysis.message}
                  </p>
                  
                  {primerPairAnalysis.productSize && (
                    <div className="mt-2 text-sm">
                      <div className="font-medium">Erwartetes PCR-Produkt:</div>
                      <div>Größe: {primerPairAnalysis.productSize} bp</div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Primer-Design-Richtlinien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Optimale Primer-Eigenschaften:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Länge: 18-30 Nukleotide</li>
                  <li>GC-Gehalt: 40-60%</li>
                  <li>Schmelztemperatur (Tm): 55-65°C</li>
                  <li>Tm-Differenz zwischen Primern: &lt;5°C</li>
                  <li>Keine Sekundärstrukturen oder Dimere</li>
                  <li>3'-Ende sollte G oder C enthalten</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Schmelztemperatur (Tm):</h3>
                <p className="text-sm text-muted-foreground">
                  Die Temperatur, bei der 50% der Primer-Template-Hybride dissoziieren. Die Annealing-Temperatur sollte etwa 5°C unter der Tm liegen.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Zu vermeiden:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Wiederholungen von &gt;4 Basen</li>
                  <li>Komplementarität zwischen Primern</li>
                  <li>Starke Sekundärstrukturen</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Anleitung:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Geben Sie die Primer-Sequenz im 5'→3' Format ein</li>
                  <li>Wählen Sie Forward oder Reverse</li>
                  <li>Fügen Sie den Primer zur Liste hinzu</li>
                  <li>Fügen Sie mindestens ein Primer-Paar hinzu</li>
                  <li>Geben Sie optional eine Template-Sequenz ein</li>
                  <li>Klicken Sie auf "Primer-Paar analysieren"</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beispiel-Primer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">GFP Forward</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => {
                    setNewPrimerName("GFP-F")
                    setNewPrimerSequence("ATGGTGAGCAAGGGCGAGGA")
                    setNewPrimerDirection('forward')
                  }}
                >
                  <span className="text-xs font-mono">ATGGTGAGCAAGGGCGAGGA</span>
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">GFP Reverse</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => {
                    setNewPrimerName("GFP-R")
                    setNewPrimerSequence("CTTGTACAGCTCGTCCATGC")
                    setNewPrimerDirection('reverse')
                  }}
                >
                  <span className="text-xs font-mono">CTTGTACAGCTCGTCCATGC</span>
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">GFP Template</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => {
                    setTemplateSequence("ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCACCCAGTCCGCCCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAG")
                  }}
                >
                  <span className="text-xs">GFP-Sequenz (720 bp)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
