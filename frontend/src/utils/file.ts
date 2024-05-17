export async function getDataUrl(blob: Blob): Promise<string>
export async function getDataUrl(file: File): Promise<string>
export async function getDataUrl(arrayBuffer: ArrayBuffer): Promise<string>
export async function getDataUrl(
  data: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read data URL'))
      }
    }
    reader.onerror = reject
    if (data instanceof Blob) {
      reader.readAsDataURL(data)
    } else if (data instanceof ArrayBuffer) {
      const blob = new Blob([data], {type: 'arraybuffer'})
      reader.readAsDataURL(blob)
    } else if (data instanceof File) {
      const blob = new Blob([data], {type: (data as File).type})
      reader.readAsDataURL(blob)
    } else {
      reject(new Error('Invalid data type'))
    }
  })
}
