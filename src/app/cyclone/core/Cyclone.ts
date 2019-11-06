class Cyclone {

    private _tick: FrameRequestCallback = (time: number): void => {
        
    }

    constructor() {
        window.requestAnimationFrame(this._tick);
    }

}
const cyclone = new Cyclone();
export default cyclone;