module view {

    export class SlotResult {

        private static _ins:SlotResult;
        public static get Ins():SlotResult {
            if (this._ins == null) this._ins = new SlotResult();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;
        private _reward:number = 0;
        private _showResultPopup:number = 0;
        private _numberScroller:ui.SlotNumberScroller;

        private _xixue:game.Animation;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            game.UIEvent.SLOT_RESULT.add(this.onSlotResult, this);
            game.UIEvent.SLOT_WHEEL_END.add(this.onSlotWheelEnd, this);

            // this._deer = game.Animation.get('laohujinew001', 'mc_laohujinew001_hua')
            //                 .attach(this._slot.m_hua)
            //                 .onStop(false)
            //                 .stop();

            this.xixueguiNormalAni();
        }

        private onSlotResult(error:any, result:game.SlotResponse):void {
            if (error) {
                this._showResultPopup = -1;
                if (error.error + '' == '4') {
                    var notify:any = {
                        content: game.Tools.lang('活動已結束!')
                    };
                    ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, notify);

                }

            } else {
                var bigWin:number = model.LocalConfigModel.Ins.getBigWin(), 
                    superWin:number = model.LocalConfigModel.Ins.getSuperWin();
                //result.rewardDiamond = 5600;
                this._reward = result.rewardDiamond;
                if (result.rewardDiamond < bigWin) {
                    // 不显示任何弹窗
                    this._showResultPopup = 0;
                } else if (result.rewardDiamond < superWin) {
                    // 显示小奖弹窗
                    this._showResultPopup = 1;
                } else {
                    // 显示大奖弹窗
                    this._showResultPopup = 2;
                }

                console.log('[SlotResult]', '弹窗:', this._showResultPopup, bigWin, superWin, this._reward);
            }
        }

        private xixueguiNormalAni():void {
             //this._xixue = game.Animation.get('laohujinew001', 'mc_laohujinew001xxg_xixuegui01')
             //                .attach(this._slot.m_xixuegui01)
             //                .onStop(false)
             //                .play(true);

            //game.Animation.get('laohujinew001', 'mc_laohujinew001xxg_xixuegui01')
            //    .attach(this._slot.m_xixuegui01)
            //    .play(true);
        }

        private xixueguiWinAni():void {
            var self = this;
            //var animation:game.Animation =
            //    game.Animation.get("laohujinew002", "mc_laohujinew001xxg_win01")
            //        .attach(this._slot.m_xixuegui01)
            //        .onStop(false, function ():void {
            //
            //            self.xixueguiNormalAni();
            //            if (self._numberScroller.parent) self._numberScroller.parent.removeChild(self._numberScroller);
            //            game.UIEvent.SLOT_RESULT_POPUP_END.dispatch();
            //
            //            //var timeout:number = setTimeout(function() {
            //            //    clearTimeout(timeout);
            //            //}, 1500);
            //        })
            //        .play(false);

        }

        private onSlotWheelEnd():void {
            var self = this;
            if (this._showResultPopup == 0 || this._showResultPopup == -1) {
                // 否则直接结束
                game.UIEvent.SLOT_RESULT_POPUP_END.dispatch();
            } else {
                game.UIEvent.SLOT_SHOW_RESULT.dispatch(self._showResultPopup);

                if (self._showResultPopup == 1) {
                    // big win
                    if (!self._numberScroller) self._numberScroller = new ui.SlotNumberScroller('font1');
                    self._numberScroller.x = fairygui.GRoot.inst.width / 2;
                    self._numberScroller.y = fairygui.GRoot.inst.height / 2;
                    self._slot.displayListContainer.addChild(self._numberScroller);
                    self._numberScroller.target = self._reward;
                    game.GameEvent.COLLECT_COMPLETE_ANIMATION.dispatch();
                    // 先播鹿, 鹿结束了需要播爆炸, 爆炸结束了, 动画就结束了
                    // self._deer
                    //     .play();


                     //game.Animation.get('laohujinew004', 'mc_laohujinew001_win002')
                     //    .attach(self._slot.m_zuanshi)
                     //    .fitScale()
                     //    .play()
                     //    .onStop(true, function ():void {
                     //       if (self._numberScroller.parent) self._numberScroller.parent.removeChild(self._numberScroller);
                     //       game.UIEvent.SLOT_RESULT_POPUP_END.dispatch();
                     //    }, self);
                    
                     //game.Animation.get('laohujinew003', 'mc_laohujinew001yc_paidui')
                     //    .attach(self._slot.m_chushuzi01)
                     //    // .fitScale()
                     //    .play();
                    
                    // 然后播花草盛开
                     game.Animation.get('laohujinew004', 'mc_laohujinew001xxg_win05')
                         .attach(self._slot.m_chushuzi01)
                         .fitScale()
                         .play()
                         .onStop(true, function ():void {
                             if (self._numberScroller.parent) self._numberScroller.parent.removeChild(self._numberScroller);
                             game.UIEvent.SLOT_RESULT_POPUP_END.dispatch();

                         }, self);

                    self.xixueguiWinAni();


                } else {
                    var popup:ui.IPopup = ui.UILayer.Ins.popup(ui.PopUpIds.SUPER_WIN, this._reward);
                    popup.onClose(function ():void {
                        // 弹窗关闭后派发结束事件
                        game.UIEvent.SLOT_RESULT_POPUP_END.dispatch();
                    }, this);

                }
            }
        }

    }

}