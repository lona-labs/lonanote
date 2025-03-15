import { semanticColors } from '@heroui/theme';
import { useEffect } from 'react';

import { isElectron } from '@/bindings/core';
import { useWindowTitleHeight } from '@/hooks';

import { useColorMode } from './provider/ColorModeProvider';

const titlebarStyle = `
.titlebar {
  ${isElectron ? 'app-region: drag;' : ''}
  user-select: none;
  position: fixed;
  width: 100%;
  pointer-events: none;
}
`;

export const Title = () => {
  const { resolvedColorMode } = useColorMode();
  useEffect(() => {
    if (!window.api) return;
    requestAnimationFrame(() => {
      if (window.api && resolvedColorMode) {
        const c = semanticColors[resolvedColorMode];
        const bg = typeof c.background === 'string' ? c.background : c.background.DEFAULT;
        const fg = typeof c.foreground === 'string' ? c.foreground : c.foreground.DEFAULT;
        window.api.utils.setTitleBarColor(fg || '#000000', bg || '#ffffff');
      }
    });
  }, [resolvedColorMode]);
  const titleHeight = useWindowTitleHeight();
  return (
    <>
      <style>{titlebarStyle}</style>
      <div className="titlebar" style={{ height: titleHeight }}></div>
    </>
  );
};
