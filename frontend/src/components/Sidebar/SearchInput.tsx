import { MdOutlineClear } from 'react-icons/md'
import React from 'react'

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
    setValue('')
  }
  return (
    <form className='flex items-center gap-2' onSubmit={handleSubmit}>
      <label className='input input-bordered flex items-center gap-2'>
        <input
          type='text'
          placeholder='Search...'
          value={value}
          onChange={handleChange}
          className='grow'
        />
        <MdOutlineClear onClick={handleClear} />
      </label>
      {/*<button type="submit" className="btn btn-circle">*/}
      {/*  <IoSearch className="w-5 h-5 outline-none"/>*/}
      {/*</button>*/}
    </form>
  )
}
export default SearchInput
