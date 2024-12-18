import { createContext, useContext, useEffect, useState } from 'react';

const colorModeKey = 'current-color-mode';
export const colorModeList = ['light', 'dark', 'system'] as const;

export type ColorMode = (typeof colorModeList)[number];
export type CurrentColorMode = 'light' | 'dark';

export type ThemeProviderProps = {
  children: React.ReactNode;
  updateColorMode?: (colorMode: ColorMode) => boolean | undefined | void;
};

export type ThemeProviderState = {
  currentColorMode: CurrentColorMode;
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
};

const initialState: ThemeProviderState = {
  currentColorMode: 'light',
  colorMode: 'system',
  setColorMode: () => null,
};

export const getCurrentColorMode = (colorMode?: ColorMode): CurrentColorMode => {
  colorMode = colorMode || getColorMode();
  return colorMode === 'system' ? getSystemColorMode() : colorMode;
};

export const getColorMode = (): ColorMode => {
  return (localStorage.getItem(colorModeKey) as ColorMode) || 'system';
};

const saveColorMode = (colorMode: ColorMode) => {
  localStorage.setItem(colorModeKey, colorMode);
};

const getSystemColorMode = (): CurrentColorMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const colorModeClass = {
  system: undefined,
  light: 'light',
  dark: 'dark',
};

const ColorModeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => getColorMode());
  const [currentColorMode, setCurrentColorMode] = useState<CurrentColorMode>(() =>
    getCurrentColorMode(colorMode),
  );
  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const updateColorMode = (colorMode: ColorMode) => {
      if (props.updateColorMode && props.updateColorMode(colorMode)) {
        return;
      }
      const root = window.document.body;
      const classList = Object.values(colorModeClass).filter((c) => c !== undefined);
      root.classList.remove(...classList);
      if (colorMode === 'system') {
        const systemColorMode = getSystemColorMode();
        if (colorModeClass[systemColorMode]) {
          root.classList.add(colorModeClass[systemColorMode]);
        }
      } else {
        if (colorModeClass[colorMode]) {
          root.classList.add(colorModeClass[colorMode]);
        }
      }
    };
    const onColorModeChange: (this: MediaQueryList, ev: MediaQueryListEvent) => any = ({
      matches,
    }) => {
      if (colorMode === 'system') {
        setCurrentColorMode(matches ? 'dark' : 'light');
        updateColorMode(colorMode);
      }
    };
    matchMedia.addEventListener('change', onColorModeChange);
    updateColorMode(colorMode);
    return () => {
      if (matchMedia) {
        matchMedia.removeEventListener('change', onColorModeChange);
      }
    };
  }, [colorMode]);
  const value = {
    currentColorMode,
    colorMode,
    setColorMode: (colorMode: ColorMode) => {
      setColorMode(colorMode);
      setCurrentColorMode(getCurrentColorMode(colorMode));
      saveColorMode(colorMode);
    },
  };
  return (
    <ColorModeProviderContext.Provider {...props} value={value}>
      {children}
    </ColorModeProviderContext.Provider>
  );
}

export const useColorMode = () => {
  const context = useContext(ColorModeProviderContext);
  if (context === undefined)
    throw new Error('useColorMode must be used within a ColorModeProvider');
  return context;
};
