/**
 * Created by zhaikaiyu on 16/12/24.
 */
module ui {

    export class RankingPop extends BasePopup {
        public _list:fairygui.GList;
        public _data:any;
        private _result:any;
        private _control:fairygui.Controller;
        public constructor() {
            super('slots', 'popup_rank');
        }

        protected onUpdate(...args):void {
            //model.UserModel.Ins.getRanking(this.initUi , this);
            this._data = [];
            this._result = args[0];
            this._control = this.view.getController('c1');
            this._control.addEventListener(fairygui.StateChangeEvent.CHANGED , this.onControlChange, this);
            this.initUi(args[0]);
            this.onControlChange();
        }

        public onControlChange():void{
            var self = this;
            if(this._control.selectedIndex == 0){
                model.UserModel.Ins.getRanking(1,function (result) {
                    self.initUi(result);
                } , this);
            }
            else{
                model.UserModel.Ins.getRanking(2,function (result) {
                    self.initUi(result);
                } , this);
            }

        }

        protected initUi(result:any):void{
            this._data = result.ranking;
            this._data.sort(this.sortByRank);
            //var label:fairygui.GTextField = this.view.getChild('n65').asTextField;
            //label.ubbEnabled = true;
            //label.text = game.Tools.lang('活動結束后，鴻運榜第1名可以額外獲得[color=#ffe400]500000U[/color]鑽的鴻運大禮!');
            /*var endDate = new Date();
            endDate.setFullYear(2017,0,6);
            endDate.setHours(1,0,0,0);*/

            var endTime = model.UserModel.Ins.activityEndTime - model.GeneralServerRequest.getServerTime();
            if(endTime <=0){
                this.view.getChild('n5').text = game.Tools.lang('已結束');
            } else {
                var hour = Math.floor((endTime/1000)/3600);
                var min = Math.floor((endTime/1000 - hour*3600)/60);
                if(hour > 24){
                    var days = Math.floor(hour/24);
                    var h  = Math.floor((hour - days*24));
                    this.view.getChild('n5').asTextField.text = game.Tools.lang('剩餘時間:%c天%c時' , days , h);
                }
                else{
                    this.view.getChild('n5').asTextField.text = game.Tools.lang('剩餘時間:%c時%c分' , hour , min);
                }
            }
            //this.view.getChild('n5').asTextField.text = game.Tools.lang('2017年1月6日1時');

            var component = [{'icon':'n39','rank':'n26','name':'n49','gem':'n56'},
                {'icon':'n40','rank':'n8','name':'n48','gem':'n55'},
                {'icon':'n41','rank':'n9','name':'n50','gem':'n57'}];

            var viewCom = 'n73';
            if(this._control.selectedIndex == 1){
                viewCom = 'n74';
            }
            for(var i = 0;i <3;i++){
                if(this._data[i]){
                    var comt:fairygui.GComponent = this.view.getChild(viewCom).asCom.getChild(component[i].icon).asCom;
                    var c:fairygui.Controller = comt.getController('c1');
                    c.selectedIndex = 0;
                    this.view.getChild(viewCom).asCom.getChild(component[i].name).asTextField.text = game.Tools.getFormatText(this._data[i].username);
                    ui.UIUtils.fitPlayerHead(comt ,this._data[i].avatar);
                    var sd = this.view.getChild(viewCom).asCom.getChild(component[i].gem).asCom;
                    sd.getController('c1').selectedIndex = this._control.selectedIndex;
                    if(this._control.selectedIndex == 1){
                        this.view.getChild(viewCom).asCom.getChild(component[i].gem).asCom.getChild('n54').asTextField.text = game.Tools.lang('已開啟%c次',this._data[i].diamond);
                    }else {
                        this.view.getChild(viewCom).asCom.getChild(component[i].gem).asCom.getChild('n54').asTextField.text = this._data[i].diamond;
                    }
                    this.view.getChild(viewCom).asCom.getChild(component[i].rank).asTextField.text = 'No.' + this._data[i].ranking;
                }
                else{
                    var com:fairygui.GComponent = this.view.getChild(viewCom).asCom.getChild(component[i].icon).asCom;
                    var control:fairygui.Controller = com.getController('c1');
                    control.selectedIndex = 1;
                    this.view.getChild(viewCom).asCom.getChild(component[i].name).asTextField.text = game.Tools.lang('虛位以待');
                    this.view.getChild(viewCom).asCom.getChild(component[i].gem).asCom.visible = false;
                    this.view.getChild(viewCom).asCom.getChild(component[i].rank).asTextField.visible = false;
                }
            }

            var origin = this._data.length;
            var l = origin >=3 ? (20 - origin) : 17;
            origin = origin >= 3 ? 3:origin;
            this._data.splice(0,origin);
            if(this._data.length < 20){

                for(var i:number = 0 ; i < l; i++){
                    this._data.push({'uid':null , 'username':'虛位以待','ranking':(this._data.length+4)});
                }
            }

            this._list = this.view.getChild(viewCom).asCom.getChild('n24').asList;
            this._list.itemRenderer = this.onItemFunc;
            this._list.callbackThisObj = this;
            this._list.numItems = this._data.length;

            //this.view.getChild('n58').asTextField.text = game.Tools.lang('鴻運大禮會在活動結束后3個工作日內發放\n排行榜資訊刷新可能存在少許延遲');
        }

        public onItemFunc(index:number , obj:fairygui.GComponent):void{
            var cell:fairygui.GComponent = obj ;
            var data = this._data[index];
            if(data.uid){
                ui.UIUtils.fitPlayerHead(cell.getChild('n18').asCom , data.avatar);

                var c:fairygui.Controller = cell.getController('c1');
                if(this._control.selectedIndex == 1){
                    c.selectedIndex = 2;
                }else {
                    c.selectedIndex = 0;
                }

                cell.getChild('n19').asTextField.text = game.Tools.getFormatText(data.username);
                cell.getChild('n22').asTextField.text = data.diamond + '';
                cell.getChild('n23').asTextField.text = '' + data.ranking;
                cell.getChild('n24').asTextField.text = game.Tools.lang('已開啟%c次',data.diamond);

            }
            else{
                cell.getChild('n19').asTextField.text = data.username;
                cell.getChild('n23').asTextField.text = '' + data.ranking;
                var c:fairygui.Controller = cell.getController('c1');
                c.selectedIndex = 1;
                var c2:fairygui.Controller = cell.getChild('n18').asCom.getController('c1');
                c2.selectedIndex = 2;
            }

        }


        public sortByRank(obj1:any , obj2:any):any{
            return obj1.ranking - obj2.ranking;
        }

        protected onBackgroudClose():void {
            super.onBackgroudClose();
        }

    }

}