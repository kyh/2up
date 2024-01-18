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
      Team: {
        Row: {
          createdAt: string
          id: string
          name: string | null
          slug: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name?: string | null
          slug: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string | null
          slug?: string
          updatedAt?: string
        }
        Relationships: []
      }
      TeamMember: {
        Row: {
          role: Database["public"]["Enums"]["Role"]
          teamId: string
          userId: string
        }
        Insert: {
          role: Database["public"]["Enums"]["Role"]
          teamId: string
          userId: string
        }
        Update: {
          role?: Database["public"]["Enums"]["Role"]
          teamId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamMember_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamMember_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      TeamMemberInvite: {
        Row: {
          code: string
          createdAt: string
          email: string
          id: string
          role: Database["public"]["Enums"]["Role"]
          teamId: string
          updatedAt: string
        }
        Insert: {
          code: string
          createdAt?: string
          email: string
          id: string
          role: Database["public"]["Enums"]["Role"]
          teamId: string
          updatedAt?: string
        }
        Update: {
          code?: string
          createdAt?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["Role"]
          teamId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamMemberInvite_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          }
        ]
      }
      Todo: {
        Row: {
          completed: boolean
          content: string
          createdAt: string
          id: string
          teamId: string | null
          updatedAt: string
          userId: string | null
        }
        Insert: {
          completed?: boolean
          content: string
          createdAt?: string
          id: string
          teamId?: string | null
          updatedAt?: string
          userId?: string | null
        }
        Update: {
          completed?: boolean
          content?: string
          createdAt?: string
          id?: string
          teamId?: string | null
          updatedAt?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Todo_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Todo_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          createdAt: string
          id: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Waitlist: {
        Row: {
          createdAt: string
          email: string
          id: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
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
      Role: "ADMIN" | "MEMBER"
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
