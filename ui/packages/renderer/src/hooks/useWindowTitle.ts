import { useState } from 'react';

import { utils } from '@/utils';

import { useEffect } from './useEffect';
import { useInited } from './useInited';

export const defaultTitleHeight = utils.isDesktop() ? 30 : 0;

export const useWindowTitleHeight = () => {
  const [titleHeight, setTitleHeight] = useState(defaultTitleHeight);
  useEffect(() => {
    if (window.api) {
      const onZoomChange = (zoom: number) => {
        const h = utils.getTitleHeight(zoom, defaultTitleHeight);
        // console.log(zoom, h, titleHeight);
        if (h !== titleHeight) {
          setTitleHeight(h);
        }
      };
      window.api.utils.addZoomChangeListener(onZoomChange);
      return () => window.api?.utils.removeZoomChangeListener(onZoomChange);
    }
    return undefined;
  }, [titleHeight]);
  useInited(async () => {
    if (window.api) {
      const initZoom = await window.api.utils.getZoom();
      if (initZoom && initZoom !== titleHeight) {
        const h = utils.getTitleHeight(initZoom, defaultTitleHeight);
        if (h !== titleHeight) {
          setTitleHeight(h);
        }
      }
    }
  });
  return titleHeight;
};
