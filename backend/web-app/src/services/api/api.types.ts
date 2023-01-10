import {GeneralApiProblem} from "./api-problem"

export interface LoginData {
  username: string
  password: string
}


export type ListResult = { kind: "ok"; data: any[] } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type SingleResult = { kind: "ok"; data: any } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type NoResponseGetResult = { kind: "ok" } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type NoResponsePostResult = { kind: "ok" } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type SimpleGetResult = { kind: "ok"; data: any } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type SimplePostResult = { kind: "ok"; response: any } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
export type GenericResponse = { kind: "ok"; } | { kind: "bad-data"; errors: {} } | GeneralApiProblem
