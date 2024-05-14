import {useContext} from 'react';
import {AuthContext} from '@/context/AuthContextProvider.tsx';

const useAuthContext = () => {
  return useContext(AuthContext)
}
export default useAuthContext;