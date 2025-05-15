"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Info } from "lucide-react"

// Dieses Template dient als Grundlage für neue Tool-Implementierungen
// Bitte kopieren und anpassen für neue Tools

export default function ToolTemplate() {
  const [input, setInput] = useState<string>("")
  const [result, setResult] = useState<string>("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Hier kommt die Tool-spezifische Logik
    setResult(`Verarbeite Eingabe: ${input}`)
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
          <h1 className="text-2xl font-bold">Tool-Name</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Kurze Beschreibung des Tools und seines Verwendungszwecks
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hauptfunktion</CardTitle>
              <CardDescription>
                Beschreibung der Hauptfunktion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input">Eingabe</Label>
                  <Input
                    id="input"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Geben Sie Ihre Daten hier ein..."
                  />
                </div>
                <Button type="submit">Berechnen</Button>
              </form>

              {result && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                  <h3 className="text-sm font-medium mb-2">Ergebnis:</h3>
                  <div className="text-sm">
                    {result}
                  </div>
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
                Hilfe & Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Anleitung:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Geben Sie Ihre Daten ein</li>
                  <li>Klicken Sie auf "Berechnen"</li>
                  <li>Das Ergebnis wird angezeigt</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hintergrund:</h3>
                <p className="text-sm text-muted-foreground">
                  Kurze Erklärung der wissenschaftlichen Grundlagen und Methoden dieses Tools.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Referenzen:</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Referenz 1</li>
                  <li>Referenz 2</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
