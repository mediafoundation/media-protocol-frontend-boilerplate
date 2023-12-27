import { useTheme } from "next-themes"

export const useCurrentTheme = () => {
  const { systemTheme, theme } = useTheme()
  const currentTheme = theme === "system" ? systemTheme : theme
  return currentTheme as string
}
export default useCurrentTheme
