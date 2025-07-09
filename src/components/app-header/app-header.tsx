import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader = () => {
  const { user } = useSelector((state) => state.user);
  return <AppHeaderUI userName={user?.name} />;
};
