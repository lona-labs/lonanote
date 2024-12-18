import { ThemeProvider } from './theme';

export const AppTheme = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
