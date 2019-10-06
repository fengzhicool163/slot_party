//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    public static Inst:Main;

    private _initSequence:init.SequenceInit;

    public constructor() {
        super();
        Main.Inst = this;
        this.init();
    }

    private init():void {

        this._initSequence = init.BaseInit.sequence;
        this._initSequence
            .add(new init.ConsoleHacker())
            .add(new init.DetermineLocale())
            // .add(new init.CatchError())
            .add(new init.AddedToStage())
            .add(new init.LoadResConfig())
            .add(new init.LoadAndShowLogin())
            .add(new init.LoadGameResource())
            .add(new init.PlatformLogin())
            .add(new init.LoadDynamicResource())
            .done(this.determinScene, this)
            .do();
    }

    private determinScene():void {
        console.log('[Main]', 'Done');
        // 所有初始化的动作都完成了,需要根据情况来决定是不是自动跳转到其他场景
        if (model.UserModel.Ins.getIsClosed() || false) {
            model.UserModel.Ins.getRanking(1,function (result) {
                ui.UILayer.Ins.popup(ui.PopUpIds.RANKING, result);
            } , this);

        } else {
            ui.UILayer.Ins.switchStatus(ui.UIStatusIds.MAIN);
        }

        WindowMsg.Ins.posMessage({key:"loadComplete"})
    }
}


