import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  FileText, 
  PenSquare,
  Microscope,
  Tag,
  Clock,
  Star
} from "lucide-react"
import { ExperimentDetailViewer } from "@/components/experiments/experiment-detail-viewer"

export default function ExperimentDetailPage({ params }: { params: { id: string } }) {
  // In a real application, we would fetch this data from an API or database using the ID
  const experimentData = {
    id: parseInt(params.id),
    title: "PCR Amplifikation GPCR Gene",
    date: "15.05.2025",
    updatedAt: "15.05.2025 14:30",
    tags: ["PCR", "Genetik", "GPCR"],
    status: "Abgeschlossen",
    content: `
# PCR Amplifikation des GPCR-Gens

## Zielsetzung
Amplifikation des G-Protein-gekoppelten Rezeptorgens (GPCR) aus genomischer DNA der Maus für spätere Klonierung in einen Expressionsvektor.

## Material und Methoden

### Verwendete Reagenzien
- Q5 High-Fidelity DNA Polymerase (NEB, #M0491S)
- 5X Q5 Reaction Buffer
- 10 mM dNTPs
- Forward Primer (10 µM): 5'-ATGACCATGATTACGCCAAGC-3'
- Reverse Primer (10 µM): 5'-GCTTGGCGTAATCATGGTCAT-3'
- Genomische DNA aus Mausgewebe (50 ng/µl)
- Nuklease-freies Wasser

### PCR-Ansatz (50 µl)
| Komponente | Volumen (µl) | Finale Konzentration |
|------------|--------------|----------------------|
| 5X Q5 Reaction Buffer | 10 | 1X |
| 10 mM dNTPs | 1 | 200 µM |
| Forward Primer | 2.5 | 0.5 µM |
| Reverse Primer | 2.5 | 0.5 µM |
| Genomische DNA | 2 | 2 ng/µl |
| Q5 Polymerase | 0.5 | 0.02 U/µl |
| Nuklease-freies Wasser | 31.5 | - |

### PCR-Programm
1. Initiale Denaturierung: 98°C, 30 Sekunden
2. 35 Zyklen:
   - Denaturierung: 98°C, 10 Sekunden
   - Annealing: 58°C, 30 Sekunden
   - Extension: 72°C, 90 Sekunden (30 Sekunden/kb)
3. Finale Extension: 72°C, 5 Minuten
4. Lagerung: 4°C

## Ergebnisse

Die Amplifikation des GPCR-Gens war erfolgreich. Das PCR-Produkt wurde mittels Agarose-Gelelektrophorese analysiert und zeigte eine deutliche Bande bei der erwarteten Größe von 1,2 kb.

![Gelelektrophorese Ergebnis](/images/gel-result-001.jpg)

Spur 1: DNA-Marker
Spur 2: PCR-Produkt (GPCR-Gen)
Spur 3: Negativkontrolle

Das PCR-Produkt wurde anschließend mit dem QIAquick PCR Purification Kit gereinigt und für die nachfolgende Klonierung vorbereitet.

## Diskussion

Die PCR-Amplifikation des GPCR-Gens verlief ohne Komplikationen. Die Q5-Polymerase wurde aufgrund ihrer hohen Genauigkeit und der Fähigkeit, längere DNA-Abschnitte zu amplifizieren, ausgewählt. Die Annealing-Temperatur von 58°C wurde basierend auf den Schmelztemperaturen der Primer gewählt und führte zu einer spezifischen Amplifikation ohne Nebenbanden.

## Nächste Schritte

1. Restriktionsverdau des PCR-Produkts mit BamHI und HindIII
2. Ligation in den pET28a-Expressionsvektor
3. Transformation in E. coli BL21(DE3) für Proteinexpression
    `,
    attachments: [
      { name: "gel-result-001.jpg", type: "image/jpeg", size: "1.2 MB" },
      { name: "PCR-Rohdaten.csv", type: "text/csv", size: "45 KB" }
    ],
    author: "Max Mustermann",
    favorited: true
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center">
            <Link href="/experiments">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{experimentData.title}</h1>
            {experimentData.favorited && (
              <Star className="h-5 w-5 text-yellow-500 ml-2 fill-yellow-500" />
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF Export
            </Button>
            <Link href={`/experiments/${params.id}/edit`}>
              <Button size="sm">
                <PenSquare className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Erstellt: {experimentData.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Aktualisiert: {experimentData.updatedAt}</span>
          </div>
          <div className="flex items-center">
            <Microscope className="h-4 w-4 mr-1" />
            <span>Status: {experimentData.status}</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>Autor: {experimentData.author}</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
          {experimentData.tags.map((tag, i) => (
            <div
              key={i}
              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <ExperimentDetailViewer content={experimentData.content} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-4">Anhänge</h3>
            <div className="space-y-2">
              {experimentData.attachments.map((attachment, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{attachment.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-4">Versionshistorie</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Version 3 (Aktuell)</span>
                  <span className="text-muted-foreground">15.05.2025</span>
                </div>
                <p className="text-muted-foreground">Ergebnisse aktualisiert</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Version 2</span>
                  <span className="text-muted-foreground">14.05.2025</span>
                </div>
                <p className="text-muted-foreground">Methoden ergänzt</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Version 1</span>
                  <span className="text-muted-foreground">13.05.2025</span>
                </div>
                <p className="text-muted-foreground">Experiment angelegt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
