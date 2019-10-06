/**
 * Created by huangqingfeng on 16/4/27.
 */
module ui {

    /*
    * 游戏层主界面的层级管理。
    * 这个层级包含两样东西，一个是主界面，一个是战斗界面。
    *
    * 主界面即首页，包含HUD，DOCK，中间的跳转界面等。
    * */
    export class UIGameLayer extends fairygui.GComponent {

        //private hud:HUD = null;

        private login:UILoginMain = null;
        private main:UIGameMain = null;

        private _current:fairygui.GObject;

        public switchStatus(statusId:string, ...args):void {
            switch (statusId) {
                case UIStatusIds.LOGIN :
                    if (!this.login) this.login = new ui.UILoginMain();
                    this._current = this.login;
                    break;

                case UIStatusIds.MAIN :
                    if (!this.main) this.main = new ui.UIGameMain();
                    this.main.jumpPage(args.length > 0 ? args[0] : -1);
                    this._current = this.main;
                    break;
            }

            if (this._current) {
                ui.UIUtils.lifeTime(this._current, function ():void {
                    game.GameEvent.UI_SWITCHED.dispatch();
                    game.GameEvent.LOCK_SCREEN.dispatch(false);
                });
                this.addChild(this._current);
            }

            // if (!this.hud) {
            //     // this.hud = HUD.Ins;
            //     // this.addChild(this.hud);
            // }
        }

        public clear():void {
            if (this._current) {
                this.removeChild(this._current);
                
                if (this.login) {
                    this.login.dispose();
                    this.login = null;
                }
            }
        }

    }

}