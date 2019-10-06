/**
 * Created by huangqingfeng on 16/5/18.
 */
module ui {

    export class NotificationPopup extends BasePopup {

        private static CONF:any = {
            content: '',                // 弹窗内部的文字内容
            showClose: true,            // 是否显示关闭按钮
            showConfirm: true,          // 是否显示确定按钮(左侧按钮)
            showCancel: false,          // 是否显示取消按钮(右侧按钮)
            confirmLabel: '確認',        // 确定按钮的文字内容
            cancelLabel: '取消',         // 取消按钮的文字内容
            confirmCallback: null,      // 确定按钮的回调方法
            confirmCallbackObj: null,   // 确定按钮的回调this
            cancelCallback: null,       // 取消按钮的回调方法
            cancelCallbackObj: null,     // 取消按钮的回调this
            selectIndex:0                //控制器的索引
        };

        private _conf:any;
        private _confirmBtn:fairygui.GButton;
        private _cancelBtn:fairygui.GButton;
        private _closeBtn:fairygui.GObject;

        public constructor() {
            super('slots', 'popup_tongyong');
        }

        public closeWhenClickOutside():boolean {
            return false;
        }

        protected onUpdate(...args):void {
            NotificationPopup.CONF.confirmLabel = game.Tools.lang('確認');
            NotificationPopup.CONF.cancelLabel = game.Tools.lang('取消');

            this._conf = JSON.parse(JSON.stringify(NotificationPopup.CONF));
            this.view.opaque = false;

            var config:any = args[0];

            if (typeof config === 'string') {
                this._conf.content = config + '';
            } else {
                var self = this;
                for (var key in config) {
                    if (config[key]) {
                        self._conf[key] = config[key];
                    }
                }
            }

            // 更新文字内容
            var tf:fairygui.GTextField = this.view.getChild('n3').asTextField;
            tf.align = fairygui.AlignType.Center;
            tf.text = this._conf.content;
            tf.color = 0xffffff;
            // this._closeBtn = this.view.getChild('frame');
            // if (!this._conf.showClose) this._closeBtn.visible = false;

            this._confirmBtn = this.view.getChild('n8').asButton;
            this._confirmBtn.visible = this._conf.showConfirm;
            if (this._conf.confirmLabel) this._confirmBtn.text = this._conf.confirmLabel;
            if (this._confirmBtn.visible) this._confirmBtn.addClickListener(this.onConfirm, this);

            this._cancelBtn = this.view.getChild('n7').asButton;
            this._cancelBtn.visible = this._conf.showCancel;
            if (this._conf.cancelLabel) this._cancelBtn.text = this._conf.cancelLabel;
            if (this._cancelBtn.visible) this._cancelBtn.addClickListener(this.onCancel, this);

            if (!this._conf.showConfirm || !this._conf.showCancel) {
                if (this._conf.showConfirm) this._confirmBtn.x = (this.view.width - this._confirmBtn.width) / 2;
                else this._cancelBtn.x = (this.view.width - this._cancelBtn.width) / 2;

                // console.log('[Notification]', this._confirmBtn.x, this._confirmBtn.y);
            }
            this.view.getController('c1').selectedIndex = this._conf.selectIndex;
            if(this._conf.selectIndex){
                //this.view.getChild('n9').asTextField.text = game.Tools.lang('数量不足,可通過中指定獎項後獲得\n詳細細節可查詢玩法介紹中的獎勵資訊')
            }
        }
        
        /*
        * 确认回调
        * */
        private onConfirm():void {
            if (this._conf.confirmCallback)
            {
                this._conf.confirmCallback.apply(this._conf.confirmCallbackObj);
            }
            this.hide();
        }

        /*
        * 取消回调
        * */
        private onCancel():void {
            if (this._conf.cancelCallback) this._conf.cancelCallback.apply(this._conf.cancelCallbackObj);
            this.hide();
        }

        protected closeEventHandler(e:egret.Event):void {
            // 关闭等同于取消
            if (this._conf.cancelCallback) this._conf.cancelCallback.apply(this._conf.cancelCallbackObj);
            super.closeEventHandler(e);
        }

        public onHide():void {
            super.onHide();

            if (this._confirmBtn) this._confirmBtn.removeClickListener(this.onConfirm, this);
            if (this._cancelBtn) this._cancelBtn.removeClickListener(this.onCancel, this);
        }

        protected onBackgroudClose():void {
            super.onBackgroudClose();

            // 关闭等同于取消
            if (this._conf.cancelCallback) this._conf.cancelCallback.apply(this._conf.cancelCallbackObj);
        }
    }
}