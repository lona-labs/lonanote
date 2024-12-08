import { useMediaQuery } from 'react-responsive';

import { os } from '@/config';

import { useWindowSize } from './useWindowSize';

// 平板电脑或桌面
export const useDesktop = () => useMediaQuery({ minWidth: 768 });

interface Props {
  children?: React.ReactNode;
}

export const Desktop = ({ children }: Props) => {
  return useDesktop() ? children : undefined;
};

export const Mobile = ({ children }: Props) => {
  return !useDesktop() ? children : undefined;
};

export const useTitle = () => {
  const desktop = os.desktop;
  const [, h] = useWindowSize();
  const titleHeight = desktop ? 32 : 0;
  const contentHeight = h - titleHeight;
  return {
    titleHeight,
    contentHeight,
  };
};
