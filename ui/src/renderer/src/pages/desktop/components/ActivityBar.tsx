import { Button, Tab, Tabs, Tooltip } from '@heroui/react';
import { ReactNode } from 'react';
import { LuFolder, LuLibraryBig, LuSearch, LuSettings } from 'react-icons/lu';

// import { VscExtensions } from 'react-icons/vsc';

import styles from './ActivityBar.module.scss';
import { useSettingsState } from './dialogs/settings';
import { useWorkspaceManagerState } from './dialogs/workspaceManager';

export interface ActivityBarProps {
  tabValue: string | undefined;
  onTabChange: (v: string) => void;
  isShowTabContent?: boolean;
  setShowTabContent?: (isShow: boolean) => void;
}

export interface FunctionType {
  value: string;
  title?: ReactNode;
  tooltip?: string;
}

const tabs: FunctionType[] = [
  {
    value: 'explorer',
    title: <LuFolder strokeWidth={2.5} />,
    tooltip: '资源管理器',
  },
  {
    value: 'search',
    title: <LuSearch strokeWidth={2.5} />,
    tooltip: '搜索',
  },
  // {
  //   value: 'extensions',
  //   title: <VscExtensions strokeWidth={1} />,
  //   tooltip: '扩展',
  // },
];

const fixedBtns: FunctionType[] = [
  {
    value: 'workspace',
    title: <LuLibraryBig />,
    tooltip: '工作区',
  },
  {
    value: 'settings',
    title: <LuSettings />,
    tooltip: '设置',
  },
];

const bottomBtnHeight = 40;
const bottomGap = 2;
const bottomHeight = fixedBtns.length * bottomBtnHeight + (fixedBtns.length - 1) * bottomGap;
const topHeight = `calc(100% - ${bottomHeight}px)`;

const onBtnClick = (value: string) => {
  if (value === 'workspace') {
    useWorkspaceManagerState.getState().setIsOpen(true);
  } else if (value === 'settings') {
    useSettingsState.getState().setIsOpen(true);
  }
};

export const ActivityBar: React.FC<ActivityBarProps> = ({
  tabValue,
  isShowTabContent,
  setShowTabContent,
  onTabChange,
}) => {
  const curTabValue = tabValue || tabs[0].value;
  return (
    <div className={styles.title}>
      <div style={{ height: topHeight }} className={styles.titleTop}>
        <Tabs
          className={styles.titleTabRoot}
          color="primary"
          variant="light"
          isVertical
          fullWidth
          disableAnimation
          classNames={{
            tab: 'p-0',
            tabContent: 'p-0 w-full h-full',
          }}
          selectedKey={isShowTabContent ? curTabValue : ''}
          onSelectionChange={(v) => {
            onTabChange(v as string);
            if (v === curTabValue) {
              setShowTabContent?.(!isShowTabContent);
            } else {
              setShowTabContent?.(true);
            }
          }}
          items={tabs}
        >
          {(tab) => (
            <Tab
              key={tab.value}
              title={
                <Tooltip content={tab.tooltip} placement="right" delay={200}>
                  <div className="w-full h-full flex justify-center items-center">{tab.title}</div>
                </Tooltip>
              }
            />
          )}
        </Tabs>
      </div>
      <div style={{ height: bottomHeight, gap: bottomGap }} className={styles.titleBottom}>
        {fixedBtns.map((item) => (
          <div key={item.value}>
            <Tooltip content={item.tooltip} placement="right">
              <Button
                isIconOnly
                onPress={() => onBtnClick(item.value)}
                className={styles.titleBottomItem}
                variant="light"
              >
                {item.title}
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};
