/**
 * Created by zhaikaiyu on 16/12/22.
 */
module ui {

    import MusicManager = game.MusicManager;
    export class UIGameMain extends fairygui.GComponent {

        private _view:fairygui.GComponent;
        private slotAnim = {};
        private completeIndex:number = 0;
        private canClick:boolean = true;
        private isEndLoopAni:boolean = false;//是否可以胜利框了
        private slotResult;
        private userProfile:model.UserProfile;
        private btnStart:any;
        private _timeTick:any;
        private _time:number = 0;
        private diamondTxt:any;
        private maxAutoTimes:number = 100;
        private curentAutoTimes:number = 0;
        private loopSoundChanels = [];

        private diamonds = [10,100,500];
        private btnDiamonds = [];
        private btnLow:fairygui.GButton;
        private btnMid:fairygui.GButton;
        private btnHigh:fairygui.GButton;
        private currentDiamond:number = 0;
        private diamondIdx:number = 0;

        public constructor() {
            super();

            this.addChild(new view.SlotViewMain());
            return;

            //game.GameEvent.UPDATE_HUD_DIAMOND.add(this.updateHudDiamond, this);
            //
            //this.onShow();
        }

        public jumpPage(index:number, reason:any = null):void {
        }

        //private onShow():void {
        //    this.completeIndex = 0;
        //    this.canClick = true;
        //    this.isEndLoopAni = false;
        //    this.curentAutoTimes = 0;
        //    this._view = fairygui.UIPackage.createObject('slots', 'slots').asCom;
        //    this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        //    this.addChild(this._view);
        //    var slot1 = this._view.getChild("n17").asCom.getChild("zhuanpan1").asGraph;
        //    var slot2 = this._view.getChild("n17").asCom.getChild("zhuanpan2").asGraph;
        //    var slot3 = this._view.getChild("n17").asCom.getChild("zhuanpan3").asGraph;
        //    var img = RES.getRes("img_egret_icon");
        //    var bitMap = new egret.Bitmap(img);
        //
        //
        //    var activityTime = this._view.getChild('n99').asTextField;
        //    activityTime.text = game.Tools.lang('活動時間:1月11日18:00 - 1月15日1:00');
        //    //var bitMap = new egret.Bitmap(RES.getRes("element001" + "_png") );
        //
        //
        //    //slot1.setNativeObject(bitMap);
        //
        //    this.gotoAndPlay("laohuji","mc_laohuji_shuzixunhuan001",slot1);
        //    this.gotoAndPlay("laohuji","mc_laohuji_shuzixunhuan002",slot2);
        //    this.gotoAndPlay("laohuji","mc_laohuji_shuzixunhuan003",slot3);
        //
        //    var btnStart = this._view.getChild('n9').asButton;
        //    this.btnStart = btnStart;
        //    btnStart.addClickListener(this.btnStartHandler , this);
        //    btnStart.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandler,this);
        //    btnStart.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
        //    btnStart.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchHandler,this);
        //    btnStart.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchHandler,this);
        //
        //    var egraph = btnStart.getChild("anniu01").asGraph;
        //    var fgraph = btnStart.getChild("anniu02").asGraph;
        //    var touch = btnStart.getChild("anniu03").asGraph;
        //    this.intScenAni("laohuji","mc_laohujitexiao002_texiao002e",egraph,true,false);
        //    this.intScenAni("laohuji","mc_laohujitexiao002_texiao002g",touch,false,false);
        //    //this.intScenAni("laohuji","mc_laohujitexiao002_texiao002f",fgraph,true,false);
        //
        //    //*my
        //    var btnLow:fairygui.GButton = this._view.getChild('n80').asButton;
        //    this.btnLow = btnLow;
        //    this.btnDiamonds.push(btnLow);
        //    btnLow["tag"] = 0;
        //    var controller = this.btnLow.getController("button");
        //    controller.selectedIndex  = 1;
        //    this.currentDiamond = this.diamonds[0];
        //    this.diamondIdx = 0;
        //    //this.playBtnDiamonds(0);
        //    btnLow.addClickListener(this.btnDiamondsHandler , this);
        //
        //    var btnMid = this._view.getChild('n81').asButton;
        //    this.btnMid = btnMid;
        //    this.btnDiamonds.push(btnMid);
        //    btnMid["tag"] = 1;
        //    btnMid.addClickListener(this.btnDiamondsHandler , this);
        //
        //    var btnHigh = this._view.getChild('n82').asButton;
        //    this.btnHigh = btnHigh;
        //    this.btnDiamonds.push(btnHigh);
        //    btnHigh["tag"] = 2;
        //    btnHigh.addClickListener(this.btnDiamondsHandler , this);
        //    //*/
        //
        //
        //    this.btnIndex(0);
        //
        //    //game.GameEvent.SLOT_AUTO.add(this.autoSlot,this);
        //    //this.playButtonAni(false);
        //    var self = this;
        //    ui.UILayer.Ins.stage().addEventListener(egret.Event.DEACTIVATE, function() {
        //        if(self.isAuto){
        //            self.autoSlot(false);
        //        }
        //    }, this);
        //
        //    var btnAdd = this._view.getChild('n37').asButton;
        //    btnAdd.addClickListener(this.btnAdd , this);
        //
        //    //var n35 = this._view.getChild("n34").asCom.getChild("n63").asImage;
        //    HorseRaceLamp.init(this._view.getChild("n35").asCom);
        //    ui.UIUtils.lifeTime(this, this.onAdded, this.onRemoved, false);
        //    ui.UIUtils.iterGLoader(this._view, function (loader:fairygui.GLoader):boolean {
        //        if (loader.name == 'bg.jpg') ui.UIUtils.fitScale(loader, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        //        return true;
        //    }, this);
        //
        //    var laohujitexiao001 = this._view.getChild("beijing").asGraph;
        //    this.intScenAni("laohuji","mc_laohujitexiao_001",laohujitexiao001,true,true);
        //
        //
        //    this.playKuaimanAni(true);
        //
        //    var btnRank = this._view.getChild('n41').asButton;
        //    btnRank.addClickListener(this.btnRankClick , this);
        //
        //    this._view.getChild("n34").addClickListener(this.btnHeadIcon, this);
        //
        //    this.userProfile =  model.UserModel.Ins.userProfile;
        //
        //    var shuzi = this._view.getChild("002_shuzi").asGraph
        //    var mc_002_shuzi = this.intScenAni("laohuji","mc_002_shuzi",shuzi,false,false);
        //    var spr = mc_002_shuzi.getSprite("wenzi");
        //    if(spr){
        //        var text = spr.getChildByName("labelTxt");
        //        if(!text){
        //            text = new egret.TextField();
        //            text.size = 24;
        //            text.textColor = 0xffffff;
        //            text.y = 6;
        //            text.width = 120;
        //            text.textAlign = egret.HorizontalAlign.LEFT;
        //            spr.addChild(text);
        //            text.name = "labelTxt";
        //        }
        //        this.diamondTxt = text;
        //
        //    }
        //
        //    MusicManager.Ins.setMusicOn(MusicManager.Ins.isMusicOn());
        //    this.initHud();
        //    this.initMusic();
        //    this._view.getChild('n74').addClickListener(this.onMusic, this);
        //    //MusicManager.Ins.setMusicOn(MusicManager.Ins.isMusicOn());
        //
        //    //MusicManager.Ins.playMusic(MusicManager.HOME_MUSIC);
        //}

       // public onMusic(event:any):void{
       //     if (MusicManager.Ins.isMusicOn()) {
       //         MusicManager.Ins.setMusicOn(false);
       //     } else {
       //         MusicManager.Ins.setMusicOn(true);
       //     }
       //
       //     this.initMusic();
       // }
       //
       // private initMusic(){
       //     var btn = this._view.getChild('n74').asCom;
       //     var control:fairygui.Controller = btn.getController("button");
       //     control.selectedIndex = (MusicManager.Ins.isMusicOn() ? 0 : 1);
       // }
       //
       // private updateHudDiamond():void {
       //     if (this.diamondTxt) {
       //         this.diamondTxt.text = (model.UserModel.Ins.userProfile.diamond || 0) + '';
       //     }
       // }
       //
       // private autoSlot(isAuto):void{//自动播放
       //     var btnStart = this._view.getChild('n9').asButton;
       //     var controller = btnStart.getController("c1");
       //     controller.selectedIndex  = isAuto ? 1 : 0;
       //     if(isAuto){
       //         this.startRun();
       //     }
       // }
       //
       // private displayArrow(bl):void{
       //     var btnStart = this._view.getChild('n9').asButton;
       //     btnStart.getChild("anniu01").visible = bl;
       // }
       // private displayTouch(bl):void{
       //     var btnStart = this._view.getChild('n9').asButton;
       //     var egraph = btnStart.getChild("anniu03").asGraph;
       //     this.intScenAni("laohuji","mc_laohujitexiao002_texiao002g",egraph,false,false);
       // }
       // private enabledDiamondBtn(bl):void{
       //     var btnnum = this.btnDiamonds.length;
       //     var btn;
       //     for(var i=0;i<btnnum;i++){
       //         btn = this.btnDiamonds[i];
       //         if(i == this.diamondIdx){
       //
       //         }else{
       //             btn.enabled = bl;
       //         }
       //     }
       // }
       //
       // private  playKuaimanAni(isMan:boolean):void{
       //     this.playKuaimanAni2(isMan);
       // }
       //
       // private  playKuaimanAni2(isMan:boolean):void{
       //     //return;
       //     //var mc_laohuji2_laba1 = this.slotAnim["mc_laohuji2_laba1"];
       //     //var mc_laohuji2_laba2 = this.slotAnim["mc_laohuji2_laba2"];
       //     var mc_laohujitexiao_shanguangdeng = this.slotAnim["mc_laohujitexiao_shanguangdeng"];
       //
       //     //var n59 = this._view.getChild("n59").asCom;
       //     //if(!mc_laohuji2_laba1){//002a 002d快慢必加  002b 002c 只有快的时候才有
       //     //    var laohuji2_laba1 = n59.getChild("laba3").asGraph;
       //     //    mc_laohuji2_laba1 = this.intScenAni("laohuji","mc_laohuji2_laba1",laohuji2_laba1,true,false);
       //     //}
       //     //if(!mc_laohuji2_laba2){
       //     //    var laohuji2_laba2 = n59.getChild("laba2").asGraph;
       //     //    mc_laohuji2_laba2 = this.intScenAni("laohuji","mc_laohuji2_laba2",laohuji2_laba2,true,false);
       //     //}
       //     if(!mc_laohujitexiao_shanguangdeng){
       //         var laohujitexiao_shanguangdeng = this._view.getChild("shanguangdeng").asGraph;
       //         mc_laohujitexiao_shanguangdeng = this.intScenAni("laohuji","mc_laohujitexiao_shanguangdeng",laohujitexiao_shanguangdeng,true,true);
       //     }
       //
       //     if(isMan){//把bc移除
       //         //this.removeTarget(mc_laohujitexiao002_texiao002b);
       //         //this.removeTarget(mc_laohujitexiao002_texiao002c);
       //         //mc_laohujitexiao002_texiao002a.gotoAndPlay("man01");
       //         //mc_laohujitexiao002_texiao002d.gotoAndPlay("man02");
       //         if(mc_laohujitexiao_shanguangdeng)
       //             mc_laohujitexiao_shanguangdeng.visible = false;
       //     }else{
       //         //mc_laohujitexiao002_texiao002a.gotoAndPlay("kuai01");
       //         //mc_laohujitexiao002_texiao002d.gotoAndPlay("kuai02");
       //         //var laohujitexiao002b = n59.getChild("laba2").asGraph;
       //         //mc_laohujitexiao002_texiao002b = this.intScenAni("laohujitexiao002","mc_laohujitexiao002_texiao002b",laohujitexiao002b,true,false);
       //         //var laohujitexiao002c = n59.getChild("laba3").asGraph;
       //         //mc_laohujitexiao002_texiao002c = this.intScenAni("laohujitexiao002","mc_laohujitexiao002_texiao002c",laohujitexiao002c,true,false);
       //         if(mc_laohujitexiao_shanguangdeng)
       //             mc_laohujitexiao_shanguangdeng.visible = true;
       //     }
       // }
       //
       //
       // private initHud():void{
       //     if(this.userProfile){
       //         this._view.getChild("n11").asTextField.text = game.Tools.getFormatText(model.UserModel.Ins.userProfile.username,30);
       //         //this._view.getChild("n10").asTextField.text = ""
       //         //this._view.getChild("n42").asTextField.text = game.Tools.lang("Lv.%c",this.userProfile.grade + "")
       //
       //         if(this.slotResult && this.slotResult.rewardDiamond != 0){
       //             MusicManager.Ins.play("shuzi_mp3")
       //             this.slotAnim["mc_002_shuzi"].gotoAndPlay(0);
       //         }
       //         this.diamondTxt.text = this.userProfile.diamond?this.userProfile.diamond:0 + ""
       //         ui.UIUtils.fitPlayerHead(this._view.getChild("n34").asCom.getChild("n34").asCom,model.UserModel.Ins.userProfile.avatar)
       //         //this._view.getChild("n45").asCom.getChild("n44").visible = model.UserModel.Ins.userProfile.gender == 1;
       //         //this._view.getChild("n45").asCom.getChild("n43").visible = model.UserModel.Ins.userProfile.gender != 1;
       //     }
       // }
       //
       // private btnAdd():void{
       //     if(!this.canClick) return;
       //     model.UpSDKModel.Ins.goPay();
       // }
       //
       // private btnHeadIcon():void {
       //     // 禁用头像的点击
       //     return;
       //     if(!this.canClick) return;
       //     ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
       //         content: game.Tools.lang('版本號：%c', PPGame.VERSION),
       //     });
       // }
       //
       // private intScenAni(swfName,aniname,graph,isLoop,isFitScale,keyName?:any):any{
       //     var swf = game.AssetManager.Ins.getSwf(swfName)
       //     if(!swf) return;
       //     var keyName = keyName ? keyName : aniname;
       //     var currentSwfAni = this.slotAnim[keyName];
       //     if(!currentSwfAni){
       //         currentSwfAni = swf.createMovie(aniname);
       //         this.slotAnim[keyName] = currentSwfAni;
       //         if(isFitScale){
       //             ui.UIUtils.fitScale(currentSwfAni, fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
       //         }
       //
       //     }
       //     currentSwfAni.loop = isLoop;
       //     currentSwfAni.gotoAndPlay(0);
       //     graph.setNativeObject(currentSwfAni);
       //     graph.touchable = false;
       //     return currentSwfAni;
       // }
       //
       // private gotoAndPlay(swfName,aniname,graph):any{
       //     var swf = game.AssetManager.Ins.getSwf(swfName)
       //     if(!swf) return;
       //     var currentSwfAni = this.slotAnim[aniname];
       //     if(!currentSwfAni){
       //         currentSwfAni = swf.createMovie(aniname);
       //         currentSwfAni.loop = false;
       //         currentSwfAni.gotoAndPlay("start")
       //         this.initIcon(currentSwfAni,"element001");
       //         graph.setNativeObject(currentSwfAni);
       //         this.slotAnim[aniname] = currentSwfAni;
       //     }
       //     return currentSwfAni;
       // }
       //
       // private initIcon(anim,elementName):void{
       //     var spr = anim.getSprite("shuzi");
       //     spr.removeChildren();
       //     var bitMap = new egret.Bitmap(RES.getRes(elementName + "_png") );
       //     bitMap.x = 146 -bitMap.width;
       //     bitMap.y = 122 -bitMap.height;
       //     spr.addChild(bitMap)
       // }
       //
       // private mcComplete(target):void{
       //     this.completeIndex = this.completeIndex + 1;
       //     var anim = target.currentTarget;
       //     anim.removeEventListener(egret.Event.COMPLETE,this.mcComplete,this);
       //     var guang1 = this._view.getChild("guang" + this.completeIndex);
       //     this.intScenAni("laohuji","mc_laohuji_faguang",guang1,false,false,"mc_laohuji_faguang" + this.completeIndex);
       //     MusicManager.Ins.play("tingzhi_mp3")
       //
       //     if(this.completeIndex >= 3){
       //         this.canClick = true;
       //         this.playKuaimanAni(true);
       //
       //         for(var i = 0; i < this.loopSoundChanels.length; i++){
       //             this.loopSoundChanels[i].stop();
       //         }
       //         this.loopSoundChanels = [];
       //           //this.slotResult.slotResult.quality = 3;
       //           //this.slotResult.rewardDiamond = 10;
       //         var p = ui.UILayer.Ins.popup(ui.PopUpIds.POPRESULT,this.slotResult,this.callPopResultCallBack,this);
       //         //this.playResultAni();
       //     }
       // }
       //
       // private callPopResultCallBack():void{
       //     if(model.UserModel.Ins.userProfile){
       //         model.UserModel.Ins.userProfile.diamond = parseInt(this.slotResult.diamond?this.slotResult.diamond:0);
       //     }
       //     this.initHud();
       //     this.displayArrow(true);
       //     this.enabledDiamondBtn(true);
       //     if(this.isAuto){
       //         this.curentAutoTimes ++;
       //         this.startRun();
       //     }
       // }
       //
       // private mcPlayCompleteAndRemove(target):void{
       //     this.removeTarget(target.currentTarget);
       // }
       //
       // private removeTarget(target):void{
       //     if(target && target.parent){
       //         target.stop();
       //         target.parent.removeChild(target);
       //     }
       // }
       //
       // private btnRankClick():void{
       //     if(!this.canClick) return;
       //     model.UserModel.Ins.getRanking(function (result) {
       //         ui.UILayer.Ins.popup(ui.PopUpIds.RANKINGPOP, result);
       //     } , this);
       //
       // }
       //
       // private startPlayComplete(target):void{
       //     var currentTarget = target.currentTarget;
       //     currentTarget.loop = true;
       //     currentTarget.removeEventListener(egret.Event.COMPLETE,this.startPlayComplete,this);
       //     currentTarget.gotoAndPlay("loop");
       //     if(this.loopSoundChanels && this.loopSoundChanels.length == 0){
       //         var soundChanel = MusicManager.Ins.play("zhuandong_mp3");
       //         if(soundChanel){
       //             this.loopSoundChanels.push(soundChanel);
       //         }
       //     }
       //
       // }
       //
       // private touchHandler(evt: egret.TouchEvent): void {
       //     if(evt.type == egret.TouchEvent.TOUCH_BEGIN){
       //         if(!this.isAuto){
       //             this._timeTick = this.updateHandler;
       //             this._time = egret.getTimer();
       //             egret.startTick(this._timeTick,this);
       //         }
       //
       //     }else if(evt.type == egret.TouchEvent.TOUCH_CANCEL || evt.type == egret.TouchEvent.TOUCH_END || evt.type == egret.TouchEvent.TOUCH_RELEASE_OUTSIDE){
       //         egret.stopTick(this._timeTick,this);
       //     }
       // }
       //
       //private btnIndex(tag){
       //    for(var i = 0; i < 3;i++){
       //        var btn = this.btnDiamonds[i];
       //        var controller = btn.getController("button");
       //        if(i == tag){
       //            this.currentDiamond = this.diamonds[i];
       //            controller.selectedIndex  = 1;
       //            btn.enabled = false;
       //            //this.playBtnDiamonds(i);
       //        }else{
       //            btn.enabled = true;
       //            controller.selectedIndex  = 0;
       //        }
       //    }
       //}
       // private btnDiamondsHandler(evt: egret.TouchEvent):void{
       //     var curbtn = evt.currentTarget;
       //     var tag = curbtn["tag"];
       //     this.diamondIdx = tag;
       //     this.btnIndex(tag);
       //     console.log('---->', tag);
       //     //this.btnLow.enabled = true;
       //     //this.btnMid.enabled = true;
       //     //this.btnHigh.enabled = true;
       //     //var btnnum = this.btnDiamonds.length;
       //     //var btn;
       //     //for(var i=0;i<btnnum;i++){
       //     //    btn = this.btnDiamonds[i];
       //     //    var controller = btn.getController("button");
       //     //    if(curbtn == btn){
       //     //        this.currentDiamond = this.diamonds[i];
       //     //        this.diamondIdx = i;
       //     //        controller.selectedIndex  = 1;
       //     //        btn.enabled = false;
       //     //        console.log('---->this.currentDiamond:', this.currentDiamond);
       //     //        this.playBtnDiamonds(i);
       //     //
       //     //    }else {
       //     //        controller.selectedIndex  = 0;
       //     //        btn.enabled = true;
       //     //
       //     //    }
       //     //}
       //     //
       //     //if(){
       //     //
       //     //}
       // }
       //
       // private  playBtnDiamonds(idx:number):void{
       //     console.log('----->playBtnDiamonds:',idx);
       //     if(idx == 0){
       //         var mc_laohujitexiao002_texiao002f1 = this.slotAnim["mc_laohujitexiao002_texiao002f1"];
       //         var n80 = this._view.getChild("n80").asCom;
       //         if(!mc_laohujitexiao002_texiao002f1){
       //             var laohuji2_laba1 = n80.getChild("texiao002f1").asGraph;
       //             mc_laohujitexiao002_texiao002f1 = this.intScenAni("laohuji","mc_laohujitexiao002_texiao002f1",laohuji2_laba1,true,false,"mc_laohujitexiao002_texiao002f1");
       //         }else{
       //             mc_laohujitexiao002_texiao002f1.visible = true;
       //         }
       //         var mc_laohujitexiao002_texiao002f2 = this.slotAnim["mc_laohujitexiao002_texiao002f2"];
       //         var mc_laohujitexiao002_texiao002f3 = this.slotAnim["mc_laohujitexiao002_texiao002f3"];
       //         if(mc_laohujitexiao002_texiao002f2){
       //             mc_laohujitexiao002_texiao002f2.visible = false;
       //         }
       //         if(mc_laohujitexiao002_texiao002f3){
       //             mc_laohujitexiao002_texiao002f3.visible = false;
       //         }
       //
       //     }else if(idx == 1){
       //         var mc_laohujitexiao002_texiao002f2 = this.slotAnim["mc_laohujitexiao002_texiao002f2"];
       //         var n81 = this._view.getChild("n81").asCom;
       //         if(!mc_laohujitexiao002_texiao002f2){
       //             var laohuji2_laba2 = n81.getChild("texiao002f2").asGraph;
       //             mc_laohujitexiao002_texiao002f2 = this.intScenAni("laohuji","mc_laohujitexiao002_texiao002f1",laohuji2_laba2,true,false,"mc_laohujitexiao002_texiao002f2");
       //         }else{
       //             mc_laohujitexiao002_texiao002f2.visible = true;
       //         }
       //         var mc_laohujitexiao002_texiao002f1 = this.slotAnim["mc_laohujitexiao002_texiao002f1"];
       //         var mc_laohujitexiao002_texiao002f3 = this.slotAnim["mc_laohujitexiao002_texiao002f3"];
       //
       //         if(mc_laohujitexiao002_texiao002f1){
       //             mc_laohujitexiao002_texiao002f1.visible = false;
       //         }
       //         if(mc_laohujitexiao002_texiao002f3){
       //             mc_laohujitexiao002_texiao002f3.visible = false;
       //         }
       //
       //     }else if(idx == 2){
       //         var mc_laohujitexiao002_texiao002f3 = this.slotAnim["mc_laohujitexiao002_texiao002f3"];
       //         var n82 = this._view.getChild("n82").asCom;
       //         if(!mc_laohujitexiao002_texiao002f3){
       //             var laohuji2_laba3 = n82.getChild("texiao002f3").asGraph;
       //             mc_laohujitexiao002_texiao002f3 = this.intScenAni("laohuji","mc_laohujitexiao002_texiao002f1",laohuji2_laba3,true,false,"mc_laohujitexiao002_texiao002f3");
       //         }else{
       //             mc_laohujitexiao002_texiao002f3.visible = true;
       //         }
       //         var mc_laohujitexiao002_texiao002f1 = this.slotAnim["mc_laohujitexiao002_texiao002f1"];
       //         var mc_laohujitexiao002_texiao002f2 = this.slotAnim["mc_laohujitexiao002_texiao002f2"];
       //
       //         if(mc_laohujitexiao002_texiao002f1){
       //             mc_laohujitexiao002_texiao002f1.visible = false;
       //         }
       //         if(mc_laohujitexiao002_texiao002f2){
       //             mc_laohujitexiao002_texiao002f2.visible = false;
       //         }
       //     }
       //
       //
       //
       // }
       //
       // private get isAuto():boolean{
       //     var controller = this.btnStart.getController("c1");
       //     return controller.selectedIndex == 1;
       // }
       //
       // private updateHandler(timeStamp, paused):void{
       //     var delTime = timeStamp - this._time;
       //     if(delTime > 1000){
       //         egret.stopTick(this._timeTick,this);
       //         if(!this.isAuto){
       //             this.curentAutoTimes = 0;
       //             this.autoSlot(true);
       //         }
       //
       //     }
       // }
       //
       // private btnStartHandler():void{
       //     if(this.isAuto){
       //         this.autoSlot(false);
       //         return;
       //     }
       //     this.startRun();
       // }
       //
       // private startRun(){
       //     if(!this.canClick) return;
       //     if(!model.UserModel.Ins.isEnough(this.currentDiamond,"diamond")){
       //         if(this.isAuto){
       //             this.autoSlot(false);
       //         }
       //         return;
       //     }
       //     if(this.isAuto && this.curentAutoTimes >= this.maxAutoTimes){
       //         this.autoSlot(false);
       //         return;
       //     }
       //     this.canClick = false;
       //     this.isEndLoopAni = false;
       //     this.completeIndex = 0;
       //     this.slotResult = {"slotResult":{"status":true,"row":{"row1":"element005","row2":"element005","row3":"element005"},"id":7,"rewardlevel":7,"quality":1,"multi":2},"rewardDiamond":20}
       //     this.slotResult = null;
       //
       //     this.displayTouch(true);
       //     this.displayArrow(false);
       //     this.enabledDiamondBtn(false);
       //     this.playKuaimanAni(false);
       //     for(var i = 1; i < 4; i++){
       //         var anim = this.slotAnim["mc_laohuji_shuzixunhuan00" + i];
       //         anim.removeEventListener(egret.Event.COMPLETE,this.startPlayComplete,this);
       //         anim.addEventListener(egret.Event.COMPLETE,this.startPlayComplete,this);
       //         anim.loop = false;
       //         anim.gotoAndPlay("play");
       //     }
       //
       //     model.UserModel.Ins.getSlotElement(1, this.currentDiamond, this.getSlotElementComplete,this.getSlotElementFail,this);
       //     setTimeout(
       //         function(self) {
       //             return function() {
       //                 self.isEndLoopAni = true;
       //                 //self.playEndAnim();
       //                 if(self.slotResult){
       //                     self.playEndAnim();
       //                 }
       //             }
       //         } (this),
       //         1500
       //     );
       // }
       //
       // private getSlotElementFail():void{
       //     //this.playEndAnim();
       //     if(this.isAuto){
       //         this.autoSlot(false);
       //     }
       //     for(var i = 1; i < 4; i++){
       //         var anim = this.slotAnim["mc_laohuji_shuzixunhuan00" + i];
       //         anim.removeEventListener(egret.Event.COMPLETE,this.startPlayComplete,this);
       //         anim.loop = false;
       //         anim.gotoAndPlay("start");
       //     }
       //     this.canClick = true;
       // }
       //
       // private getSlotElementComplete(result){
       //     this.slotResult = result;
       //     if(model.UserModel.Ins.userProfile){
       //         console.log('--->this.currentDiamond: -',this.currentDiamond);
       //         model.UserModel.Ins.userProfile.diamond -= this.currentDiamond;
       //         game.GameEvent.UPDATE_HUD_DIAMOND.dispatch()
       //     }
       //     if(this.isEndLoopAni){//请求回来看是否结束循环动画了
       //         this.playEndAnim();
       //     }
       //
       // }
       //
       // private playEndAnim():void{
       //     var index = 0;
       //     var self = this;
       //     function playEnd(): void {
       //         index = index + 1
       //         var anim = self.slotAnim["mc_laohuji_shuzixunhuan00" + index];
       //         anim.loop = false;
       //         anim.gotoAndPlay("end");
       //         self.initIcon(anim,self.slotResult.slotResult.row["row" + index]);
       //         anim.removeEventListener(egret.Event.COMPLETE,self.mcComplete,self);
       //         anim.addEventListener(egret.Event.COMPLETE,self.mcComplete,self);
       //         if(index < 3){
       //             setTimeout(function () {
       //                 playEnd();
       //             },500)
       //         }
       //
       //     }
       //     playEnd()
       // }

        private onAdded():void{

        }

        private onRemoved():void{
            HorseRaceLamp.dispose();
            for(var key in this.slotAnim){
                this.slotAnim[key].stop();
                if(this.slotAnim[key].parent){
                    this.slotAnim[key].parent.removeChild(this.slotAnim[key]);
                }
            }

            if(RES.hasRes("laohujitexiao003_json") &&
                RES.hasRes("laohujitexiao003_swf_json"))
            {
                RES.destroyRes("laohujitexiao003_json");
                RES.destroyRes("laohujitexiao003_swf_json")
            }

            if(RES.hasRes("laohujitexiao004_json") &&
                RES.hasRes("laohujitexiao004_swf_json"))
            {
                RES.destroyRes("laohujitexiao004_json");
                RES.destroyRes("laohujitexiao004_swf_json")
            }
            //game.GameEvent.SLOT_AUTO.remove(this.autoSlot,this);
            //if(this.btnStart){
            //    this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandler,this);
            //    this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            //    this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchHandler,this);
            //    this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchHandler,this);
            //}

        }

    }

}