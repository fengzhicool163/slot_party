/**
 * Created by zhaikaiyu on 17/2/7.
 */
class WindowMsg {
    private static _ins: WindowMsg;

    public static get Ins(): WindowMsg {
        if (WindowMsg._ins == null) WindowMsg._ins = new WindowMsg();
        return WindowMsg._ins;
    }

    public startListen():void {
        var self = this;
        window.addEventListener("message", function (event) {
            self.receiveMessage(event);
        }, false);
    }

    public receiveMessage(event) {
        // if (event.origin !== "http://localhost:63341") {
        //     return
        // }
        //				return;
        if (event.data.key == "enter") {
            model.UserModel.Ins.reqLogin(function () {
                if (model.UserModel.Ins.getIsClosed() ) {
                    model.UserModel.Ins.getRanking(1,function (result) {
                        ui.UILayer.Ins.popup(ui.PopUpIds.RANKING, result);
                    } , this);

                }
            }, this);
            WindowMsg.Ins.posMessage({key:"getMusic"});
            // if (game.MusicManager.Ins.isMusicOn()) {
            //     game.MusicManager.Ins.replayMusic()
            // }
            egret.Ticker.getInstance().resume();
        } else if (event.data.key == "stop") {
            if (game.MusicManager.Ins.isMusicOn()) {
                game.MusicManager.Ins.pauseMusic()
            }
            egret.Ticker.getInstance().pause();
            //alert("stop")
        }else if(event.data.key == "music"){
           // alert(event.data.status)
            game.MusicManager.Ins.setMusicOn(event.data.status);
        }

    }
    //{key:"close"}
    public posMessage(key,frame?:any):void{
        // window.open("http://tactics.xingyunzhi.cn/up-casino/asia/index.html?v=0.0.72&env=dev")
        // return;
        frame = frame ? frame : window.parent;
        //alert(key)
        frame.postMessage(key,"*")
    }
}