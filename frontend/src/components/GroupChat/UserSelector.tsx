import reactLogo from "@/assets/react.svg"
import { ResponseUsers, UserModel } from "@/types.ts"
import { useEffect, useState } from "react"
import { request } from "@/fetch.ts"

const UserSelector = ({
  onSubmit,
}: {
  onSubmit: (selectedUsers: UserModel[]) => void
}) => {
  const [users, setUsers] = useState<UserModel[]>([])
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res: ResponseUsers = await request.get("/users/forSelector")
        const { data } = res
        setUsers(data)
      } catch (e) {
        console.log(e as Error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  const handleClick = (user: UserModel) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers((prevState) => [...prevState, user])
    } else {
      setSelectedUsers((prevState) =>
        prevState.filter((selected) => selected._id !== user._id),
      )
    }
  }
  const handleSubmit = () => {
    onSubmit(selectedUsers)
    setSelectedUsers([])
  }
  return (
    <>
      <div className="flex flex-wrap text-sm pb-2">
        <p>已选：</p>
        {selectedUsers.map((user: UserModel) => (
          <div key={user._id}>{user.fullName},</div>
        ))}
      </div>
      <div className={`flex-auto overflow-auto h-60`}>
        {loading ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          <div className="py-2 overflow-auto grid grid-cols-4 gap-x-1">
            {users.map((user: UserModel) => (
              <User
                user={user}
                inSelected={selectedUsers.includes(user)}
                onSelect={handleClick}
                key={user._id}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleSubmit}
          disabled={loading || selectedUsers.length < 2}
        >
          新建群聊
        </button>
      </div>
    </>
  )
}
export default UserSelector

const User = ({
  user,
  inSelected,
  onSelect,
}: {
  user: UserModel
  inSelected: boolean
  onSelect: (user: UserModel) => void
}) => {
  return (
    <div
      className={`flex gap-1 p-1 items-center cursor-pointer ${
        inSelected ? "selected-to-selector rounded" : ""
      }`}
      onClick={() => onSelect(user)}
    >
      <div className={`avatar`}>
        {
          <div className={`w-4 rounded-full`}>
            <img
              src={user.avatar}
              onError={(event) => {
                console.log(event)
                event.currentTarget.src = reactLogo
              }}
              alt="user avatar"
            />
          </div>
        }
      </div>
      <p className="ml-1 text-xs truncate text-nowrap flex-1">
        {user.fullName}
      </p>
    </div>
  )
}
