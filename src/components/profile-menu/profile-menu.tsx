import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';

import { logoutUser } from '../../services/slices/userSlice';

export const ProfileMenu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
