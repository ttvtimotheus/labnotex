"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Pencil, 
  Eraser, 
  Microscope, 
  Info,
  RefreshCcw,
  Layers,
  Image as ImageIcon,
  Plus
} from "lucide-react"

type Annotation = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
}

type ImageData = {
  id: string;
  name: string;
  url: string;
  type: string;
  date: string;
  annotations: Annotation[];
}

export default function MicroscopyToolPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [drawingColor, setDrawingColor] = useState<string>("#ff0000")
  const [drawingSize, setDrawingSize] = useState<number>(3)
  const [newAnnotation, setNewAnnotation] = useState<{text: string, color: string}>({
    text: "",
    color: "#ff0000"
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Load example images on first render
  useEffect(() => {
    const exampleImages: ImageData[] = [
      {
        id: "img1",
        name: "HeLa Zellen (40x)",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/HeLa_cells_stained_with_Hoechst_33258.jpg/1024px-HeLa_cells_stained_with_Hoechst_33258.jpg",
        type: "Fluoreszenz",
        date: "2025-05-15",
        annotations: []
      },
      {
        id: "img2",
        name: "Gram-Färbung Bakterien",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Gram_Stain_Anthrax.jpg/1024px-Gram_Stain_Anthrax.jpg",
        type: "Lichtmikroskopie",
        date: "2025-05-14",
        annotations: []
      }
    ]
    
    setImages(exampleImages)
    if (exampleImages.length > 0) {
      setCurrentImage(exampleImages[0])
    }
  }, [])
  
  // Draw annotations whenever current image or zoom changes
  useEffect(() => {
    if (!currentImage || !canvasRef.current || !imageRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw annotations
    currentImage.annotations.forEach(annotation => {
      // Draw circle
      ctx.beginPath()
      ctx.arc(annotation.x * zoom, annotation.y * zoom, annotation.size * zoom, 0, 2 * Math.PI)
      ctx.fillStyle = annotation.color
      ctx.fill()
      
      // Draw text
      ctx.font = `${12 * zoom}px Arial`
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2 * zoom
      ctx.strokeText(annotation.text, (annotation.x + 10) * zoom, (annotation.y + 5) * zoom)
      ctx.fillText(annotation.text, (annotation.x + 10) * zoom, (annotation.y + 5) * zoom)
    })
  }, [currentImage, zoom])
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    const reader = new FileReader()
    
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') return
      
      const newImage: ImageData = {
        id: `img-${Date.now()}`,
        name: file.name,
        url: event.target.result,
        type: "Custom",
        date: new Date().toISOString().split('T')[0],
        annotations: []
      }
      
      setImages([...images, newImage])
      setCurrentImage(newImage)
    }
    
    reader.readAsDataURL(file)
  }
  
  // Handle canvas click to add annotation
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !currentImage) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom
    
    // Create temporary annotation for positioning
    const tempAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      x,
      y,
      text: newAnnotation.text || "Annotation",
      color: newAnnotation.color,
      size: drawingSize
    }
    
    // Update current image with new annotation
    const updatedImage = {
      ...currentImage,
      annotations: [...currentImage.annotations, tempAnnotation]
    }
    
    // Update state
    setCurrentImage(updatedImage)
    setImages(images.map(img => img.id === currentImage.id ? updatedImage : img))
    
    // Reset annotation text
    setNewAnnotation({...newAnnotation, text: ""})
  }
  
  // Zoom in
  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 3))
  }
  
  // Zoom out
  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5))
  }
  
  // Reset zoom
  const resetZoom = () => {
    setZoom(1)
  }
  
  // Delete last annotation
  const deleteLastAnnotation = () => {
    if (!currentImage || currentImage.annotations.length === 0) return
    
    const updatedAnnotations = [...currentImage.annotations]
    updatedAnnotations.pop()
    
    const updatedImage = {
      ...currentImage,
      annotations: updatedAnnotations
    }
    
    setCurrentImage(updatedImage)
    setImages(images.map(img => img.id === currentImage.id ? updatedImage : img))
  }
  
  // Download annotated image
  const downloadImage = () => {
    if (!currentImage || !canvasRef.current || !imageRef.current) return
    
    // Create a new canvas for combined image and annotations
    const combinedCanvas = document.createElement('canvas')
    const ctx = combinedCanvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size to match image
    combinedCanvas.width = imageRef.current.naturalWidth
    combinedCanvas.height = imageRef.current.naturalHeight
    
    // Draw image
    ctx.drawImage(imageRef.current, 0, 0)
    
    // Draw annotations at their original scale
    currentImage.annotations.forEach(annotation => {
      // Draw circle
      ctx.beginPath()
      ctx.arc(annotation.x, annotation.y, annotation.size, 0, 2 * Math.PI)
      ctx.fillStyle = annotation.color
      ctx.fill()
      
      // Draw text
      ctx.font = '12px Arial'
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2
      ctx.strokeText(annotation.text, annotation.x + 10, annotation.y + 5)
      ctx.fillText(annotation.text, annotation.x + 10, annotation.y + 5)
    })
    
    // Create download link
    const dataURL = combinedCanvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `${currentImage.name.split('.')[0]}_annotated.png`
    a.click()
  }
  
  // Colors for annotation
  const colors = [
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
    "#ffffff", // White
    "#000000"  // Black
  ]

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
          <h1 className="text-2xl font-bold">Mikroskopie-Tool</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bildansicht und Annotation</CardTitle>
              <CardDescription>
                Betrachten und annotieren Sie mikroskopische Bilder
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentImage ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{currentImage.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {currentImage.type} | {currentImage.date}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={zoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={zoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetZoom}>
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="relative border rounded-md overflow-hidden bg-black"
                    style={{ height: '400px' }}
                    ref={containerRef}
                  >
                    <div 
                      style={{ 
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                      }}
                      className="absolute"
                    >
                      <img
                        ref={imageRef}
                        src={currentImage.url}
                        alt={currentImage.name}
                        className="max-w-none"
                        style={{ display: 'block' }}
                        onLoad={() => {
                          if (imageRef.current && canvasRef.current) {
                            canvasRef.current.width = imageRef.current.naturalWidth
                            canvasRef.current.height = imageRef.current.naturalHeight
                          }
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ pointerEvents: 'auto' }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="space-y-1">
                        <Label htmlFor="annotation-text" className="text-xs">Text</Label>
                        <Input
                          id="annotation-text"
                          value={newAnnotation.text}
                          onChange={(e) => setNewAnnotation({...newAnnotation, text: e.target.value})}
                          placeholder="Bezeichnung"
                          className="w-40"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Farbe</Label>
                        <div className="flex space-x-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => setNewAnnotation({...newAnnotation, color})}
                              className={`w-6 h-6 rounded-full ${color === newAnnotation.color ? 'ring-2 ring-primary' : ''}`}
                              style={{ backgroundColor: color }}
                              aria-label={`Farbe ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={deleteLastAnnotation}
                        disabled={!currentImage?.annotations.length}
                      >
                        <Eraser className="h-4 w-4 mr-2" />
                        Letzte löschen
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadImage}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Bild speichern
                      </Button>
                    </div>
                  </div>
                  
                  {currentImage.annotations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Annotationen:</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {currentImage.annotations.map((ann, index) => (
                          <div key={ann.id} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: ann.color }}
                            />
                            <span>{index + 1}. {ann.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Microscope className="h-12 w-12 mb-4" />
                  <p>Kein Bild ausgewählt</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bildgalerie</CardTitle>
              <CardDescription>
                Lade Bilder hoch oder wähle aus bestehenden Bildern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="image-upload" className="block mb-2">Neues Bild hochladen</Label>
                <div className="flex space-x-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                </div>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map(image => (
                    <div 
                      key={image.id} 
                      className={`relative border rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md ${currentImage?.id === image.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setCurrentImage(image)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="object-cover w-full h-full"
                        />
                        {image.annotations.length > 0 && (
                          <div className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {image.annotations.length}
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-sm font-medium truncate">{image.name}</div>
                        <div className="text-xs text-muted-foreground">{image.type}</div>
                      </div>
                    </div>
                  ))}
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
                Anleitung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Bilder betrachten:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Wählen Sie ein Beispielbild oder laden Sie ein eigenes hoch</li>
                  <li>Nutzen Sie die Zoom-Steuerelemente für eine Detailansicht</li>
                  <li>Scrollen zum Navigieren in vergrößerten Bildern</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Bilder annotieren:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Geben Sie einen Annotationstext ein</li>
                  <li>Wählen Sie eine Farbe für die Markierung</li>
                  <li>Klicken Sie auf das Bild, um die Annotation zu platzieren</li>
                  <li>Nutzen Sie "Letzte löschen" zum Entfernen der letzten Annotation</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Bilder speichern:</h3>
                <p className="text-sm text-muted-foreground">
                  Klicken Sie auf "Bild speichern", um das annotierte Bild als PNG-Datei herunterzuladen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mikroskopie-Tipps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Maßstäbe in der Mikroskopie:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>10x Objektiv: ~100 µm / Bildbreite</div>
                  <div>40x Objektiv: ~25 µm / Bildbreite</div>
                  <div>100x Objektiv: ~10 µm / Bildbreite</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Gängige Färbetechniken:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div><span className="font-medium">H&E:</span> Zellkerne (blau), Zytoplasma (rot)</div>
                  <div><span className="font-medium">DAPI:</span> DNA/Zellkerne (blau)</div>
                  <div><span className="font-medium">Gram:</span> Gram-positiv (violett), Gram-negativ (rot)</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Bildvergleich:</h3>
                <p className="text-sm text-muted-foreground">
                  Laden Sie mehrere Bilder hoch, um sie miteinander zu vergleichen oder vor/nach Behandlungen zu dokumentieren.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
