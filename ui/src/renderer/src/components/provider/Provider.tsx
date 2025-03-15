'use client';

import { HeroUIProvider, HeroUIProviderProps } from '@heroui/react';
import { Href, RouterOptions } from '@react-types/shared';

import { ColorModeProvider } from './ColorModeProvider';

const navigate = async (path: Href, routerOptions: RouterOptions | undefined) => {
  if (window.navigate) {
    await window.navigate(path, routerOptions);
  }
};

export function Provider(props: HeroUIProviderProps) {
  return (
    <HeroUIProvider style={{ height: '100%', width: '100%' }} navigate={navigate} {...props}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </HeroUIProvider>
  );
}
