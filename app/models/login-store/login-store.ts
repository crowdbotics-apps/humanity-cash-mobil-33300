import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment, withRootStore } from ".."
import { COLOR } from '../../theme'

/**
 * Model description here for TypeScript hints.
 */
export const LoginStoreModel = types
  .model("LoginStore")
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    id: types.maybeNull(types.number),
    selected_account: types.maybeNull(types.string),
    account_base_color: types.maybeNull(types.string),
    username: types.maybeNull(types.string),
    first_name: types.maybeNull(types.string),
    last_name: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    verified_email: types.maybeNull(types.boolean),
    allow_touch_id: types.maybeNull(types.boolean),
    password_set: types.maybeNull(types.boolean),
    business_name: types.maybeNull(types.string),
    type_of_business: types.maybeNull(types.string),
    business_story: types.maybeNull(types.string),
    random_profile_picture_index: types.maybeNull(types.number),
    profile_picture: types.maybeNull(types.string),
    profile_picture_merchant: types.maybeNull(types.string),
    background_picture: types.maybeNull(types.string),
    owner_first_name: types.maybeNull(types.string),
    owner_last_name: types.maybeNull(types.string),
    registered_business_name: types.maybeNull(types.string),
    industry: types.maybeNull(types.string),
    website: types.maybeNull(types.string),
    employer_identification_number: types.maybeNull(types.string),
    social_security_number: types.maybeNull(types.string),
    address_1: types.maybeNull(types.string),
    address_2: types.maybeNull(types.string),
    city: types.maybeNull(types.string),
    state: types.maybeNull(types.string),
    zip_code: types.maybeNull(types.string),
    phone_number: types.maybeNull(types.string),
    billing_data_added: types.maybeNull(types.boolean),

    access_token: types.maybeNull(types.string),
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
    get getSelectedAccount() {
      return self.selected_account || 'consumer'
    },
    get getAccountColor() {
      return self.account_base_color || COLOR.PALETTE.blue
    },
    get getBillingData() {
      return {
        billing_data_added: self.billing_data_added,
      }
    },
    get getAllData() {
      return {
        id: self.id,
        username: self.username,
        first_name: self.first_name,
        last_name: self.last_name,
        verified_email: self.verified_email,
        allow_touch_id: self.allow_touch_id,
        email: self.email,
        phone_number: self.phone_number,
        profile_picture: self.profile_picture,
        profile_picture_merchant: self.profile_picture_merchant,
        access_token: self.access_token,
        city: self.city,
        state: self.state,
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
        allow_touch_id: self.allow_touch_id,
        full_name: self.first_name + ' ' + self.last_name
      }
    },
    get ProfileDataBusiness() {
      return {
        id: self.id,
        business_name: self.business_name,
        type_of_business: self.type_of_business,
        business_story: self.business_story,
        profile_picture_merchant: self.profile_picture_merchant,
        background_picture: self.background_picture,
        owner_first_name: self.owner_first_name,
        owner_last_name: self.owner_last_name,
        registered_business_name: self.registered_business_name,
        industry: self.industry,
        website: self.website,
        employer_identification_number: self.employer_identification_number,
        social_security_number: self.social_security_number,
        address_1: self.address_1,
        address_2: self.address_2,
        city: self.city,
        state: self.state,
        zip_code: self.zip_code,
        phone_number: self.phone_number,
        allow_touch_id: self.allow_touch_id
      }
    },
    get getRandomProfilePictureIndex() {
      return self.random_profile_picture_index
    }
  }))
  .actions(self => ({
    setSelectedAccount(type) {
      if (type === 'consumer') {
        self.selected_account = type
        self.account_base_color = COLOR.PALETTE.blue
      }
      if (type === 'merchant')  {
        self.selected_account = type
        self.account_base_color = COLOR.PALETTE.green
      }
      if (type === 'cashier')  {
        self.selected_account = type
        self.account_base_color = COLOR.PALETTE.orange
      }
    },
    setUser(user) {
      self.id = user.id
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.email = user.email
      self.password_set = user.password_set
      self.verified_email = user.verified_email
      self.allow_touch_id = user.allow_touch_id
    },
    setRandomProfilePictureIndex(index) {
      self.random_profile_picture_index = index
    },
    setConsumerUser(user) {
      self.id = user.id
      self.profile_picture = user.consumer_profile
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
    },
    setMerchantUser(user) {
      self.business_name = user.business_name
      self.type_of_business = user.type_of_business
      self.business_story = user.business_story
      self.profile_picture_merchant = user.profile_picture?.split('?')?.[0]
      self.background_picture = user.background_picture?.split('?')?.[0]
      self.owner_first_name = user.owner_first_name
      self.owner_last_name = user.owner_last_name
      self.registered_business_name = user.registered_business_name
      self.industry = user.industry
      self.website = user.website
      self.employer_identification_number = user.employer_identification_number
      self.social_security_number = user.social_security_number
      self.address_1 = user.address_1
      self.address_2 = user.address_2
      self.city = user.city
      self.state = user.state
      self.zip_code = user.zip_code
      self.phone_number = user.phone_number
    },
    setAllowTouchId(user){
      self.allow_touch_id = user.allow_touch_id
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
    reset() {
      const api = self.environment.api.apisauce
      api.deleteHeader("Authorization")
      self.id = null
      self.selected_account = null
      self.username = null
      self.first_name = null
      self.last_name = null
      self.verified_email = null
      self.allow_touch_id = null
      self.email = null
      self.phone_number = null
      self.profile_picture = null
      self.access_token = null
      self.city = null
      self.state = null
      self.billing_data_added = false
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
