import {types} from "mobx-state-tree"

export const UXModel = types
  .model("UXModel")
  .props({
    popoverOpen: types.boolean
  })
