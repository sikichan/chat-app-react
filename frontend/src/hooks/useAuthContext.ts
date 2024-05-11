import {useContext} from 'react';
import {AuthContext} from '@/components/AuthContextProvider.tsx';

const useAuthContext = () => {
  return useContext(AuthContext)
}
export default useAuthContext;