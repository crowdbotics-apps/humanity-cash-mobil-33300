import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  username: string
  email: string
  email_verified: boolean
  first_name: string
  last_name: string
  phone_number: string
  profile_picture: string
  profiles: Array<any>
}




export type ListResult = { kind: "ok"; data: any[] } | { kind: "bad-data"; errors: any } | GeneralApiProblem
export type SingleResult = { kind: "ok"; data: any } | { kind: "bad-data"; errors: any } | GeneralApiProblem
export type NoResponseGetResult = { kind: "ok" } | { kind: "bad-data"; errors: any } | GeneralApiProblem
export type NoResponsePostResult = { kind: "ok" } | { kind: "bad-data"; errors: any } | GeneralApiProblem
export type SimpleGetResult = { kind: "ok"; data: any } | { kind: "bad-data"; errors: any } | GeneralApiProblem
export type SimplePostResult = { kind: "ok"; response: any } | { kind: "bad-data"; errors: any } | GeneralApiProblem
export type GenericResponse = { kind: "ok"; } | { kind: "bad-data"; errors: any } | GeneralApiProblem
