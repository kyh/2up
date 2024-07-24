
> @init/db@0.1.0 supabase /home/gru/Documents/init/packages/db
> supabase "gen" "types" "typescript" "--project-id" "tnfzyurwdjytkdzqxylp"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Accounts: {
        Row: {
          createdAt: string | null
          createdBy: string | null
          email: string | null
          id: string
          isPersonalAccount: boolean
          name: string
          pictureUrl: string | null
          primaryOwnerUserId: string
          publicData: Json
          slug: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          createdAt?: string | null
          createdBy?: string | null
          email?: string | null
          id?: string
          isPersonalAccount?: boolean
          name: string
          pictureUrl?: string | null
          primaryOwnerUserId?: string
          publicData?: Json
          slug?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          createdAt?: string | null
          createdBy?: string | null
          email?: string | null
          id?: string
          isPersonalAccount?: boolean
          name?: string
          pictureUrl?: string | null
          primaryOwnerUserId?: string
          publicData?: Json
          slug?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Accounts_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Accounts_primaryOwnerUserId_fkey"
            columns: ["primaryOwnerUserId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Accounts_updatedBy_fkey"
            columns: ["updatedBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      AccountsMemberships: {
        Row: {
          accountId: string
          accountRole: string
          createdAt: string
          createdBy: string | null
          updatedAt: string
          updatedBy: string | null
          userId: string
        }
        Insert: {
          accountId: string
          accountRole: string
          createdAt?: string
          createdBy?: string | null
          updatedAt?: string
          updatedBy?: string | null
          userId: string
        }
        Update: {
          accountId?: string
          accountRole?: string
          createdAt?: string
          createdBy?: string | null
          updatedAt?: string
          updatedBy?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AccountsMemberships_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AccountsMemberships_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AccountsMemberships_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AccountsMemberships_accountRole_fkey"
            columns: ["accountRole"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "AccountsMemberships_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AccountsMemberships_updatedBy_fkey"
            columns: ["updatedBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AccountsMemberships_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      BillingCustomers: {
        Row: {
          accountId: string
          customerId: string
          email: string | null
          id: number
          provider: Database["public"]["Enums"]["BillingProvider"]
        }
        Insert: {
          accountId: string
          customerId: string
          email?: string | null
          id?: number
          provider: Database["public"]["Enums"]["BillingProvider"]
        }
        Update: {
          accountId?: string
          customerId?: string
          email?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["BillingProvider"]
        }
        Relationships: [
          {
            foreignKeyName: "BillingCustomers_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BillingCustomers_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BillingCustomers_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
        ]
      }
      Config: {
        Row: {
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          enableAccountBilling: boolean
          enableTeamAccountBilling: boolean
          enableTeamAccounts: boolean
        }
        Insert: {
          billingProvider?: Database["public"]["Enums"]["BillingProvider"]
          enableAccountBilling?: boolean
          enableTeamAccountBilling?: boolean
          enableTeamAccounts?: boolean
        }
        Update: {
          billingProvider?: Database["public"]["Enums"]["BillingProvider"]
          enableAccountBilling?: boolean
          enableTeamAccountBilling?: boolean
          enableTeamAccounts?: boolean
        }
        Relationships: []
      }
      Invitations: {
        Row: {
          accountId: string
          createdAt: string
          email: string
          expiresAt: string
          id: number
          invitedBy: string
          inviteToken: string
          role: string
          updatedAt: string
        }
        Insert: {
          accountId: string
          createdAt?: string
          email: string
          expiresAt?: string
          id?: number
          invitedBy: string
          inviteToken: string
          role: string
          updatedAt?: string
        }
        Update: {
          accountId?: string
          createdAt?: string
          email?: string
          expiresAt?: string
          id?: number
          invitedBy?: string
          inviteToken?: string
          role?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Invitations_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitations_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitations_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitations_invitedBy_fkey"
            columns: ["invitedBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["name"]
          },
        ]
      }
      Notifications: {
        Row: {
          accountId: string
          body: string
          channel: Database["public"]["Enums"]["NotificationChannel"]
          createdAt: string
          dismissed: boolean
          expiresAt: string | null
          id: number
          link: string | null
          type: Database["public"]["Enums"]["NotificationType"]
        }
        Insert: {
          accountId: string
          body: string
          channel?: Database["public"]["Enums"]["NotificationChannel"]
          createdAt?: string
          dismissed?: boolean
          expiresAt?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["NotificationType"]
        }
        Update: {
          accountId?: string
          body?: string
          channel?: Database["public"]["Enums"]["NotificationChannel"]
          createdAt?: string
          dismissed?: boolean
          expiresAt?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["NotificationType"]
        }
        Relationships: [
          {
            foreignKeyName: "Notifications_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Notifications_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Notifications_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderItems: {
        Row: {
          createdAt: string
          id: string
          orderId: string
          priceAmount: number | null
          productId: string
          quantity: number
          updatedAt: string
          variantId: string
        }
        Insert: {
          createdAt?: string
          id: string
          orderId: string
          priceAmount?: number | null
          productId: string
          quantity?: number
          updatedAt?: string
          variantId: string
        }
        Update: {
          createdAt?: string
          id?: string
          orderId?: string
          priceAmount?: number | null
          productId?: string
          quantity?: number
          updatedAt?: string
          variantId?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrderItems_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Orders"
            referencedColumns: ["id"]
          },
        ]
      }
      Orders: {
        Row: {
          accountId: string
          billingCustomerId: number
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          createdAt: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          totalAmount: number
          updatedAt: string
        }
        Insert: {
          accountId: string
          billingCustomerId: number
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          createdAt?: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          totalAmount: number
          updatedAt?: string
        }
        Update: {
          accountId?: string
          billingCustomerId?: number
          billingProvider?: Database["public"]["Enums"]["BillingProvider"]
          createdAt?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          totalAmount?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Orders_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Orders_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Orders_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Orders_billingCustomerId_fkey"
            columns: ["billingCustomerId"]
            isOneToOne: false
            referencedRelation: "BillingCustomers"
            referencedColumns: ["id"]
          },
        ]
      }
      RolePermissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["AppPermissions"]
          role: string
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["AppPermissions"]
          role: string
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["AppPermissions"]
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "RolePermissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["name"]
          },
        ]
      }
      Roles: {
        Row: {
          hierarchyLevel: number
          name: string
        }
        Insert: {
          hierarchyLevel: number
          name: string
        }
        Update: {
          hierarchyLevel?: number
          name?: string
        }
        Relationships: []
      }
      SubscriptionItems: {
        Row: {
          createdAt: string
          id: string
          interval: string
          intervalCount: number
          priceAmount: number | null
          productId: string
          quantity: number
          subscriptionId: string
          type: Database["public"]["Enums"]["SubscriptionItemType"]
          updatedAt: string
          variantId: string
        }
        Insert: {
          createdAt?: string
          id: string
          interval: string
          intervalCount: number
          priceAmount?: number | null
          productId: string
          quantity?: number
          subscriptionId: string
          type: Database["public"]["Enums"]["SubscriptionItemType"]
          updatedAt?: string
          variantId: string
        }
        Update: {
          createdAt?: string
          id?: string
          interval?: string
          intervalCount?: number
          priceAmount?: number | null
          productId?: string
          quantity?: number
          subscriptionId?: string
          type?: Database["public"]["Enums"]["SubscriptionItemType"]
          updatedAt?: string
          variantId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubscriptionItems_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: false
            referencedRelation: "Subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscriptions: {
        Row: {
          accountId: string
          active: boolean
          billingCustomerId: number
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          cancelAtPeriodEnd: boolean
          createdAt: string
          currency: string
          id: string
          periodEndsAt: string
          periodStartsAt: string
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          trialEndsAt: string | null
          trialStartsAt: string | null
          updatedAt: string
        }
        Insert: {
          accountId: string
          active: boolean
          billingCustomerId: number
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          cancelAtPeriodEnd: boolean
          createdAt?: string
          currency: string
          id: string
          periodEndsAt: string
          periodStartsAt: string
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          trialEndsAt?: string | null
          trialStartsAt?: string | null
          updatedAt?: string
        }
        Update: {
          accountId?: string
          active?: boolean
          billingCustomerId?: number
          billingProvider?: Database["public"]["Enums"]["BillingProvider"]
          cancelAtPeriodEnd?: boolean
          createdAt?: string
          currency?: string
          id?: string
          periodEndsAt?: string
          periodStartsAt?: string
          status?: Database["public"]["Enums"]["SubscriptionStatus"]
          trialEndsAt?: string | null
          trialStartsAt?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscriptions_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Subscriptions_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Subscriptions_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Subscriptions_billingCustomerId_fkey"
            columns: ["billingCustomerId"]
            isOneToOne: false
            referencedRelation: "BillingCustomers"
            referencedColumns: ["id"]
          },
        ]
      }
      Tasks: {
        Row: {
          accountId: string
          createdAt: string
          createdBy: string | null
          id: string
          label: Database["public"]["Enums"]["TaskLabel"]
          priority: Database["public"]["Enums"]["TaskPriority"]
          slug: string | null
          status: Database["public"]["Enums"]["TaskStatus"]
          title: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountId: string
          createdAt?: string
          createdBy?: string | null
          id?: string
          label?: Database["public"]["Enums"]["TaskLabel"]
          priority?: Database["public"]["Enums"]["TaskPriority"]
          slug?: string | null
          status?: Database["public"]["Enums"]["TaskStatus"]
          title?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountId?: string
          createdAt?: string
          createdBy?: string | null
          id?: string
          label?: Database["public"]["Enums"]["TaskLabel"]
          priority?: Database["public"]["Enums"]["TaskPriority"]
          slug?: string | null
          status?: Database["public"]["Enums"]["TaskStatus"]
          title?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Tasks_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_updatedBy_fkey"
            columns: ["updatedBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Waitlist: {
        Row: {
          accountId: string | null
          email: string | null
          id: string
        }
        Insert: {
          accountId?: string | null
          email?: string | null
          id?: string
        }
        Update: {
          accountId?: string | null
          email?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Waitlist_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Waitlist_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Waitlist_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "UserAccountWorkspace"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      UserAccounts: {
        Row: {
          id: string | null
          name: string | null
          pictureUrl: string | null
          role: string | null
          slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "AccountsMemberships_accountRole_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["name"]
          },
        ]
      }
      UserAccountWorkspace: {
        Row: {
          id: string | null
          name: string | null
          pictureUrl: string | null
          subscription_status:
            | Database["public"]["Enums"]["SubscriptionStatus"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      acceptInvitation: {
        Args: {
          token: string
          userId: string
        }
        Returns: string
      }
      addInvitationsToAccount: {
        Args: {
          account_slug: string
          invitations: Database["public"]["CompositeTypes"]["Invitation"][]
        }
        Returns: Database["public"]["Tables"]["Invitations"]["Row"][]
      }
      canActionAccountMember: {
        Args: {
          targetTeamAccountId: string
          targetUserId: string
        }
        Returns: boolean
      }
      createInvitation: {
        Args: {
          accountId: string
          email: string
          role: string
        }
        Returns: {
          accountId: string
          createdAt: string
          email: string
          expiresAt: string
          id: number
          invitedBy: string
          inviteToken: string
          role: string
          updatedAt: string
        }
      }
      createTeamAccount: {
        Args: {
          account_name: string
        }
        Returns: {
          createdAt: string | null
          createdBy: string | null
          email: string | null
          id: string
          isPersonalAccount: boolean
          name: string
          pictureUrl: string | null
          primaryOwnerUserId: string
          publicData: Json
          slug: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
      }
      getAccountInvitations: {
        Args: {
          account_slug: string
        }
        Returns: {
          id: number
          email: string
          accountId: string
          invitedBy: string
          role: string
          createdAt: string
          updatedAt: string
          expiresAt: string
          inviterName: string
          inviterEmail: string
        }[]
      }
      getAccountMembers: {
        Args: {
          account_slug: string
        }
        Returns: {
          id: string
          userId: string
          accountId: string
          role: string
          roleHierarchyLevel: number
          primaryOwnerUserId: string
          name: string
          email: string
          pictureUrl: string
          createdAt: string
          updatedAt: string
        }[]
      }
      getConfig: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      getUpperSystemRole: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hasActiveSubscription: {
        Args: {
          targetAccountId: string
        }
        Returns: boolean
      }
      hasMoreElevatedRole: {
        Args: {
          targetUserId: string
          targetAccountId: string
          roleName: string
        }
        Returns: boolean
      }
      hasPermission: {
        Args: {
          userId: string
          accountId: string
          permissionName: Database["public"]["Enums"]["AppPermissions"]
        }
        Returns: boolean
      }
      hasRoleOnAccount: {
        Args: {
          accountId: string
          accountRole?: string
        }
        Returns: boolean
      }
      hasSameRoleHierarchyLevel: {
        Args: {
          targetUserId: string
          targetAccountId: string
          roleName: string
        }
        Returns: boolean
      }
      isAccountOwner: {
        Args: {
          accountId: string
        }
        Returns: boolean
      }
      isAccountTeamMember: {
        Args: {
          targetAccountId: string
        }
        Returns: boolean
      }
      isSet: {
        Args: {
          fieldname: string
        }
        Returns: boolean
      }
      isTeamMember: {
        Args: {
          accountId: string
          userId: string
        }
        Returns: boolean
      }
      teamAccountWorkspace: {
        Args: {
          account_slug: string
        }
        Returns: {
          id: string
          name: string
          pictureUrl: string
          slug: string
          role: string
          roleHierarchyLevel: number
          primaryOwnerUserId: string
          subscriptionStatus: Database["public"]["Enums"]["SubscriptionStatus"]
          permissions: Database["public"]["Enums"]["AppPermissions"][]
        }[]
      }
      transferTeamAccountOwnership: {
        Args: {
          targetAccountId: string
          newOwnerId: string
        }
        Returns: undefined
      }
      upsertOrder: {
        Args: {
          targetAccountId: string
          targetCustomerId: string
          targetOrderId: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          totalAmount: number
          currency: string
          lineItems: Json
        }
        Returns: {
          accountId: string
          billingCustomerId: number
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          createdAt: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          totalAmount: number
          updatedAt: string
        }
      }
      upsertSubscription: {
        Args: {
          targetAccountId: string
          targetCustomerId: string
          targetSubscriptionId: string
          active: boolean
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          cancelAtPeriodEnd: boolean
          currency: string
          periodStartsAt: string
          periodEndsAt: string
          lineItems: Json
          trialStartsAt?: string
          trialEndsAt?: string
        }
        Returns: {
          accountId: string
          active: boolean
          billingCustomerId: number
          billingProvider: Database["public"]["Enums"]["BillingProvider"]
          cancelAtPeriodEnd: boolean
          createdAt: string
          currency: string
          id: string
          periodEndsAt: string
          periodStartsAt: string
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          trialEndsAt: string | null
          trialStartsAt: string | null
          updatedAt: string
        }
      }
    }
    Enums: {
      AppPermissions:
        | "roles.manage"
        | "billing.manage"
        | "settings.manage"
        | "members.manage"
        | "invites.manage"
      BillingProvider: "stripe" | "lemon-squeezy" | "paddle"
      NotificationChannel: "in_app" | "email"
      NotificationType: "info" | "warning" | "error"
      PaymentStatus: "pending" | "succeeded" | "failed"
      SubscriptionItemType: "flat" | "per_seat" | "metered"
      SubscriptionStatus:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
      TaskLabel: "bug" | "feature" | "enhancement" | "documentation"
      TaskPriority: "low" | "medium" | "high"
      TaskStatus: "todo" | "in-progress" | "done" | "canceled"
    }
    CompositeTypes: {
      Invitation: {
        email: string | null
        role: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
