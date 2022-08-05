import {Reducer, useCallback, useReducer} from 'react';

export type ModalState =
  | {
      modalVisible: false;
    }
  | {
      modalVisible: true;
      targetItemId: string;
    };

type Action =
  | {
      type: 'OPEN_MODAL';
      payload: {targetItemId: string};
    }
  | {
      type: 'CLOSE_MODAL';
    };

const reducer: Reducer<ModalState, Action> = (_, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        modalVisible: true,
        targetItemId: action.payload.targetItemId,
      };
    case 'CLOSE_MODAL':
      return {
        modalVisible: false,
      };
  }
};

const initialState: ModalState = {
  modalVisible: false,
};

export const useModal = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openModal = useCallback((targetItemId: string) => {
    dispatch({type: 'OPEN_MODAL', payload: {targetItemId}});
  }, []);

  const closeModal = useCallback(() => {
    dispatch({type: 'CLOSE_MODAL'});
  }, []);

  return {
    state,
    openModal,
    closeModal,
  };
};
