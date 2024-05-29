import { IoIosAddCircleOutline } from "react-icons/io"
import { useRef, useState } from "react"
import UserSelector from "@/components/GroupChat/UserSelector.tsx"
import { UserModel } from "@/types.ts"
import toast from "react-hot-toast"
import { request } from "@/fetch.ts"
import useAuthContext from "@/hooks/useAuthContext.ts"

const NewGroup = () => {
  const [loading, setLoading] = useState(false)
  const [groupName, setGroupName] = useState("")
  const selectorDialogRef = useRef<HTMLDialogElement>(null)
  const { authUser } = useAuthContext()
  const handleSubmit = async (selectedUsers: UserModel[]) => {
    console.log(selectedUsers)
    setLoading(true)
    try {
      const name =
        groupName.trim() ||
        authUser?.fullName +
          "," +
          selectedUsers
            .map((user) => user.fullName)
            .slice(0, 2)
            .join(",") +
          "...等人的群聊"
      await request.post("/users/newGroupChat", {
        groupName: name,
        memberIds: selectedUsers.map((user) => user._id),
      })
      selectorDialogRef.current?.close()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div
        className="tooltip tooltip-bottom p-0"
        data-tip="新建群聊"
        onClick={() => selectorDialogRef.current?.showModal()}
      >
        <IoIosAddCircleOutline className="text-[1.4rem]" />
      </div>
      {loading ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : (
        <dialog id="selectorDialog" ref={selectorDialogRef} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-md mb-2">新建群聊</h3>
            <input
              type="text"
              placeholder={"请输入群聊名称"}
              className="input input-bordered p-2 h-8"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <div className="py-4">
              <UserSelector onSubmit={handleSubmit} />
            </div>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </dialog>
      )}
    </>
  )
}
export default NewGroup
