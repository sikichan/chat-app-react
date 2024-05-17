import ImageCropper from "@/components/ImageCropper/ImageCropper.tsx"
import React, { useCallback, useState } from "react"
import { getDataUrl } from "@/utils/file.ts"
import FileUpload from "@/components/FileUpload.tsx"

const ModifyAvatar = () => {
  const [remoteImage, setRemoteImage] = useState("")
  const [localImage, setLocalImage] = useState("")
  const [zoom, setZoom] = useState(1)
  const [croppedImage, setCroppedImage] = useState<Blob>()
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(false)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setRemoteImage("")
    setLocalImage(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const handleOnZoom = useCallback((zoomValue: number) => {
    setZoom(zoomValue)
  }, [])

  const handleOnRotation = useCallback((rotationValue: number) => {
    setRotation(rotationValue)
  }, [])
  const handleCrop = async () => {
    const img = await getDataUrl(croppedImage as Blob)
    console.log(img)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <FileUpload />
      {localImage ? (
        <>
          <ImageCropper
            zoom={zoom}
            onZoomChange={handleOnZoom}
            rotation={rotation}
            onRotationChange={handleOnRotation}
            imageSrc={remoteImage || localImage}
            onCrop={setCroppedImage}
            width={500}
            height={500}
          />
          <div className="flex gap-8 items-center h-[15vh]">
            <button className="btn" onClick={handleCrop}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCrop}>
              Confirm
            </button>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  )
}
export default ModifyAvatar
