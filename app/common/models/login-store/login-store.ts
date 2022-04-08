import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withRootStore} from "../index"
import {withEnvironment} from "../extensions/with-environment";
import {ApisauceInstance} from "apisauce";
import {bool} from "yup";

export enum USER_PROFILE {
    boater = "boater",
    marina_staff = "marina_staff",
    worker = "worker"
}

/**
 * Model description here for TypeScript hints.
 */
export const LoginStoreModel = types
    .model("LoginStore")
    .extend(withRootStore)
    .extend(withEnvironment)
    .props({
        id: types.maybeNull(types.number),
        name: types.maybeNull(types.string),
        username: types.maybeNull(types.string),
        first_name: types.maybeNull(types.string),
        last_name: types.maybeNull(types.string),
        email: types.maybeNull(types.string),
        email_verified: types.maybeNull(types.boolean),
        phone_number: types.maybeNull(types.string),
        profile_picture: types.maybeNull(types.string),
        is_marina_staff: types.optional(types.boolean, false),
        is_boater: types.optional(types.boolean, false),
        is_worker: types.optional(types.boolean, false),

        access_token: types.maybeNull(types.string),
        refresh_token: types.maybeNull(types.string),
        registered: types.maybeNull(types.boolean),

    })
    .views(self => ({
        get isRegistered() {
            return self.registered
        },
        get isLoggedIn() {
            return self.access_token !== null && self.access_token !== undefined
        },
        get hasProfile(){
            return (self.is_marina_staff || self.is_worker || self.is_boater || true)
        },
        get hasProfileCompleted(){
            return (self.name !== null && self.username)
        },
    }))
    .actions(self => ({
        setName(name:string){
            self.name
        },
        setRegistered(installed: boolean){
            self.registered = installed
        },
        setUser(user: any) {
            self.id = user.id
            self.username = user.username
            self.email = user.email
            self.email_verified = user.email_verified
            self.first_name = user.first_name
            self.last_name = user.last_name
            self.phone_number = user.phone_number
            self.profile_picture = user.profile_picture
            self.is_worker = USER_PROFILE.worker in user.profiles
            self.is_boater = USER_PROFILE.boater in user.profiles
            self.is_marina_staff = USER_PROFILE.marina_staff in user.profiles
        },
        setUserProfile(profile:USER_PROFILE){
            console.log("setuserprofile", profile)
            if(profile === USER_PROFILE.boater){
                self.is_boater = true
            }else if(profile === USER_PROFILE.worker){
                self.is_worker = true
            }else if(profile === USER_PROFILE.marina_staff){
                self.is_marina_staff = true
            }
        },
        removeUserProfile(profile: USER_PROFILE){
            if(profile === USER_PROFILE.boater){
                self.is_boater = false
            }else if(profile === USER_PROFILE.worker){
                self.is_worker = false
            }else if(profile === USER_PROFILE.marina_staff){
                self.is_marina_staff = false
            }
        },
        // TODO: This should be in ApiBase
        setHeader(key:string, value:string){
            self.environment.api.apisauce!.setHeader(key, value)
            self.environment.api.user.apisauce!.setHeader(key, value)
            self.environment.api.marinas.apisauce!.setHeader(key, value)
        },
        // TODO: This should be in ApiBase
        deleteHeader( key:string){
            self.environment.api.apisauce!.deleteHeader(key)
            self.environment.api.user.apisauce!.deleteHeader(key)
            self.environment.api.marinas.apisauce!.deleteHeader(key)
        },
        setApiToken(tokenProvided:any) {
            self.access_token = tokenProvided
            if (self.access_token) {
                const token = "Bearer " + self.access_token
                __DEV__ && console.log(token)
                this.setHeader("Authorization", token)

            } else {
                this.deleteHeader("Authorization")
            }
        },

        reset() {
            const api = self.environment.api.apisauce
            if(api){
                api.deleteHeader("Authorization")
            }
            self.id = null
            self.username = null
            self.email = null
            self.email_verified = false
            self.first_name = null
            self.last_name = null
            self.phone_number = null
            self.profile_picture = null
            self.is_worker = false
            self.is_boater = false
            self.is_marina_staff = false
            self.access_token = null
            self.refresh_token = null

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
