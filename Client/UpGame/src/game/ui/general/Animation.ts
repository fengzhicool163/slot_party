module game {

    export class Animation {

        private static _animationCache:any = {};

        private static _swfCache:any = {};
        private static _animationsCache:any = {};

        private _anim:starlingswf.SwfMovieClip;

        private _cb:Function;
        private _ctx:any;
        private _clearOnStop:boolean = true;
        private _graph:fairygui.GGraph;

        private _key:string;

        public static get(swfName:string, animName:string):game.Animation {
            var key:string = swfName + '|' + animName;
            var animations:game.Animation[] = this._animationCache[key];
            if (!animations) {
                animations = [];
                this._animationCache[key] = animations;
            }
            var anim:game.Animation;
            if (animations.length > 0) {
                anim = animations.shift();
            } else {
                anim = new Animation();
            }

            anim.init(swfName, animName, key);

            return anim;
        }

        private init(swfName:string, animName:string, key:string):void {
            this._key = key;

            if (!this._anim)
                this._anim = this.create(swfName, animName);

            if (this._anim) {
                this._anim.scaleX = this._anim.scaleY = 1;
                this._anim.x = this._anim.y = 0;

                this.stop();
            }
        }

        private create(swfName:string, animName:string):starlingswf.SwfMovieClip {
            if (!Animation._swfCache[swfName]) {
                Animation._swfCache[swfName] = game.AssetManager.Ins.getSwf(swfName);
            }
            var swf:starlingswf.Swf = Animation._swfCache[swfName];
            return swf.createMovie(animName);
        }

        public attach(graph:fairygui.GGraph, touchable:boolean = false):game.Animation {
            this._graph = graph;

            if (this._anim && this._graph) {
                this._graph.setNativeObject(this._anim);
                this._graph.touchable = touchable;
            }
            return this;
        }

        public play(loop:boolean = false, frame:number = 0):game.Animation {
            if (this._anim) {
                this._anim.loop = loop;
                this._anim.gotoAndPlay(frame);

                if (!loop && !this._anim.hasEventListener(egret.Event.COMPLETE)) {
                    this._anim.addEventListener(egret.Event.COMPLETE, this.onStopHandler, this);
                }
            }
            return this;
        }

        public stop(frame:number = 0, clear:boolean = true):game.Animation {
            this._clearOnStop = clear;
            if (this._anim) {
                this._anim.gotoAndStop(frame);

                this.onStopHandler();
            }
            return this;
        }

        public fitScale(isToScreen:boolean = true, w?:number, h?:number):game.Animation {
            w = w > 0 ? w : fairygui.GRoot.inst.width;
            h = h > 0 ? h : fairygui.GRoot.inst.height;
            this._anim.scaleX = isToScreen ? fairygui.GRoot.inst.width / 640 : this._anim.width / w;
            this._anim.scaleY = isToScreen ? fairygui.GRoot.inst.height / 960 : this._anim.height / h;

            return this;
        }

        public fitScreen():game.Animation {
            ui.UIUtils.fitScale(this._anim, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);

            return this;
        }

        public onStop(clear:boolean, cb?:Function, ctx?:any):game.Animation {
            this._cb = cb;
            this._ctx = ctx;
            this._clearOnStop = clear;
            return this;
        }

        private onStopHandler():void {
            if (this._clearOnStop) {
                this.clear();
            }

            if (!!this._cb) this._cb.apply(this._ctx);
        }

        public clear():game.Animation {
            if (this._graph) {
                this._graph.clearGraphics();
            }

            if (this._anim) {
                this._anim.scaleX = this._anim.scaleY = 1;
            }

            if (this._anim && this._anim.parent) {
                this._anim.parent.removeChild(this._anim);
            }

            if (!!this._key && Animation._animationCache[this._key]) {
                var animations:Animation[] = Animation._animationCache[this._key];
                if (!!animations && animations.length > 0 && animations.indexOf(this) == -1) {
                    animations.push(this);
                }
            }
            return this;
        }

        public get anim():starlingswf.SwfMovieClip {
            return this._anim;
        }

    }

}