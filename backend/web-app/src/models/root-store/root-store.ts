import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {withEnvironment} from ".."
import {UserStoreModel} from "../user-store/user-store";

/**
 * A RootStore model.
 */
// @ts-ignore
export const RootStoreModel = types.model("RootStore")
  .extend(withEnvironment)
  .props({
    userStore: types.optional(UserStoreModel, {}),
  })
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
