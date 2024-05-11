import {FetchProps} from './types.ts'

const Fetch = async ({url, body = {}, method}: FetchProps) => {
  console.log(url)
  
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res.json()
}
const AuthedFetch = async ({url, body = {}, method}: FetchProps) => {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  return res.json()
}
export {
  Fetch, AuthedFetch
}