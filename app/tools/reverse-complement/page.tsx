"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Info, RotateCcw, Copy, CheckCircle2 } from "lucide-react"

export default function ReverseComplementPage() {
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const [includeSpaces, setIncludeSpaces] = useState<boolean>(true)
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true)

  // Funktion zum Generieren des Reverse Complement
  const generateReverseComplement = (sequence: string): string => {
    // Entferne Leerzeichen und Zeilennummern, wenn nicht gewünscht
    let cleanSequence = sequence;
    
    if (!includeSpaces) {
      cleanSequence = cleanSequence.replace(/\s+/g, '');
    }
    
    if (!includeNumbers) {
      cleanSequence = cleanSequence.replace(/\d+/g, '');
    }
    
    const complementMap: Record<string, string> = {
      'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
      'a': 't', 't': 'a', 'g': 'c', 'c': 'g',
      'U': 'A', 'u': 'a', // Für RNA
      'N': 'N', 'n': 'n',
      'R': 'Y', 'r': 'y', // R = A oder G; Y = C oder T
      'Y': 'R', 'y': 'r',
      'K': 'M', 'k': 'm', // K = G oder T; M = A oder C
      'M': 'K', 'm': 'k',
      'S': 'S', 's': 's', // S = G oder C; bleibt gleich
      'W': 'W', 'w': 'w', // W = A oder T; bleibt gleich
      'B': 'V', 'b': 'v', // B = nicht A; V = nicht T
      'V': 'B', 'v': 'b',
      'D': 'H', 'd': 'h', // D = nicht C; H = nicht G
      'H': 'D', 'h': 'd',
      '-': '-',            // Gaps bleiben erhalten
      ' ': ' '             // Leerzeichen bleiben erhalten
    };
    
    return cleanSequence
      .split('')
      .map(base => complementMap[base] || base) // Ersetze durch Komplement oder behalte bei, wenn nicht im Map
      .reverse()
      .join('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateReverseComplement(input);
    setOutput(result);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <h1 className="text-2xl font-bold">Reverse Complement Generator</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Erstellen Sie revers-komplementäre DNA- oder RNA-Sequenzen für Primer-Design und molekularbiologische Anwendungen
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sequenz-Umwandlung</CardTitle>
              <CardDescription>
                Geben Sie eine DNA- oder RNA-Sequenz ein, um den Reverse Complement zu generieren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input">Eingabesequenz</Label>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Geben Sie Ihre DNA- oder RNA-Sequenz ein..."
                    className="font-mono h-32"
                  />
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeSpaces}
                        onChange={() => setIncludeSpaces(!includeSpaces)}
                        className="w-4 h-4"
                      />
                      <span>Leerzeichen behalten</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeNumbers}
                        onChange={() => setIncludeNumbers(!includeNumbers)}
                        className="w-4 h-4"
                      />
                      <span>Nummern behalten</span>
                    </label>
                  </div>
                </div>
                <Button type="submit">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reverse Complement generieren
                </Button>
              </form>

              {output && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Ergebnis:</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                          Kopiert
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Kopieren
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="p-4 border rounded-md bg-muted font-mono whitespace-pre-wrap overflow-x-auto">
                    {output}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Länge: {output.length} Basen
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beispiele</CardTitle>
              <CardDescription>
                Klicken Sie auf ein Beispiel, um es in das Eingabefeld zu laden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start font-mono text-left h-auto py-2"
                    onClick={() => setInput("ATGCTAGCTAGCTAGC")}
                  >
                    <div>
                      <div className="font-medium">Kurze DNA-Sequenz</div>
                      <div className="text-xs text-muted-foreground truncate w-full">
                        ATGCTAGCTAGCTAGC
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start font-mono text-left h-auto py-2"
                    onClick={() => setInput("AUGCUAGCUAGCUAGC")}
                  >
                    <div>
                      <div className="font-medium">Kurze RNA-Sequenz</div>
                      <div className="text-xs text-muted-foreground truncate w-full">
                        AUGCUAGCUAGCUAGC
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start font-mono text-left h-auto py-2"
                    onClick={() => setInput("NNACTGCTGNNN")}
                  >
                    <div>
                      <div className="font-medium">Sequenz mit N's</div>
                      <div className="text-xs text-muted-foreground truncate w-full">
                        NNACTGCTGNNN
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start font-mono text-left h-auto py-2"
                    onClick={() => setInput("5'-ATGC TAGC TAGC-3'")}
                  >
                    <div>
                      <div className="font-medium">Formatierte Sequenz</div>
                      <div className="text-xs text-muted-foreground truncate w-full">
                        5'-ATGC TAGC TAGC-3'
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Hilfe & Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Was ist ein reverse Complement?</h3>
                <p className="text-sm text-muted-foreground">
                  Der reverse Complement einer DNA-Sequenz wird durch Umkehrung der Sequenz und Ersetzung jeder Base durch ihre komplementäre Base erzeugt:
                </p>
                <div className="text-sm text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>A ↔ T</li>
                    <li>G ↔ C</li>
                    <li>Für RNA: U ↔ A</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Verwendung:</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Design von Primern für PCR</li>
                  <li>Analyse von DNA-Bindungsstellen</li>
                  <li>Identifizierung von Palindromen</li>
                  <li>Simulation von DNA-Replikation</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">IUPAC-Codes:</h3>
                <p className="text-sm text-muted-foreground">
                  Dieses Tool unterstützt erweiterte IUPAC-Nukleotidcodes:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>R = A/G</div>
                  <div>Y = C/T</div>
                  <div>K = G/T</div>
                  <div>M = A/C</div>
                  <div>S = G/C</div>
                  <div>W = A/T</div>
                  <div>B = C/G/T</div>
                  <div>D = A/G/T</div>
                  <div>H = A/C/T</div>
                  <div>V = A/C/G</div>
                  <div>N = A/C/G/T</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Primer-Design-Tipps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Optimale PCR-Primer:</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>18-30 Basen Länge</li>
                  <li>GC-Gehalt: 40-60%</li>
                  <li>Tm: 55-65°C</li>
                  <li>Vermeiden Sie Sekundärstrukturen</li>
                  <li>Enden idealerweise mit G oder C</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
