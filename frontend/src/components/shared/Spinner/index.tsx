import React from 'react';

import { SpinnerIcon } from './styles';

// Interface
interface ISpinnerProps {
  size?: string;
  color?: string;
  background?: string;
  [x: string]: any;
};

export default function Spinner({
  size = '11em',
  color = 'white',
  background = 'transparent',
  ...props
}: ISpinnerProps) {
  const sizeArr = size.split(/(\d+)/);
  sizeArr.shift();

  const sizeNumber = sizeArr[0];
  const sizeUnit = sizeArr.length == 2 ? sizeArr[1] : 'px';

  return (
    <SpinnerIcon
      className={"spinner"}
      sizeNumber={sizeNumber}
      sizeUnit={sizeUnit}
      color={color}
      background={background}
      {...props}
    />
  );
}
