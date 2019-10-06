/**
 * Created by a123 on 17-1-22.
 */
module ui {

    export class Ranking extends BasePopup {
        public _list:fairygui.GList;
        public _data:any;
        private _result:any;
        private _control:fairygui.Controller;

        private _rankReward:any = [10888,
            6666,
            2888,
            1888,
            1888,
            888,
            888,
            888,
            888,
            888];
        public constructor() {
            super('slots', 'popup_jiangdan');
            this._requestFull = true;
        }

        protected onUpdate(...args):void {
            //model.UserModel.Ins.getRanking(this.initUi , this);
            this._data = [];
            //this.view.getChild('jiangdanjpg').asLoader.url = 'resource/assets/dynamic/jiangdan.jpg';
            //this.view.getChild('jiangdan_star_png').asLoader.url = 'resource/assets/dynamic/jiangdan_star.png';
            this._result = args[0];
            this._control = this.view.getController('c1');
            var showTwoTabs = true;


            if (showTwoTabs) {
                this._control.selectedIndex = 1;
                this._control.addEventListener(fairygui.StateChangeEvent.CHANGED , this.onChange , this);
            }
            if(this._control.selectedIndex == 0){
                this._list = this.view.getChild('n78').asList;
                this._list.itemRenderer = this.onItemfunc;
                this._list.callbackThisObj = this;
            }
            else if(this._control.selectedIndex == 1){
                this._list = this.view.getChild('n79').asList;
            }
            else if(this._control.selectedIndex == 2){
                this._list = this.view.getChild('n80').asList;
            }
            this._list.itemRenderer = this.onItemfunc;
            this._list.callbackThisObj = this;
            this.initUi(args[0]);
            //ui.UIUtils.fitScale(this.view.getChild('jiangdanjpg').asLoader , fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);

            this.view.getChild('n103').addClickListener(this.onReturn, this);

        }

        private onReturn(): void {
            WindowMsg.Ins.posMessage({ key: 'close' });
        }

        public onChange():void{
            var self = this;
            if(this._control.selectedIndex == 1){
                this._list = null;
                this._list = this.view.getChild('n79').asList;
                this._list.itemRenderer = this.onItemfunc;
                this._list.callbackThisObj = this;
                model.UserModel.Ins.getRanking(1,function (result) {
                    self.initUi(result);
                } , this);
            }
            else if(this._control.selectedIndex ==2){
                this._list = null;
                this._list = this.view.getChild('n80').asList;
                this._list.itemRenderer = this.onItemfunc;
                this._list.callbackThisObj = this;
                model.UserModel.Ins.getRanking(2,function (result) {
                    self.initUi(result);
                } , this);
            }
        }

        protected onLoaderNeedToDealWith(loader:fairygui.GLoader):boolean{
            if(loader.name == 'jiangdanjpg'){
                loader.url = 'resource/assets/dynamic/jiangdan.jpg';
                return false;
            }
            if(loader.name == 'jiangdan_star_png'){
                loader.url = 'resource/assets/dynamic/jiangdan_star.png';
                return false;
            }
            return true;
        }

        protected initUi(result:any):void{
            this._data = result.ranking;

            this._data.sort(this.sortByRank);
            this._list.numItems = this._data.length > 10 ? 10:this._data.length;

            /*for(var i = 0;i <5;i++){
                if(this._data[i]){
                    var comt:fairygui.GComponent = this.view.getChild('n'+ (78+i)).asCom;
                    var n:fairygui.GTextField = comt.getChild('n75').asTextField;
                    n.text = this._data[i].username;
                    var n76:fairygui.GTextField = comt.getChild('n76').asTextField;
                    n76.text = game.Tools.lang('UP号:%c' , this._data[i].upliveCode);
                    var n77:fairygui.GTextField = comt.getChild('n77').asTextField;
                    n77.text = game.Tools.lang('%c U鑚' , this._data[i].diamond);
                    ui.UIUtils.fitPlayerHead(comt.getChild('n70').asCom.getChild('n34').asCom , this._data[i].avatar);
                   }
                else{
                    var com:fairygui.GComponent = this.view.getChild('n'+ (78+i)).asCom;
                    com.visible = false;
                  }
            }*/


        }



        public sortByRank(obj1:any , obj2:any):any{
            return obj1.ranking - obj2.ranking;
        }

        protected onBackgroudClose():void {
            super.onBackgroudClose();
        }

        public onItemfunc(index:number , obj:fairygui.GObject):void{
            var com:fairygui.GComponent = obj as fairygui.GComponent;
            var data = this._data[index];
            if(data){
                var control:fairygui.Controller = com.getController('c1');
                if(index == 0){
                    control.selectedIndex = 0;
                }
                else if(index == 1){
                    control.selectedIndex = 1;
                }
                else if(index == 2){
                    control.selectedIndex = 2;
                }
                else{
                    control.selectedIndex = 3;
                    var rank:fairygui.GTextField = com.getChild('n82').asTextField;
                    rank.text = data.ranking + '';
                }
                var n:fairygui.GTextField = com.getChild('n75').asTextField;
                n.text = data.username;
                var n76:fairygui.GTextField = com.getChild('n76').asTextField;
                n76.text = game.Tools.lang('UP号:%c' , data.upliveCode);
                var n77:fairygui.GTextField = com.getChild('n77').asTextField;
                if(this._control.selectedIndex ==1){
                    n77.text = game.Tools.lang('%c U鑚' , data.diamond);
                }else if(this._control.selectedIndex ==2){
                    n77.text = game.Tools.lang('已開啟派對 %c次' , data.diamond);
                }

                ui.UIUtils.fitPlayerHead(com.getChild('n70').asCom.getChild('n34').asCom , data.avatar);
            }

        }

    }

}