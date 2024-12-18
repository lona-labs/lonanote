type LinkProps = {
  to: string;
  children?: React.ReactNode;
};

export const Link = (props: LinkProps) => {
  return (
    <a
      href="#"
      onClick={() => {
        // navigate(props.to)
      }}
      {...props}
    >
      {props.children}
    </a>
  );
};
