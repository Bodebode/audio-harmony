export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      email_campaigns: {
        Row: {
          clicked_count: number | null
          content: string
          created_at: string
          created_by_user_id: string | null
          id: string
          name: string
          opened_count: number | null
          recipients_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          target_audience: string
          updated_at: string
        }
        Insert: {
          clicked_count?: number | null
          content: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          name: string
          opened_count?: number | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          target_audience?: string
          updated_at?: string
        }
        Update: {
          clicked_count?: number | null
          content?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          name?: string
          opened_count?: number | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          target_audience?: string
          updated_at?: string
        }
        Relationships: []
      }
      entitlements: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          kind: Database["public"]["Enums"]["entitlement_kind"]
          release_id: string | null
          source: string | null
          starts_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          kind: Database["public"]["Enums"]["entitlement_kind"]
          release_id?: string | null
          source?: string | null
          starts_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["entitlement_kind"]
          release_id?: string | null
          source?: string | null
          starts_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          app_version: string | null
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          id: string
          name: string
          properties: Json | null
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          name: string
          properties?: Json | null
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          name?: string
          properties?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_admin: boolean | null
          is_premium: boolean
          payment_method: string | null
          paypal_subscription_id: string | null
          paypal_subscription_status: string | null
          premium_expires_at: string | null
          role: Database["public"]["Enums"]["admin_role"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_premium?: boolean
          payment_method?: string | null
          paypal_subscription_id?: string | null
          paypal_subscription_status?: string | null
          premium_expires_at?: string | null
          role?: Database["public"]["Enums"]["admin_role"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_premium?: boolean
          payment_method?: string | null
          paypal_subscription_id?: string | null
          paypal_subscription_status?: string | null
          premium_expires_at?: string | null
          role?: Database["public"]["Enums"]["admin_role"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotional_banners: {
        Row: {
          background_color: string
          button_text: string | null
          button_url: string | null
          created_at: string
          created_by_user_id: string | null
          end_date: string | null
          id: string
          is_active: boolean
          message: string
          priority: number
          start_date: string | null
          target_audience: string
          text_color: string
          title: string
          updated_at: string
        }
        Insert: {
          background_color?: string
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          message: string
          priority?: number
          start_date?: string | null
          target_audience?: string
          text_color?: string
          title: string
          updated_at?: string
        }
        Update: {
          background_color?: string
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          message?: string
          priority?: number
          start_date?: string | null
          target_audience?: string
          text_color?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          notification_type: string
          target_audience: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          notification_type?: string
          target_audience?: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          notification_type?: string
          target_audience?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      releases: {
        Row: {
          cover_url: string | null
          created_at: string
          created_by_user_id: string | null
          id: string
          notes: string | null
          preview_only: boolean
          release_date: string | null
          release_type: Database["public"]["Enums"]["release_type"]
          status: Database["public"]["Enums"]["release_status"]
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          notes?: string | null
          preview_only?: boolean
          release_date?: string | null
          release_type?: Database["public"]["Enums"]["release_type"]
          status?: Database["public"]["Enums"]["release_status"]
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          notes?: string | null
          preview_only?: boolean
          release_date?: string | null
          release_type?: Database["public"]["Enums"]["release_type"]
          status?: Database["public"]["Enums"]["release_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shares: {
        Row: {
          created_at: string
          id: string
          platform: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          message: string | null
          payment_method: string
          paypal_order_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          supporter_email: string | null
          supporter_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          message?: string | null
          payment_method?: string
          paypal_order_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          supporter_email?: string | null
          supporter_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          message?: string | null
          payment_method?: string
          paypal_order_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          supporter_email?: string | null
          supporter_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          audio_file_url: string | null
          created_at: string
          duration_sec: number | null
          explicit: boolean | null
          hls_master_url: string | null
          id: string
          isrc: string | null
          lyrics: string | null
          release_id: string | null
          status: Database["public"]["Enums"]["track_status"]
          title: string
          track_number: number | null
          updated_at: string
        }
        Insert: {
          audio_file_url?: string | null
          created_at?: string
          duration_sec?: number | null
          explicit?: boolean | null
          hls_master_url?: string | null
          id?: string
          isrc?: string | null
          lyrics?: string | null
          release_id?: string | null
          status?: Database["public"]["Enums"]["track_status"]
          title: string
          track_number?: number | null
          updated_at?: string
        }
        Update: {
          audio_file_url?: string | null
          created_at?: string
          duration_sec?: number | null
          explicit?: boolean | null
          hls_master_url?: string | null
          id?: string
          isrc?: string | null
          lyrics?: string | null
          release_id?: string | null
          status?: Database["public"]["Enums"]["track_status"]
          title?: string
          track_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      whitelists: {
        Row: {
          added_by_admin_id: string | null
          created_at: string
          id: string
          release_id: string
          user_id: string
        }
        Insert: {
          added_by_admin_id?: string | null
          created_at?: string
          id?: string
          release_id: string
          user_id: string
        }
        Update: {
          added_by_admin_id?: string | null
          created_at?: string
          id?: string
          release_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whitelists_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_payment_field_update: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_tip_access: {
        Args: { tip_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "admin" | "editor" | "support"
      entitlement_kind: "subscription" | "whitelist" | "trial" | "purchase"
      release_status: "draft" | "scheduled" | "live" | "archived"
      release_type: "album" | "single" | "ep"
      track_status: "uploaded" | "transcoding" | "ready" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["admin", "editor", "support"],
      entitlement_kind: ["subscription", "whitelist", "trial", "purchase"],
      release_status: ["draft", "scheduled", "live", "archived"],
      release_type: ["album", "single", "ep"],
      track_status: ["uploaded", "transcoding", "ready", "failed"],
    },
  },
} as const
