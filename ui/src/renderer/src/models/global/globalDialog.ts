import { HTMLMotionProps } from 'framer-motion';
import { create } from 'zustand';

export interface GlobalDialogType {
  open: boolean;
  options: GlobalDialogOption;
}

export type ButtonColorType =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | undefined;
export type ButtonVariantType =
  | 'solid'
  | 'flat'
  | 'bordered'
  | 'light'
  | 'faded'
  | 'shadow'
  | 'ghost'
  | undefined;

export interface GlobalDialogOption {
  content?: string | null;
  title?: string | null;
  isKeyboardDismissDisabled?: boolean;
  isDismissable?: boolean;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | '2xl' | '3xl' | '4xl' | '5xl' | undefined;
  /** @default "normal" */
  scrollBehavior?: 'normal' | 'inside' | 'outside';
  /** @default "center" */
  placement?: 'center' | 'auto' | 'top' | 'top-center' | 'bottom' | 'bottom-center' | undefined;
  motionProps?: HTMLMotionProps<'section'>;
  disableAnimation?: boolean;
  okText?: string;
  cancelText?: string;
  okBtnVariant?: ButtonVariantType;
  cancelBtnVariant?: ButtonVariantType;
  okBtnColor?: ButtonColorType;
  cancelBtnColor?: ButtonColorType;
  /** 隐藏确定按钮 */
  hideOkBtn?: boolean;
  /** 隐藏取消按钮 */
  hideCancelBtn?: boolean;
  /** 隐藏关闭按钮 */
  hideCloseBtn?: boolean;
  /** 点击确定按钮时关闭 */
  closeOk?: boolean;
  /** 点击取消按钮时关闭 */
  closeCancel?: boolean;
  onOk?: (() => void) | null;
  onCancel?: (() => void) | null;
  onClose?: (() => void) | null;
}

export const useGlobalDialogStore = create<GlobalDialogType>(() => ({
  open: false,
  options: {},
}));
