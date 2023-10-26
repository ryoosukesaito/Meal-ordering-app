// 'use client'

import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { auth } from '@/firebase'
interface AuthState {
  customer: {
    id: string
    tableName: string
  }

  setCustomer: (id: string, table: string) => void
}

interface Credentials {
  email: string
  password: string
}

interface AdminAuthState {
  isLoggedIn: boolean
  errorMsg: string
  setAdminLogin: (credentials: Credentials) => void
  setAdminLogout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: { id: '', tableName: '' },
      setCustomer: (id, table) =>
        set({ customer: { id: id, tableName: table } })
    }),
    {
      name: 'user'
    }
  )
)

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      errorMsg: '',
      setAdminLogin: (credentials) => {
        const { email, password } = credentials
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            set({ isLoggedIn: auth.currentUser !== null })
            set({ errorMsg: '' })
            window.location.replace('/admin/dashboard')
          })
          .catch((err) => {
            const errMsg = 'There is something wrong with Email or Password.'
            set({ errorMsg: errMsg })
            console.error(err)
          })
      },
      setAdminLogout: () => {
        signOut(auth)
          .then(() => {
            console.log('User logged out')
            set({ isLoggedIn: false })
            window.location.replace('/admin/login')
          })
          .catch((err) => set({ errorMsg: err }))
      }
    }),
    { name: 'admin' }
  )
)
