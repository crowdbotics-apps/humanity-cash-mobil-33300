import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from "../extensions/with-environment";
import {withRootStore} from "../extensions/with-root-store";
import {UXModel} from "../UXModel";

/**
 * Model description here for TypeScript hints.
 */
export const LoginStoreModel = types
  .model("LoginStore")
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    id: types.maybeNull(types.number),
    username: types.maybeNull(types.string),
    first_name: types.maybeNull(types.string),
    last_name: types.maybeNull(types.string),
    group: types.maybeNull(types.string),
    role: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    access_token: types.maybeNull(types.string),
    refresh_token: types.maybeNull(types.string),
    verified_email: types.maybeNull(types.boolean),
    merchant_data: types.maybeNull(types.string),

    ux: types.maybeNull(UXModel)
  })
  .views(self => ({
    get isLoggedIn() {
      return self.access_token !== null && self.access_token !== undefined
    },
    get fullName() {
      return self.first_name + ' ' + self.last_name
    },
    get getUX() {
      return {...self.ux} || {...UXModel}
    }
  }))
  .actions(self => ({
    setApiToken(token: string | null) {
      const api = self.environment.api.apisauce
      self.access_token = token
      if (token) {
        api?.setHeader('Authorization', 'Bearer ' + token)
      } else {
        api?.deleteHeader('Authorization')
      }
    },
    setUp(){
      if(self.access_token){
        self.environment.api.apisauce?.setHeader("Authorization", 'Bearer ' + self.access_token)
      }else{
        self.environment.api.apisauce?.deleteHeader("Authorization")
      }

    },
    setUser(user: any) {
      self.id = user.id
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.email = user.email
      self.group = user.group
      self.role = user.role
      self.access_token = user.token.access
      self.refresh_token = user.token.refresh
      self.verified_email = user.verified_email
    },
    setPopoverOpen(open: boolean) {
      let ux = { ...self.ux } || { popoverOpen: false }
      ux.popoverOpen = open
      self.ux = ux
    },
    reset() {
      const api = self.environment.api.apisauce
      api?.deleteHeader("Authorization")
      self.id = null
      self.username = null
      self.first_name = null
      self.last_name = null
      self.email = null
      self.access_token = null
      self.refresh_token = null
      self.verified_email = null
    },
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type LoginStoreType = Instance<typeof LoginStoreModel>

export interface LoginStore extends LoginStoreType {
}

type LoginStoreSnapshotType = SnapshotOut<typeof LoginStoreModel>

export interface LoginStoreSnapshot extends LoginStoreSnapshotType {
}
