module view {

    export class SlotWheel {

        public static LINE1:number[] = [1, 1, 1, 1, 1];
        public static LINE2:number[] = [0, 0, 0, 0, 0];
        public static LINE3:number[] = [2, 2, 2, 2, 2];
        public static LINE4:number[] = [0, 1, 2, 1, 0];
        public static LINE5: number[] = [2, 1, 0, 1, 2];
        public static LINE6: number[] = [0, 2, 0, 2, 0];
        public static LINE7: number[] = [2, 0, 2, 0, 2];
        public static LINE8: number[] = [1, 2, 1, 0, 1];
        public static LINE9: number[] = [1, 0, 1, 2, 1];
        public static LINES: number[][] = [
            SlotWheel.LINE1,
            SlotWheel.LINE2,
            SlotWheel.LINE3,
            SlotWheel.LINE4,
            SlotWheel.LINE5,
            SlotWheel.LINE6,
            SlotWheel.LINE7,
            SlotWheel.LINE8,
            SlotWheel.LINE9,
        ];

        private static NO_REWARD:number[] = [10, 17, 1, 26, 15];

        private static _ins:SlotWheel;
        private _resultError:boolean = false;
        public static get Ins():SlotWheel {
            if (this._ins == null) this._ins = new SlotWheel();
            return this._ins;
        }

        public static MAX_SCROLLER: number = 5;
        public static MAX_LINE: number = SlotWheel.LINES.length;

        private _slot:ui.slots.UI_slots;
        private _scroller:ui.SlotScroller[];
        private _rewardLine:ui.SlotRewardLine;
        private _runIndex:number = -1;
        private _resultIndex:number = -1;
        private _stopNum:number = 0;
        private _allStarted:boolean = false;
        private _wheelResultSetted:boolean = false;
        private _wheelResult:number[];
        private _showReward:boolean = false;
        private _rewardResult:any;
        private _rewardDetail:any;
        private _lineIndex:number = 0;
        private _rewardNumScroller:ui.SlotNumberScroller;
        private _isSlotResult:boolean = true;

        private _mode:number = 0;
        private _scrollerConf:any[] = [];
        private _scrollerPostion:any[] = [];

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            game.UIEvent.SLOT.add(this.onSlot, this);
            game.UIEvent.SLOT_RESULT.add(this.onSlotResult, this);
            game.UIEvent.SLOT_RESULT_POPUP_END.add(this.onSlotResultPopup, this);
            game.UIEvent.SLOT_CHANGE_SCROLLER.add(this.onChangeScroller, this);

            var confR: any[][] = model.LocalConfigModel.Ins.getUnitRowsR();
            var scrollerConfR: any[][] = [];
            for (var i: number = 0; i < confR.length; i++) {
                var c: any[] = confR[i];
                var s: ui.ISlotUnitConfig[] = [];
                scrollerConfR.push(s);
                for (var j: number = 0; j < c.length; j++) {
                    var unit: string = c[j];
                    var temp: ui.ISlotUnitConfig = {
                        id: unit,
                        name: SlotViewMain.UNIT_NAMES[unit],
                        bitmap: SlotViewMain.getUnitTexture(unit),
                        bitmap_blur: SlotViewMain.getUnitTexture(`${unit}_blur`)
                    };
                    s.push(temp);
                }
            }
            this._scrollerConf.push(scrollerConfR);

            var confS: any[][] = model.LocalConfigModel.Ins.getUnitRowsS();
            var scrollerConfS: any[][] = [];
            for (var i: number = 0; i < confS.length; i++) {
                var c: any[] = confS[i];
                var s: ui.ISlotUnitConfig[] = [];
                scrollerConfS.push(s);
                for (var j: number = 0; j < c.length; j++) {
                    var unit: string = c[j];
                    var temp: ui.ISlotUnitConfig = {
                        id: unit,
                        name: SlotViewMain.UNIT_NAMES[unit],
                        bitmap: SlotViewMain.getUnitTexture(unit),
                        bitmap_blur: SlotViewMain.getUnitTexture(`${unit}_blur`)
                    };
                    s.push(temp);
                }
            }
            this._scrollerConf.push(scrollerConfS);

            if(model.UserModel.Ins.numOfGetReward == 4){
                var scrollerConf: any[][] = scrollerConfS;
                this.setScroller(scrollerConf);
                this._mode = 1;
            }else {
                var scrollerConf: any[][] = scrollerConfR;
                this.setScroller(scrollerConf);
                this._mode = 0;
            }


            this._rewardLine = new ui.SlotRewardLine();
            this._slot.displayListContainer.addChild(this._rewardLine);
            
            this._rewardNumScroller = new ui.SlotNumberScroller('font1', 0.4);
            this._rewardNumScroller.x = this._slot.width / 2;
            this._rewardNumScroller.y = this._slot.height / 2;
            this._rewardNumScroller.scalable = false;
            this._slot.displayListContainer.addChildAt(this._rewardNumScroller, this._slot.displayListContainer.getChildIndex(this._rewardLine) + 1);
        }

        private setScroller(scrollerConf:any[][]):void {
            this._scroller = [];
            // 需要放到graph里去
            this._scroller.push(new ui.SlotScroller(scrollerConf[0], this._slot.m_guang1.width, this._slot.m_guang1.height, 3));
            this._slot.m_guang1.setNativeObject(this._scroller[0]);

            this._scroller.push(new ui.SlotScroller(scrollerConf[1], this._slot.m_guang2.width, this._slot.m_guang2.height, 3));
            this._slot.m_guang2.setNativeObject(this._scroller[1]);

            this._scroller.push(new ui.SlotScroller(scrollerConf[2], this._slot.m_guang3.width, this._slot.m_guang3.height, 3));
            this._slot.m_guang3.setNativeObject(this._scroller[2]);

            this._scroller.push(new ui.SlotScroller(scrollerConf[3], this._slot.m_guang4.width, this._slot.m_guang4.height, 3));
            this._slot.m_guang4.setNativeObject(this._scroller[3]);

            this._scroller.push(new ui.SlotScroller(scrollerConf[4], this._slot.m_guang5.width, this._slot.m_guang5.height, 3));
            this._slot.m_guang5.setNativeObject(this._scroller[4]);

        }

        private onChangeScroller(mode:number):void {
            if(this._mode == mode) return;
            this.stopScroll();
            if(mode == 0){
                //this.getScrollerPostion();
                this.setScroller(this._scrollerConf[0]);
                //this.setScrollerPostion();
            }else if(mode == 1){
                //this.getScrollerPostion();
                this.setScroller(this._scrollerConf[1]);
                //this.setScrollerPostion();
            }
            this._mode = mode;
            //this.changeScrollerDone();
        }

        public getMode():number {
            return this._mode;

        }

        private changeScrollerDone():void {
            game.GameEvent.SHOW_CHANGE_SCROLLER_END.dispatch();

        }

        private stopScroll():void {
            for(var i=0; i<this._scroller.length; i++){
                var scroller = this._scroller[i];
                scroller.stop();
            }

        }

        private setScrollerPostion():void {
            for(var i=0; i<this._scroller.length; i++){
                var scroller = this._scroller[i];
                scroller.setPostion(this._scrollerPostion[i]);
            }

        }

        private getScrollerPostion():void {
            this._scrollerPostion = [];
            for(var i=0; i<this._scroller.length; i++){
                var scroller = this._scroller[i];
                var endidx = scroller.getEndIndex();
                this._scrollerPostion.push(endidx);
            }

        }

        private onSlot():void {
            console.log('[SlotWheel]', 'Wheeeeeeeeeel!');
            this._runIndex = -1;
            this._resultIndex = -1;
            this._stopNum = 0;
            this._allStarted = false;
            this._isSlotResult = true;
            this.run();
        }

        private run():void {
            this._runIndex ++;
            if (this._scroller.length >= (this._runIndex + 1)) {
                var scroller:ui.SlotScroller = this._scroller[this._runIndex];
                // 启动转动
                scroller.start(this.onEnd, this);

                var self = this;
                var timeout:number = setTimeout(function ():void {
                    clearTimeout(timeout);
                    self.run();
                }, 200);
            } else {
                this._allStarted = true;
                // handle result
                this.setResult();
            }
        }

        private onSlotResult(error:any, result:game.SlotResponse):void {
            if (error) {
                // var self = this;
                // var timeout:number = setTimeout(function() {
                //     clearTimeout(timeout);
                //     for (var i:number = 0; i < self._scroller.length; i ++) {
                //         self._scroller[i].stop(SlotWheel.NO_REWARD[i]);
                //     }
                //
                // }, 1000);
                // self._allStarted = false;
                this._resultError = true;
                this._wheelResult = SlotWheel.NO_REWARD;
                this._wheelResultSetted = true;
                this.setResult();
            } else {
                this._resultError = false;
                this._wheelResult = result.slotResult.rowIndex;
                this._rewardResult = result.slotResult.rowArray;
                this._rewardDetail = result.slotResult.rewardDetails;
                this._showReward = result.rewardDiamond > 0;
                this._wheelResultSetted = true;
                if (this._isSlotResult) {
                    this.setResult();
                } else {
                    this.onSlot();
                }
            }
        }

        private setResult():void {
            if (this._allStarted && this._wheelResultSetted && this._wheelResult) {
                this._wheelResultSetted = false;
                this.loopResult();
            }
        }

        private loopResult():void {
            this._resultIndex ++;
            if (this._scroller.length >= (this._resultIndex + 1)) {
                var scroller:ui.SlotScroller = this._scroller[this._resultIndex];
                scroller.setResult(this._wheelResult[this._resultIndex]);

                var self = this;
                var timeout = setTimeout(function ():void {
                    self.loopResult();
                }, 200);
            }
        }

        private onSlotResultPopup():void {
            this._lineIndex = 0;
            this.showLine();
        }

        private onEnd(scroller:ui.SlotScroller):void {
            if (!this._allStarted) return;
            this._stopNum ++;
            if (this._stopNum == SlotWheel.MAX_SCROLLER) {
                this._allStarted = false;
                this._isSlotResult = false;
                if (this._resultError)
                    game.UIEvent.SLOT_COMPLETE.dispatch();
                else
                    game.UIEvent.SLOT_WHEEL_END.dispatch();
            }
        }

        private _splashNum:number = 0;
        private showLine():void {
            if (this._lineIndex < SlotWheel.MAX_LINE) {
                this._lineIndex ++;
                var rewardNum:number = this._rewardResult[this._lineIndex];
                // console.log('[SlotWheel]', `第 ${this._lineIndex} 条线, 中了 ${rewardNum} 个, ${SlotWheel.LINES[this._lineIndex - 1]}`)
                if (rewardNum > 0) {
                    this._splashNum = rewardNum;
                    var squares:egret.Rectangle[] = [];
                    var i:number = 0;
                    var slotIndex:number = 0;
                    for (i = 0; i < SlotWheel.MAX_SCROLLER; i ++) {
                        slotIndex = SlotWheel.LINES[this._lineIndex - 1][i];
                        if (i < rewardNum) {
                            this._scroller[i].splash(slotIndex, this.onSplashComplete, this);
                        }
                        squares.push(this._scroller[i].getSlotGlobalRect(slotIndex));
                    }

                    // 画线
                    this._rewardLine.draw(rewardNum, squares, SlotWheel.LINES[this._lineIndex - 1]);
                    // 出数
                    this._rewardNumScroller.target = this._rewardDetail[this._lineIndex];
                    // this._rewardNumScroller.setTo(this._rewardDetail[this._lineIndex]);
                } else {
                    this.showLine();
                }
            } else {
                game.UIEvent.SLOT_LINE_REWARD_END.dispatch();
            }
        }

        private onSplashComplete():void {
            this._rewardLine.clear();
            this._rewardNumScroller.stop();
            this._rewardNumScroller.current = 0;

            if (this._splashNum > 0) {
                this._splashNum --;
            }
            
            if (this._splashNum <= 0) 
                this.showLine();
        }

        public getUnitIndex(unit:string):number[] {
            // 当前需要计算的线束
            var selectedLines:number[][] = SlotWheel.LINES.slice(0, game.SlotLogic.Ins.line);
            // 3 * 5的矩阵来表示当前滚轮的状态
            var visibleUnits:string[][] = [];
            for (var i:number = 0; i < SlotWheel.MAX_SCROLLER; i ++) {
                var units:string[] = this._scroller[i].getVisibleUnits();
                visibleUnits.push(units);
            }

            var r:number[] = [];
            for (i = 0; i < selectedLines.length; i ++) {
                // 对于每条线,判断是不是有需要的元素在线上
                var line:number[] = selectedLines[i];
                for (var j:number = 0; j < line.length; j ++) {
                    if (visibleUnits[j][line[j]] == unit) {
                        var idx:number = line[j] * 5 + j + 1;
                        r.push(idx);
                    }
                }
            }

            return r;
        }

    }

}