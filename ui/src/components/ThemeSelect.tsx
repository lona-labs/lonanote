import { ColorMode, colorModeList, useColorMode } from '@/utils/theme';

const colorModeI18n = {
  light: {
    zh_CN: '浅色',
  },
  dark: {
    zh_CN: '深色',
  },
  system: {
    zh_CN: '跟随系统',
  },
};

export const ThemeSelect = (props: { width?: string | number }) => {
  const { colorMode, setColorMode } = useColorMode();
  return (
    <select
      value={colorMode}
      onChange={(e) => {
        const newValue = e.target.value;
        if (newValue != null) {
          setColorMode(newValue as ColorMode);
        }
      }}
    >
      {colorModeList.map((item, index) => (
        <option key={index} value={item}>
          {colorModeI18n[item].zh_CN}
        </option>
      ))}
    </select>
  );
};
