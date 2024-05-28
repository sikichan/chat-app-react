import { MdOutlineClear } from "react-icons/md"
import React from "react"
import NewGroup from "@/components/GroupChat/NewGroup.tsx"

type Props = {
  value: string
  setValue: (value: string) => void
}
const SearchInput = (props: Props) => {
  const { value, setValue } = props

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  const handleClear = () => {
    setValue("")
  }
  return (
    <div className="flex p-1 gap-1 items-center">
      <NewGroup />

      <form className="flex items-center" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-1">
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={handleChange}
            className="grow"
          />
          <MdOutlineClear onClick={handleClear} />
        </label>
        {/*<button type="submit" className="btn btn-circle">*/}
        {/*  <IoSearch className="w-5 h-5 outline-none"/>*/}
        {/*</button>*/}
      </form>
    </div>
  )
}
export default SearchInput
