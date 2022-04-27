import { cast, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { LoginStoreModel } from '../login-store/login-store'
// import {Boat} from "../boat";
import {User} from "../user";
import {withEnvironment} from "../extensions/with-environment";
/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').extend(withEnvironment)
    .props({
    loginStore: types.optional(LoginStoreModel, {}),
    // boats: types.array(Boat),
    user: types.optional(types.model("User"), {}),
    // marinas: types.array(types.model("Marina"))
    // verifiedUserContacts: types.array(VerifiedUserContact),
}).views(self => ({}))
    .actions(self => ({
        createUser(){
            self.user = User.create({id: null, name:null})

        },
        reset() {
            // self.userContacts = cast([]);
            // self.verifiedUserContacts = cast([]);
            // self.boats = cast([])
            // self.marinas = cast([])
            self.loginStore.reset();
        },
        updateUser(user: any){
            self.user = user
        },
        // setBoats(boats: any) {
        //     self.boats = boats || []
        // },
        // addBoat(boat: any) {
        //     self.boats.push(boat)
        // },
        // removeProducto(boat: any) {
        //     self.boats.remove(boat)
        // },
        // editBoat(boat: any) {
        //     self.boats = cast(self.boats.map(b => boat.id === b.id? boat:b))
        // },
        // updateBoat(boat: any, index:number) {
        //     self.boats = cast(self.boats.map((b, i) => i === index? boat:b))
        // }

    }));



/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
