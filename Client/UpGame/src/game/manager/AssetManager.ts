module game {
    export class AssetManager {
        private static ins: AssetManager;
        private assetsManager = null;
        public boneFactory = null;


        public static get Ins(): AssetManager {
            if(this.ins == null) this.ins = new AssetManager();
            return this.ins;
        }

        private getSwfAssetManager(): starlingswf.SwfAssetManager {
            if(this.assetsManager == null) {
                this.assetsManager = new starlingswf.SwfAssetManager();
            }
            return this.assetsManager;
        }

        private dicSwfData = new Object();

        public GetSwfList(): Object {
            return this.dicSwfData;
        }

        public getSwf(name,fps?:number): starlingswf.Swf {
            fps = fps || 24;
            if(this.dicSwfData[name]) {
                this.addUpdateEventByName(name);
                return this.dicSwfData[name];
            }
            
            var swfData: Object = RES.getRes(name + "_swf_json");
            if(!swfData){
                return null;
            }
            var spriteSheet:egret.SpriteSheet = RES.getRes(name + "_json");
            if (spriteSheet) {
                this.getSwfAssetManager().addSpriteSheet(name, spriteSheet);
            }

            if(RES.hasRes("img_" + name + "_png")){
                var texture:egret.Texture = RES.getRes("img_" + name + "_png");
                this.getSwfAssetManager().addTexture("img_" + name,texture)
            }


            
            this.dicSwfData[name] = new starlingswf.Swf(swfData,this.getSwfAssetManager(),fps);
            return this.dicSwfData[name];
        }
    
        public deleteSwf(name):void{
            delete this.dicSwfData[name];
            RES.destroyRes(name + "_swf_json");
            RES.destroyRes(name + "_json")
        }

        public deleteAllSwf():void{
            for(var key in this.dicSwfData){
                delete this.dicSwfData[key];
            }

        }

        public removeAllSwfUpdateEventListener():void{
            for(var key in this.dicSwfData){
                this.removeUpdateEventByName(key);
                this.dicSwfData[key].clearUpdateQueue();
            }
        }

        public removeUpdateEventByName(name){
            if(this.dicSwfData[name]){
                this.dicSwfData[name].removeUpdateEventListener();
            }

        }

        public addUpdateEventByName(name){
            if(this.dicSwfData[name]){
                this.dicSwfData[name].removeUpdateEventListener();
                this.dicSwfData[name].addUpdateEventListener();
            }

        }

        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        public getAsset(source: string,compFunc: Function,thisObject: any): void {
            function onGetRes(data: any): void {
                compFunc.call(thisObject,data,source);
            }
            if(RES.hasRes(source)) {
                var data = RES.getRes(source);
                if(data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source,onGetRes,this);
                }
            }
            else {
                RES.getResByUrl(source,onGetRes,this,RES.ResourceItem.TYPE_IMAGE);
            }
        }


        /**
         * @language zh_CN
         * 解析素材
         * @param monsterId
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        public loadAssets(sources: any,compFunc: Function,thisObject: any): void {
            var index = 0;
            function onGetRes(data: any): void {
                index = index + 1
                if(index >= sources.length){
                    compFunc.apply(thisObject,[data]);
                }
            }
            for(var i = 0; i < sources.length; i++){
                var source = sources[i]
                var data = RES.getRes(source);
                if(data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source,onGetRes,this);
                }
            }

        }


        /**
         * @language zh_CN
         * 解析素材
         * @param monsterId
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        public getMonsterIcon(monsterId: string,compFunc: Function,thisObject: any): void {
            var index = 0;
            var sources = [monsterId + "_swf_json"]
            if(RES.hasRes(monsterId + "_json")){
                sources.push(monsterId + "_json")
            }else if(RES.hasRes("img_" + monsterId + "_png")){
                sources.push("img_" + monsterId + "_png")
            }

            function onGetRes(data: any): void {
                index = index + 1
                if(index >= sources.length){
                    // 读取头像
                    var swf:starlingswf.Swf = game.AssetManager.Ins.getSwf(monsterId);
                    // 这图片的实际坐标在中点
                    if(!swf) return;
                    var data:any = swf.createImage("img_" + monsterId);
                    // var sprite:egret.Sprite = new egret.Sprite();
                    // sprite.width = 165;
                    // sprite.height = 165;
                    // sprite.addChild(data);
                    compFunc.apply(thisObject, [data]);
                }
            }
            for(var i = 0; i < sources.length; i++){
                var source = sources[i]
                var data = RES.getRes(source);
                if(data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source,onGetRes,this);
                }
            }

        }
    }


}
