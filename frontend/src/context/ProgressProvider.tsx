import React, { useState, useEffect, ReactNode } from 'react';

interface ProgressProviderProps {
  valueStart: number;
  valueEnd: number;
  children: (value: number) => ReactNode;
}

const ProgressProvider: React.FC<ProgressProviderProps> = ({
  valueStart,
  valueEnd,
  children,
}) => {
  const [value, setValue] = useState<number>(valueStart);

  useEffect(() => {
    setValue(valueEnd);
  }, [valueEnd]);

  return <>{children(value)}</>;
};

export default ProgressProvider;
