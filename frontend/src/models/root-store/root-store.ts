import {Instance, SnapshotOut, types} from 'mobx-state-tree'
import {LoginStoreModel} from '../login-store/login-store'
import {withEnvironment} from "../extensions/with-environment";

export const ListaModel = types.model("ListaModel").props({
    _id: types.string,
    titulo: (types.string),
    checkName: types.maybeNull(types.string),
    abrv: (types.string),
    field: types.maybeNull(types.string),
    rw: types.maybeNull(types.array(types.string)),
    trueColor: types.maybeNull(types.string),
    falseColor: types.maybeNull(types.string),
    disabledColor: types.maybeNull(types.string),
    todas: types.maybeNull(types.boolean),
    hidden: types.maybeNull(types.boolean),
    active: types.maybeNull(types.boolean),
})
export type IListaModel = Instance<typeof ListaModel>;

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').extend(withEnvironment)
    .props({
        loginStore: types.optional(LoginStoreModel, {}),
        // globalLoader: types.optional(types.boolean, false),
        // selectedList: types.maybeNull(ListaModel),
        // listSelectionTime: types.maybeNull(types.Date),
        loggedUser: types.maybeNull(types.string),
        loggedP: types.maybeNull(types.string),
        // mapView: types.optional(types.boolean, false),
        // filtering: types.optional(types.number, 0),
        // mapLayer: types.optional(types.boolean, false),
        // lists: types.optional(types.array(ListaModel), []),
        // updateSpeed: types.optional(types.string, '10'),

    }).views(self => ({
        // get isGlobalLoading() {
        //     return self.globalLoader
        // }
    }))
    .actions(self => ({

        reset() {
            self.loginStore.reset();
        },
        loginUser(username: string, p: string) {
            self.loggedUser = username
            self.loggedP = p
        }
    }));


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
