/**
 * Created by MIC on 2016/1/7.
 */

export interface ITween {

    play(): void;
    gotoAndPlay(time: number): void;
    stop(): void;
    gotoAndStop(time: number): void;
    togglePause(): void;
    stopOnComplete: boolean;

}
