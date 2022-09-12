import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment, withRootStore } from '..'
import {AUTHORIZATION} from "../../services/constants";
// response:
//   access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYyNTIwMTMwLCJpYXQiOjE2NjI0MzM3MzAsImp0aSI6ImIxMjNkOTM0OGQ1NTRiNjVhMzA3N2JhMGM0NTZlOGY0IiwidXNlcl9pZCI6Mn0.8ZTfOa5_NnUFcF96hPfMXOKlN4vyJOfFpIumew5HOWw"
// refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY2MjUyMDEzMCwiaWF0IjoxNjYyNDMzNzMwLCJqdGkiOiIwM2Q4ZGI2YmIyZTI0ZWQ1YTYyNjkxMjEwNjMxMjJmNCIsInVzZXJfaWQiOjJ9.Fzd__YLHPL6wPks2YhCJAOg91axkFsjfdNss7tGDMvg"
// user:
//   allow_touch_id: false
// consumer_data: null
// email: "juanber2.0@gmail.com"
// first_name: ""
// id: 2
// last_name: ""
// merchant_data: null
// password_set: true
// token: {refresh: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90e…iOjJ9.eph2svjn0z5zZAYUXhvOONVcN0PH_mlDM7ktxHedZck', access: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90e…I6Mn0.oPOfmROBFBbOJQ-QUxrKAwl2EulwDb9v4aWCmiKlYZQ'}
// username: "user1"
// verified_email: fals
//

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
    .model('UserStore')
    .extend(withRootStore)
    .extend(withEnvironment)
    .props({
        id: types.maybeNull(types.number),
        username: types.maybeNull(types.string),
        first_name: types.maybeNull(types.string),
        last_name: types.maybeNull(types.string),
        email: types.maybeNull(types.string),
        access_token: types.maybeNull(types.string),
        refresh_token: types.maybeNull(types.string),
        verified_email: types.maybeNull(types.boolean),
        merchant_data: types.maybeNull(types.string),
    })
    .views(self => ({
        get isLoggedIn () {
            return self.access_token !== null && self.access_token !== undefined
        },
    }))
    .actions(self => ({

        setUser (user:any) {
            self.id = user.id
            self.username = user.username
            self.first_name = user.first_name
            self.last_name = user.last_name
            self.email = user.email
            self.access_token = user.token.access
            self.refresh_token = user.token.refresh
            self.verified_email = user.verified_email
        },
        setApiToken(access_token: string|null, refresh_token: string|null) {
          const api = self.environment.api.apisauce
          self.access_token = access_token
          if (access_token) {
            api?.setHeader(AUTHORIZATION, 'Bearer ' + access_token)
          } else {
            api?.deleteHeader(AUTHORIZATION)
          }
          self.refresh_token = refresh_token

        },
        reset () {
            const api = self.environment.api.apisauce
            api?.deleteHeader(AUTHORIZATION)
            self.id = null
            self.username = null
            self.first_name = null
            self.last_name = null
            self.email = null
            self.access_token = null
            self.refresh_token = null
            self.verified_email = null
        }
    }))

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
