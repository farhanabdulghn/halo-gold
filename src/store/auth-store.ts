import { create } from "zustand";

type LoginResult = { success: true } | { success: false; message: string };

type AuthState = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userEmail: null,

  login: async (email, password) => {
    const trimmedEmail = email.trim();
    const isValidEmail = /^\S+@\S+\.\S+$/.test(trimmedEmail);

    if (!trimmedEmail || !password) {
      return { success: false, message: "Email dan kata sandi wajib diisi." };
    }
    if (!isValidEmail) {
      return { success: false, message: "Format email tidak valid." };
    }
    if (password.length < 4) {
      return { success: false, message: "Kata sandi minimal 4 karakter." };
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    set({ isAuthenticated: true, userEmail: trimmedEmail });
    return { success: true };
  },

  logout: () => set({ isAuthenticated: false, userEmail: null }),
}));
