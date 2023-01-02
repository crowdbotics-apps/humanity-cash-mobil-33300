import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {withEnvironment, withRootStore} from '..'


/**
 * Model description here for TypeScript hints.
 */
export const CalendarStoreModel = types
  .model('CalendarStore')
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    date: types.maybeNull(types.string),
  })
  .views(self => ({

  }))
  .actions(self => ({
    reset () {
      self.date = null
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type CalendarStoreType = Instance<typeof CalendarStoreModel>
export interface UserStore extends CalendarStoreType {}
type CalendarStoreSnapshotType = SnapshotOut<typeof CalendarStoreModel>
export interface UserStoreSnapshot extends CalendarStoreSnapshotType {}
