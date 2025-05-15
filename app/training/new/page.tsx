"use client"

import { useState } from "react"
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
  Save,
  Calendar,
  Clock, 
  CheckSquare,
  UserCircle,
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewTrainingEntryPage() {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("4")
  const [type, setType] = useState("practical")
  const [supervisors, setSupervisors] = useState(["Dr. Schmidt"])
  const [examRelevant, setExamRelevant] = useState(false)
  
  const handleSave = () => {
    // In a real application, this would save the training entry to a database
    console.log("Saving training entry:", {
      title,
      date,
      description,
      duration: parseInt(duration),
      type,
      supervisors,
      examRelevant,
      status: "draft"
    })
    // Redirect to training list
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/training">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Neuer Ausbildungseintrag</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !date || !description.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Grundinformationen</CardTitle>
              <CardDescription>
                Geben Sie die grundlegenden Informationen über den Ausbildungseintrag ein
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="z.B. Mikroskopietechniken"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Datum *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Dauer (Stunden) *
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dauer wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {hours} {hours === 1 ? "Stunde" : "Stunden"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Typ *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Typ wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practical">Praktisch</SelectItem>
                    <SelectItem value="theory">Theorie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung *</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreiben Sie die durchgeführten Tätigkeiten und Lerninhalte"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Details zur Ausbildung</CardTitle>
              <CardDescription>
                Zusätzliche Informationen zur Dokumentation und Bewertung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supervisors" className="flex items-center">
                  <UserCircle className="h-4 w-4 mr-1" />
                  Betreuende Person(en)
                </Label>
                <Select defaultValue={supervisors[0]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Betreuer wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Schmidt">Dr. Schmidt</SelectItem>
                    <SelectItem value="Dr. Meyer">Dr. Meyer</SelectItem>
                    <SelectItem value="Dr. Becker">Dr. Becker</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  In einer zukünftigen Version wird die Auswahl mehrerer Betreuer möglich sein.
                </p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="examRelevant" 
                  checked={examRelevant} 
                  onCheckedChange={(checked) => setExamRelevant(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="examRelevant"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Prüfungsrelevant
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Markieren Sie diesen Eintrag als relevant für die Abschlussprüfung
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hinweise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Ausbildungsnachweis</h3>
                <p className="text-sm text-muted-foreground">
                  Der Ausbildungsnachweis dient zur Dokumentation aller Ausbildungsinhalte und wird für die Zulassung zur Abschlussprüfung benötigt.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Bewertung</h3>
                <p className="text-sm text-muted-foreground">
                  Die Bewertung kann nur von berechtigten Ausbildern vorgenommen werden und erfolgt nach dem Speichern des Eintrags.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Verpflichtende Felder</h3>
                <p className="text-sm text-muted-foreground">
                  Bitte füllen Sie alle mit * gekennzeichneten Felder aus.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Verknüpfte Experimente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sie können Experimente mit diesem Ausbildungseintrag verknüpfen, um eine bessere Dokumentation zu gewährleisten.
              </p>
              <Button variant="outline" className="w-full">
                Experiment verknüpfen
              </Button>
              <p className="text-xs text-muted-foreground">
                Die Verknüpfung von Experimenten ist in einer zukünftigen Version verfügbar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
