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
import {
  CalendarIcon,
  Plus,
  ClipboardList,
  Star,
  Download,
  FileText,
  TableProperties,
  UserCircle,
  Filter
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Helper to format dates in German format
const formatDate = (date: Date) => {
  return format(date, "dd.MM.yyyy", { locale: de })
}

// Mock data for training entries
const trainingEntries = [
  {
    id: "1",
    date: new Date(2025, 4, 15), // May 15, 2025
    title: "Mikroskopietechniken",
    description: "Durchführung von Licht- und Fluoreszenzmikroskopie, Probenaufbereitung und Bildanalyse.",
    type: "practical",
    status: "completed",
    duration: 6,
    rating: 2, // On a scale of 1-3, where 3 is best
    examRelevant: true,
    supervisors: ["Dr. Schmidt"]
  },
  {
    id: "2",
    date: new Date(2025, 4, 14), // May 14, 2025
    title: "Spektralphotometrie",
    description: "Konzentrationsbestimmung mittels UV/Vis-Spektroskopie, Erstellung von Standardkurven.",
    type: "practical",
    status: "evaluated",
    duration: 4,
    rating: 3,
    examRelevant: true,
    supervisors: ["Dr. Schmidt", "Dr. Meyer"]
  },
  {
    id: "3",
    date: new Date(2025, 4, 13), // May 13, 2025
    title: "Laborgeräte und Sicherheit",
    description: "Einweisung in grundlegende Laborgeräte und Sicherheitsvorschriften im Labor.",
    type: "theory",
    status: "completed",
    duration: 2,
    rating: 2,
    examRelevant: false,
    supervisors: ["Dr. Meyer"]
  },
  {
    id: "4",
    date: new Date(2025, 4, 10), // May 10, 2025
    title: "Pipettiertechniken",
    description: "Korrekte Handhabung verschiedener Pipettentypen, Genauigkeitsbestimmung.",
    type: "practical",
    status: "draft",
    duration: 3,
    rating: null,
    examRelevant: false,
    supervisors: ["Dr. Schmidt"]
  },
  {
    id: "5",
    date: new Date(2025, 4, 8), // May 8, 2025
    title: "Zellkulturtechniken",
    description: "Steriles Arbeiten, Subkultivierung von Säugerzellen, Vitalitätsbestimmung.",
    type: "practical",
    status: "evaluated",
    duration: 8,
    rating: 3,
    examRelevant: true,
    supervisors: ["Dr. Becker"]
  },
  {
    id: "6",
    date: new Date(2025, 4, 6), // May 6, 2025
    title: "Proteinanalytik",
    description: "Proteinextraktion, SDS-PAGE und Western Blot.",
    type: "practical",
    status: "evaluated",
    duration: 6,
    rating: 2,
    examRelevant: true,
    supervisors: ["Dr. Becker", "Dr. Schmidt"]
  }
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    evaluated: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }
  
  const statusText = {
    draft: "Entwurf",
    completed: "Abgeschlossen",
    evaluated: "Bewertet"
  }
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {statusText[status as keyof typeof statusText]}
    </span>
  )
}

// Rating component with stars
const Rating = ({ value }: { value: number | null }) => {
  if (value === null) return <span className="text-muted-foreground">Keine Bewertung</span>
  
  return (
    <div className="flex">
      {[...Array(3)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < value ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
        />
      ))}
    </div>
  )
}

export default function TrainingPage() {
  const [currentView, setCurrentView] = useState("list")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter entries based on selected filters
  const filteredEntries = trainingEntries.filter(entry => {
    // Status filter
    if (statusFilter !== "all" && entry.status !== statusFilter) return false
    
    // Type filter
    if (typeFilter !== "all" && entry.type !== typeFilter) return false
    
    // Search query
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => b.date.getTime() - a.date.getTime())
  
  // Group entries by week for weekly view
  const groupedByWeek = sortedEntries.reduce((acc, entry) => {
    // Get week number (simple implementation, could be improved)
    const weekNumber = Math.floor(entry.date.getDate() / 7) + 1
    const weekLabel = `Woche ${weekNumber}, ${format(entry.date, "MMMM yyyy", { locale: de })}`
    
    if (!acc[weekLabel]) {
      acc[weekLabel] = []
    }
    
    acc[weekLabel].push(entry)
    return acc
  }, {} as Record<string, typeof trainingEntries>)
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ausbildungsnachweise</h2>
            <p className="text-muted-foreground">
              Dokumentation und Bewertung von Ausbildungsinhalten
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/training/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neuer Eintrag
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export als PDF
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0 mb-6">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Suche</Label>
          <Input
            id="search"
            placeholder="Nach Titel oder Beschreibung suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 md:flex">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="draft">Entwurf</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="evaluated">Bewertet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Typ</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="practical">Praktisch</SelectItem>
                <SelectItem value="theory">Theorie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="list" value={currentView} onValueChange={setCurrentView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">
            <ClipboardList className="mr-2 h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Wochenübersicht
          </TabsTrigger>
          <TabsTrigger value="summary">
            <TableProperties className="mr-2 h-4 w-4" />
            Zusammenfassung
          </TabsTrigger>
        </TabsList>
        
        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {sortedEntries.length > 0 ? (
            sortedEntries.map(entry => (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      <Link href={`/training/${entry.id}`} className="hover:underline hover:text-primary transition-colors">
                        {entry.title}
                      </Link>
                    </CardTitle>
                    <StatusBadge status={entry.status} />
                  </div>
                  <CardDescription>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formatDate(entry.date)}</span>
                      {entry.examRelevant && (
                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                          Prüfungsrelevant
                        </span>
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Typ: </span>
                        <span>{entry.type === "practical" ? "Praktisch" : "Theorie"}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Dauer: </span>
                        <span>{entry.duration} Stunden</span>
                      </div>
                    </div>
                    <Rating value={entry.rating} />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    <UserCircle className="h-3 w-3 inline mr-1" />
                    Betreuer: {entry.supervisors.join(", ")}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Keine Einträge gefunden. Passen Sie Ihre Filtereinstellungen an oder erstellen Sie einen neuen Eintrag.
            </div>
          )}
        </TabsContent>
        
        {/* Weekly View */}
        <TabsContent value="weekly" className="space-y-6">
          {Object.keys(groupedByWeek).length > 0 ? (
            Object.entries(groupedByWeek).map(([weekLabel, entries]) => (
              <div key={weekLabel} className="space-y-4">
                <h3 className="font-medium text-lg flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {weekLabel}
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {entries.map(entry => (
                    <Card key={entry.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{entry.title}</CardTitle>
                            <CardDescription>{formatDate(entry.date)}</CardDescription>
                          </div>
                          <StatusBadge status={entry.status} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 text-sm">
                          <span className="font-medium">Dauer: </span>
                          <span>{entry.duration} Stunden</span>
                          {entry.examRelevant && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                              Prüfungsrelevant
                            </span>
                          )}
                        </div>
                        {entry.rating !== null && (
                          <div className="mb-2">
                            <Rating value={entry.rating} />
                          </div>
                        )}
                        <Link href={`/training/${entry.id}`}>
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                            Details anzeigen
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Keine Einträge gefunden. Passen Sie Ihre Filtereinstellungen an oder erstellen Sie einen neuen Eintrag.
            </div>
          )}
        </TabsContent>
        
        {/* Summary View */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zusammenfassung der Ausbildung</CardTitle>
              <CardDescription>
                Überblick über alle dokumentierten Ausbildungsinhalte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-md p-4 text-center">
                    <div className="text-2xl font-bold">{trainingEntries.length}</div>
                    <div className="text-sm text-muted-foreground">Gesamte Einträge</div>
                  </div>
                  <div className="bg-muted rounded-md p-4 text-center">
                    <div className="text-2xl font-bold">
                      {trainingEntries.reduce((sum, entry) => sum + entry.duration, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Gesamte Stunden</div>
                  </div>
                  <div className="bg-muted rounded-md p-4 text-center">
                    <div className="text-2xl font-bold">
                      {trainingEntries.filter(e => e.examRelevant).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Prüfungsrelevant</div>
                  </div>
                  <div className="bg-muted rounded-md p-4 text-center">
                    <div className="text-2xl font-bold">
                      {trainingEntries.filter(e => e.status === "evaluated").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Bewertet</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Verteilung nach Kategorien</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="text-sm font-medium min-w-24">Praktisch</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ 
                            width: `${(trainingEntries.filter(e => e.type === "practical").length / trainingEntries.length) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-sm ml-2">
                        {trainingEntries.filter(e => e.type === "practical").length}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm font-medium min-w-24">Theorie</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ 
                            width: `${(trainingEntries.filter(e => e.type === "theory").length / trainingEntries.length) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-sm ml-2">
                        {trainingEntries.filter(e => e.type === "theory").length}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="font-medium p-4 border-b">
                    Betreuer
                  </div>
                  <div className="p-4 space-y-2">
                    {Array.from(new Set(trainingEntries.flatMap(e => e.supervisors))).map(supervisor => (
                      <div key={supervisor} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UserCircle className="h-4 w-4 mr-2" />
                          <span>{supervisor}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trainingEntries.filter(e => e.supervisors.includes(supervisor)).length} Einträge
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Vollständigen Bericht herunterladen
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
