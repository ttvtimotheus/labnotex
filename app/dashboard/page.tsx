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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Clock, 
  FilePlus, 
  Search, 
  Star, 
  TagIcon, 
  Calendar 
} from "lucide-react"

export default function Dashboard() {
  const recentExperiments = [
    { id: 1, title: "PCR Amplifikation GPCR Gene", date: "15.05.2025", tags: ["PCR", "Genetik"] },
    { id: 2, title: "Protein Expression nach Hitzeeinwirkung", date: "14.05.2025", tags: ["Protein", "Stress"] },
    { id: 3, title: "ELISA Antikörper Test", date: "12.05.2025", tags: ["Immunologie", "ELISA"] },
    { id: 4, title: "DNA Extraktion aus Blutproben", date: "10.05.2025", tags: ["DNA", "Extraktion"] },
  ]

  const favoriteExperiments = [
    { id: 5, title: "Western Blot Protokoll", date: "05.05.2025", tags: ["Western Blot", "Protein"] },
    { id: 6, title: "Klonierungsprotokoll E. coli", date: "28.04.2025", tags: ["Klonierung", "E. coli"] },
  ]

  const trainingEntries = [
    { id: 1, title: "Mikroskopietechniken", date: "15.05.2025", status: "Bewertet" },
    { id: 2, title: "Spektralphotometrie", date: "14.05.2025", status: "Offen" },
  ]

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Willkommen im elektronischen Laborbuch LabnoteX
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/experiments/new">
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Neues Experiment
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Experimente
            </CardTitle>
            <FilePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Insgesamt dokumentiert
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tags
            </CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Organisierte Kategorien
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ausbildungseinträge
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Woche vom 13.05. - 19.05.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tool-Nutzung</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Bio-Tools verwendet
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">
            <Clock className="mr-2 h-4 w-4" />
            Kürzlich bearbeitet
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="mr-2 h-4 w-4" />
            Favoriten
          </TabsTrigger>
          <TabsTrigger value="training">
            <Calendar className="mr-2 h-4 w-4" />
            Ausbildung
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentExperiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link href={`/experiments/${experiment.id}`} className="hover:underline">
                      {experiment.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{experiment.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {experiment.tags.map((tag, i) => (
                      <div key={i} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoriteExperiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link href={`/experiments/${experiment.id}`} className="hover:underline">
                      {experiment.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{experiment.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {experiment.tags.map((tag, i) => (
                      <div key={i} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainingEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link href={`/training/${entry.id}`} className="hover:underline">
                      {entry.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{entry.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      entry.status === "Bewertet" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {entry.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
