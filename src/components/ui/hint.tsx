import type { ReactElement } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type HintProps = {
  children: ReactElement;
  label: string;
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined;
};

const Hint = ({ children, label, side }: HintProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side || 'top'} sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
