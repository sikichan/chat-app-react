import ImageCropper from "@/components/ImageCropper/ImageCropper.tsx"
import { useCallback, useState } from "react"
import FileUpload from "@/components/FileUpload.tsx"
import toast from "react-hot-toast"
import useAuthContext from "@/hooks/useAuthContext.ts"
import { request } from "@/fetch.ts"
import { useNavigate } from "react-router-dom"
import { ResponseError } from "@/types.ts"

const ModifyAvatar = () => {
  const [remoteImage, setRemoteImage] = useState("")
  const [localImage, setLocalImage] = useState("")
  const [zoom, setZoom] = useState(1)
  const [croppedImage, setCroppedImage] = useState<Blob>()
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const navigate = useNavigate()
  const handleOnZoom = useCallback((zoomValue: number) => {
    setZoom(zoomValue)
  }, [])

  const handleOnRotation = useCallback((rotationValue: number) => {
    setRotation(rotationValue)
  }, [])
  const handleCrop = async () => {
    try {
      console.log("cropped:", croppedImage)
      const fd = new FormData()
      fd.append(
        "file",
        new Blob([croppedImage!], { type: "image/jpeg" }),
        "avatar",
      )
      setLoading(true)
      const { data } = await request.post("/users/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log(data)
      if (data.error) {
        return toast.error(data.error)
      }
      setAuthUser(data)
      localStorage.setItem("chat-user", JSON.stringify(data))
      navigate(-1)
    } catch (error) {
      console.log(error)
      toast.error((error as ResponseError).message)
    } finally {
      setLoading(false)
    }
  }
  const handleOnUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    console.log(url)
    setRemoteImage("")
    setLocalImage(url)
  }
  const handleCancel = () => {
    setLocalImage("")
    navigate(-1)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {!localImage && <FileUpload onFileUpload={handleOnUpload} />}
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
            <button className="btn" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCrop}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner" /> : ""}
              Confirm
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-8 items-center h-[15vh]">
          <button className="btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
export default ModifyAvatar
