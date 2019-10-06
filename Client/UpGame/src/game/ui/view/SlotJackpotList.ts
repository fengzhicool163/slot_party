module view {

    export class SlotJackpotList {
        private static _ins:SlotJackpotList;
        private _ani:starlingswf.SwfMovieClip;
        private _list = [];
        private _jackpotData = [];//用于播放动画队列.
        private _isPlay:boolean = false;
        private _data = [];//

        public static get Ins():SlotJackpotList {
            if (this._ins == null) this._ins = new SlotJackpotList();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            //this._list.push(this._slot.m_n191);
            //this._list.push(this._slot.m_n192);
            //this._list.push(this._slot.m_n193);

            game.UIEvent.UPDATE_JACKPOT_LIST.add(this.updata, this);
            game.UIEvent.SHOW_JACKPOT_ANI.add(this.playJackPot ,this);

            this.updataView();
        }

        private getDataChange(data:any):number{
            var newLen = data.length;
            var oldLen = this._data.length;
            if(newLen == 0) return 0;
            if(oldLen == 0) return newLen;

            var idx = 0;
            var oldone = this._data[oldLen-1];
            for(var i=newLen-1; i>=0; i--){
                var newone = data[i];
                if(newone.createTime == oldone.createTime){
                    break;
                }
                idx++;
            }

            return idx;
        }

        private updata(data:any):void {
            if(data == 0){
                this.updataView();
                return;
            }
            //获取数据,
            var newData:any  = model.UserModel.Ins.getRecords();

            //var newData:any = [{uid:1,username:'益达', diamond:899, avatar:'http://p.upcdn.pengpengla.com/uplive/p/u/2016/12/28/382345d4-048c-49c8-8fb8-9b0b96ddf072.jpg'}];

            var num = this.getDataChange(newData);

            if(num == 0){
                game.UIEvent.SHOW_JACKPOT_ANI_END.dispatch();
                game.UIEvent.SHOW_SUPPLEMENT_ANI_END.dispatch();
                return;
            }else {
                this.updataView();
                for(var i=0;i<num;i++){
                    this.playJackPot(newData[newData.length - i -1]);
                }


            }
        }
        private updataView():void {
            //获取数据,
            var data = model.UserModel.Ins.getRecords();
            this._data = model.UserModel.Ins.getRecords();
            //data = [{username:'益达', diamond:899, avatar:'http://p.upcdn.pengpengla.com/uplive/p/u/2016/12/28/382345d4-048c-49c8-8fb8-9b0b96ddf072.jpg'}];
            for(var i=0; i< this._list.length; i++){
                var item = this._list[i];
                if(i < data.length){
                    var one = data[i];

                    var name = item.m_n191.asTextField;
                    name.text = game.Tools.lang(game.Tools.getFormatText(one.username));
                    var value = item.m_n192.asTextField;
                    value.text = game.Tools.lang(one.diamond);

                    var units = item.m_n190.m_n34;
                    units.getController('c1').selectedIndex = 0;
                    //ui.UIUtils.fitPlayerHead(units, "http://p.upcdn.pengpengla.com/uplive/p/u/2016/12/28/382345d4-048c-49c8-8fb8-9b0b96ddf072.jpg");
                    ui.UIUtils.fitPlayerHead(units, one.avatar);
                }else {

                    var name = item.m_n191.asTextField;
                    name.text = game.Tools.lang('尚无信息');
                    var value = item.m_n192.asTextField;
                    value.text = game.Tools.lang('');
                    var units = item.m_n190.m_n34;
                    units.getController('c1').selectedIndex = 2;
                }

            }
        }

        public playJackPot(result:any):void{
            //var one = {username:'益达', diamond:899, avatar:'http://p.upcdn.pengpengla.com/uplive/p/u/2016/12/28/382345d4-048c-49c8-8fb8-9b0b96ddf072.jpg'};
            this._jackpotData.push(result);
            if(!this._isPlay){
                this.showPlay();
            }
        }

        public showPlay():void{
            var one = this._jackpotData.shift();
            if(one == null){
                this._isPlay = false;
                game.UIEvent.SHOW_JACKPOT_ANI_END.dispatch();
                if(model.UserModel.Ins.autoFill){
                    model.UserModel.Ins.autoFill = false;
                    game.UIEvent.SHOW_SUPPLEMENT_ANI.dispatch();//
                }else {
                    game.UIEvent.SHOW_SUPPLEMENT_ANI_END.dispatch();
                }

                return;
            }
            this._isPlay = true;
            var  self= this;

            var timer = setTimeout(function() {
                var popup:ui.IPopup = ui.UILayer.Ins.popup(ui.PopUpIds.JACKPOT, self._slot, one, self.showPlay, self);

            }, 500);


            //popup.onClose(this.showPlay, this);
            ///////////////////

            //var self = this;
            //var animation:game.Animation =
            //    game.Animation.get("laohujinew003", "mc_laohujinew001xxg_tonggao")
            //        .attach(this._slot.m_hongyun)
            //        //.fitScale()
            //        .onStop(true, function ():void {
            //            //self.showPlay();
            //            var timeout:number = setTimeout(function() {
            //                clearTimeout(timeout);
            //                self.showPlay();
            //            }, 1000);
            //
            //        })
            //        .play(false);
            //
            //var ani = animation.anim;
            //var spr = ani.getSprite("zhanwei");
            //
            //if(spr){
            //    spr.removeChildren();
            //
            //    var view:fairygui.GComponent = fairygui.UIPackage.createObject('slots', 'player_info').asCom;
            //    var w = view.width;
            //    var h = view.height;
            //    view.x = -w/2;
            //    view.y = -h/2;
            //    view.getChild('n66').asTextField.text = game.Tools.lang(one.username);
            //    view.getChild('n69').asTextField.text = '' + one.diamond;
            //
            //    var units = view.getChild('n65').asCom.getChild('n34').asCom;
            //    ui.UIUtils.fitPlayerHead(units, one.avatar);
            //
            //    spr.addChild(view.displayObject);
            //}

        }

        //private onAnimComplete():void {
        //    if (this._ani) {
        //        var self = this;
        //        this._ani.removeEventListener(egret.Event.COMPLETE, this.onAnimComplete, this);
        //        var anim:starlingswf.SwfMovieClip = this._ani;
        //        var timeout:number = setTimeout(function() {
        //            clearTimeout(timeout);
        //            anim.stop();
        //            if (!!anim && !!anim.parent)
        //                anim.parent.removeChild(anim);
        //
        //            self.showPlay();
        //        }, 500);
        //
        //
        //    }
        //}


    }

}