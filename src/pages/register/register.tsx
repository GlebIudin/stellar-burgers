import { SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const Register = () => {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isLoading) return;

    dispatch(registerUser({ name: userName, email, password }))
      .then(() => {
        if (!isAuthenticated) {
          console.error('Зарегистрироваться не удалось, повторите попытку');
        }
      })
      .catch((err) => {
        console.error(
          'Ошибка регистрации:',
          err.message || 'Неизвестная ошибка'
        );

        if (isAuthenticated) {
          return <Navigate to='/' replace />;
        }
      });
  };

  return (
    <RegisterUI
      errorText={error || ''}
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
