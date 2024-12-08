interface LogoProps {
  size?: number;
  radius?: number;
  boxShadow?: string;
}

export const Logo = (props: LogoProps) => {
  const { size, radius } = props;
  const width = size || 100;
  const height = size || 100;
  let borderRadius = radius;
  if (borderRadius === undefined) {
    borderRadius = width * 0.22;
  }
  const boxShadow = props.boxShadow || '5px 5px 10px rgba(0, 0, 0, 0.1)';
  return (
    <div>
      <img style={{ width, height, borderRadius, boxShadow }} src="/icon.png" />
    </div>
  );
};
