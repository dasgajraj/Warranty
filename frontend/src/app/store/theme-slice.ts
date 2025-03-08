import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ThemeState = {
  mode: "light" | "dark"
}

// Initialize theme from localStorage if available, otherwise default to light
const getInitialTheme = (): ThemeState => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || savedTheme === "light") {
      return { mode: savedTheme }
    }
  }
  return { mode: "light" }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode)
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode)
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer

