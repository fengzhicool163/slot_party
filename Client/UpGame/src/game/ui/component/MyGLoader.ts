/**
 * Created by fengzhi on 16-4-28.
 */

module ui{
    export class MyGLoader extends fairygui.GLoader{
        private __resType:string;

        public constructor(){
            super();
        }

        protected loadExternal():void{
            if (this.url.indexOf('ui://') != -1) {
                super.loadExternal();
            } else {
                this.url = model.LocaleModel.Ins.getLocaleLoaderResource(this.url);
                if (!!this.__resType) {
                    RES.getResByUrl(this.url , this.__myGetResCompleted , this, this.__resType);
                } else {
                    RES.getResByUrl(this.url , this.__myGetResCompleted , this);
                }
            }
        }

        private __myGetResCompleted(res:any , key:string):void{
            //console.log('__myGetResCompleted', key, this.__resType);
            if(res instanceof egret.Texture){
                this.onExternalLoadSuccess(<egret.Texture>res);
            }
            else{
                this.onExternalLoadFailed();
            }
        }

        public setResType(type:string):void {
            //console.log('setResType', type);
            this.__resType = type;
        }
    }
}