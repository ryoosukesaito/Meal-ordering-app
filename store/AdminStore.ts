'use client'

import { create } from 'zustand'

interface AdminState {
	admin: string
}

export const useAdminStore = create<AdminState>((set, get) => ({
	admin: ''
}))
