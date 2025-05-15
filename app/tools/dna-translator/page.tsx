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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  CopyIcon, 
  RefreshCcw, 
  Dna, 
  Info 
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Codon tables for translation
const standardGeneticCode: Record<string, string> = {
  "UUU": "F", "UUC": "F", "UUA": "L", "UUG": "L",
  "CUU": "L", "CUC": "L", "CUA": "L", "CUG": "L",
  "AUU": "I", "AUC": "I", "AUA": "I", "AUG": "M",
  "GUU": "V", "GUC": "V", "GUA": "V", "GUG": "V",
  "UCU": "S", "UCC": "S", "UCA": "S", "UCG": "S",
  "CCU": "P", "CCC": "P", "CCA": "P", "CCG": "P",
  "ACU": "T", "ACC": "T", "ACA": "T", "ACG": "T",
  "GCU": "A", "GCC": "A", "GCA": "A", "GCG": "A",
  "UAU": "Y", "UAC": "Y", "UAA": "*", "UAG": "*",
  "CAU": "H", "CAC": "H", "CAA": "Q", "CAG": "Q",
  "AAU": "N", "AAC": "N", "AAA": "K", "AAG": "K",
  "GAU": "D", "GAC": "D", "GAA": "E", "GAG": "E",
  "UGU": "C", "UGC": "C", "UGA": "*", "UGG": "W",
  "CGU": "R", "CGC": "R", "CGA": "R", "CGG": "R",
  "AGU": "S", "AGC": "S", "AGA": "R", "AGG": "R",
  "GGU": "G", "GGC": "G", "GGA": "G", "GGG": "G"
};

// Amino acid properties for coloring
const aminoAcidProperties: Record<string, { type: string, letter: string, fullName: string }> = {
  "A": { type: "hydrophobic", letter: "A", fullName: "Alanin" },
  "C": { type: "special", letter: "C", fullName: "Cystein" },
  "D": { type: "negative", letter: "D", fullName: "Aspartat" },
  "E": { type: "negative", letter: "E", fullName: "Glutamat" },
  "F": { type: "hydrophobic", letter: "F", fullName: "Phenylalanin" },
  "G": { type: "special", letter: "G", fullName: "Glycin" },
  "H": { type: "positive", letter: "H", fullName: "Histidin" },
  "I": { type: "hydrophobic", letter: "I", fullName: "Isoleucin" },
  "K": { type: "positive", letter: "K", fullName: "Lysin" },
  "L": { type: "hydrophobic", letter: "L", fullName: "Leucin" },
  "M": { type: "hydrophobic", letter: "M", fullName: "Methionin" },
  "N": { type: "polar", letter: "N", fullName: "Asparagin" },
  "P": { type: "special", letter: "P", fullName: "Prolin" },
  "Q": { type: "polar", letter: "Q", fullName: "Glutamin" },
  "R": { type: "positive", letter: "R", fullName: "Arginin" },
  "S": { type: "polar", letter: "S", fullName: "Serin" },
  "T": { type: "polar", letter: "T", fullName: "Threonin" },
  "V": { type: "hydrophobic", letter: "V", fullName: "Valin" },
  "W": { type: "hydrophobic", letter: "W", fullName: "Tryptophan" },
  "Y": { type: "polar", letter: "Y", fullName: "Tyrosin" },
  "*": { type: "special", letter: "*", fullName: "Stop-Codon" }
};

export default function DnaTranslatorPage() {
  const [input, setInput] = useState("ATGCCTAAGCTTGCTCAATCAATGGCTAAAGCT")
  const [sequenceType, setSequenceType] = useState("dna")
  const [readingFrame, setReadingFrame] = useState("1")
  const [output, setOutput] = useState("")
  const [codons, setCodons] = useState<string[]>([])

  useEffect(() => {
    translate()
  }, [input, sequenceType, readingFrame])

  const translate = () => {
    if (!input) {
      setOutput("")
      setCodons([])
      return
    }

    // Normalize input: remove whitespaces and convert to uppercase
    let sequence = input.replace(/\s/g, "").toUpperCase()
    
    // Convert DNA to RNA if necessary
    if (sequenceType === "dna") {
      sequence = sequence.replace(/T/g, "U")
    }

    // Get reading frame (0-based internally)
    const frameOffset = parseInt(readingFrame) - 1
    
    // Start from the selected reading frame
    sequence = sequence.slice(frameOffset)
    
    // Process codons
    const codonsArray: string[] = []
    let translation = ""
    
    for (let i = 0; i < sequence.length; i += 3) {
      const codon = sequence.slice(i, i + 3)
      
      // Only process complete codons
      if (codon.length === 3) {
        codonsArray.push(codon)
        const aminoAcid = standardGeneticCode[codon] || "?"
        translation += aminoAcid
      }
    }
    
    setOutput(translation)
    setCodons(codonsArray)
  }

  const handleCopySequence = () => {
    navigator.clipboard.writeText(output)
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setCodons([])
  }

  const getAminoAcidClass = (aa: string) => {
    const property = aminoAcidProperties[aa]?.type || "special"
    return `aa-${property}`
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
          <h1 className="text-2xl font-bold">DNA/RNA → Aminosäure-Translator</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sequenz-Eingabe</CardTitle>
              <CardDescription>
                Geben Sie eine DNA- oder RNA-Sequenz ein, um sie in Aminosäuren zu übersetzen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-row space-x-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="sequence-type">Sequenztyp</Label>
                      <Select
                        value={sequenceType}
                        onValueChange={setSequenceType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sequenztyp wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dna">DNA (A, T, G, C)</SelectItem>
                          <SelectItem value="rna">RNA (A, U, G, C)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="reading-frame">Leserahmen</Label>
                      <Select
                        value={readingFrame}
                        onValueChange={setReadingFrame}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Leserahmen wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Leserahmen 1</SelectItem>
                          <SelectItem value="2">Leserahmen 2</SelectItem>
                          <SelectItem value="3">Leserahmen 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    id="sequence-input"
                    placeholder={sequenceType === "dna" ? "ATGCCTAA..." : "AUGCCUAA..."}
                    rows={5}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="font-mono"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleClear}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Zurücksetzen
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ergebnis der Translation</CardTitle>
              <CardDescription>
                Codons und resultierende Aminosäuren mit Farbcodierung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="visualization">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="visualization">Visualisierung</TabsTrigger>
                  <TabsTrigger value="plain">Nur Text</TabsTrigger>
                </TabsList>
                <TabsContent value="visualization" className="pt-4">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-4 text-sm text-muted-foreground">
                      <div className="mb-2 font-medium">Codons:</div>
                      <div className="dna-sequence flex flex-wrap gap-1">
                        {codons.map((codon, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                          >
                            {codon}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div className="mb-2 font-medium">Aminosäuren:</div>
                      <div className="flex flex-wrap gap-1">
                        {output.split("").map((aa, index) => (
                          <span
                            key={index}
                            className={`amino-acid inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getAminoAcidClass(aa)}`}
                            title={aminoAcidProperties[aa]?.fullName || aa}
                          >
                            {aa}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="plain" className="pt-4">
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <div className="mb-1 text-sm font-medium">Aminosäuresequenz:</div>
                      <div className="font-mono text-sm select-all break-all">{output}</div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={handleCopySequence}>
                        <CopyIcon className="mr-2 h-3 w-3" />
                        Kopieren
                      </Button>
                    </div>
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
                Informationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Aminosäuren-Farbkodierung</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-yellow-100 dark:bg-yellow-900 mr-2"></div>
                    <span>Hydrophob</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-blue-100 dark:bg-blue-900 mr-2"></div>
                    <span>Polar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900 mr-2"></div>
                    <span>Positiv geladen</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900 mr-2"></div>
                    <span>Negativ geladen</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-700 mr-2"></div>
                    <span>Speziell</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Aminosäuren (Ein-Buchstaben-Code)</h3>
                <div className="text-xs grid grid-cols-2 gap-x-2 gap-y-1">
                  {Object.keys(aminoAcidProperties).map((key) => (
                    key !== "*" ? (
                      <div key={key} className="flex items-center">
                        <span className="font-semibold mr-1">{key}:</span>
                        <span>{aminoAcidProperties[key].fullName}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Anleitung</h3>
                <ol className="text-xs space-y-1 list-decimal list-inside">
                  <li>Wählen Sie den Sequenztyp (DNA oder RNA)</li>
                  <li>Wählen Sie den Leserahmen (1, 2 oder 3)</li>
                  <li>Geben Sie Ihre Nukleotidsequenz ein</li>
                  <li>Die Translation erfolgt automatisch</li>
                  <li>Wechseln Sie zwischen Visualisierung und Textansicht</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dna className="mr-2 h-4 w-4" />
                Beispielsequenzen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">GFP (Grün fluoreszierendes Protein)</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => setInput("ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGA")}
                >
                  <span className="text-xs truncate">ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGA...</span>
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Insulin (Mensch)</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-2 px-3" 
                  onClick={() => setInput("ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGT")}
                >
                  <span className="text-xs truncate">ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGG...</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
