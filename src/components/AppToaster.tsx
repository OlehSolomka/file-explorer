import { createPortal } from 'react-dom';
import { Toaster } from 'sonner';

export const AppToaster = () => {
  return createPortal(<Toaster position="top-center" />, document.body);
};
