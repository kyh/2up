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
      _PackToPackTag: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_PackToPackTag_A_fkey"
            columns: ["A"]
            referencedRelation: "Pack"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_PackToPackTag_B_fkey"
            columns: ["B"]
            referencedRelation: "PackTag"
            referencedColumns: ["id"]
          }
        ]
      }
      Game: {
        Row: {
          createdAt: string
          gameScenes: Json[] | null
          history: Json[] | null
          id: string
          isFinished: boolean
          isStarted: boolean
          packId: string
          state: Json
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          gameScenes?: Json[] | null
          history?: Json[] | null
          id: string
          isFinished?: boolean
          isStarted?: boolean
          packId: string
          state: Json
          updatedAt: string
        }
        Update: {
          createdAt?: string
          gameScenes?: Json[] | null
          history?: Json[] | null
          id?: string
          isFinished?: boolean
          isStarted?: boolean
          packId?: string
          state?: Json
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Game_packId_fkey"
            columns: ["packId"]
            referencedRelation: "Pack"
            referencedColumns: ["id"]
          }
        ]
      }
      Pack: {
        Row: {
          createdAt: string
          description: string | null
          gameLength: number
          id: string
          imageUrl: string | null
          isRandom: boolean
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          gameLength?: number
          id: string
          imageUrl?: string | null
          isRandom?: boolean
          name: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          gameLength?: number
          id?: string
          imageUrl?: string | null
          isRandom?: boolean
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: []
      }
      PackAsset: {
        Row: {
          createdAt: string
          id: string
          name: string
          packId: string
          updatedAt: string
          url: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          packId: string
          updatedAt: string
          url: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          packId?: string
          updatedAt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "PackAsset_packId_fkey"
            columns: ["packId"]
            referencedRelation: "Pack"
            referencedColumns: ["id"]
          }
        ]
      }
      PackTag: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Player: {
        Row: {
          avatar: string | null
          finalScore: number
          gameId: string
          name: string
          userId: string
        }
        Insert: {
          avatar?: string | null
          finalScore?: number
          gameId: string
          name: string
          userId: string
        }
        Update: {
          avatar?: string | null
          finalScore?: number
          gameId?: string
          name?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Player_gameId_fkey"
            columns: ["gameId"]
            referencedRelation: "Game"
            referencedColumns: ["id"]
          }
        ]
      }
      Profile: {
        Row: {
          avatar: string | null
          createdAt: string
          email: string
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
          userId: string
          username: string
        }
        Insert: {
          avatar?: string | null
          createdAt?: string
          email: string
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
          userId: string
          username: string
        }
        Update: {
          avatar?: string | null
          createdAt?: string
          email?: string
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
          userId?: string
          username?: string
        }
        Relationships: []
      }
      Scene: {
        Row: {
          answerDescription: string | null
          answerType: Database["public"]["Enums"]["AnswerType"]
          createdAt: string
          externalId: string | null
          id: string
          order: number | null
          packId: string
          question: string
          questionDescription: string | null
          questionType: Database["public"]["Enums"]["QuestionType"]
          updatedAt: string
        }
        Insert: {
          answerDescription?: string | null
          answerType: Database["public"]["Enums"]["AnswerType"]
          createdAt?: string
          externalId?: string | null
          id: string
          order?: number | null
          packId: string
          question: string
          questionDescription?: string | null
          questionType: Database["public"]["Enums"]["QuestionType"]
          updatedAt: string
        }
        Update: {
          answerDescription?: string | null
          answerType?: Database["public"]["Enums"]["AnswerType"]
          createdAt?: string
          externalId?: string | null
          id?: string
          order?: number | null
          packId?: string
          question?: string
          questionDescription?: string | null
          questionType?: Database["public"]["Enums"]["QuestionType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Scene_packId_fkey"
            columns: ["packId"]
            referencedRelation: "Pack"
            referencedColumns: ["id"]
          }
        ]
      }
      SceneAnswer: {
        Row: {
          content: string
          createdAt: string
          id: string
          isCorrect: boolean
          sceneId: string
          updatedAt: string
        }
        Insert: {
          content: string
          createdAt?: string
          id: string
          isCorrect?: boolean
          sceneId: string
          updatedAt: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          isCorrect?: boolean
          sceneId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "SceneAnswer_sceneId_fkey"
            columns: ["sceneId"]
            referencedRelation: "Scene"
            referencedColumns: ["id"]
          }
        ]
      }
      Waitlist: {
        Row: {
          createdAt: string
          data: Json
          id: string
          type: Database["public"]["Enums"]["WaitlistType"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          data: Json
          id?: string
          type?: Database["public"]["Enums"]["WaitlistType"]
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          data?: Json
          id?: string
          type?: Database["public"]["Enums"]["WaitlistType"]
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      AnswerType: "text" | "multiText"
      QuestionType: "text" | "image" | "video" | "audio" | "code"
      UserRole: "admin" | "user"
      WaitlistType: "account"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
