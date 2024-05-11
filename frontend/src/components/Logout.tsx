import useLogout from '@/hooks/useLogout.ts';

const Logout = () => {
  const {loading, logout} = useLogout()
  const handleLogout = async () => {
    await logout()
  }
  return <div className="fixed bottom-0">
    <button disabled={loading} className="btn btn-ghost" onClick={handleLogout}>
      
      {
        loading ? <span className="loading loading-spinner"/> : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
               className="w-6 h-6">
            <path
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
          </svg>
        )
      }
    </button>
  </div>
}
export default Logout;