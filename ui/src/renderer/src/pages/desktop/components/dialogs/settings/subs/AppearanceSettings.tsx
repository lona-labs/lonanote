import { Input } from '@heroui/react';

import { ColorModeSelect } from '@/components';
import {
  defaultThemeColor,
  isSupportResizeWindow,
  isSupportZoom,
  resetWindowSize,
  setThemeColor,
  setZoom,
  useUISettings,
} from '@/controller/settings';

import { BaseSettingsPanelProps, ResetButton } from '../Settings';
import styles from '../Settings.module.scss';

export interface AppearanceSettingsProps extends BaseSettingsPanelProps {}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = () => {
  const settings = useUISettings();
  const themeColor = settings.themeColor;
  return (
    <div className={styles.appearanceSettings}>
      <div className={styles.rowSettings}>
        <div className={styles.rowSettingsLeft}>颜色模式：</div>
        <div className={styles.rowSettingsRight}>
          <ColorModeSelect variant="faded" className="w-full" size="sm" />
        </div>
      </div>
      <div className={styles.rowSettings}>
        <div className={styles.rowSettingsLeft}>主题颜色：</div>
        <div className={styles.rowSettingsRight}>
          <Input
            size="sm"
            variant="faded"
            spellCheck="false"
            value={themeColor}
            onValueChange={(v) => setThemeColor(v)}
          />
          <ResetButton className="ml-1" onPress={() => setThemeColor(defaultThemeColor)} />
          {/* TODO ColorPicker */}
          {/* <ColorPicker.Root
            width="100%"
            size="sm"
            value={parseColor(themeColor)}
            onValueChange={(v) => setThemeColor(v.valueAsString)}
          >
            <ColorPicker.Control>
              <ColorPicker.Input />
              <ColorPicker.Trigger />
              <ResetButton onClick={() => setThemeColor(defaultThemeColor)} />
            </ColorPicker.Control>
            <ColorPicker.Content portalRef={contentRef}>
              <ColorPicker.Area />
              <HStack>
                <ColorPicker.EyeDropper />
                <ColorPicker.Sliders />
              </HStack>
            </ColorPicker.Content>
          </ColorPicker.Root> */}
        </div>
      </div>
      {isSupportZoom() && settings.zoom != null && (
        <div className={styles.rowSettings}>
          <div className={styles.rowSettingsLeft}>缩放：</div>
          <div className={styles.rowSettingsRight}>
            <Input
              size="sm"
              type="number"
              variant="faded"
              value={settings.zoom.toString()}
              onValueChange={(v) => setZoom(parseInt(v))}
              min={-8}
              max={8}
            />
            <ResetButton className="ml-1" onPress={() => setZoom(0)} />
          </div>
        </div>
      )}
      {isSupportResizeWindow() && settings.windowSize && (
        <div className={styles.rowSettings}>
          <div className={styles.rowSettingsLeft}>窗口大小：</div>
          <div className={styles.rowSettingsRight}>
            <div>{`宽: ${settings.windowSize.width}, 高: ${settings.windowSize.height}`}</div>
            <ResetButton onPress={() => resetWindowSize()} />
          </div>
        </div>
      )}
    </div>
  );
};
