import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

import { GlobalDialogOption, GlobalDialogType, useGlobalDialogStore } from '@/models/global';

export const showDialog = (options: GlobalDialogOption) => {
  const optionsNew: GlobalDialogType = { options, open: true };
  useGlobalDialogStore.setState(optionsNew);
};

export const closeDialog = () => {
  const s = useGlobalDialogStore.getState();
  if (s.open) {
    const onClose = s.options.onClose;
    useGlobalDialogStore.setState({ open: false, options: {} });
    if (onClose) {
      onClose();
    }
  }
};

export const GlobalDialog = () => {
  const state = useGlobalDialogStore();
  const ops = state.options;
  const close = () => {
    if (ops.onClose) {
      ops.onClose();
    }
  };
  return (
    <Modal
      size={ops.size}
      placement={ops.placement || 'center'}
      motionProps={ops.motionProps}
      disableAnimation={ops.disableAnimation}
      scrollBehavior={ops.scrollBehavior}
      isKeyboardDismissDisabled={ops.isKeyboardDismissDisabled}
      isDismissable={ops.isDismissable}
      hideCloseButton={ops.hideCloseBtn}
      isOpen={state.open}
      onOpenChange={(v) => {
        if (v === false) {
          useGlobalDialogStore.setState({ open: false });
          close();
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{ops.title}</ModalHeader>
            <ModalBody style={{ overflow: 'auto' }}>{ops.content}</ModalBody>
            {!ops.hideCancelBtn && !ops.hideOkBtn && (
              <ModalFooter>
                {!ops.hideCancelBtn && (
                  <Button
                    variant={ops.cancelBtnVariant || 'bordered'}
                    color={ops.cancelBtnColor || 'danger'}
                    onPress={() => {
                      ops.onCancel?.();
                      if (ops.closeCancel !== false) {
                        onClose();
                      }
                    }}
                  >
                    {ops.cancelText || '取消'}
                  </Button>
                )}
                {!ops.hideOkBtn && (
                  <Button
                    variant={ops.okBtnVariant}
                    color={ops.okBtnColor}
                    onPress={() => {
                      ops.onOk?.();
                      if (ops.closeOk !== false) {
                        onClose();
                        close();
                      }
                    }}
                  >
                    {ops.okText || '确定'}
                  </Button>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
