import { Instance, SnapshotOut, types } from "mobx-state-tree"
import {LoginStoreModel} from "../../models/login-store/login-store";

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  loginStore: types.optional(LoginStoreModel, {}),
}).views(self => ({}))
  .actions(self => ({
    reset() {
      self.loginStore.reset();
    },
  }));

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
