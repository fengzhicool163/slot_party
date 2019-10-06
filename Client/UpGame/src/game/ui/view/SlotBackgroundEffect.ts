module view {

    import GGraph = fairygui.GGraph;
    export class SlotBackgroundEffect {
        private static _ins:SlotBackgroundEffect;

        private _animation:game.Animation;
        public static get Ins():SlotBackgroundEffect {
            if (this._ins == null) this._ins = new SlotBackgroundEffect();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;
        private _grilsAni = {};
        private _grilsAniData = {};
        private _mode:number = -1;
        private _kaixiangAniData = {};

        private _dengqiuAni1:game.Animation;
        private _dengqiuAni2:game.Animation;
        private _dengguangAni:game.Animation;
        private _partyingAni:game.Animation;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            // 单独处理背景图片
            var self = this;
            game.GameEvent.CHANG_BACK_GROUND.add(this.changBackground , this);
            game.GameEvent.CHANG_BACK_GROUND.add(this.playSwimmingPoolToPartyAni , this);
            game.GameEvent.UPDATE_UNIT.add(this.updateUnit , this);
            game.GameEvent.UPDATE_ALL_UNIT.add(this.updateAllUnit , this);
             //ui.UIUtils.initStarswfAni('laohujinew001', 'mc_laohujinew001xxg_xixuegui01', this._slot.m_xixuegui01);
            // ui.UIUtils.initStarswfAni('laohujinew001', 'mc_laohujinew001_bj02', this._slot.m_bg2);
            // ui.UIUtils.initStarswfAni('laohujinew001', 'mc_laohujinew001_bj03', this._slot.m_bg3);
            // ui.UIUtils.initStarswfAni('laohujinew001', 'mc_laohujinew001_bj04', this._slot.m_bg4);


            this._kaixiangAniData['unit009']={graph:this._slot.m_girl004st, file:'laohujinew002', mcName:'mc_laohujinew001yc_girl004st'};
            this._kaixiangAniData['unit010']={graph:this._slot.m_girl002st, file:'laohujinew002', mcName:'mc_laohujinew001yc_girl002st'};
            this._kaixiangAniData['unit011']={graph:this._slot.m_girl003st, file:'laohujinew002', mcName:'mc_laohujinew001yc_girl003st'};
            this._kaixiangAniData['unit012']={graph:this._slot.m_girl001st, file:'laohujinew002', mcName:'mc_laohujinew001yc_girl001st'};

            this._grilsAniData['unit009']={graph:this._slot.m_girl004, file:'laohujinew001', mcName:'mc_laohujinew001yc_girl004',shadow:this._slot.m_n213};
            this._grilsAniData['unit010']={graph:this._slot.m_girl002, file:'laohujinew001', mcName:'mc_laohujinew001yc_girl002',shadow:this._slot.m_n209};
            this._grilsAniData['unit011']={graph:this._slot.m_girl003, file:'laohujinew001', mcName:'mc_laohujinew001yc_girl003',shadow:this._slot.m_n211};
            this._grilsAniData['unit012']={graph:this._slot.m_girl001, file:'laohujinew001', mcName:'mc_laohujinew001yc_girl001',shadow:this._slot.m_n206};



            //game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){
            //
            //
            //},this)

            game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){
                var ani = game.Animation.get('laohujinew001', 'mc_laohujinew001yc_bj01')
                    .attach(self._slot.m_bg01)
                    .fitScale()
                    .play(true);
                console.log('----->');
            },this)

            if(model.UserModel.Ins.numOfGetReward == 4){
                this.changBackground(1);
            }else {
               this.changBackground(0);
            }
            //this.updateAllUnit();
            this._slot.m_bg_jpg.url = 'resource/assets/dynamic/bg.jpg';
            this._slot.m_bgwan_jpg.url = 'resource/assets/dynamic/bgwan.jpg';
        }



        public changBackground(mode:number):void{
            if(this._mode == mode) return;
            if(mode == 0){
                //this._slot.m_bg_jpg.url = 'resource/assets/dynamic/bg.jpg';
                this._slot.getControllerAt(0).selectedIndex = 0;

            }else if(mode == 1){
                //this._slot.m_bgwan_jpg.url = 'resource/assets/dynamic/bgwan.jpg';
                this._slot.getControllerAt(0).selectedIndex = 1;

            }
            this.setEnvironmentAniVisible(mode);
            this.updateAllUnit();
            this._mode = mode;
        }

        public setUnitVisible(unit:string, visible:boolean):void{
            //this._grilsAniData['unit009']={graph:'', file:'laohujinew001', mcName:'mc_laohujinew001yc_girl001'};
            var unitId = unit;
            var unitAni:game.Animation = this._grilsAni[unitId];
            var aniData = this._grilsAniData[unitId];
            var self = this;
            if(visible){
                aniData.graph.visible = true;
                if(unitAni){
                    unitAni.play(true);
                }else {
                    game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){

                        unitAni = game.Animation.get(aniData.file, aniData.mcName)
                            .attach(aniData.graph)
                            .fitScale()
                            .onStop(false,function(){

                            },self)
                            .play(true);
                        self._grilsAni[unitId] = unitAni;
                        console.log('setUnitVisible ------ >  ', unit);
                        console.log('setUnitVisible ------ >  ', aniData.file , '        ',aniData.mcName);
                    },this)

                }
                aniData.shadow.visible = false;
            }else {
                if(unitAni){
                    unitAni.stop(0, false);
                }
                aniData.graph.visible = false;
                aniData.shadow.visible = true;
            }

            if(unit == 'unit012'){
                this._slot.m_n224.visible = visible==false;
            }

        }

        //显示gril是的特效
        public playUnitShowAni(unit:string, visible:boolean):void{
            var unitId = unit;
            var aniData = this._kaixiangAniData[unitId];
            var self = this;

            if(visible){
                game.AssetManager.Ins.loadAssets(["laohujinew002_json","laohujinew002_swf_json"],function(data){
                    console.log('playUnitShowAni   ', aniData.file, '   ---   ', aniData.mcName);
                    var guangQuan = game.Animation.get(aniData.file, aniData.mcName)
                        .attach(aniData.graph)
                        .fitScale()
                        .onStop(true,function(){

                        },self)
                        .play(false);
                    console.log('playUnitShowAni   ', aniData.file, '   ---   ', aniData.mcName);
                },this)



            }else {


            }


        }


        //播放泳池转换party过程特效
        public playSwimmingPoolToPartyAni(mode:number):void{
            if(mode == 0){
                return;
            }

            var self = this;

            game.AssetManager.Ins.loadAssets(["laohujinew002_json","laohujinew002_swf_json"],function(data){
                var jiuping = game.Animation.get('laohujinew002', 'mc_laohujinew001yc_xiangbinjiu')
                    .attach(self._slot.m_xiangbing01)
                    .fitScale()
                    .onStop(true,function(){

                    },self)
                    .play(false);

            },this)

            game.AssetManager.Ins.loadAssets(["laohujinew004_json","laohujinew004_swf_json"],function(data){
                var jiushui = game.Animation.get('laohujinew004', 'mc_laohujinew001yc_xiangbinjiu02')
                    .attach(self._slot.m_xiangbing02)
                    .fitScale()
                    .onStop(true,function(){

                    },self)
                    .play(false);

            },this)

            game.AssetManager.Ins.loadAssets(["laohujinew003_json","laohujinew003_swf_json"],function(data){
                var yahua = game.Animation.get('laohujinew003', 'mc_laohujinew001yc_paidui')
                    .attach(self._slot.m_paiduikaishi)
                    .fitScale()
                    .onStop(true,function(){

                    },self)
                    .play(false);

            },this)




        }

        public setEnvironmentAniVisible(visible:number):void{
            var self = this;
            if(visible == 1){

                game.AssetManager.Ins.loadAssets(["laohujinew002_json","laohujinew002_swf_json"],function(data){
                    if(self._dengqiuAni1 == null){
                        self._dengqiuAni1 = game.Animation.get('laohujinew002', 'mc_laohujinew001yc_dengqiu01')
                            .attach(self._slot.m_dengqiu)
                            .fitScale()
                            .onStop(false,function(){

                            },self);

                    }
                    self._dengqiuAni1.play(true);

                },this)

                game.AssetManager.Ins.loadAssets(["laohujinew002_json","laohujinew002_swf_json"],function(data){
                    if(self._dengqiuAni2 == null){
                        self._dengqiuAni2 = game.Animation.get('laohujinew002', 'mc_laohujinew001yc_dengqiu02')
                            .attach(self._slot.m_paiduideng)
                            .fitScale()
                            .onStop(false,function(){

                            },self);

                    }
                    self._dengqiuAni2.play(true);

                },this)

                game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){
                    if(self._dengguangAni == null){
                        self._dengguangAni = game.Animation.get('laohujinew001', 'mc_laohujinew001yc_dengguang')
                            .attach(self._slot.m_dengguang)
                            .fitScale()
                            .onStop(false,function(){

                            },self);
                    }
                    self._dengguangAni.play(true);

                },this)


                game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){
                    var n192 = self._slot.m_n192;
                    if(self._partyingAni == null){
                        self._partyingAni = game.Animation.get('laohujinew001', 'mc_laohujinew001yc_paiduideng')
                            .attach(n192.m_jinxingzhong)
                            .fitScale()
                            .onStop(false,function(){

                            },self);
                        console.log('----->');
                    }
                    self._partyingAni.play(true);

                },this)



                this._slot.m_dengqiu.visible = true;
                this._slot.m_dengguang.visible = true;
                this._slot.m_paiduideng.visible = true;
                var n192 = self._slot.m_n192;
                n192.m_jinxingzhong.visible = true;

            }else {
                if(this._dengqiuAni1)
                    this._dengqiuAni1.stop(0, false);
                if(this._dengqiuAni2)
                    this._dengqiuAni2.stop(0, false);
                if(this._dengguangAni)
                    this._dengguangAni.stop(0, false);
                if(this._partyingAni)
                    this._partyingAni.stop(0, false);

                this._slot.m_dengqiu.visible = false;
                this._slot.m_dengguang.visible = false;
                this._slot.m_paiduideng.visible = false;
                var n192 = self._slot.m_n192;
                n192.m_jinxingzhong.visible = false;
            }


        }


        public updateUnit(unit:string):void{
            var num = model.UserModel.Ins.numOfEachBeauty[unit] || 0;
            var maxnum = model.LocalConfigModel.Ins.getTaskUnitPoint(unit);
            var visible = num>maxnum?true:false;
            this.setUnitVisible(unit, visible);
            this.playUnitShowAni(unit, visible);
        }

        public updateAllUnit():void{
            var alldata = model.LocalConfigModel.Ins.getTaskAllUnit();
            for(var i=0; i<alldata.length;i++){
                var data = alldata[i];
                var num = model.UserModel.Ins.numOfEachBeauty[data['unit']] || 0;
                var maxnum = data['unitPoint'];
                var visible = num>maxnum?true:false;
                this.setUnitVisible(data['unit'], visible);
            }

        }


    }

}