import { useEffect, useRef, useState } from "react"
import { loadImage } from "@/utils/helper.ts"
import Cropper, { Area } from "react-easy-crop"

interface Props {
  imageSrc: string
  width: number
  height: number
  zoom: number
  rotation: number
  onZoomChange: (zoom: number) => void
  onRotationChange: (rotation: number) => void

  onCrop(image: Blob): void
}

type Crop = {
  x: number
  y: number
  width: number
  height: number
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = degreesToRadians(rotation)

  return {
    boxWidth:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    boxHeight:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

const ImageCropper = ({
  imageSrc,
  width,
  height,
  zoom,
  rotation,
  onZoomChange,
  onRotationChange,
  onCrop,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  // const [size, setSize] = useState<{ width: number; height: number }>({
  //   width: 0,
  //   height: 0,
  // })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCrop = (_: Area, croppedAreaPixels: Area) => {
    try {
      if (!croppedAreaPixels) return
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const image = new Image()
      image.crossOrigin = "anonymous"
      image.onload = () => {
        const { boxWidth, boxHeight } = rotateSize(
          image.width,
          image.height,
          rotation,
        )
        const radian = degreesToRadians(rotation) // 角度=>弧度
        canvas.width = boxWidth
        canvas.height = boxHeight

        ctx.translate(boxWidth / 2, boxHeight / 2)
        ctx.rotate(radian)
        ctx.translate(-image.width / 2, -image.height / 2)
        // drawImage(imageToDraw, 图片开始绘制的x坐标, y坐标, 绘制的宽度, 高度, 绘制到画布的x坐标, y坐标, 绘制的宽度, 高度)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        const croppedCanvas = document.createElement("canvas")
        const croppedCtx = croppedCanvas.getContext("2d")
        if (!croppedCtx) return
        const {
          x,
          y,
          width: croppedWidth,
          height: croppedHeight,
        } = croppedAreaPixels
        croppedCanvas.width = croppedWidth
        croppedCanvas.height = croppedHeight
        croppedCtx.drawImage(
          canvas,
          x,
          y,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight,
        )
        const quality = 1 / (croppedWidth / 200)

        croppedCanvas.toBlob(
          (blob) => {
            if (blob) {
              onCrop(blob)
            }
          },
          "image/jpeg",
          quality,
        )
      }
      image.src = imageSrc
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const calculateSize = async () => {
      setLoading(true)
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return
      await loadImage(
        imageSrc,
        containerRect.width * (9 * 16),
        containerRect.height * (9 * 16),
      )
      // const isPortrait = orientation === "portrait"
      // setSize({ width, height: isPortrait ? width : height })
      setLoading(false)
    }
    calculateSize()
  }, [imageSrc, containerRef])

  return (
    <div
      className="w-full h-2/3 flex flex-col items-center justify-center"
      ref={containerRef}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          className="ImageCropper relative mx-auto"
          style={{ width: "100vw", height: "80vh" }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            showGrid={false}
            rotation={rotation}
            onCropChange={(props) => setCrop({ ...props, width, height })}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            onCropComplete={handleCrop}
          />
        </div>
      )}
    </div>
  )
}
export default ImageCropper
