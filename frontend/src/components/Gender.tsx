import React from 'react'

type GenderProps = {
  gender: 'boy' | 'girl'
  handleChange: (gender: 'boy' | 'girl') => void
}

const Gender: React.FC<GenderProps> = ({gender, handleChange}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value as 'boy' | 'girl')
  }
  return (
    <div>
      <label className="label text-blue-400 p-2 justify-start">
        <span className="text-base label-text text-gray-500">Gender: </span>
      </label>
      <div className="flex items-center min-w-96 p-2">
        <div className="flex items-center px-2">
          <span className="text-base label-text text-primary mr-2">Girl</span>
          <input
            type="checkbox"
            checked={gender === 'girl'}
            value="girl"
            className="checkbox checkbox-primary"
            onChange={onChange}
          />
        </div>
        <div className="flex items-center px-2">
          <span className="text-base label-text text-primary mr-2">Boy</span>
          <input
            type="checkbox"
            checked={gender === 'boy'}
            value="boy"
            className="checkbox checkbox-primary"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}
export default Gender
