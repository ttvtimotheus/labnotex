"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { ExperimentEditor } from "@/components/experiments/experiment-editor"

export default function NewExperimentPage() {
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [markdownContent, setMarkdownContent] = useState(`# Experiment Titel

## Zielsetzung

Beschreiben Sie hier das Ziel des Experiments.

## Material und Methoden

### Verwendete Reagenzien

- Reagenz 1
- Reagenz 2
- Reagenz 3

### Geräte

- Gerät 1
- Gerät 2

### Durchführung

Beschreiben Sie hier die Durchführung des Experiments.

## Ergebnisse

Beschreiben Sie hier die Ergebnisse des Experiments.

## Diskussion

Diskutieren Sie hier die Ergebnisse des Experiments.

## Schlussfolgerung

Zusammenfassung und Schlussfolgerungen des Experiments.

## Referenzen

- Referenz 1
- Referenz 2
`)

  const handleSave = () => {
    // In a real application, this would save the experiment to a database
    console.log("Saving experiment:", { title, tags, markdownContent })
    // Redirect to experiments list
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/experiments">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Neues Experiment</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                placeholder="Experiment Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (durch Komma getrennt)</Label>
              <Input
                id="tags"
                placeholder="z.B. PCR, DNA, Extraktion"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border bg-card p-6">
            <Label>Experiment Inhalt</Label>
            <ExperimentEditor 
              value={markdownContent} 
              onChange={setMarkdownContent} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-4">Anhänge</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fügen Sie Bilder, Dokumente oder Dateien hinzu, um Ihr Experiment zu dokumentieren.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Datei hochladen
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-4">Tipps zum Erstellen</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Verwenden Sie klare, beschreibende Titel</p>
              <p>• Dokumentieren Sie Material und Methoden detailliert</p>
              <p>• Fügen Sie Bilder und Diagramme hinzu, um Ihre Ergebnisse zu veranschaulichen</p>
              <p>• Verwenden Sie Tags, um Ihre Experimente zu kategorisieren</p>
              <p>• Diskutieren Sie unerwartete Ergebnisse oder Fehlerquellen</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-4">Markdown Formatierungshilfe</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <code># Überschrift 1</code></p>
              <p>• <code>## Überschrift 2</code></p>
              <p>• <code>**Fett**</code></p>
              <p>• <code>*Kursiv*</code></p>
              <p>• <code>- Aufzählungspunkt</code></p>
              <p>• <code>1. Nummerierte Liste</code></p>
              <p>• <code>[Link](https://example.com)</code></p>
              <p>• <code>![Bild](pfad/zum/bild.jpg)</code></p>
              <p>• <code>```code```</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
