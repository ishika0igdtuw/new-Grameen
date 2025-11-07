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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bulk_purchases: {
        Row: {
          avg_price_per_ton: number
          buyer_id: string
          created_at: string
          crop_type: Database["public"]["Enums"]["crop_type"]
          disposal_method: Database["public"]["Enums"]["disposal_method"]
          id: string
          notes: string | null
          panchayat_id: string
          payment_id: string | null
          payment_status: string | null
          pickup_date: string | null
          total_amount: number
          total_quantity_tons: number
          updated_at: string
        }
        Insert: {
          avg_price_per_ton: number
          buyer_id: string
          created_at?: string
          crop_type: Database["public"]["Enums"]["crop_type"]
          disposal_method: Database["public"]["Enums"]["disposal_method"]
          id?: string
          notes?: string | null
          panchayat_id: string
          payment_id?: string | null
          payment_status?: string | null
          pickup_date?: string | null
          total_amount: number
          total_quantity_tons: number
          updated_at?: string
        }
        Update: {
          avg_price_per_ton?: number
          buyer_id?: string
          created_at?: string
          crop_type?: Database["public"]["Enums"]["crop_type"]
          disposal_method?: Database["public"]["Enums"]["disposal_method"]
          id?: string
          notes?: string | null
          panchayat_id?: string
          payment_id?: string | null
          payment_status?: string | null
          pickup_date?: string | null
          total_amount?: number
          total_quantity_tons?: number
          updated_at?: string
        }
        Relationships: []
      }
      crop_residue_listings: {
        Row: {
          created_at: string
          crop_type: Database["public"]["Enums"]["crop_type"]
          disposal_method: Database["public"]["Enums"]["disposal_method"]
          farmer_id: string
          harvest_date: string | null
          id: string
          latitude: number | null
          location_description: string | null
          longitude: number | null
          panchayat_id: string
          price_per_ton: number | null
          quantity_tons: number
          status: Database["public"]["Enums"]["residue_status"]
          updated_at: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          crop_type: Database["public"]["Enums"]["crop_type"]
          disposal_method: Database["public"]["Enums"]["disposal_method"]
          farmer_id: string
          harvest_date?: string | null
          id?: string
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          panchayat_id: string
          price_per_ton?: number | null
          quantity_tons: number
          status?: Database["public"]["Enums"]["residue_status"]
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          crop_type?: Database["public"]["Enums"]["crop_type"]
          disposal_method?: Database["public"]["Enums"]["disposal_method"]
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          panchayat_id?: string
          price_per_ton?: number | null
          quantity_tons?: number
          status?: Database["public"]["Enums"]["residue_status"]
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_residue_listings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_residue_listings_panchayat_id_fkey"
            columns: ["panchayat_id"]
            isOneToOne: false
            referencedRelation: "aggregated_crop_listings"
            referencedColumns: ["panchayat_id"]
          },
          {
            foreignKeyName: "crop_residue_listings_panchayat_id_fkey"
            columns: ["panchayat_id"]
            isOneToOne: false
            referencedRelation: "panchayats"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_payment_distributions: {
        Row: {
          bulk_purchase_id: string
          created_at: string
          farmer_id: string
          id: string
          payment_amount: number
          payment_status: string | null
          price_per_ton: number
          quantity_tons: number
          residue_listing_id: string
          updated_at: string
        }
        Insert: {
          bulk_purchase_id: string
          created_at?: string
          farmer_id: string
          id?: string
          payment_amount: number
          payment_status?: string | null
          price_per_ton: number
          quantity_tons: number
          residue_listing_id: string
          updated_at?: string
        }
        Update: {
          bulk_purchase_id?: string
          created_at?: string
          farmer_id?: string
          id?: string
          payment_amount?: number
          payment_status?: string | null
          price_per_ton?: number
          quantity_tons?: number
          residue_listing_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_payment_distributions_bulk_purchase_id_fkey"
            columns: ["bulk_purchase_id"]
            isOneToOne: false
            referencedRelation: "bulk_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_payment_distributions_residue_listing_id_fkey"
            columns: ["residue_listing_id"]
            isOneToOne: false
            referencedRelation: "crop_residue_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      farmers: {
        Row: {
          aadhar_number: string | null
          bank_account_number: string | null
          bank_ifsc_code: string | null
          created_at: string
          crop_types: string[] | null
          farmer_name: string
          farmer_phone: string | null
          id: string
          land_area_acres: number | null
          latitude: number | null
          longitude: number | null
          panchayat_id: string
          parent_name: string | null
          profile_id: string | null
          updated_at: string
          upi_id: string | null
          verification_notes: string | null
          verification_status: string | null
          village: string
        }
        Insert: {
          aadhar_number?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          created_at?: string
          crop_types?: string[] | null
          farmer_name: string
          farmer_phone?: string | null
          id?: string
          land_area_acres?: number | null
          latitude?: number | null
          longitude?: number | null
          panchayat_id: string
          parent_name?: string | null
          profile_id?: string | null
          updated_at?: string
          upi_id?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          village: string
        }
        Update: {
          aadhar_number?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          created_at?: string
          crop_types?: string[] | null
          farmer_name?: string
          farmer_phone?: string | null
          id?: string
          land_area_acres?: number | null
          latitude?: number | null
          longitude?: number | null
          panchayat_id?: string
          parent_name?: string | null
          profile_id?: string | null
          updated_at?: string
          upi_id?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          village?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmers_panchayat_id_fkey"
            columns: ["panchayat_id"]
            isOneToOne: false
            referencedRelation: "aggregated_crop_listings"
            referencedColumns: ["panchayat_id"]
          },
          {
            foreignKeyName: "farmers_panchayat_id_fkey"
            columns: ["panchayat_id"]
            isOneToOne: false
            referencedRelation: "panchayats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_bookings: {
        Row: {
          booking_date: string
          cost: number | null
          created_at: string
          duration_hours: number | null
          farmer_id: string
          field_size_acres: number | null
          id: string
          machine_type: Database["public"]["Enums"]["machine_type"]
          notes: string | null
          panchayat_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          booking_date: string
          cost?: number | null
          created_at?: string
          duration_hours?: number | null
          farmer_id: string
          field_size_acres?: number | null
          id?: string
          machine_type: Database["public"]["Enums"]["machine_type"]
          notes?: string | null
          panchayat_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          booking_date?: string
          cost?: number | null
          created_at?: string
          duration_hours?: number | null
          farmer_id?: string
          field_size_acres?: number | null
          id?: string
          machine_type?: Database["public"]["Enums"]["machine_type"]
          notes?: string | null
          panchayat_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_bookings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_bookings_panchayat_id_fkey"
            columns: ["panchayat_id"]
            isOneToOne: false
            referencedRelation: "aggregated_crop_listings"
            referencedColumns: ["panchayat_id"]
          },
          {
            foreignKeyName: "machine_bookings_panchayat_id_fkey"
            columns: ["panchayat_id"]
            isOneToOne: false
            referencedRelation: "panchayats"
            referencedColumns: ["id"]
          },
        ]
      }
      panchayats: {
        Row: {
          admin_id: string
          created_at: string
          district: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          state: string
          updated_at: string
          village: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          district: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          state: string
          updated_at?: string
          village: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          district?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string
          updated_at?: string
          village?: string
        }
        Relationships: [
          {
            foreignKeyName: "panchayats_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string | null
          pickup_date: string | null
          quantity_tons: number
          residue_listing_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string | null
          pickup_date?: string | null
          quantity_tons: number
          residue_listing_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string | null
          pickup_date?: string | null
          quantity_tons?: number
          residue_listing_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_residue_listing_id_fkey"
            columns: ["residue_listing_id"]
            isOneToOne: false
            referencedRelation: "crop_residue_listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      aggregated_crop_listings: {
        Row: {
          avg_price_per_ton: number | null
          contributing_farmers: string[] | null
          crop_type: Database["public"]["Enums"]["crop_type"] | null
          disposal_method: Database["public"]["Enums"]["disposal_method"] | null
          district: string | null
          earliest_harvest_date: string | null
          farmer_count: number | null
          latest_harvest_date: string | null
          max_price_per_ton: number | null
          min_price_per_ton: number | null
          panchayat_id: string | null
          panchayat_name: string | null
          state: string | null
          total_quantity_tons: number | null
          village: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_farmer_payment_distributions: {
        Args: {
          bulk_purchase_id_param: string
          crop_type_param: Database["public"]["Enums"]["crop_type"]
          disposal_method_param: Database["public"]["Enums"]["disposal_method"]
          panchayat_id_param: string
          total_purchase_amount: number
        }
        Returns: undefined
      }
    }
    Enums: {
      booking_status: "pending" | "approved" | "completed" | "cancelled"
      crop_type:
        | "paddy"
        | "wheat"
        | "sunflower"
        | "husk"
        | "sugarcane"
        | "cotton"
        | "maize"
      disposal_method: "sell_for_profit" | "free_pickup" | "local_recycling"
      machine_type: "happy_seeder" | "mulcher" | "baler" | "combine_harvester"
      residue_status: "available" | "sold" | "booked" | "disposed"
      user_role: "panchayat_admin" | "farmer" | "buyer"
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
      booking_status: ["pending", "approved", "completed", "cancelled"],
      crop_type: [
        "paddy",
        "wheat",
        "sunflower",
        "husk",
        "sugarcane",
        "cotton",
        "maize",
      ],
      disposal_method: ["sell_for_profit", "free_pickup", "local_recycling"],
      machine_type: ["happy_seeder", "mulcher", "baler", "combine_harvester"],
      residue_status: ["available", "sold", "booked", "disposed"],
      user_role: ["panchayat_admin", "farmer", "buyer"],
    },
  },
} as const
