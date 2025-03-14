import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={toggleTheme}
      aria-label={t("common.toggleTheme")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-gray-600" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </Button>
  );
};

export default ThemeToggle;
