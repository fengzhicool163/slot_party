/**
 * Created by liangrui on 22/12/2016.
 */


module init {

    export class PlatformLogin extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_do() {
            var self = this;

            model.UserModel.Ins.reqLogin(function () {
                game.GameEvent.PRELOADING_PROGRESS.dispatch(100);
                PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.LOGIN);

                setTimeout(function () {
                    game.GameEvent.PRELOADING_COMPLETE.dispatch();
                    self.done();
                }, 500);
            }, self);
        }
    }
}