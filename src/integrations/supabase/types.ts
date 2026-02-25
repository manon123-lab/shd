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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      donations: {
        Row: {
          accepted_by: string | null
          accepted_by_name: string | null
          address: string
          category: string
          created_at: string | null
          description: string | null
          donor_id: string | null
          donor_name: string
          donor_org: string | null
          expires_in: string | null
          food_type: string
          id: string
          lat: number | null
          lng: number | null
          pickup_time: string
          quantity: string
          status: string
        }
        Insert: {
          accepted_by?: string | null
          accepted_by_name?: string | null
          address: string
          category?: string
          created_at?: string | null
          description?: string | null
          donor_id?: string | null
          donor_name: string
          donor_org?: string | null
          expires_in?: string | null
          food_type: string
          id?: string
          lat?: number | null
          lng?: number | null
          pickup_time: string
          quantity: string
          status?: string
        }
        Update: {
          accepted_by?: string | null
          accepted_by_name?: string | null
          address?: string
          category?: string
          created_at?: string | null
          description?: string | null
          donor_id?: string | null
          donor_name?: string
          donor_org?: string | null
          expires_in?: string | null
          food_type?: string
          id?: string
          lat?: number | null
          lng?: number | null
          pickup_time?: string
          quantity?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_requests: {
        Row: {
          address: string
          beneficiaries: number | null
          created_at: string | null
          description: string | null
          food_type: string
          fulfilled_by: string | null
          fulfilled_by_name: string | null
          id: string
          lat: number | null
          lng: number | null
          quantity: string
          requester_id: string | null
          requester_name: string
          requester_org: string | null
          status: string
          urgency: string
        }
        Insert: {
          address: string
          beneficiaries?: number | null
          created_at?: string | null
          description?: string | null
          food_type: string
          fulfilled_by?: string | null
          fulfilled_by_name?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          quantity: string
          requester_id?: string | null
          requester_name: string
          requester_org?: string | null
          status?: string
          urgency?: string
        }
        Update: {
          address?: string
          beneficiaries?: number | null
          created_at?: string | null
          description?: string | null
          food_type?: string
          fulfilled_by?: string | null
          fulfilled_by_name?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          quantity?: string
          requester_id?: string | null
          requester_name?: string
          requester_org?: string | null
          status?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_requests_fulfilled_by_fkey"
            columns: ["fulfilled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          organization: string | null
          phone: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          organization?: string | null
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          organization?: string | null
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: string
          capacity: number | null
          created_at: string | null
          current_stock: number | null
          id: string
          lat: number | null
          lng: number | null
          manager: string | null
          name: string
          phone: string | null
          status: string
          type: string
        }
        Insert: {
          address: string
          capacity?: number | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          manager?: string | null
          name: string
          phone?: string | null
          status?: string
          type?: string
        }
        Update: {
          address?: string
          capacity?: number | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          manager?: string | null
          name?: string
          phone?: string | null
          status?: string
          type?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
