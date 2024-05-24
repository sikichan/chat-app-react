import { PropsWithChildren } from "react"

const RedDot = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center justify-center text-xs text-light rounded-full min-w-[20px] bg-red px-1">
      {children}
    </div>
  )
}

export default RedDot
