module init {

    export class LoadDynamicResource extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_do():void {
            this.loadRes();

            this.done();
        }

        public loadRes():void {
            var res = [];
            res.push("laohujinew001_json");
            res.push("laohujinew001_swf_json");

            res.push("laohujinew002_json");
            res.push("laohujinew002_swf_json");

            res.push("laohujinew003_json");
            res.push("laohujinew003_swf_json");

            res.push("beilv_swf_json");
            res.push("beilv_json");


            game.AssetManager.Ins.loadAssets(res,function(data){
                console.log('LoadOtherResource  done');

            },this)

        }

    }
}