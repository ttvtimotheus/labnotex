import OpenAI from 'openai'

// Initialize the OpenAI client if API key is available
const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ apiKey }) : null

// Helper function to check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!openai
}

/**
 * Generates a summary of an experiment based on its content
 */
export async function generateExperimentSummary(content: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Wissenschaftsassistent, der Laborprotokolle zusammenfasst. Erstelle eine prägnante Zusammenfassung der wichtigsten Punkte des folgenden Laborprotokolls. Behalte wissenschaftliche Genauigkeit bei und hebe Methoden, Ergebnisse und Schlussfolgerungen hervor.'
        },
        {
          role: 'user',
          content
        }
      ],
      max_tokens: 500
    })
    
    return response.choices[0]?.message?.content || 'Keine Zusammenfassung verfügbar.'
  } catch (error) {
    console.error('Error generating experiment summary:', error)
    return 'Fehler bei der Generierung der Zusammenfassung.'
  }
}

/**
 * Generates a discussion section for an experiment based on its content
 */
export async function generateExperimentDiscussion(content: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein wissenschaftlicher Berater, der Diskussionsabschnitte für Laborprotokolle erstellt. Analysiere die folgenden Experimentdaten und erstelle einen Diskussionsteil, der die Ergebnisse interpretiert, sie in den Kontext der bestehenden Literatur einordnet, mögliche Fehlerquellen diskutiert und Vorschläge für zukünftige Experimente macht. Halte einen wissenschaftlichen, akademischen Ton ein.'
        },
        {
          role: 'user',
          content
        }
      ],
      max_tokens: 1000
    })
    
    return response.choices[0]?.message?.content || 'Keine Diskussion verfügbar.'
  } catch (error) {
    console.error('Error generating experiment discussion:', error)
    return 'Fehler bei der Generierung der Diskussion.'
  }
}

/**
 * Analyzes errors in experimental data
 */
export async function analyzeExperimentalErrors(content: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein erfahrener Laborwissenschaftler, der Experimente auf mögliche Fehlerquellen analysiert. Untersuche die folgenden Experimentdaten und identifiziere potentielle methodische Probleme, Fehlerquellen oder Verbesserungsmöglichkeiten. Liefere eine konstruktive Analyse mit konkreten Vorschlägen zur Verbesserung der Methodik oder Interpretation.'
        },
        {
          role: 'user',
          content
        }
      ],
      max_tokens: 800
    })
    
    return response.choices[0]?.message?.content || 'Keine Fehleranalyse verfügbar.'
  } catch (error) {
    console.error('Error analyzing experimental errors:', error)
    return 'Fehler bei der Analyse experimenteller Fehler.'
  }
}

/**
 * Extracts key information from an experiment
 */
export async function extractExperimentKeyInfo(content: string): Promise<{
  title: string;
  materials: string[];
  methods: string[];
  results: string[];
  keywords: string[];
}> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `Du bist ein wissenschaftlicher Datenextraktionsspezialist. Extrahiere die folgenden Informationen aus dem Laborprotokoll und gib sie im JSON-Format zurück:
          1. Einen vorgeschlagenen Titel für das Experiment
          2. Eine Liste aller verwendeten Materialien/Reagenzien
          3. Eine Liste der Hauptmethoden
          4. Eine Liste der wichtigsten Ergebnisse
          5. Eine Liste von 3-5 relevanten Keywords/Tags
          
          Formatiere die Antwort als JSON-Objekt mit den Schlüsseln: title, materials, methods, results, keywords.`
        },
        {
          role: 'user',
          content
        }
      ],
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    })
    
    const defaultResponse = {
      title: 'Unbekanntes Experiment',
      materials: [],
      methods: [],
      results: [],
      keywords: []
    }
    
    if (!response.choices[0]?.message?.content) {
      return defaultResponse
    }
    
    try {
      const parsedResponse = JSON.parse(response.choices[0].message.content)
      return {
        title: parsedResponse.title || defaultResponse.title,
        materials: parsedResponse.materials || defaultResponse.materials,
        methods: parsedResponse.methods || defaultResponse.methods,
        results: parsedResponse.results || defaultResponse.results,
        keywords: parsedResponse.keywords || defaultResponse.keywords
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError)
      return defaultResponse
    }
  } catch (error) {
    console.error('Error extracting experiment key info:', error)
    return {
      title: 'Unbekanntes Experiment',
      materials: [],
      methods: [],
      results: [],
      keywords: []
    }
  }
}
