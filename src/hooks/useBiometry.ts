import {useState} from 'react';

export const useBiometry = () => {
  const [isBiometry, setIsBiometry] = useState<boolean>(false);

  const toggle = (bool?: boolean) => {
    setIsBiometry(bool !== undefined ? bool : prev => !prev);
  };

  return {
    isBiometry,
    toggle,
  };
};
