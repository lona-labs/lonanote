import { Spinner } from '@heroui/react';

import { useGlobalSpinnerStore } from '@/models/global';

let showSpinnerTimeId: number | null = null;

export const showSpinner = (content: string | null) => {
  if (showSpinnerTimeId) {
    window.clearTimeout(showSpinnerTimeId);
    showSpinnerTimeId = null;
  }
  // 延迟一定时间显示Spinner, 当时间过快时不会显示Spinner
  showSpinnerTimeId = window.setTimeout(() => {
    showSpinnerTimeId = null;
    useGlobalSpinnerStore.setState({ open: true, content });
  }, 300);
};

export const hideSpinner = () => {
  if (showSpinnerTimeId) {
    window.clearTimeout(showSpinnerTimeId);
    showSpinnerTimeId = null;
  }
  useGlobalSpinnerStore.setState({ open: false });
};

export const GlobalSpinner = () => {
  const store = useGlobalSpinnerStore();
  // <Box
  //   visibility={store.open ? 'visible' : 'hidden'}
  //   zIndex={9998}
  //   pos="absolute"
  //   inset="0"
  //   bg="bg/80"
  //   pointerEvents="auto"
  // >
  //   <Center h="full">
  //     <Spinner color="teal.500" />
  //     <div style={{ marginLeft: '10px' }}>{store.content}</div>
  //   </Center>
  // </Box>
  return (
    <div
      className="h-full w-full absolute inset-0 pointer-events-auto"
      style={{
        visibility: store.open ? 'visible' : 'hidden',
        zIndex: 9998,
      }}
    >
      <Spinner />
    </div>
  );
};
