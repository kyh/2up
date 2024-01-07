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
            isOneToOne: false
            referencedRelation: "Pack"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_PackToPackTag_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "PackTag"
            referencedColumns: ["id"]
          }
        ]
      }
      Game: {
        Row: {
          code: string
          createdAt: string
          history: Json[] | null
          id: string
          isActive: boolean
          packId: string
          scenes: Json[] | null
          updatedAt: string
        }
        Insert: {
          code: string
          createdAt?: string
          history?: Json[] | null
          id: string
          isActive?: boolean
          packId: string
          scenes?: Json[] | null
          updatedAt: string
        }
        Update: {
          code?: string
          createdAt?: string
          history?: Json[] | null
          id?: string
          isActive?: boolean
          packId?: string
          scenes?: Json[] | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Game_packId_fkey"
            columns: ["packId"]
            isOneToOne: false
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
        Relationships: [
          {
            foreignKeyName: "Pack_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
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
            isOneToOne: false
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
          finalScore: number
          gameId: string
          name: string
          userId: string
        }
        Insert: {
          finalScore?: number
          gameId: string
          name: string
          userId: string
        }
        Update: {
          finalScore?: number
          gameId?: string
          name?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Player_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "Game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Player_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
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
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "Scene"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          role: Database["public"]["Enums"]["UserRole"]
          stripeCurrentPeriodEnd: string | null
          stripeCustomerId: string | null
          stripePriceId: string | null
          stripeSubscriptionId: string | null
          updatedAt: string
          username: string | null
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          stripeCurrentPeriodEnd?: string | null
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          updatedAt?: string
          username?: string | null
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          stripeCurrentPeriodEnd?: string | null
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          updatedAt?: string
          username?: string | null
        }
        Relationships: []
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
          id: string
          type?: Database["public"]["Enums"]["WaitlistType"]
          updatedAt: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
