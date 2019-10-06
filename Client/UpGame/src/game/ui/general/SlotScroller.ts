module ui {

    export interface ISlotUnitConfig {

        id: string;
        name: string;
        bitmap: egret.Texture;
        bitmap_blur: egret.Texture;

    }

    export class SlotScroller extends egret.Sprite {

        private _visibleItemNum:number;
        private _visibleHeight:number;
        private _visibleWidth:number;
        private _unitWidth:number;
        private _unitHeight:number;
        private _config:ISlotUnitConfig[];
        private _container:egret.Sprite;
        private _running:boolean = false;
        private _unitGap:number = -1;

        private _onComplete:Function;
        private _onCompleteContext:any;

        private _splashGraph:fairygui.GGraph;

        public constructor(config:ISlotUnitConfig[], w:number, h:number, visibleItemNum:number) {
            super();

            this._config = config;
            this._visibleItemNum = visibleItemNum;
            this._visibleHeight = h;
            this._visibleWidth = w;
            this._container = new egret.Sprite();
            this.addChild(this._container);

            ui.UIUtils.lifeTime(this, this.onAdded, null, null, true);
        }

        private onAdded(e:egret.Event):void {
            // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), '结果为', this._config);

            this._container.graphics.beginFill(0xCCCCCC, 0);
            this._container.graphics.drawRect(0, 0, this._visibleWidth, this._visibleHeight);
            this._container.graphics.endFill();
            
            var rect:egret.Rectangle = new egret.Rectangle(0, 0, this._visibleWidth, this._visibleHeight);
            this._container.scrollRect = rect;

            // 初始化图标等
            this._l1 = new egret.Sprite();
            var bpContainer:egret.Sprite;
            var bp:egret.Bitmap;
            var bp_:egret.Bitmap;
            var itemHeight:number = this._visibleHeight / this._visibleItemNum;

            for (var i:number = 0; i < this._config.length; i ++) {
                bpContainer = new egret.Sprite();
                bpContainer.name = this._config[i].name;

                bp = new egret.Bitmap(this._config[i].bitmap);
                if (this._unitGap == -1) {
                    this._unitGap = Math.round((itemHeight - bp.height) / 2);
                    // console.log('[SlotScroller]', 'gap', gap);
                }
                bp.y = this._unitGap;
                bpContainer.addChild(bp);
                bp_ = new egret.Bitmap(this._config[i].bitmap_blur);
                bp_.y = this._unitGap;
                bp_.visible = false;
                bpContainer.addChild(bp_);
                bpContainer.y = this._l1.numChildren ? this.l1Height : 0;
                this._l1.addChild(bpContainer);
            }
            this._l2 = new egret.Sprite();
            for (var i:number = 0; i < this._config.length; i ++) {
                bpContainer = new egret.Sprite();
                bpContainer.name = this._config[i].name;

                bp = new egret.Bitmap(this._config[i].bitmap);
                bp.y = this._unitGap;
                bpContainer.addChild(bp);
                bp_ = new egret.Bitmap(this._config[i].bitmap_blur);
                bp_.y = this._unitGap;
                bp_.visible = false;
                bpContainer.addChild(bp_);
                bpContainer.y = this._l2.numChildren ? this.l2Height : 0;
                this._l2.addChild(bpContainer);
            }
            this._l1.y = 0;
            this._container.addChild(this._l1);
            this._l2.y = -this.l2Height;
            this._container.addChild(this._l2);

            this._unitWidth = Math.round(this._visibleWidth);
            this._unitHeight = Math.round(itemHeight) + this._unitGap * 2;
        }

        public start(onComplete:Function, context:any):void {
            this.setOnCompleteCallback(onComplete, context);
            this.onSlot();
        }


        public setOnCompleteCallback(onComplete:Function, context:any):void {
            this._onComplete = onComplete;
            this._onCompleteContext = context;
        }

        public setResult(index:number):void {
            this._endIndex = index == 0 ? this._config.length - 1 : index - 1;
            // this._endIndex = index;

            // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), '结果:', this._endIndex);

            this.whatsTheResult();
        }

        public stop(index:number = 0):void {
            var self = this;
            if (!self._running) return;

            if (self._endIndex != -1) {
                console.log('[SlotScroller]', '停到当前结果', self._endIndex);
                self._scrollStatus = 3;
            } else {
                // 停到0
                self._endIndex = index;
                self._scrollStatus = 3;
            }
        }

        /*
        * 闪光
        * @param index 0, 1, 2 分别代表上中下
        */
        public splash(index:number, onComplete?:Function, context?:any):void {
            var idx:number = this._endIndex + index;
            if (idx >= this._config.length) idx = idx - this._config.length;
            // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), 'splash:', idx, 'end:', this._endIndex);

            var child:egret.DisplayObject = this._fixL1 ? this._l1.getChildAt(idx) : this._l2.getChildAt(idx);
            
            if (child) {
                var ox:number = child.x, 
                    oy:number = child.y, 
                    tx:number = ox + this._unitWidth * -0.2, 
                    ty:number = oy + this._unitHeight * -0.2, 
                    tx1:number = ox + this._unitWidth * -0.05, 
                    ty1:number = oy + this._unitHeight * -0.05;
                // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), 'child:', child.name, ox, oy, tx, ty);

                if (!this._splashGraph) {
                    this._splashGraph = new fairygui.GGraph();
                }
                this._splashGraph.y = this._unitHeight * index;
                game.Animation.get("laohujinew002", "mc_laohujinew001yc_tubiaoguang")
                    .attach(this._splashGraph)
                    .play(false);
                if (!this.contains(this._splashGraph.displayObject)) {
                    this.addChild(this._splashGraph.displayObject);
                }

                egret.Tween.get(child)
                    .to({scaleX: 1.4, scaleY: 1.4, x: tx, y: ty}, 50)
                    .wait(100)
                    .to({scaleX: 1, scaleY: 1, x: ox, y: oy}, 200)
                    .to({scaleX: 1.1, scaleY: 1.1, x: tx1, y: ty1}, 200)
                    .to({scaleX: 1, scaleY: 1, x: ox, y: oy}, 150)
                    .to({scaleX: 1.1, scaleY: 1.1, x: tx1, y: ty1}, 200)
                    .to({scaleX: 1, scaleY: 1, x: ox, y: oy}, 150)
                    .wait(100)
                    .call(function ():void {
                        child.x = ox;
                        child.y = oy;
                        if (!!onComplete) onComplete.apply(context);
                    });
            } else {
                if (!!onComplete) onComplete.apply(context);
            }
        }

        private _slotRect:egret.Rectangle = new egret.Rectangle();
        private _slotP:egret.Point = new egret.Point();
        public getSlotGlobalRect(index:number):egret.Rectangle {
            var idx:number = this._endIndex + index;
            if (idx >= this._config.length) idx = idx - this._config.length;

            var child:egret.DisplayObjectContainer = this._l1.getChildAt(idx) as egret.DisplayObjectContainer;
            var pos:number = child.y + this._l1.y + this._unitGap;
            if (pos < 0 || pos >= this._visibleHeight) {
                child = this._l2.getChildAt(idx) as egret.DisplayObjectContainer;
            }
            if (child) {
                this._slotRect.setEmpty();

                child.localToGlobal(0, child.getChildAt(0).y, this._slotP);
                this._slotP.x = Math.floor(this._slotP.x);
                this._slotP.y = Math.floor(this._slotP.y);
                this._slotRect.x = this._slotP.x;
                this._slotRect.y = this._slotP.y;
                this._slotRect.width = this._unitWidth;
                this._slotRect.height = this._unitHeight;

                // console.log('[SlotScroller]', 'global rect:', this._slotRect, child.getChildAt(0).y, child.y);

                return this._slotRect;
            }
            return null;
        }
        
        public getVisibleUnits():string[] {
            var self = this;

            var nIndex:number = self._endIndex == self._config.length - 1 ? 0 : self._endIndex + 1, 
                nnIndex:number = nIndex == self._config.length - 1 ? 0 : nIndex + 1;
                
            var n:string = self._config[nIndex].id, 
                c:string = self._config[self._endIndex].id, 
                nn:string = self._config[nnIndex].id;
            
            return [c, n, nn];
        }

        private whatsTheResult():void {
            var self = this;
            var result:string[] = self.getVisibleUnits();
            console.log(
                '[SlotScroller]', 
                'index_' + self.parent.parent.getChildIndex(self.parent), 
                `结果为: ${result.join(',')}`);
        }

        private _l1:egret.Sprite;
        private _l2:egret.Sprite;

        private _scrollStatus:number = -1;

        private _endIndex:number = 0;

        private MAX_SPEED:number = 50;
        private INIT_SPEED:number = 2;

        private SPEED_STEP:number = 4;
        private MAX_SPEED_TIME:number = 0.8;
        private OUT_OF_TIME:number = 6;

        private _speed:number = this.INIT_SPEED;
        private _firstStepSpeedStep:number = 0;
        private _maxSpeed:number = this.MAX_SPEED;
        private _maxSpeedTime:number = this.MAX_SPEED_TIME;
        private _finalStepDetermined:boolean = false;
        private _finalStepTime:number = 0;
        private _finalStepTimePassed:number = 0;
        private _finalStepLength:number = 0;
        private _finalStepLastLength:number = 0;
        private _fixL1:boolean = false;

        private onSlot():void {
            var self = this;
            // scroll
            if (self._scrollStatus != -1) return;

            self._running = true;
            self._scrollStatus = 1;
            self._speed = self.INIT_SPEED;
            self._finalStepTimePassed = 0;
            self._finalStepLastLength = 0;
            self._finalStepDetermined = false;
            self._endIndex = -1;
            self._maxSpeed = Math.ceil(Math.random() * 20) + this.MAX_SPEED;

            var speedStep = self.SPEED_STEP;
            self._firstStepSpeedStep = speedStep * 2;

            self._maxSpeedTime = self.MAX_SPEED_TIME;
            self._maxSpeedTime = Math.ceil(self._maxSpeedTime * self.stage.frameRate);

            // console.log('scroll status:', this._speed, this._scrollStatus);
            self.stage.addEventListener(egret.Event.ENTER_FRAME, self.scroll, self);
        }

        private scroll():void {
            if (this._l1.y > this._visibleHeight) {
                this._l1.y = this._l2.y - this.l1Height;
            } else if ((this._l1.y + this.l1Height) < this._visibleHeight) {
                this._l2.y = this._l1.y + this.l1Height;
            }
            if (this._l2.y > this._visibleHeight) {
                this._l2.y = this._l1.y - this.l2Height;
            } else if ((this._l2.y + this.l2Height) < this._visibleHeight) {
                this._l1.y = this._l2.y + this.l2Height;
            }

            this._l1.y += this._speed;
            this._l2.y += this._speed;

            if (this._scrollStatus == 1) {
                if (this._speed < this.MAX_SPEED) {
                    this._speed += this._firstStepSpeedStep;

                    if (this._speed > 15) {
                        this.toModal(true);
                    }

                    if (this._speed >= this.MAX_SPEED) {
                        this._speed = this.MAX_SPEED;
                        this._scrollStatus = 2;
                        // console.log('scroll status:', this._speed, this._scrollStatus);
                    }
                }
            } else if (this._scrollStatus == 2) {
                this.toModal(true);

                this._speed = this.MAX_SPEED;
                this._maxSpeedTime --;

                // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), this._maxSpeedTime, this._endIndex);
                if (this.OUT_OF_TIME * this.stage.frameRate < this._maxSpeedTime) {
                    // 超时了,强制停止
                    this.stop();
                } else if (this._maxSpeedTime <= 0 && this._endIndex != -1) {
                    this._scrollStatus = 3;
                    // console.log('scroll status:', this._speed, this._scrollStatus);
                }
            } else if (this._scrollStatus == 3) {
                if (!this._finalStepDetermined) {
                    this._finalStepDetermined = true;

                    // 这里决定要多转多少
                    var l1EndPos:number = this._l1.getChildAt(this._endIndex).y, 
                        l1Pos:number = this._l1.y, 
                        l2EndPos:number = this._l2.getChildAt(this._endIndex).y, 
                        l2Pos:number = this._l2.y, 
                        l1CurrPos:number = l1Pos + l1EndPos, 
                        l2CurrPos:number = l2Pos + l2EndPos;

                    if (l1Pos > -this.l1Height && l1EndPos < this._visibleHeight) {
                        // 正在显示L1,就用l1的位置来算需要多少距离
                        // 这里可能出现离得过近或者过远的情况,直接
                        // 做一段offset来调整位置
                        this._speed = -1500 - l1CurrPos;

                        this._fixL1 = true;
                    } else {
                        // 正在显示l2
                        this._speed = -1500 - l2CurrPos;

                        this._fixL1 = false;
                    }
                    this._finalStepLength = 1500;
                    this._finalStepTime = 40;

                    return;
                }

                this._finalStepTimePassed ++;

                var t:number = (this._finalStepTime - this._finalStepTimePassed) > 20 ? 
                    this._finalStepTimePassed / this._finalStepTime : 
                    this.tween(this._finalStepTimePassed / this._finalStepTime);
                var l:number = this._finalStepTimePassed == this._finalStepTime ? this._finalStepLength : this._finalStepLength * t;
                this._speed = l - this._finalStepLastLength;
                if (this._finalStepTimePassed <= this._finalStepTime) {
                    // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), 
                    //     'speed', this._finalStepLength, this._finalStepTime, this._speed);

                    // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), 
                    //     [this._finalStepLength, l, this._finalStepTime].join('\n'));
                }
                this._finalStepLastLength = l;

                if ((this._finalStepTime - this._finalStepTimePassed) < 30) {
                    this.toModal(false);
                }

                if (this._finalStepTimePassed >= this._finalStepTime) {
                    var l1EndPos:number = this._l1.getChildAt(this._endIndex).y, 
                        l1Pos:number = this._l1.y, 
                        l2EndPos:number = this._l2.getChildAt(this._endIndex).y, 
                        l2Pos:number = this._l2.y;
                    var currPos:number = Math.ceil(Math.abs(l1EndPos + l1Pos)), 
                        currPos:number = Math.ceil(Math.abs(l2EndPos + l2Pos));
                    // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), 
                    //     'last pos', this._endIndex, this._l1.y, this._l2.y, this._l1.getChildAt(this._endIndex).y, this._l2.getChildAt(this._endIndex).y);
                    if (this._fixL1) {
                        this._l1.y = -this._l1.getChildAt(this._endIndex).y;
                    } else {
                        this._l2.y = -this._l2.getChildAt(this._endIndex).y;
                    }
                    
                    if (this._l1.y > this._visibleHeight) {
                        this._l1.y = this._l2.y - this.l1Height;
                    } else if ((this._l1.y + this.l1Height) < this._visibleHeight) {
                        this._l2.y = this._l1.y + this.l1Height;
                    }
                    if (this._l2.y > this._visibleHeight) {
                        this._l2.y = this._l1.y - this.l2Height;
                    } else if ((this._l2.y + this.l2Height) < this._visibleHeight) {
                        this._l1.y = this._l2.y + this.l2Height;
                    }

                    this.toModal(false);

                    // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent), 
                    //     'end in:', this._l1.y, this._l2.y);

                    this._finalStepLastLength = 0;
                    this._finalStepTimePassed = 0;
                    this._finalStepDetermined = false;
                    this.jumpOut();
                }
            }
        }

        private get l1Height():number {
            return this._l1.height + this._unitGap;
        }

        private get l2Height():number {
            return this._l2.height + this._unitGap;
        }

        private _modaled:boolean = false;
        private toModal(v:boolean):void {
            if (this._modaled != v) {
                this._modaled = v;

                if (this._modaled) {
                    for (var i:number = 0; i < this._l1.numChildren; i ++) {
                        var p:egret.DisplayObjectContainer = this._l1.getChildAt(i) as egret.DisplayObjectContainer;
                        p.getChildAt(0).visible = false;
                        p.getChildAt(1).visible = true;
                        p = this._l2.getChildAt(i) as egret.DisplayObjectContainer;
                        p.getChildAt(0).visible = false;
                        p.getChildAt(1).visible = true;
                    }
                } else {
                    for (var i:number = 0; i < this._l1.numChildren; i ++) {
                        var p:egret.DisplayObjectContainer = this._l1.getChildAt(i) as egret.DisplayObjectContainer;
                        p.getChildAt(0).visible = true;
                        p.getChildAt(1).visible = false;
                        p = this._l2.getChildAt(i) as egret.DisplayObjectContainer;
                        p.getChildAt(0).visible = true;
                        p.getChildAt(1).visible = false;
                    }
                }
            }
        }

        // private BACK_OUT_AMOUNT:number = 0.9;
        private pi2 = Math.PI * 2;

        private _ease:Function;
        private tween(t:number):number {
            // return t;
            if (!this._ease) {
                this._ease = this.elasticOut(1, 0.3);

                // this._ease = this.backOut(2);

                // this._ease = this.cubicOut(3);
            }
            return this._ease(t);
        }

        private cubicOut(pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        };

        private elasticOut(amplitude, period) {
            var pi2 = Math.PI * 2;
            var s = period / pi2 * Math.asin(1 / amplitude);
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            };
        }

        private backOut(amount) {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            };
        };

        private jumpOut():void {
            this._scrollStatus = -1;
            this._running = false;
            // console.log('scroll status:', this._speed, this._scrollStatus);
            this.stage.removeEventListener(egret.Event.ENTER_FRAME, this.scroll, this);

            if (!!this._onComplete) this._onComplete.apply(this._onCompleteContext, [this]);
        }


        public setPostion(endindex:number):void{
            this._endIndex = endindex;
            var l1EndPos:number = this._l1.getChildAt(this._endIndex).y,
                l1Pos:number = this._l1.y,
                l2EndPos:number = this._l2.getChildAt(this._endIndex).y,
                l2Pos:number = this._l2.y;
            var currPos:number = Math.ceil(Math.abs(l1EndPos + l1Pos)),
                currPos:number = Math.ceil(Math.abs(l2EndPos + l2Pos));
            // console.log('[SlotScroller]', 'index_' + this.parent.parent.getChildIndex(this.parent),
            //     'last pos', this._endIndex, this._l1.y, this._l2.y, this._l1.getChildAt(this._endIndex).y, this._l2.getChildAt(this._endIndex).y);
            if (this._fixL1) {
                this._l1.y = -this._l1.getChildAt(this._endIndex).y;
            } else {
                this._l2.y = -this._l2.getChildAt(this._endIndex).y;
            }

            if (this._l1.y > this._visibleHeight) {
                this._l1.y = this._l2.y - this.l1Height;
            } else if ((this._l1.y + this.l1Height) < this._visibleHeight) {
                this._l2.y = this._l1.y + this.l1Height;
            }
            if (this._l2.y > this._visibleHeight) {
                this._l2.y = this._l1.y - this.l2Height;
            } else if ((this._l2.y + this.l2Height) < this._visibleHeight) {
                this._l1.y = this._l2.y + this.l2Height;
            }
        }

        public getEndIndex():number{
            return this._endIndex;
        }

    }

}