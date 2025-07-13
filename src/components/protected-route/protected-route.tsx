import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement, FC } from 'react';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: ReactElement;
  unlogged?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  unlogged = false
}) => {
  const { pathname, state } = useLocation();
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);
  const refreshTokenExists = localStorage.getItem('refreshToken') !== null;

  const renderContent = () => {
    if (isLoading && !refreshTokenExists) {
      return <Preloader />;
    }

    if (unlogged) {
      return isAuthenticated || refreshTokenExists ? (
        <Navigate to={state?.from?.pathname || '/'} replace />
      ) : (
        children
      );
    }

    if (!isAuthenticated && !refreshTokenExists) {
      return (
        <Navigate
          to='/login'
          state={{ from: { pathname: '/profile' } }}
          replace
        />
      );
    }

    if (refreshTokenExists && isLoading && !isAuthenticated) {
      return <div>Идет проверка авторизации...</div>;
    }

    return children;
  };

  return renderContent();
};
