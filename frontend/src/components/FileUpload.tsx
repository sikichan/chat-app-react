import React, { useRef, useState } from "react"
import styled from "styled-components"

const FileUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // handle file upload
      console.log("File selected:", file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      console.log("File dropped:", file)
      // handle file upload
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
      <div
        className={`file-upload ${isDragOver ? "drag-over" : ""}`}
        onClick={() => ref.current?.click()}
      >
        +
      </div>

      <input type="file" onChange={handleUpload} ref={ref} />
      <div
        className="beauty"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        Drop your files here
      </div>
    </Container>
  )
}

const Container = styled.div`
  position: relative;

  .file-upload {
    width: 3rem;
    height: 3rem;
    border-radius: 0.2rem;
    border: 0.08rem dashed #424769;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #424769;
    transition: background-color 0.3s;

    &:hover {
      cursor: pointer;
    }

    &.drag-over {
      background-color: #e0e0e0;
    }
  }

  .beauty {
    margin-top: 1rem;
    padding: 1rem;
    border: 0.08rem dashed #424769;
    border-radius: 0.2rem;
    text-align: center;
    color: #424769;
  }

  input[type="file"] {
    display: none;
  }
`

export default FileUpload
