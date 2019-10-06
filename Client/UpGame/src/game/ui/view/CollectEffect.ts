/**
 * Created by a123 on 17-3-21.
 * 收集飞入动画
 */
module view{
    export class CollectEffect {
        private static _ins:CollectEffect;


        public static get Ins():CollectEffect {
            if (this._ins == null) this._ins = new CollectEffect();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;
        private _animation:game.Animation;
        private _animNum:number = 0;
        private _unitIndex:number = 0;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        public doLogic():void{
            //return;

            game.GameEvent.COLLECT_EFFECT.add(this.playTo , this);

        }

        public playTo(...args):void{
            var resultArray = [];
            //var alldata = model.LocalConfigModel.Ins.getTaskAllUnit();
            var collectBeautys:any = model.UserModel.Ins.collectBeautys;
            var oldNumOfEachBeauty = model.UserModel.Ins.oldNumOfEachBeauty;

            //for(var i=0; i<alldata.length;i++) {
            //    var data = alldata[i];
            //    var unit = data['unit'];
            //    var maxnum = data['unitPoint'];
            //
            //    if(collectBeautys[unit] > 0 ){
            //        var unitNum:number[] = SlotWheel.Ins.getUnitIndex(unit);
            //        var data:any = {unit:unit, result:unitNum};
            //        resultArray.push(data);
            //    }
            //
            //}

            for(var k in collectBeautys) {
                var alldata = model.LocalConfigModel.Ins.getTaskUnit(k);
                if(collectBeautys[k] > 0 && oldNumOfEachBeauty[k] < alldata['unitPoint']){
                    var unitNum:number[] = SlotWheel.Ins.getUnitIndex(k);
                    var data:any = {unit:k, result:unitNum};
                    resultArray.push(data);
                }
            }
            if(resultArray.length == 0){
                game.GameEvent.SHOW_COLLECT_EFFECT_END.dispatch();
                return;
            }

            this._unitIndex = 0;
            var result:number[] = [];// = SlotWheel.Ins.getUnitIndex(model.UserModel.Ins.whichCake);
            var i = 0;
            var swfName = 'beilv';
            var unitName;
            var guijiType = 'a';
            var self = this;

            function getHuijiType(unitId):string{
                if(unitId == 'unit009'){
                    return 'a';
                }else if(unitId == 'unit010'){
                    return 'b';
                }else if(unitId == 'unit011'){
                    return 'c';
                }else if(unitId == 'unit012'){
                    return 'd';
                }
                return 'a';
            }

            function play(swfName, aniName,graph):void{
                var anim:starlingswf.SwfMovieClip = game.Animation.get(swfName ,aniName).attach(graph)
                    .fitScale()
                .onStop(true,function(){
                        (graph.displayObject as egret.DisplayObjectContainer).removeChildren();
                        graph.removeFromParent();
                        self.onStopCollectStep();

                    },self)
                .play(false).anim;

                if (!!anim) {
                    var icon:starlingswf.SwfSprite = anim.getSprite('icon');
                    // icon.removeChildren();
                    var bm:egret.Bitmap = new egret.Bitmap(view.SlotViewMain.getUnitTexture(unitName));
                    bm.x = -bm.width / 2;
                    bm.y = -bm.height / 2;
                    icon.addChild(bm);
                }
            }


            function next():void{
                if(i < result.length){
                    i++;
                    var k:number = result[i - 1];
                    var key:string = k < 10 ? '0' + k : '' + k;

                    var mcName = `mc_${swfName}_jiangli${key}${guijiType}`;
                    self._animNum ++;

                    var graph = new fairygui.GGraph();
                    self._slot.m_n181.addChild(graph);
                    play('guiji', mcName, graph);
                    var Timeout = setTimeout(function(){
                        next();
                        clearTimeout(Timeout);
                    },100);

                }else {
                    if(self._unitIndex >= resultArray.length)return;
                    var one:any = resultArray[self._unitIndex];
                    self._unitIndex++;
                    result = one.result;
                    unitName = one.unit;
                    guijiType = getHuijiType(unitName);
                    i = 0;
                    next();
                }
            }



            next();
        }

        private onStopCollectStep():void {
            this._animNum --;
            if (this._animNum <= 0) {
                this._animNum = 0;

                game.GameEvent.SHOW_COLLECT_EFFECT_END.dispatch();
            }
        }



    }
}