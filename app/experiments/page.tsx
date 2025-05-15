import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  FilePlus,
  Search,
  Filter,
  Calendar,
  Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function ExperimentsPage() {
  // Mock data for experiments
  const experiments = [
    { 
      id: 1, 
      title: "PCR Amplifikation GPCR Gene", 
      date: "15.05.2025", 
      tags: ["PCR", "Genetik"],
      description: "Amplifikation des GPCR-Gens aus Mausgewebe für Klonierung in Expressionsvektor."
    },
    { 
      id: 2, 
      title: "Protein Expression nach Hitzeeinwirkung", 
      date: "14.05.2025", 
      tags: ["Protein", "Stress"],
      description: "Untersuchung der Expressionsmuster von Hitzeschockproteinen in HeLa-Zellen nach Behandlung bei 42°C."
    },
    { 
      id: 3, 
      title: "ELISA Antikörper Test", 
      date: "12.05.2025", 
      tags: ["Immunologie", "ELISA"],
      description: "Quantitative Bestimmung von IL-6 in Serumproben von Patienten mit chronischer Entzündung."
    },
    { 
      id: 4, 
      title: "DNA Extraktion aus Blutproben", 
      date: "10.05.2025", 
      tags: ["DNA", "Extraktion"],
      description: "Optimierung des Protokolls zur DNA-Extraktion aus kleinen Blutmengen für PCR-basierte Diagnostik."
    },
    { 
      id: 5, 
      title: "Western Blot Protokoll", 
      date: "05.05.2025", 
      tags: ["Western Blot", "Protein"],
      description: "Standardisiertes Protokoll für Western Blot zur Detektion von phosphorylierten Proteinen aus Zellysaten."
    },
    { 
      id: 6, 
      title: "Klonierungsprotokoll E. coli", 
      date: "28.04.2025", 
      tags: ["Klonierung", "E. coli"],
      description: "Optimiertes Protokoll zur Klonierung von DNA-Fragmenten in pET28a-Vektor und Transformation in E. coli BL21."
    },
    { 
      id: 7, 
      title: "Zellkultur HEK293", 
      date: "25.04.2025", 
      tags: ["Zellkultur", "HEK293"],
      description: "Etablierung von HEK293-Zellen für transiente Transfektionen mit verschiedenen Expressionskonstrukten."
    },
    { 
      id: 8, 
      title: "RNA-Extraktion aus Gewebe", 
      date: "20.04.2025", 
      tags: ["RNA", "Extraktion"],
      description: "Protokoll zur RNA-Isolierung aus Lebergewebe mit verbesserter Ausbeute und Reinheit für RNA-Seq."
    },
  ]

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Experimente</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Laborexperimente und Protokolle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/experiments/new">
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Neues Experiment
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium" htmlFor="search">
            Suche
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nach Titel oder Inhalt suchen..."
              className="pl-8"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:flex">
          <div className="space-y-2">
            <label className="text-sm font-medium">Zeitraum</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Zeitraum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="today">Heute</SelectItem>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Dieser Monat</SelectItem>
                <SelectItem value="year">Dieses Jahr</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="pcr">PCR</SelectItem>
                <SelectItem value="protein">Protein</SelectItem>
                <SelectItem value="dna">DNA</SelectItem>
                <SelectItem value="rna">RNA</SelectItem>
                <SelectItem value="klonierung">Klonierung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment) => (
          <Card key={experiment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <Link 
                  href={`/experiments/${experiment.id}`} 
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {experiment.title}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {experiment.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {experiment.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {experiment.tags.map((tag, i) => (
                  <div 
                    key={i} 
                    className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
