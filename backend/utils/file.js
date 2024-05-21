import fs from "fs"
import path from "path"

export async function getDataUrl(data) {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(data)) {
      // For ArrayBuffer
      resolve(`data:application/octet-stream;base64,${data.toString("base64")}`)
    } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
      // For Uint8Array or ArrayBuffer
      const buffer = Buffer.from(data)
      resolve(
        `data:application/octet-stream;base64,${buffer.toString("base64")}`,
      )
    } else if (typeof data === "string" && fs.existsSync(data)) {
      // For file paths
      const mimeType = getMimeType(data)
      fs.readFile(data, (err, fileData) => {
        if (err) {
          reject(err)
        } else {
          resolve(`data:${mimeType};base64,${fileData.toString("base64")}`)
        }
      })
    } else if (data instanceof Buffer) {
      // For Buffer
      resolve(`data:application/octet-stream;base64,${data.toString("base64")}`)
    } else {
      reject(new Error("Invalid data type"))
    }
  })
}

// Helper function to get MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".jpeg":
    case ".jpg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".gif":
      return "image/gif"
    case ".pdf":
      return "application/pdf"
    case ".txt":
      return "text/plain"
    // Add more MIME types as needed
    default:
      return "application/octet-stream"
  }
}
