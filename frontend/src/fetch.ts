import { FetchProps } from "./types.ts"

const Fetch = async ({
  url,
  method,
  body = method === "GET" ? undefined : {},
}: FetchProps) => {
  console.log(url)

  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (res.status === 401) {
    await AuthedFetch({
      url: "/api/auth/logout",
      method: "POST",
    })
    localStorage.removeItem("chat-user")
    return (window.location.href = "/login")
  }
  return res.json()
}
const AuthedFetch = async ({
  url,
  method,
  body = method === "GET" ? undefined : {},
}: FetchProps) => {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
  return res.json()
}
export { Fetch, AuthedFetch }
