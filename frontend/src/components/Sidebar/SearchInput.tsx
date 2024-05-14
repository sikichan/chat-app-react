import {IoSearch} from 'react-icons/io5';
import React, {useState} from 'react';

const SearchInput = () => {
  const [value, setValue] = useState('')
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // const result = conversations.find(item => item.fullName.toLowerCase().includes(value.toLowerCase()))
    // setSelectedConversation(result)
  }
  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="input input-bordered rounded-full"
      />
      <button type="submit" className="btn btn-circle">
        <IoSearch className="w-5 h-5 outline-none"/>
      </button>
    
    </form>
  )
}
export default SearchInput
