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
    verified_email: types.maybeNull(types.boolean),
    password_set: types.maybeNull(types.boolean),

    phone_number: types.maybeNull(types.string),
    phone_number_national: types.maybeNull(types.string),
    phone_number_national_iso: types.maybeNull(types.string),
    profile_picture: types.maybeNull(types.string),
    access_token: types.maybeNull(types.string),
    refresh_token: types.maybeNull(types.string),
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
    get getAllData() {
      return {
        id: self.id,
        username: self.username,
        first_name: self.first_name,
        last_name: self.last_name,
        verified_email: self.verified_email,
        email: self.email,
        phone_number: self.phone_number,
        phone_number_national: self.phone_number_national,
        phone_number_national_iso: self.phone_number_national_iso,
        profile_picture: self.profile_picture,
        access_token: self.access_token,
        refresh_token: self.refresh_token,
        passcode: self.passcode,
        finplan_admin: self.finplan_admin,
        current_balance: self.current_balance,
        payment_method_id: self.payment_method_id,
        payment_method_choice: self.payment_method_choice,
        recurring_selected_option: self.recurring_selected_option,
        read_contacts_permission : self.read_contacts_permission ,
        line1: self.line1,
        city: self.city,
        state: self.state,
        postal_code: self.postal_code,
        country: self.country,
        billing_data_added: self.billing_data_added,
      }
    },
    get ProfileData() {
      return {
        id: self.id,
        username: self.username,
        first_name: self.first_name,
        last_name: self.last_name,
        profile_picture: self.profile_picture,
      }
    }
  }))
  .actions(self => ({
    setUser(user) {
      self.id = user.id
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.email = user.email
      self.password_set = user.password_set
      self.verified_email = user.verified_email
    },
    setConsumerUser(user) {
      self.id = user.consumer_profile.id
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.profile_picture = user.consumer_profile.profile_picture
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
      self.verified_email = null
      self.email = null
      self.phone_number = null
      self.phone_number_national = null
      self.phone_number_national_iso = null
      self.profile_picture = null
      self.access_token = null
      self.refresh_token = null
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
