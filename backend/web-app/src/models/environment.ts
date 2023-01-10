import {Api} from "../services/api"


/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    // create each service
    // in dev, we attach Reactotron, in prod we attach a interface-compatible mock.

    this.api = new Api()
  }

  async setup() {
    await this.api.setup()
    // allow each service to setup
    // in dev, we attach Reactotron, in prod we attach a interface-compatible mock.
  }


  /**
   * Our api.
   */
  api: Api
}
