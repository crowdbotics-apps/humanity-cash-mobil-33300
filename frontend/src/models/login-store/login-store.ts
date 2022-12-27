import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from "../extensions/with-environment";
import {withRootStore} from "../extensions/with-root-store";

/**
 * Model description here for TypeScript hints.
 */
export const LoginStoreModel = types
  .model("LoginStore")
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    id: types.maybeNull(types.number),
    first_name: types.maybeNull(types.string),
    last_name: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    username: types.maybeNull(types.string),
    access_token: types.maybeNull(types.string),
    refresh_token: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    company_name: types.maybeNull(types.string),
    display_company: types.maybeNull(types.boolean),
    address: types.maybeNull(types.string),
    zip_code: types.maybeNull(types.string),
    phone_number: types.maybeNull(types.string),
    profile_picture: types.maybeNull(types.string),
    user_type: types.maybeNull(types.string),
    frequency: types.maybeNull(types.string),
    other: types.maybeNull(types.string),
    notifications_enabled: types.maybeNull(types.boolean),
    assigned_team: types.maybeNull(types.string),
    number_of_pending_requests: types.maybeNull(types.number),
  })
  .views(self => ({
    get isLoggedIn() {
      return self.access_token !== null && self.access_token !== undefined
    },
    get fullName() {
      return self.first_name + ' ' + self.last_name
    },

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
    setUser(data: any) {
      self.id = data.id
      self.first_name = data.first_name
      self.last_name = data.last_name
      self.email = data.email
      self.access_token = data.token.access_token
      self.refresh_token = data.token.refresh_token
      self.name = data.name
      self.company_name = data.company_name
      self.display_company = data.display_company
      self.address = data.address
      self.zip_code = data.zip_code
      self.phone_number = data.phone_number
      self.profile_picture = data.profile_picture
      self.user_type = data.user_type
      self.frequency = data.frequency
      self.other = data.other
      self.notifications_enabled = data.notifications_enabled
      self.assigned_team = data.assigned_team
    },
    reset() {
      self.id = null
      self.first_name = null
      self.last_name = null
      self.email = null
      self.username = null
      self.access_token = null
      self.refresh_token = null
      self.name = null
      self.company_name = null
      self.display_company = null
      self.address = null
      self.zip_code = null
      self.phone_number = null
      self.profile_picture = null
      self.user_type = null
      self.frequency = null
      self.other = null
      self.notifications_enabled = null
      self.assigned_team = null
    },
    setPendingRequests(count: number) {
      self.number_of_pending_requests = count;
    }
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
