import {
  Button,
  ButtonProps,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
} from '@heroui/react';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { RiResetLeftLine } from 'react-icons/ri';
import { create } from 'zustand';

import styles from './Settings.module.scss';
import { AppearanceSettings } from './subs/AppearanceSettings';
import { GlobalSettings } from './subs/GlobalSettings';
import { WorkspaceSettings } from './subs/WorkspaceSettings';

export interface SettingsProps {}

export interface SettingsStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSettingsState = create<SettingsStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

const settingsTabs = [
  {
    value: 'globalSettings',
    title: '全局设置',
  },
  {
    value: 'workspaceSettings',
    title: '工作区设置',
  },
  {
    value: 'appearance',
    title: '外观',
  },
];

interface ResetButtonProps extends ButtonProps {}

export const ResetButton: React.FC<ResetButtonProps> = (props) => {
  return (
    <Tooltip content="重置" placement="top">
      <Button isIconOnly size="sm" variant="light" {...props}>
        <RiResetLeftLine />
      </Button>
    </Tooltip>
  );
};

export interface BaseSettingsPanelProps {}

export const Settings: React.FC<SettingsProps> = () => {
  const state = useSettingsState();
  const [selectedKeys, setSelectedKeys] = useState(new Set([settingsTabs[0].value]));
  const selectedValue = useMemo(() => Array.from(selectedKeys).join(', '), [selectedKeys]);
  return (
    <Modal
      className="h-3/4"
      size="4xl"
      placement="center"
      isOpen={state.isOpen}
      onOpenChange={(v) => state.setIsOpen(v)}
    >
      <ModalContent>
        <ModalHeader>设置</ModalHeader>
        <ModalBody style={{ overflow: 'auto' }}>
          <div className={styles.settings}>
            <Listbox
              aria-label="Setting Tabs"
              className={styles.settingsTabs}
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys as any}
            >
              {settingsTabs.map((item) => {
                const isSelect = selectedKeys.has(item.value);
                return (
                  <ListboxItem
                    hideSelectedIcon
                    className={clsx(isSelect ? 'bg-default-300' : undefined)}
                    key={item.value}
                  >
                    {item.title}
                  </ListboxItem>
                );
              })}
            </Listbox>
            <div className={styles.settingsContentWrap}>
              {selectedValue === 'globalSettings' && <GlobalSettings />}
              {selectedValue === 'workspaceSettings' && <WorkspaceSettings />}
              {selectedValue === 'appearance' && <AppearanceSettings />}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
