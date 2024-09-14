export type TRequest = {
  url: string
  urlFragment?: string
  method: string
  headers: Headers
  postData?: string
  hasPostData?: boolean
  postDataEntries?: [{
    bytes: string
  }]
  
}