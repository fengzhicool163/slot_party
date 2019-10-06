module view.delegate {

    export class SlotHudLogic {

        private _ui: components.hud.ISlotHud;

        public constructor(i: components.hud.ISlotHud) {
            this._ui = i;

            game.UIEvent.SLOT.add(this.onSlot, this);
            game.UIEvent.SLOT_COMPLETE.add(this.onSlotComplete, this);

            game.GameEvent.UPDATE_HUD_DIAMOND.add(this.updataDiamond, this);
            game.GameEvent.UPDATE_HUD_MUSIC.add(this.initMusic, this);
            game.GameEvent.UPDATE_QUEST_REDDOT.add(this.updateTask, this);
            
            this._ui.chargeBtn.addClickListener(this.gotoPay, this);
            this._ui.musicBtn.addClickListener(this.onMusic, this);
            this._ui.taskComp.addClickListener(this.onTask, this);
            this._ui.returnBtn.addClickListener(this.onReturn, this);

            var profile: model.UserProfile = model.UserModel.Ins.userProfile;
            this._ui.nameText.text = profile.username;

            ui.UIUtils.fitPlayerHead(this._ui.headComp, profile.avatar);

            this._ui.diamondGraph.setNativeObject(this._ui.diamondText);

            this.updataDiamond();
            this.initMusic();
            this.updateTask(true);
        }

        private updataDiamond() {
            this._ui.diamondText.text = (model.UserModel.Ins.userProfile.diamond || 0) + '';

            //var s = model.UserModel.Ins.userProfile;
            // this._slot.m_n202.getChild("rdot").visible = model.UserModel.Ins.userProfile["taskStatus"];
            //this._slot.m_n155.getChild("texiao2").asGraph.visible = this._slot.m_n155.getChild("rdot").visible;
        }

        private gotoPay(): void {
            WindowMsg.Ins.posMessage({ key: 'pay' });
        }

        private onMusic(e: egret.Event): void {
            var musicOn: boolean = game.MusicManager.Ins.isMusicOn();
            WindowMsg.Ins.posMessage({ key: 'music', status: !musicOn });

            game.MusicManager.Ins.setMusicOn(!musicOn);
        }

        private initMusic(): void {
            (this._ui.musicBtn as fairygui.GButton).selected = !game.MusicManager.Ins.isMusicOn();
        }

        public updateTask(init: boolean): void {
            var self = this;

            var ts: boolean = model.UserModel.Ins.taskStatus,
                lastTs: boolean = model.UserModel.Ins.lastTaskStatus,
                lastTc: number = model.UserModel.Ins.lastTaskCount,
                tc: number = model.UserModel.Ins.taskCount;

            var controller: fairygui.Controller = self._ui.taskComp.getControllerAt(0),
                transition: fairygui.Transition = self._ui.taskComp.getTransitionAt(0);

            // 调整层级是因为:
            // 1. 任务按钮里有一个序列帧动画
            // 2. 如果任务按钮在音乐按钮的上层,这个序列帧动画会盖住音乐按钮,影响点击
            // 3. 正常状态下,需要任务按钮的层级在音乐按钮下面,以保证音乐按钮的点击
            // 4. 在播放新任务动画的时候,任务按钮会往左延伸
            // 5. 这时需要反过来,让任务按钮在因为按钮上面,才能保证动画不会被音乐按钮覆盖
            function taskBtnUp(): void {
                var p: fairygui.GComponent = self._ui.taskComp.parent,
                    taskBtnIndex: number = p.getChildIndex(self._ui.taskComp),
                    musicBtnIndex: number = p.getChildIndex(self._ui.musicBtn);
                if (taskBtnIndex < musicBtnIndex) {
                    p.setChildIndex(self._ui.taskComp, musicBtnIndex);
                }
            }

            function taskBtnDown(): void {
                var p: fairygui.GComponent = self._ui.taskComp.parent,
                    taskBtnIndex: number = p.getChildIndex(self._ui.taskComp),
                    musicBtnIndex: number = p.getChildIndex(self._ui.musicBtn);
                if (taskBtnIndex > musicBtnIndex) {
                    p.setChildIndex(self._ui.taskComp, musicBtnIndex);
                }
            }

            function show(): void {
                taskBtnDown();

                if (ts) {
                    // 如果有未领的任务,显示红点
                    controller.selectedIndex = 1;
                } else {
                    controller.selectedIndex = 0;
                }
            }

            console.log('[SlotHudLogic]', init, lastTc, tc, lastTs, ts);

            if (!init && tc > lastTc) {
                // 如果新的任务数量大于老的任务数量,那么应该是播放一次新任务来了
                taskBtnUp();

                controller.selectedIndex = 2;
                transition.play(function (): void {
                    show();
                }, self);
            } else {
                show();
            }
        }

        private onTask(): void {
            WindowMsg.Ins.posMessage({ key: 'popup', identity: 'quest' });
        }

        private onReturn(): void {
            WindowMsg.Ins.posMessage({ key: 'close' });
        }

        private onSlot(): void {
            var cost: number = model.UserModel.Ins.freeTimes > 0 ? 0 : game.SlotLogic.Ins.line * game.SlotLogic.Ins.bet;
            this._ui.diamondText.text = (model.UserModel.Ins.userProfile.diamond || 0) - cost + '';
            // console.log('[SlotHudLogic]', 'slot', cost);
        }

        private onSlotComplete(): void {
            this._ui.diamondText.text = (model.UserModel.Ins.userProfile.diamond || 0) + '';
            // console.log('[SlotHudLogic]', 'slot complete', model.UserModel.Ins.userProfile.diamond);
        }

    }

}