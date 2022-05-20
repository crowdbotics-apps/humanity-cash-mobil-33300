import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from ".."

/**
 * A RootStore model.
 */
// @ts-ignore
export const RootStoreModel = types.model("RootStore")
  .extend(withEnvironment)
  .props({})
  .views(self => ({ }))
  .actions(self => ({}))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {
}
