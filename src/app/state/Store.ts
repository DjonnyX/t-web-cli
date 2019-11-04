export default class Store<S = {}> {
  constructor(protected _initialState: S) {}
}
