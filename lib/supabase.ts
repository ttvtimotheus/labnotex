import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Create a Supabase client only if the environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Define types for our database
export type { Database }
export type Tables = Database['public']['Tables']
export type Experiments = Tables['experiments']['Row']
export type TrainingEntries = Tables['training_entries']['Row']
export type User = Tables['users']['Row']
export type ToolResults = Tables['tool_results']['Row']

// Create and export the Supabase client if the environment variables are defined
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey
}

// User authentication helpers
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  return { data, error }
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { error } = await supabase.auth.signOut()
  
  return { error }
}

export async function getSession() {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase.auth.getSession()
  
  return { data, error }
}

// Database query helpers
export async function getExperiments() {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getExperiment(id: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

export async function createExperiment(experiment: Partial<Experiments>) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('experiments')
    .insert(experiment)
    .select()
    .single()
  
  return { data, error }
}

export async function updateExperiment(id: string, experiment: Partial<Experiments>) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('experiments')
    .update(experiment)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteExperiment(id: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { error } = await supabase
    .from('experiments')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Training entries helpers
export async function getTrainingEntries() {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('training_entries')
    .select('*')
    .order('date', { ascending: false })
  
  return { data, error }
}

export async function getTrainingEntry(id: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('training_entries')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

export async function createTrainingEntry(entry: Partial<TrainingEntries>) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('training_entries')
    .insert(entry)
    .select()
    .single()
  
  return { data, error }
}

export async function updateTrainingEntry(id: string, entry: Partial<TrainingEntries>) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { data, error } = await supabase
    .from('training_entries')
    .update(entry)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteTrainingEntry(id: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  
  const { error } = await supabase
    .from('training_entries')
    .delete()
    .eq('id', id)
  
  return { error }
}
