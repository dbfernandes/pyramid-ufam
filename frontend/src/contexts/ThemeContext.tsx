import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  isLightTheme: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    const storedTheme = window.localStorage.getItem('isLightTheme');
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isLightTheme ? 'light' : 'dark');
  }, [isLightTheme]);

  const toggleTheme = () => {
    setIsLightTheme(prev => {
      const newTheme = !prev;
      window.localStorage.setItem('isLightTheme', JSON.stringify(newTheme));
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
