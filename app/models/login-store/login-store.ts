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
    merchant_id: types.maybeNull(types.number),
    consumer_id: types.maybeNull(types.number),
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
    merchant_balance: types.maybeNull(types.number),
    consumer_balance: types.maybeNull(types.number),
    access_token: types.maybeNull(types.string),
    instagram: types.maybeNull(types.string),
    facebook: types.maybeNull(types.string),
    twitter: types.maybeNull(types.string),
    // currentStep
    currentStep: types.maybeNull(types.string),
    // signup
    signupData: types.frozen(),
    // setup
    setupData: types.frozen(),
    // events
    events: types.maybeNull(types.array(types.frozen())),
    // business
    business: types.maybeNull(types.array(types.frozen())),
    business_details: types.maybeNull(types.frozen()),
    // merchant of the month
    merchant_month: types.maybeNull(types.frozen()),
    // coupon
    merchant_coupons: types.maybeNull(types.array(types.frozen())),
    consumer_coupons: types.maybeNull(types.array(types.frozen())),
    // billing
    billing_data_added: types.maybeNull(types.boolean),
    funding_sources: types.maybeNull(types.array(types.frozen())),
    transactions: types.maybeNull(types.array(types.frozen())),
    // users
    users: types.maybeNull(types.frozen()),
  })
  .views(self => ({
    get isLoggedIn() {
      return self.access_token !== null && self.access_token !== undefined
    },
    get getFundingSources() {
      return self.funding_sources || []
    },
    get getTransactions() {
      return self.transactions || []
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
    get getEvents() {
      return self.events || []
    },
    get getBusiness() {
      return self.business || []
    },
    get getBusinessDetail() {
      return self.business_details || {}
    },
    get getMerchantOfMonth() {
      return self.merchant_month || {}
    },
    get getConsumerCoupons() {
      return self.consumer_coupons || []
    },
    get getMerchantCoupons() {
      return self.merchant_coupons || []
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
    get getUserName() {
      const name = (self.first_name && self.first_name !== '') ? self.first_name + ' ' + self.last_name : self.email
      return name
    },
    get balance() {
      return {
        merchant: self.merchant_balance || 0,
        consumer: self.consumer_balance || 0
      }
    },
    get getProfilesId() {
      return {
        merchant: self.merchant_id,
        consumer: self.consumer_id
      }
    },
    get getAllData() {
      return {
        id: self.id,
        merchant_id: self.merchant_id,
        consumer_id: self.consumer_id,
        selected_account: self.selected_account,
        account_base_color: self.account_base_color,
        username: self.username,
        first_name: self.first_name,
        last_name: self.last_name,
        email: self.email,
        verified_email: self.verified_email,
        allow_touch_id: self.allow_touch_id,
        password_set: self.password_set,
        business_name: self.business_name,
        type_of_business: self.type_of_business,
        business_story: self.business_story,
        random_profile_picture_index: self.random_profile_picture_index,
        profile_picture: self.profile_picture,
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
        billing_data_added: self.billing_data_added,
        merchant_balance: self.merchant_balance,
        consumer_balance: self.consumer_balance,
      }
    },
    get ProfileData() {
      return {
        id: self.id,
        consumer_id: self.consumer_id,
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
        merchant_id: self.merchant_id,
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
        allow_touch_id: self.allow_touch_id,
        instagram: self.instagram,
        facebook: self.facebook,
        twitter: self.twitter,
      }
    },
    get getRandomProfilePictureIndex() {
      return self.random_profile_picture_index
    },
    get getUsers() {
      return {
        consumers: self.users?.consumers || [],
        merchants: self.users?.merchants || []
      }
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
    setConsumerCoupons(coupons) {
      self.consumer_coupons = coupons
    },
    setMerchantCoupons(coupons) {
      self.merchant_coupons = coupons
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
      self.group = user.group
      self.group_name = user.group_name
    },
    setRandomProfilePictureIndex(index) {
      self.random_profile_picture_index = index
    },
    setConsumerUser(user) {
      if (!user) return
      self.consumer_id = user.consumer
      self.id = user.id
      self.profile_picture = user.consumer_profile
      self.username = user.username
      self.first_name = user.first_name
      self.last_name = user.last_name
      self.email = user.email
    },
    setMerchantUser(user) {
      if (!user) return
      self.merchant_id = user.id
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
      self.city = `${user.city}` || ''
      self.state = `${user.state}`
      self.zip_code = user.zip_code
      self.phone_number = user.phone_number
      self.instagram = user.instagram
      self.facebook = user.facebook
      self.twitter = user.twitter
    },
    setBalanceData(data) {
      self.consumer_balance = data?.consumer
      self.merchant_balance = data?.merchant
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
    setEvents(events) {
      self.events = events
    },
    setMerchantMonth(merchantMonth) {
      self.merchant_month = merchantMonth
    },
    setBusiness(business) {
      self.business = business
    },
    setBusinessDetails(businessDetails) {
      self.business_details = businessDetails
    },
    setFundingSources(data) {
      if (!data) self.billing_data_added = false
      if (Array.isArray(data) && data.length === 0) self.billing_data_added = false
      else self.billing_data_added = true
      self.funding_sources = data
    },
    setUsers(data) {
      self.users = data || {}
    },
    setTransactions(data) {
      self.transactions = data || []
    },
    reset() {
      const api = self.environment.api.apisauce
      api.deleteHeader("Authorization")
      Object.keys(self).map(key => self[key] = null)
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
