import type { IconButtonProps as ChakraIconButtonProps } from '@chakra-ui/react';
import { IconButton as ChakraIconButton } from '@chakra-ui/react';
import * as React from 'react';

export interface IconButtonProps extends ChakraIconButtonProps {}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { children, ...rest } = props;
    return (
      <ChakraIconButton ref={ref} color="primary.700" {...rest}>
        {children}
      </ChakraIconButton>
    );
  },
);