import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const loginData = { email, password };
    dispatch(loginUser(loginData));
  };

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
