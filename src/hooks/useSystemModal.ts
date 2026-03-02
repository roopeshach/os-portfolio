import { useDispatch } from 'react-redux';
import { showModal } from '../store/systemSlice';
import { registerModalCallback } from '../system/components/SystemModal';

let callbackCounter = 0;

export const useSystemModal = () => {
  const dispatch = useDispatch();

  const prompt = (options: {
    title: string;
    message: string;
    defaultValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<string | null> => {
    return new Promise((resolve) => {
      const callbackId = `modal_${++callbackCounter}`;
      registerModalCallback(callbackId, (value) => {
        resolve(value as string | null);
      });
      dispatch(showModal({
        type: 'prompt',
        title: options.title,
        message: options.message,
        defaultValue: options.defaultValue,
        placeholder: options.placeholder,
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Cancel',
        callbackId,
      }));
    });
  };

  const confirm = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      const callbackId = `modal_${++callbackCounter}`;
      registerModalCallback(callbackId, (value) => {
        resolve(value as boolean);
      });
      dispatch(showModal({
        type: 'confirm',
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        callbackId,
      }));
    });
  };

  return { prompt, confirm };
};
