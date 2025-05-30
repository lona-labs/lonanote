import React, { lazy } from 'react';

import './SideBar.scss';

const tabsRenders: Record<string, React.FC<any>> = {
  explorer: lazy(() => import('./sideBarTabs/Explorer')),
  search: lazy(() => import('./sideBarTabs/Search')),
};

export interface SideBarProps {
  tabValue?: string | undefined;
}

export const SideBar: React.FC<SideBarProps> = ({ tabValue }) => {
  const getTabRender = (tabValue: string | undefined) => {
    if (tabValue && tabsRenders[tabValue]) {
      const Tab = tabsRenders[tabValue];
      return <Tab />;
    }
    return <></>;
  };
  return <div className="desktopLayoutSidebarRoot">{getTabRender(tabValue)}</div>;
};
