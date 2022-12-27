import {GeneralApiProblem} from "./api-problem"

export interface LoginData {
  username: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  passwordConfirm: string
}

export interface User {
  id: number
  username: string
  first_name: string
  second_name: string
  last_name: string
  second_last_name: string
  token: string
  group: number
  verified_email: boolean
  profile_image: string
  phone_number: string
  city: string
}

export interface Faq {
  id: number
  question: string
  answer: string
}

export interface Review {
  id: number
  author: string
  created_on: string
  comment: string
  rating: number
}

export type LogoutResult = { kind: "ok"; } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type LoginResult = { kind: "ok"; user: User } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type ListResult = { kind: "ok"; data: any[] } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type SingleResult = { kind: "ok"; data: any } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type NoResponseGetResult = { kind: "ok" } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type NoResponsePostResult = { kind: "ok" } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type SimpleGetResult = { kind: "ok"; data: any } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type SimplePostResult = { kind: "ok"; response: any } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type GenericResponse = { kind: "ok"; } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
