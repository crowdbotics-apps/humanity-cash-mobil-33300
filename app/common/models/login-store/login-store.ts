import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment, withRootStore } from ".."

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
    email: types.maybeNull(types.string),
    phone_number: types.maybeNull(types.string),
    phone_number_national: types.maybeNull(types.string),
    phone_number_national_iso: types.maybeNull(types.string),
    profile_picture: types.maybeNull(types.string),
    access_token: types.maybeNull(types.string),
    refresh_token: types.maybeNull(types.string),
    email_verified: types.maybeNull(types.boolean),
    passcode: types.maybeNull(types.boolean),
    finplan_admin: types.maybeNull(types.boolean),
    current_balance: types.maybeNull(types.number),
    read_contacts_permission: types.optional(types.boolean, false),
    payment_method_id: types.maybeNull(types.number),
    payment_method_choice: types.maybeNull(types.number),
    recurring_selected_option: types.maybeNull(types.number),
    line1: types.maybeNull(types.string),
    city: types.maybeNull(types.string),
    state: types.maybeNull(types.string),
    postal_code: types.maybeNull(types.string),
    country: types.maybeNull(types.string),
    billing_data_added: types.maybeNull(types.boolean),
    // currentStep
    currentStep: types.maybeNull(types.string),
    // signup
    signupData: types.frozen(),
    // setup
    setupData: types.frozen(),
  })
  .views(self => ({
    get isLoggedIn() {
      return self.access_token !== null && self.access_token !== undefined
    },
    get getStep() {
      return self.currentStep
    },
    get getSignupData() {
      return self.signupData
    },
    get getSetupData() {
      return self.setupData
    },
  }))
  .actions(self => ({
    setUser(user) {
      self.id = user.id
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.email = user.email
      self.phone_number = user.phone_number
      self.phone_number_national = user.phone_number_national
      self.phone_number_national_iso = user.phone_number_national_iso
      self.profile_picture = user.profile_picture
      self.access_token = user.token.access
      self.refresh_token = user.token.refresh
      self.email_verified = user.email_verified
      self.passcode = user.passcode
      self.finplan_admin = user.finplan_admin
      self.current_balance = user.current_balance
      self.payment_method_id = user.payment_method_id
      self.payment_method_choice = user.payment_method_choice
      self.recurring_selected_option = user.recurring_selected_option
      self.line1 = user.line1
      self.city = user.city
      self.state = user.state
      self.postal_code = user.postal_code
      self.country = user.country
      self.billing_data_added = user.billing_data_added
    },
    setStep(step) {
      self.currentStep = step
    },
    setSignupData(data) {
      self.signupData = data
    },
    setSetupData(data) {
      self.setupData = data
    },
    setApiToken(tokenProvided) {
      const api = self.environment.api.apisauce
      self.access_token = tokenProvided
      if (self.access_token) {
        const token = "Bearer " + self.access_token
        __DEV__ && console.log(token)
        api.setHeader("Authorization", token)
      } else {
        api.deleteHeader("Authorization")
      }
    },
    setReadContactsPermission(read_contacts_permission: boolean) {
      self.read_contacts_permission = read_contacts_permission
    },
    reset() {
      const api = self.environment.api.apisauce
      api.deleteHeader("Authorization")
      self.id = null
      self.username = null
      self.first_name = null
      self.last_name = null
      self.email = null
      self.phone_number = null
      self.phone_number_national = null
      self.phone_number_national_iso = null
      self.profile_picture = null
      self.access_token = null
      self.refresh_token = null
      self.email_verified = null
      self.passcode = null
      self.finplan_admin = null
      self.current_balance = null
      self.payment_method_id = null
      self.payment_method_choice = null
      self.recurring_selected_option = null
      self.read_contacts_permission = false
      self.line1 = null
      self.city = null
      self.state = null
      self.postal_code = null
      self.country = null
      self.billing_data_added = null
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type LoginStoreType = Instance<typeof LoginStoreModel>
export interface LoginStore extends LoginStoreType {}
type LoginStoreSnapshotType = SnapshotOut<typeof LoginStoreModel>
export interface LoginStoreSnapshot extends LoginStoreSnapshotType {}
