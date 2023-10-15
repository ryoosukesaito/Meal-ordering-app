// 'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  admin: string
  customer: {
    id: string
    tableName: string
  }
  setCustomer: (id: string, table: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: '',
      customer: { id: '', tableName: '' },
      setCustomer: (id, table) =>
        set({ customer: { id: id, tableName: table } })
    }),
    {
      name: 'user'
    }
  )
)
