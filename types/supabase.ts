export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      experiments: {
        Row: {
          id: string
          title: string
          content: string
          tags: string[]
          created_at: string
          updated_at: string
          user_id: string
          is_public: boolean
          status: string
          favorited: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          user_id: string
          is_public?: boolean
          status?: string
          favorited?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
          is_public?: boolean
          status?: string
          favorited?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "experiments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      experiment_attachments: {
        Row: {
          id: string
          experiment_id: string
          file_name: string
          file_type: string
          file_size: number
          file_url: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          experiment_id: string
          file_name: string
          file_type: string
          file_size: number
          file_url: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          experiment_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          file_url?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_attachments_experiment_id_fkey"
            columns: ["experiment_id"]
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_attachments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      training_entries: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          duration: number
          type: string
          status: string
          rating: number | null
          user_id: string
          supervisor_id: string | null
          created_at: string
          updated_at: string
          exam_relevant: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          duration: number
          type: string
          status?: string
          rating?: number | null
          user_id: string
          supervisor_id?: string | null
          created_at?: string
          updated_at?: string
          exam_relevant?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          duration?: number
          type?: string
          status?: string
          rating?: number | null
          user_id?: string
          supervisor_id?: string | null
          created_at?: string
          updated_at?: string
          exam_relevant?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "training_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_entries_supervisor_id_fkey"
            columns: ["supervisor_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_results: {
        Row: {
          id: string
          tool_type: string
          data: Json
          user_id: string
          created_at: string
          name: string
        }
        Insert: {
          id?: string
          tool_type: string
          data: Json
          user_id: string
          created_at?: string
          name: string
        }
        Update: {
          id?: string
          tool_type?: string
          data?: Json
          user_id?: string
          created_at?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_results_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: string
          created_at: string
          organization: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: string
          created_at?: string
          organization?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: string
          created_at?: string
          organization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
