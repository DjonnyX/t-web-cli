/**
 * Executes pending scripts, etc.
 */
class Cyclone {
  public readonly addDeferCall = (...calls: Array<Function>): void => {
    this._deferList.push(...calls);
  };

  protected _intervalId: number;

  protected _deferList = new Array<Function>();

  private _tick: TimerHandler = () => {
    while (this._deferList.length > 0) {
      // It is executed in turn from the first time added
      let deferCall = this._deferList.shift();

      deferCall();

      deferCall = undefined;
    }
  };

  constructor() {
    this._intervalId = setInterval(this._tick);
  }

  public dispose(): void {
    clearInterval(this._intervalId);
    this._deferList = undefined;
  }
}
const cyclone = new Cyclone();
export default cyclone;
