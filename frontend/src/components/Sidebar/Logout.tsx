import useLogout from "@/hooks/useLogout.ts"
import useAuthContext from "@/hooks/useAuthContext.ts"
import { useEffect, useRef, useState } from "react"
import { MdOutlineLogout } from "react-icons/md"
import { RxAvatar } from "react-icons/rx"
import { useNavigate } from "react-router-dom"

const Logout = () => {
  const { loading, logout } = useLogout()
  const { authUser } = useAuthContext()
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
  }
  const menuRef = useRef<HTMLUListElement>(null)
  const handleClickOutside = (event: MouseEvent) => {
    if (showMenu && !menuRef.current?.contains(event.target as Node)) {
      setShowMenu(false)
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])
  return (
    <div className="rounded w-full mt-1 flex gap-2 items-center justify-between">
      <div className="text-light text-[14px] flex items-end justify-end w-full">
        <span
          className="mr-1.5 hover:text-yellow cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu((show) => !show)
          }}
        >
          {authUser?.fullName}
        </span>
        <div className="avatar online cursor-pointer">
          <div
            className="w-12"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu((show) => !show)
            }}
          >
            <img src={authUser?.avatar} alt="user avatar" />
          </div>
        </div>

        {showMenu && (
          <ul
            className="absolute bottom-14 font-thin right-1 menu menu-xs bg-base-200 w-36 rounded-box "
            ref={menuRef}
          >
            <li>
              <button
                disabled={loading}
                className="btn btn-ghost btn-md  py-0 px-1"
                onDoubleClick={handleLogout}
              >
                {loading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <MdOutlineLogout />
                )}{" "}
                双击退出
              </button>
            </li>
            <li>
              <button
                className="btn btn-ghost btn-md py-0 px-2"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/personal/avatar")
                }}
              >
                <RxAvatar />
                修改头像
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}
export default Logout
