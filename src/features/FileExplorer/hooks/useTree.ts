import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { ROUTES } from '@/router';
import { LocalstorageHelper } from '@/shared/helpers';
import { LOCALSTORAGE_KEYS } from '@/shared/constants';
import { TreeNodeSchema } from '../fileExplorer.schemas';

export const useTree = () => {
  const navigate = useNavigate();

  const raw = LocalstorageHelper.get<unknown>(LOCALSTORAGE_KEYS.TREE_DATA);
  const result = TreeNodeSchema.safeParse(raw);

  useEffect(() => {
    if (!result.success) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [result.success, navigate]);

  return result.success ? result.data : null;
};
