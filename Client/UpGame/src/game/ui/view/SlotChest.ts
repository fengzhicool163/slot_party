module view {

    export class SlotChest {

        private static _ins:SlotChest;
        private mc_dianji:any;
        private _ani:starlingswf.SwfMovieClip;
        public static get Ins():SlotChest {
            if (this._ins == null) this._ins = new SlotChest();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            var n129 = this._slot.m_n129;
            n129.addClickListener(this.onClick, this);
            this.updata();

            game.UIEvent.SLOT_COMPLETE.add(this.onSlotComplete, this);
            game.UIEvent.UPDATE_CHEST.add(this.updata, this);
            game.UIEvent.SHOW_KEY_ANI.add(this.playKey ,this);
        }
        private updata():void {
            //获取数据,
            var text = this._slot.m_n129.m_n128;
            text.text = game.Tools.lang('%c/%c', model.UserModel.Ins.getPoint001(), model.LocalConfigModel.Ins.getPoint001());
            if(model.UserModel.Ins.getPoint001() >= model.LocalConfigModel.Ins.getPoint001()){
                this.displayTouch(true);
            }else {
                this.displayTouch(false);
            }
        }
        private onSlotComplete():void {
            console.log('[SlotBtnAct]   onSlotComplete');

        }

        private onClick():void {
            if (SlotBtn.Ins.running) return;

            console.log('[SlotBtnAct]  ', 'click');
            if(model.UserModel.Ins.getPoint001() >= model.LocalConfigModel.Ins.getPoint001()){
                this._slot.m_n129.enabled = false;
                model.UserModel.Ins.getAwardByType(1,this.showPlay , this.playFail , this);
            }else {
                ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION,{
                    'selectIndex':2
                })
            }
        }


        private displayTouch(show:boolean):void{
            //if(!this.mc_dianji) {
            //    var dianji = this._slot.m_laohujinew001_dianji;
            //    this.mc_dianji = ui.UIUtils.initStarswfAni("laohujinew002","mc_laohujinew001xxg_tubiaoguang2",dianji, true, false);
            //}
            //this.mc_dianji.visible = show;
        }

        private Complete():void{
            this._ani.visible = false;
            this._ani = null;
            this._slot.removeEventListener(egret.TouchEvent.TOUCH_END,this.Complete,this);
            this._slot.m_n129.enabled = true;
        }
        public playFail(result:any):void{
            this._slot.m_n129.enabled = true;
        }
        public showPlay(result:any):void{
            game.UIEvent.SLOT_FREE_TIMES.dispatch(result.point001);
            game.UIEvent.UPDATE_CHEST.dispatch();

            this._ani = ui.UIUtils.initStarswfAni("laohujinew003","mc_laohujinew001xxg_chushuzi01",this._slot.m_chushuzi01,false,true);
            this._ani.visible = true;
            this._ani.gotoAndPlay(0);
            this._ani.addEventListener(egret.Event.COMPLETE, this.onAnimComplete, this);
            var spr = this._ani.getSprite("wenzi");

            if(spr){
                var text:any = spr.getChildByName("labelTxt");
                if(!text){
                    spr.removeChildren();
                    text = new fairygui.GTextField();
                    text.font = fairygui.UIPackage.getItemURL("slots","Font1");
                    //text = new egret.TextField();
                    //text.size = 45;
                    //text.textColor = 0xffffff;
                    text.text = '' + result.rewardValue||1 +'';
                    text.y = -20;
                    //text.width = 180;
                    //text.textAlign = egret.HorizontalAlign.CENTER;
                    spr.addChild(text.displayObject);

                }
            }
            //this._slot.removeEventListener(egret.TouchEvent.TOUCH_END,this.Complete,this);
            //this._slot.addEventListener(egret.TouchEvent.TOUCH_END,this.Complete,this);
        }

        private onAnimComplete():void {
            if (this._ani) {
                var self = this;
                this._ani.removeEventListener(egret.Event.COMPLETE, this.onAnimComplete, this);
                var anim:starlingswf.SwfMovieClip = this._ani;
                var timeout:number = setTimeout(function() {
                    clearTimeout(timeout);
                    self._slot.m_n129.enabled = true;
                    if (!!anim && !!anim.parent) 
                        anim.parent.removeChild(anim);
                }, 1000);
            }
        }

        private _playTimes:number = 0;
        private playKey(times:number):void{
            this._playTimes = times;
            if (this._playTimes > 0) 
                this.playKeyAnim();
        }

        private playKeyAnim():void {

            if (this._playTimes <= 0) {
                game.UIEvent.SHOW_KEY_ANI_END.dispatch();
                return;
            }
            this._playTimes --;
            game.UIEvent.UPDATE_CHEST.dispatch();
            var self = this;
            var graph:fairygui.GGraph = this._slot.m_yaoshi;
            var anim:starlingswf.SwfMovieClip = ui.UIUtils.createStarlingSwf("laohujinew004","mc_laohujinew001_yaoshi",false,false);
            if (!!graph) {
                graph.setNativeObject(anim);
                graph.touchable = false;
            }

            var timeout:number = setTimeout(function ():void {
                clearTimeout(timeout);
                self.playKeyAnim();
            }, 1000);
        }

    }

}