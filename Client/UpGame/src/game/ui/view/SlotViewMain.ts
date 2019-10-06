module view {

    export class SlotViewMain extends fairygui.GComponent {

        public static UNIT_NAMES: any = {
            'unit001': '王冠',
            'unit002': '发卡',
            'unit003': '帽子',
            'unit004': '药水',
            'unit005': '蝙蝠',
            'unit006': '蝴蝶刀',
            'unit007': '黑猫',
            'unit008': '蝙蝠1',
            'unit009': '蝴蝶刀1',
            'unit010': '黑猫1'
        };

        private static textureCache: any = {};
        public static getUnitTexture(unit: string): egret.Texture {
            if (SlotViewMain.textureCache[unit]) return SlotViewMain.textureCache[unit];
            var image: fairygui.GImage =
                fairygui.UIPackage.createObject('slots', unit) as fairygui.GImage,
                texture: egret.Texture = !!image && image.texture ? image.texture : null;

            // console.log('[SlotWheel]', 'texture size:', texture.textureWidth, texture.textureHeight);
            image.dispose();
            SlotViewMain.textureCache[unit] = texture;
            return texture;
        }

        private _slot:ui.slots.UI_slots;

        public constructor() {
            super();

            ui.slots.slotsBinder.bindAll();

            ui.UIUtils.lifeTime(this, this.onAdded, this.onRemoved);
        }

        private onAdded():void {
            this._slot = ui.slots.UI_slots.createInstance();
            this._slot.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            this.addChild(this._slot);

            // 主逻辑, 负责拉霸点击的请求桥接, 也可以写到SlotResult里
            game.SlotLogic.Ins.init();

            var initializer: components.core.UIReplacementInitializer =
                new components.core.UIReplacementInitializer();
            initializer
                .add(new components.hud.SlotHud().setParams(this._slot.m_hud_hud, view.delegate.SlotHudLogic))
                .on(function (logics: any[]): void {
                    console.log('[SlowViewMain]', 'initialized components');
                }, this);

            // 初始化组件视图
            view.SlotBackgroundEffect.Ins.init(this._slot); // 通用背景特效
            view.SlotResult.Ins.init(this._slot);       // 拉霸结束之后的弹窗视图管理
            // view.SlotHud.Ins.init(this._slot);          // 顶部的hud

            view.SlotWheel.Ins.init(this._slot);        // 转动动画
            view.SlotRankBtn.Ins.init(this._slot);      // 排行榜
            view.SlotCost.Ins.init(this._slot);         // 单次花费
            view.SlotCollect.Ins.init(this._slot);
            view.CollectEffect.Ins.init(this._slot);
            // 延迟在其他组件之后,因为涉及到初始化数据派发
            view.SlotLine.Ins.init(this._slot);         // 选择线束的按钮组
            view.SlotBet.Ins.init(this._slot);          // 选择下注额的按钮组

            // view.SlotFire.Ins.init(this._slot);          //烟花按钮
            //view.SlotChest.Ins.init(this._slot);          //宝箱按钮
            view.SlotBtn.Ins.init(this._slot);          // 开始按钮
            view.SlotRule.Ins.init(this._slot);
            view.RateBar.Ins.init(this._slot);
            view.RateScreenEffect.Ins.init(this._slot);
            // view.SlotFanli.Ins.init(this._slot);        //返利
            view.SlotHorseRaceLamp.Ins.init(this._slot);    // 跑马灯
            //view.SlotJackpot.Ins.init(this._slot);    // 滚动奖池
            //view.SlotJackpotList.Ins.init(this._slot);    // 获奖列表

            // 初始化音乐
            WindowMsg.Ins.posMessage({ key: "getMusic" });
        }

        private onRemoved():void {

        }

    }

}