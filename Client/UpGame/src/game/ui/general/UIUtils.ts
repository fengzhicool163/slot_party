/**
 * Created by huangqingfeng on 16/5/3.
 */
module ui {

    import AssetManager = game.AssetManager;
    export class UIUtils {

        public static NATIVE_FONT_DEFAULT:string = 'font_system';
        public static NATIVE_FONT_EN_US:string = 'font_en_US';

        /*
        * 动态UI素材目录
        * */
        public static UI_BASE_URL:string = "resource/assets/dynamic/";

        /*
        * 怪物半身像目录
        * */
        public static MONSTER_HALF_BASE_URL:string = "resource/assets/icons/monster/";
        public static MONSTER_HALF_BASE_URL_ZH_CN_1:string = "resource/assets/icons_zh_CN_1/monster/";
        public static MONSTER_HALF_BASE_URL_ZH_CN_MT:string = "resource/assets/icons_zh_CN_MT/monster/";


        public static getMonsterHalfIcon(monsterId:string):string {
            return UIUtils.MONSTER_HALF_BASE_URL + monsterId + '.png';
        }

        /*
        * 获取关卡刷新的怪物配置
        * */
        public static getMissionUnits(missionId:string, callback:Function, context?:any):void {
            var missionConfUrl:string = 'resource/config/refreshUnit/' + missionId + '.json';
            RES.getResByUrl(missionConfUrl, function (data, url):void {
                if (data) {
                    if (!!callback) callback.apply(context, [data]);
                }
            }, this);
        }

        public static iterGLoader(comp:fairygui.GComponent, dealWithCallback?:Function, context?:any):void {
            if (comp) {
                var len:number = comp.numChildren,
                    child:fairygui.GLoader;
                for (var i:number = 0; i < len; i ++) {
                    child = comp.getChildAt(i).asLoader;
                    if (!!child && child instanceof fairygui.GLoader) {
                        if (dealWithCallback) {
                            if (dealWithCallback.apply(context, [child])) {
                                if (!UIUtils.fitMonsterLoader(child)) {
                                    child.url = UIUtils.UI_BASE_URL + child.name;
                                }
                            }
                        } else {
                            if (!UIUtils.fitMonsterLoader(child)) {
                                child.url = UIUtils.UI_BASE_URL + child.name;
                            }
                        }
                    }
                }
            }
        }

        /*
        * 半身像辅助方法.
        * 自动加载名字是怪物id的loader.或者根据提供的怪物id,加载对应的半身像.
        */
        public static fitMonsterLoader(loader:fairygui.GLoader, monsterId:string = null):boolean {
            if (!loader) return;

            var path:string = '';
            if (!!monsterId && monsterId.length > 0) {
                path += monsterId + '.png';
            } else if (loader.name.indexOf('monster') == 0) {
                path += loader.name;
            } else {
                return false;
            }

            if (path && path.length > 0) {
                loader.url = ui.UIUtils.MONSTER_HALF_BASE_URL + path;
                return true;
            }
            return false;
        }

        /*
        * 获取卡牌头像的fgui版本
        * */
        public static getMonsterIconFGui(monsterId:string, width?:number, height?:number, x?:number, y?:number):fairygui.GGraph {
            var g:fairygui.GGraph = new fairygui.GGraph(),
                icon:egret.DisplayObject = UIUtils.getMonsterIcon(monsterId);

            g.touchable = false;
            icon.x = icon.width / 2;
            icon.y = icon.height / 2;
            g.setNativeObject(icon);

            g.width = width == undefined ? icon.width : width;
            g.height = height == undefined ? icon.height : height;
            if (x != undefined) g.x = x;
            if (y != undefined) g.y = y;

            return g;
        }

        public static loadURLAsImage(url:string, loader:fairygui.GLoader):void {
            var setResType:Function = loader['setResType'];
            if (setResType) {
                setResType.apply(loader, [RES.ResourceItem.TYPE_IMAGE]);
            }
            loader.url = url;
        }

        /*
        * 往Graph里填充卡牌头像
        * */
        public static fitMonsterIconToGraph(monsterId:string, g:fairygui.GGraph):void {
            function onGetRes(icon: any,g:fairygui.GGraph): void {
                if (icon && g && g.parent) {
                    //加载完毕判断g是否还在舞台上,不在舞台上不管
                    icon.x = icon.width / 2;
                    icon.y = icon.height / 2;
                    icon.width = g.width;
                    icon.height = g.height;
                    g.setNativeObject(icon);
                }
            }
            if((RES.hasRes(monsterId + "_json") || RES.hasRes("img_" + monsterId + "_png")) && RES.hasRes(monsterId + "_swf_json")){
                game.AssetManager.Ins.getMonsterIcon(monsterId,function (g) {
                    return function (icon) {
                        onGetRes(icon,g)
                    }
                }(g),this);
            }else{
                var icon:egret.DisplayObject = UIUtils.getMonsterIcon(monsterId);
                onGetRes(icon,g);
            }

        }

        /*
        * 获取卡牌头像
        * */
        public static getMonsterIcon(monsterId:string):egret.DisplayObject {
            // 读取头像
            var swf:starlingswf.Swf = game.AssetManager.Ins.getSwf("assetHero");
            // 这图片的实际坐标在中点
            return swf.createImage("img_" + monsterId);
        }


        /*
        * 界面里基于home_page内的home_playerbox结构的组件都可以用这个方法直接填充用户信息:
        *   组件里要有   n30 GLoader
        *              n37 GGraph
        *              n32 GTextField (可以没有)    
        */
        public static fitPlayerHead(
            component:fairygui.GComponent,  // 要显示头像的组件容器，应该是基于home_page里的home_playerbox结构的 
            head:string,                    // 头像，可以是monster也可以是链接
            level:string = ''):void {            // 等级字符串
                if (component) {
                    var headLoader = component.getChild('n34').asLoader;
                     //RES.getResByUrl(head,function (data) {
                     //    var icon = new egret.Bitmap(data);
                     //    icon.x = icon.width / 2;
                     //    icon.y = icon.height / 2;
                     //    icon.width = 100;
                     //    icon.height = 100;
                     //    component.displayListContainer.addChild(icon)
                     //    //headGraph.setNativeObject(icon);
                     //},this);

                    ui.UIUtils.loadURLAsImage(head, headLoader);
                }
        }

        /*
        * TODO
        * 根据缩放来自适应.
        *
        * 此适配的逻辑是:
        *   1.假设原点是左上角
        *   2.对区域尺寸和设计尺寸进行比较,选择缩放率大(即更宽或更高)的一侧作为基准,等比放大另外一侧,从而让目标对象可以填满整个屏幕.
        *   3.基于缩放的结果和目标对象的原始位置信息,计算出新的位置信息
        *
        * 对于大部分背景/图片类型的缩放可以使用此办法缩放.
        * 需要确保传入的target对象拥有正确的尺寸和位置信息.
        *
        * @param target 需要调整的对象
        * @param areaWidth 自适应区域的宽度
        * @param areaHeight 自适应区域的高度
        * @param designWidth 设计宽度,默认640
        * @param designHeight 设计高度,默认960
        *
        * @return FitInfo 适配的详细信息,主要提供了target改变过后的位置信息等数值
        * */
        public static fitScale(target:any,
                               areaWidth:number,
                               areaHeight:number,
                               designWidth:number = 640,
                               designHeight:number = 960,
                               applyChange:boolean = true):FitInfo {
            var info:FitInfo = new FitInfo();

            // 适配不同高宽
            var w:number = areaWidth,
                h:number = areaHeight,
                vw:number = designWidth,
                vh:number = designHeight,
                sw:number = w / vw,
                sh:number = h / vh;

            // console.log(`[FitScale] before: ${target.x}, ${target.y}, ${target.width}, ${target.height}; to: ${areaWidth}, ${areaHeight}, ${sw.toFixed(3)}, ${sh.toFixed(3)}`);
            if (sw > sh) {
                info.scale = sw;
                info.x = target.x;
                info.y = target.y + (vh * (1 - sw)) / 2;

                if (applyChange) {
                    target.scaleX = target.scaleY = sw;
                    target.x = info.x;
                    target.y = info.y;
                    // console.log(`[FitScale] after: ${target.x}, ${target.y}, ${target.width}, ${target.height}, ${target.scaleX}`);
                }
            } else {
                info.scale = sh;
                info.x = target.x + (vw * (1 - sh)) / 2;
                info.y = target.y;

                if (applyChange) {
                    target.scaleX = target.scaleY = sh;
                    target.x = info.x;
                    target.y = info.y;
                    // console.log(`[FitScale] after: ${target.x}, ${target.y}, ${target.width}, ${target.height}, ${target.scaleX}`);
                }
            }

            return info;
        }

        /*
        * TODO
        * 不缩放,只做位置上的自适应.
        *
        * 对于面板里面的不随面板缩放的内容,一般可以采用此方法自适应.
        * 需要确保传入的target对象拥有正确的尺寸和位置信息.
        *
        * @param target 需要调整的对象
        * @param areaWidth 自适应区域的宽度,传值为-1时代表不需要适应宽度
        * @param areaHeight 自适应区域的高度,传值为-1时代表不需要适应高度
        * */
        public static fitAlign(target:any, areaWidth:number, areaHeight:number):FitInfo {
            var info:FitInfo = new FitInfo();
            info.scale = 1;
            info.x = areaWidth == -1 ? target.x : (areaWidth - target.width) / 2;
            info.y = areaHeight == -1 ? target.y : (areaHeight - target.height) / 2;
            return info;
        }

        private static EFFECT_NAME_PREFIX:string = 'dyEffect_';
        private static EFFECT_NAME_SEPERATOR:string = '_';
        /*
        * @comp 目标显示对象,上面要有预定义的占位组件用来动态加载动效
        * @effectPack 需要动态加载的动效所在的包
        * @callback 找到effect之后的回调方法
        * @callbackObj this
        * @actualWidth 假如动效的高宽和目标组件不一致,需要传入.目前来说,这里只有当需要匹配的界面是缩放效果的时候才需要传入
        * @actualHeight 假如动效的高宽和目标组件不一致,需要传入
        * */
        public static bindEffect(comp:fairygui.GComponent, isClear?:boolean, callback?:Function, callbackObj?:any, actualWidth?:number, actualHeight?:number):void {
            if (comp) {
                var handler:Function = function ():void {
                    comp.removeEventListener(egret.Event.ADDED_TO_STAGE, handler, this);
                    var effects:any = {};
                    if (comp && comp['numChildren']) {
                        var child:fairygui.GObject;
                        for (var i:number = 0, len:number = comp.numChildren; i < len; i ++) {
                            child = comp.getChildAt(i);
                            var prefixIdx:number = child.name.indexOf(UIUtils.EFFECT_NAME_PREFIX);
                            if (prefixIdx === 0) {
                                // 如果是清理,就不走下面的逻辑了
                                if (isClear === true) {
                                    child.asCom.removeChildren();
                                    continue;
                                }

                                var left:string = child.name.substr(UIUtils.EFFECT_NAME_PREFIX.length),
                                    lastSepIndex:number = left.lastIndexOf(UIUtils.EFFECT_NAME_SEPERATOR),
                                    packName:string = left.substr(0, lastSepIndex),
                                    itemName:string = left.substr(lastSepIndex + 1);
                                if (packName && packName.length > 0 && itemName && itemName.length > 0) {
                                    if (!effects.hasOwnProperty(packName)) effects[packName] = [];
                                    effects[packName].push({child: child, name: itemName, pack: packName});
                                }
                            }
                        }
                        for (var pack in effects) {
                            LoadingView.create(false, false)
                                .setCallback((function (cs:any[]):Function {
                                    return function ():void {
                                        for (var j:number = 0, len:number = cs.length; j < len; j ++) {
                                            var a:any = cs[j],
                                                c:fairygui.GObject = a.child,
                                                n:string = a.name,
                                                p:string = a.pack;
                                            
                                            var cp:fairygui.GComponent = c.asCom;
                                            if (cp) {
                                                cp.removeChildren();

                                                var effect:fairygui.GObject = fairygui.UIPackage.createObject(p, n);
                                                if (effect) {
                                                    cp.addChild(effect);
                                                    // console.log('添加动态特效', c.name);
                                                    if (actualWidth)
                                                        effect.scaleX = actualWidth / effect.width;
                                                    else
                                                        effect.width = cp.width;
                                                    if (actualHeight)
                                                        effect.scaleY = actualHeight / effect.height;
                                                    else
                                                        effect.height = cp.height;
                                                    
                                                    if (!!callback) {
                                                        callback.apply(callbackObj, [cp]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })(effects[pack]), this)
                                .queue(pack)
                                .load();
                        }
                    }
                };

                if (!comp.parent) {
                    comp.addEventListener(egret.Event.ADDED_TO_STAGE, handler, this);
                } else {
                    handler();
                }
            }
        }

        public static bindStarlingAnimation(
            resourceToLoad:string, 
            container:fairygui.GComponent, 
            childrenToRender:any, 
            handler?:Function, 
            handlerObj?:any
            ):Function {
            var json:string = resourceToLoad + '_json', 
                sheet:string = resourceToLoad + '_swf_json';
            if (RES.hasRes(json) && RES.hasRes(sheet)) {
                var cache:any[] = [];

                var clearCache:Function = function (c:any[]):Function {
                    return function ():void {
                        if (!!c && c.length > 0) {
                            while (c.length) {
                                var p = c.pop();
                                if (!!p) {
                                    p.stop();
                                    p.parent ? p.parent.removeChild(p) : null;
                                }
                            }
                        }
                    }
                }(cache);

                var createMovie:Function = function (c:any[], h?:Function, t?:any):Function {
                    return function ():void {
                        var graph:fairygui.GGraph, 
                            swf:starlingswf.Swf,
                            anim:starlingswf.SwfMovieClip;
                        for (var child in childrenToRender) {
                            if (container.getChild(child)) {
                                graph = container.getChild(child).asGraph;
                                graph.touchable = false;
                                swf = game.AssetManager.Ins.getSwf(resourceToLoad);
                                if (swf) {
                                    anim = swf.createMovie(childrenToRender[child]);
                                }
                                if (!!graph && !!anim) {
                                    anim.loop = true;
                                    anim.gotoAndPlay(0);
                                    graph.setNativeObject(anim);
                                    if (!!h) {
                                        h.apply(t, [anim, child, childrenToRender[child]]);
                                    } else {
                                        ui.UIUtils.fitScale(anim, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                                    }

                                    c.push(anim);
                                }
                            }
                        }
                    }
                }(cache, handler, handlerObj);

                game.AssetManager.Ins.loadAssets([json, sheet], function ():void {
                    ui.UIUtils.lifeTime(container, createMovie, clearCache, this, true);
                }, this);

                return clearCache;
            }
        }

        /*
        * 判断一个fgui对象是不是在屏幕区域里
        */
        private static _screenRect:egret.Rectangle;
        public static isEgretViewInScreen(view:egret.DisplayObject):boolean {
            if (!!view) {
                var viewRect:egret.Rectangle = UIUtils.localToGlobalRect(view);
                if (!UIUtils._screenRect) {
                    UIUtils._screenRect = new egret.Rectangle(0, 0, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                } else {
                    UIUtils._screenRect.width = fairygui.GRoot.inst.width;
                    UIUtils._screenRect.height = fairygui.GRoot.inst.height;
                }
                if (viewRect.intersects(UIUtils._screenRect) || UIUtils._screenRect.containsRect(viewRect)) {
                    return true;
                }
            }

            return false;
        }

        private static _localToGlobalRect:egret.Rectangle;
        private static _localToGlobalPoint:egret.Point;
        public static localToGlobalRect(view:any):egret.Rectangle {
            if (!UIUtils._localToGlobalRect) {
                UIUtils._localToGlobalRect = new egret.Rectangle();
                UIUtils._localToGlobalPoint = new egret.Point();
            } else {
                UIUtils._localToGlobalRect.setEmpty();
                UIUtils._localToGlobalPoint.setTo(0, 0);
            }

            if (view['localToGlobal'] && view['width'] && view['height']) {
                view.localToGlobal(0, 0, UIUtils._localToGlobalPoint);
                UIUtils._localToGlobalRect.x = UIUtils._localToGlobalPoint.x;
                UIUtils._localToGlobalRect.y = UIUtils._localToGlobalPoint.y;
                UIUtils._localToGlobalRect.width = view.width;
                UIUtils._localToGlobalRect.height = view.height;
            }

            return UIUtils._localToGlobalRect;
        }

        // private static _drawToScreenGraph:fairygui.GGraph;
        // private static _drawToScreenInited:boolean = false;
        // private static _drawToScreenViews:any[] = [];
        // public static addTodrawRectToUIQueue(view:any):void {
        //     if (!UIUtils._drawToScreenGraph) {
        //         UIUtils._drawToScreenGraph = new fairygui.GGraph();
        //         UIUtils._drawToScreenGraph.touchable = false;
        //         fairygui.GRoot.inst.addChild(UIUtils._drawToScreenGraph);
        //     }
        //     if (!UIUtils._drawToScreenInited) {
        //         UIUtils._drawToScreenInited = true;
        //         fairygui.GRoot.inst.displayObject.addEventListener(egret.Event.ENTER_FRAME, this.onDrawRectToScreen, this);
        //     }
        //     if (!!view && (view instanceof fairygui.GObject || view instanceof egret.DisplayObject)) {
        //         if (UIUtils._drawToScreenViews.indexOf(view) == -1)
        //             UIUtils._drawToScreenViews.push(view);
        //     }
        // }

        // private static onDrawRectToScreen(e):void {
        //     UIUtils._drawToScreenGraph.clearGraphics();
        //     if (UIUtils._drawToScreenViews && UIUtils._drawToScreenViews.length) {
        //         fairygui.GRoot.inst.setChildIndex(UIUtils._drawToScreenGraph, fairygui.GRoot.inst.numChildren - 1);
        //         UIUtils._drawToScreenGraph.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);

        //         for (var i:number = 0; i < UIUtils._drawToScreenViews.length; i ++) {
        //             var view:any = UIUtils._drawToScreenViews[i];
        //             UIUtils.drawRectToUI(view);
        //         }
        //     }
        // }

        // public static drawRectToUI(view:any):void {
        //     var rect:egret.Rectangle = UIUtils.localToGlobalRect(view);
        //     console.log('[UIUnit]', rect);
        //     if (rect && rect.width && rect.height) {
        //         UIUtils._drawToScreenGraph.graphics.lineStyle(2, 0xFF0000);
        //         UIUtils._drawToScreenGraph.graphics.beginFill(0, 0);
        //         UIUtils._drawToScreenGraph.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        //         UIUtils._drawToScreenGraph.graphics.endFill();
        //     }
        // }

        /*
        * 组件添加到舞台和移除舞台的监听简化方法.
        * */
        public static lifeTime(comp:any, onAdded?:Function, onRemoved?:Function, context?:any, clean:boolean = false):void {
            (function (c:any, a?:Function, r?:Function, t?:any, l:boolean = false):void {
                if (!!c) {
                    if (!!a) {
                        var af:Function = function ():void {
                                if (!!a) a.apply(t || c);
                                c.addEventListener(egret.Event.REMOVED_FROM_STAGE, rf, c);
                            },
                            rf:Function = function ():void {
                                if (l) {
                                    c.removeEventListener(egret.Event.ADDED_TO_STAGE, af, c);
                                    c.removeEventListener(egret.Event.REMOVED_FROM_STAGE, rf, c);
                                }

                                if (!!r) r.apply(t || c);
                            };
                        c.addEventListener(egret.Event.ADDED_TO_STAGE, af, c);
                        if (c.parent) {
                            af();
                        }
                    }
                }
            })(comp, onAdded, onRemoved, context, clean);
        }

        public static slotAnim:any = [];
        public static initStarswfAni(swfName,aniname,graph,isLoop = true,isFitScale = true,keyName?:any):any{
            var keyName = keyName ? keyName : aniname;
            var currentSwfAni = this.slotAnim[keyName] || this.createStarlingSwf(swfName, aniname, isLoop, isFitScale);;
            if (!this.slotAnim[keyName]) {
                this.slotAnim[keyName] = currentSwfAni;
            }
            currentSwfAni.loop = isLoop;
            currentSwfAni.gotoAndPlay(0);
            if (!!graph) {
                graph.setNativeObject(currentSwfAni);
                graph.touchable = false;
            }
            return currentSwfAni;
        }

        public static createStarlingSwf(swfName,aniname,isLoop,isFitScale):starlingswf.SwfMovieClip {
            var swf = game.AssetManager.Ins.getSwf(swfName);
            var currentSwfAni:starlingswf.SwfMovieClip;
            if (swf) {
                currentSwfAni = swf.createMovie(aniname);
                currentSwfAni.loop = isLoop;
                currentSwfAni.gotoAndPlay(0);
                if (currentSwfAni) {
                    if (isFitScale) {
                        ui.UIUtils.fitScale(currentSwfAni, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                    }
                }
            }
            return currentSwfAni;
        }

        public static showOnce(swfName:string, animName:string, graph:fairygui.GGraph, onComplete?:Function, context?:any):void {
            var self = this;
            var anim:starlingswf.SwfMovieClip = self.initStarswfAni(swfName, animName, graph, false);
            if (anim) {
                var cb:Function = function (
                    a:starlingswf.SwfMovieClip, 
                    callback:Function, 
                    ctx:any):Function {
                        return function ():void {
                            if (a.parent) a.parent.removeChild(a);

                            a.removeEventListener(egret.Event.COMPLETE, cb, self);
                            if (!!callback) callback.apply(ctx);
                        }
                }(anim, onComplete, context);
                
                anim.addEventListener(egret.Event.COMPLETE, cb, self);
            }
        }

    }

    export class FitInfo {

        public scale:number;
        public x:number;
        public y:number;

    }

}