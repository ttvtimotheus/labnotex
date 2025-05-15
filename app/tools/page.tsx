import React from "react"
import Link from "next/link"
// Import UI-Komponenten direkt mit relativen Pfaden
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  // Molekularbiologie / Genetik
  Dna, 
  Scissors,
  RotateCcw,
  FileCode,
  Atom,
  Play,
  
  // Analytik / Chemie
  Calculator,
  Droplet,
  FlaskConical,
  Beaker,
  LineChart,
  GitMerge,
  FlaskConical as Flask,
  
  // Visualisierung & Simulation
  Grid, 
  Layers,
  LayoutGrid,
  Microscope,
  MousePointer,
  Eye,
  
  // Statistik & Auswertung
  BarChart,
  BarChart2,
  TrendingUp,
  CircleDot,
  
  // Ausbildung / Allgemein
  GraduationCap,
  ClipboardCheck,
  History,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  
  // Allgemeine Icons
  Thermometer
} from "lucide-react"

// Tool Card Component
type ToolCardProps = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  category?: string;
  status?: "completed" | "development" | "planned";
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, href }) => (
  <Link href={href} className="block">
    <Card className="h-full transition-colors hover:border-primary hover:bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  </Link>
);

export default function ToolsPage() {
  // Molekularbiologie / Genetik Tools
  const molecularBiologyTools: ToolCardProps[] = [
    {
      id: "dna-translator",
      title: "DNA/RNA → Aminosäure-Translator",
      description: "Umwandlung von DNA- und RNA-Sequenzen in Aminosäuren mit Codon-Tabelle und Farbkodierung.",
      icon: Dna,
      href: "/tools/dna-translator",
      status: "completed"
    },
    {
      id: "reverse-complement",
      title: "Reverse Complement Generator",
      description: "Generierung von umgekehrten komplementären DNA/RNA-Sequenzen mit Option für Primer-Design.",
      icon: RotateCcw,
      href: "/tools/reverse-complement",
      status: "planned"
    },
    {
      id: "codon-optimizer",
      title: "Codon Usage Optimizer",
      description: "Optimierung von Gensequenzen für die Expression in verschiedenen Organismen.",
      icon: FileCode,
      href: "/tools/codon-optimizer",
      status: "planned"
    },
    {
      id: "crispr-designer",
      title: "CRISPR sgRNA Designer",
      description: "Design von sgRNAs für CRISPR/Cas9-Experimente mit Effizienzvorhersage.",
      icon: Scissors,
      href: "/tools/crispr-designer",
      status: "planned"
    },
    {
      id: "plasmid-viewer",
      title: "Plasmid-Viewer",
      description: "Visualisierung und Bearbeitung von Plasmid-Karten mit Restriktionsstellen.",
      icon: Atom,
      href: "/tools/plasmid-viewer",
      status: "completed"
    },
    {
      id: "translation-animation",
      title: "Translation-Animation",
      description: "Interaktive Animation des Translationsprozesses von mRNA zu Protein.",
      icon: Play,
      href: "/tools/translation-animation",
      status: "planned"
    },
  ];

  // Analytik / Chemie Tools
  const analyticsChemistryTools: ToolCardProps[] = [
    {
      id: "molarity-calculator",
      title: "Molaritätsrechner",
      description: "Berechnung von Molarität, Masse und Volumen für Laborlösungen.",
      icon: Calculator,
      href: "/tools/molarity-calculator",
      status: "completed"
    },
    {
      id: "dilution-calculator",
      title: "Verdünnungsrechner",
      description: "Berechnung von Verdünnungen nach der C1V1 = C2V2 Formel für Laborbedarf.",
      icon: Droplet,
      href: "/tools/dilution-calculator",
      status: "planned"
    },
    {
      id: "buffer-calculator",
      title: "Pufferlösungsrechner",
      description: "Berechnung von Pufferlösungen nach Henderson-Hasselbalch für präzise pH-Werte.",
      icon: Beaker,
      href: "/tools/buffer-calculator",
      status: "planned"
    },
    {
      id: "reaction-balancer",
      title: "Reaktionsgleichungs-Balancer",
      description: "Automatischer Ausgleich chemischer Reaktionsgleichungen für stöchiometrische Berechnungen.",
      icon: GitMerge,
      href: "/tools/reaction-balancer",
      status: "planned"
    },
    {
      id: "titration-curve",
      title: "Titrationskurve",
      description: "Interaktive Visualisierung von Titrationskurven mit Äquivalenzpunkt-Berechnung.",
      icon: LineChart,
      href: "/tools/titration-curve",
      status: "planned"
    },
    {
      id: "od600-calculator",
      title: "OD600 → Zellkonzentration",
      description: "Umrechnung optischer Dichte (OD600) in Bakterienkonzentration für verschiedene Organismen.",
      icon: Flask,
      href: "/tools/od600-calculator",
      status: "planned"
    },
    {
      id: "pcr-builder",
      title: "PCR-Builder",
      description: "Berechnung von Primer-Eigenschaften wie Tm, GC% und Länge für PCR-Experimente.",
      icon: Thermometer,
      href: "/tools/pcr-builder",
      status: "completed"
    },
  ];

  // Visualisierung & Simulation Tools
  const visualizationSimulationTools: ToolCardProps[] = [
    {
      id: "electrophoresis-simulator",
      title: "Elektrophorese-Simulator",
      description: "Simulation einer Gel-Elektrophorese basierend auf DNA-Fragmentlängen.",
      icon: Grid,
      href: "/tools/electrophoresis",
      status: "completed"
    },
    {
      id: "sds-page-calculator",
      title: "SDS-PAGE-Rechner",
      description: "Berechnung und Visualisierung von Proteingrößen in SDS-PAGE-Gelen.",
      icon: Layers,
      href: "/tools/sds-page-calculator",
      status: "planned"
    },
    {
      id: "microscopy-comparison",
      title: "Mikroskopie-Bild-Vergleich",
      description: "Vergleich und Analyse von mikroskopischen Bildern mit Schieberegler-Funktion.",
      icon: LayoutGrid,
      href: "/tools/microscopy-comparison",
      status: "planned"
    },
    {
      id: "microscopy",
      title: "Mikroskopie-Annotation",
      description: "Annotation und Markierung von mikroskopischen Bildern für Publikationen und Präsentationen.",
      icon: Microscope,
      href: "/tools/microscopy",
      status: "completed"
    },
    {
      id: "protein-viewer",
      title: "Proteinstruktur-Viewer",
      description: "3D-Visualisierung von Proteinstrukturen aus PDB-Dateien mit interaktiven Funktionen.",
      icon: Eye,
      href: "/tools/protein-viewer",
      status: "planned"
    },
  ];

  // Statistik & Auswertung Tools
  const statisticsTools: ToolCardProps[] = [
    {
      id: "t-test-calculator",
      title: "T-Test Rechner",
      description: "Statistische Analyse für zwei Gruppen mit p-Wert und Konfidenzintervall.",
      icon: BarChart,
      href: "/tools/t-test-calculator",
      status: "planned"
    },
    {
      id: "anova-calculator",
      title: "ANOVA Rechner",
      description: "Varianzanalyse für mehrere Gruppen mit F-Statistik und Post-hoc-Tests.",
      icon: BarChart2,
      href: "/tools/anova-calculator",
      status: "planned"
    },
    {
      id: "elisa-calibration",
      title: "ELISA-Kalibrationskurve",
      description: "Erstellung und Analyse von Standardkurven für ELISA-Experimente.",
      icon: LineChart,
      href: "/tools/elisa-calibration",
      status: "planned"
    },
    {
      id: "ddct-normalizer",
      title: "ΔΔCt Normalisierer",
      description: "Relative Quantifizierung von qPCR-Daten mit ΔΔCt-Methode und Haushaltsgen-Normalisierung.",
      icon: TrendingUp,
      href: "/tools/ddct-normalizer",
      status: "planned"
    },
    {
      id: "lineweaver-burk",
      title: "Lineweaver-Burk-Plot",
      description: "Erstellung und Analyse von Lineweaver-Burk-Plots für enzymatische Kinetik.",
      icon: CircleDot,
      href: "/tools/lineweaver-burk",
      status: "planned"
    },
  ];

  // Ausbildung / Allgemein Tools
  const educationGeneralTools: ToolCardProps[] = [
    {
      id: "protocol-generator",
      title: "Protokollgenerator",
      description: "KI-basierte Generierung von Laborprotokollen mit anpassbaren Parametern.",
      icon: GraduationCap,
      href: "/tools/protocol-generator",
      status: "planned"
    },
    {
      id: "assessment-tool",
      title: "Bewertungstool für Lehrer",
      description: "Werkzeug zur Bewertung von Schülern und Auszubildenden mit Standardkriterien.",
      icon: ClipboardCheck,
      href: "/tools/assessment-tool",
      status: "planned"
    },
    {
      id: "audit-trail",
      title: "Audit-Trail Viewer",
      description: "Anzeige und Filterung von Benutzeraktivitäten für Compliance und Qualitätssicherung.",
      icon: History,
      href: "/tools/audit-trail",
      status: "planned"
    },
    {
      id: "equipment-log",
      title: "Gerätebuch",
      description: "Digitales Logbuch für Laborgeräte mit Wartungs- und Kalibrierungsprotokollen.",
      icon: BookOpen,
      href: "/tools/equipment-log",
      status: "planned"
    },
    {
      id: "hazard-list",
      title: "Gefahrstoffliste",
      description: "Verwaltung und Anzeige von Gefahrstoffen mit GHS-Symbolen und Sicherheitsdatenblättern.",
      icon: AlertTriangle,
      href: "/tools/hazard-list",
      status: "planned"
    },
    {
      id: "quiz-tool",
      title: "Quiz-Tool für Azubis",
      description: "Multiple-Choice-Quizze mit Erklärungen für die Ausbildung im Laborumfeld.",
      icon: HelpCircle,
      href: "/tools/quiz-tool",
      status: "planned"
    },
  ];
  
  // Alle Tools zusammenfassen
  const allTools = [
    ...molecularBiologyTools,
    ...analyticsChemistryTools,
    ...visualizationSimulationTools,
    ...statisticsTools,
    ...educationGeneralTools
  ];

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Labor- und Biotech-Tools</h2>
        <p className="text-muted-foreground">
          Spezielle Werkzeuge für Forschung, Ausbildung und biotechnologische Anwendungen
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="molecular">Molekularbiologie</TabsTrigger>
          <TabsTrigger value="analytics">Analytik & Chemie</TabsTrigger>
          <TabsTrigger value="visualization">Visualisierung</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
          <TabsTrigger value="education">Ausbildung</TabsTrigger>
        </TabsList>
        
        {/* Alle Tools */}
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </TabsContent>
        
        {/* Molekularbiologie Tools */}
        <TabsContent value="molecular" className="mt-0">
          <div className="flex flex-col space-y-2 mb-6">
            <h3 className="text-lg font-medium">Molekularbiologie / Genetik</h3>
            <p className="text-muted-foreground">
              Tools für DNA/RNA-Analyse, Genmanipulation und molekulare Prozesse
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {molecularBiologyTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </TabsContent>
        
        {/* Analytik & Chemie Tools */}
        <TabsContent value="analytics" className="mt-0">
          <div className="flex flex-col space-y-2 mb-6">
            <h3 className="text-lg font-medium">Analytik & Chemie</h3>
            <p className="text-muted-foreground">
              Rechner und Werkzeuge für chemische und analytische Laborarbeiten
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analyticsChemistryTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </TabsContent>
        
        {/* Visualisierung & Simulation Tools */}
        <TabsContent value="visualization" className="mt-0">
          <div className="flex flex-col space-y-2 mb-6">
            <h3 className="text-lg font-medium">Visualisierung & Simulation</h3>
            <p className="text-muted-foreground">
              Interaktive Visualisierungen und Simulationen für biologische Prozesse
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visualizationSimulationTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </TabsContent>
        
        {/* Statistik & Auswertung Tools */}
        <TabsContent value="statistics" className="mt-0">
          <div className="flex flex-col space-y-2 mb-6">
            <h3 className="text-lg font-medium">Statistik & Auswertung</h3>
            <p className="text-muted-foreground">
              Statistische Analysen und Datenauswertungstools für Experimente
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statisticsTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </TabsContent>
        
        {/* Ausbildung & Allgemein Tools */}
        <TabsContent value="education" className="mt-0">
          <div className="flex flex-col space-y-2 mb-6">
            <h3 className="text-lg font-medium">Ausbildung & Allgemein</h3>
            <p className="text-muted-foreground">
              Lehrmittel, Protokollverwaltung und allgemeine Labororganisation
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {educationGeneralTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
