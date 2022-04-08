import { types } from "mobx-state-tree"

/**
 * User contact model.
 */
export const User = types.model("User").props({
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    // boats: types.array(types.model("Boat"))
}).actions(self => ({

    setId(id: number){
        self.id = id
    },
    setEmail(email: string){
        self.email = email
    },
    // setBoats(boats:any){
    //     self.boats = boats
    // }

}))

