import React, {createContext, PropsWithChildren, useContext} from 'react';
import {type ModalState, useModal} from '../hooks/useModal';

const ModalStateContext = createContext<ModalState>({
  modalVisible: false,
});

const ModalDispatchContext = createContext<{
  openModal: (targetItemId: string) => void;
  closeModal: () => void;
}>({
  openModal: _ => {},
  closeModal: () => {},
});

type Props = {
  modalComponent: React.ReactNode;
};

export const ModalProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  modalComponent,
}) => {
  const {state, openModal, closeModal} = useModal();

  return (
    <ModalStateContext.Provider value={state}>
      <ModalDispatchContext.Provider value={{openModal, closeModal}}>
        {children}

        {modalComponent}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};

export const useModalState = () => useContext(ModalStateContext);
export const useModalDispatch = () => useContext(ModalDispatchContext);
