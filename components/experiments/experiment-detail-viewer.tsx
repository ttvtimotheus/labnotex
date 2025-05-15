"use client"

import React from "react"
import ReactMarkdown from "react-markdown"

interface ExperimentDetailViewerProps {
  content: string
}

export function ExperimentDetailViewer({ content }: ExperimentDetailViewerProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
