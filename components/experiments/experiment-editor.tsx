"use client"

import React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExperimentDetailViewer } from "./experiment-detail-viewer"

interface ExperimentEditorProps {
  value: string
  onChange: (value: string) => void
}

export function ExperimentEditor({ value, onChange }: ExperimentEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Schreiben</TabsTrigger>
        <TabsTrigger value="preview">Vorschau</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[500px] font-mono text-sm"
          placeholder="Markdown-Inhalt hier eingeben..."
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-4 border rounded-md p-4 min-h-[500px] bg-background">
        <ExperimentDetailViewer content={value} />
      </TabsContent>
    </Tabs>
  )
}
