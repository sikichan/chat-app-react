import React, { useRef, useState } from "react"
import styled from "styled-components"
import toast from "react-hot-toast"

const validateType = (file: File) => {
  if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
    toast.error("只能上传JPG/PNG图片类型")
    return false
  }
  return true
}
type Props = {
  onFileUpload: (file: File) => void
}
const FileUpload = ({ onFileUpload }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (validateType(file)) {
      onFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      // console.log(file)
      if (!file) return
      if (validateType(file)) {
        onFileUpload(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  return (
    <Container>
      {/*<div*/}
      {/*  className={`file-upload ${isDragOver ? "drag-over" : ""}`}*/}
      {/*  onClick={() => ref.current?.click()}*/}
      {/*  onDrop={handleDrop}*/}
      {/*  onDragOver={handleDragOver}*/}
      {/*  onDragLeave={handleDragLeave}*/}
      {/*>*/}
      {/*  +*/}
      {/*</div>*/}

      <input
        type="file"
        accept={"image/jpeg, image/jpg, image/png"}
        onChange={handleUpload}
        ref={ref}
      />
      <div
        className={`beauty ${isDragOver ? "drag-over" : ""}`}
        onClick={() => ref.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        将图片拖拽到此处，或<span className="text-primary">点击上传</span>
      </div>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  //
  //.file-upload {
  //  width: 3rem;
  //  height: 3rem;
  //  border-radius: 0.2rem;
  //  border: 0.08rem dashed #424769;
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //  color: #424769;
  //  transition: background-color 0.3s;
  //}

  .beauty {
    margin-top: 1rem;
    padding: 2rem 1rem;
    border: 0.08rem dashed #424769;
    border-radius: 0.2rem;
    text-align: center;
    color: #424769;
    font-size: 0.7rem;

    &.drag-over {
      background-color: #e0e0e0;
    }

    &:hover {
      cursor: pointer;
    }
  }

  input[type="file"] {
    display: none;
  }
`

export default FileUpload
