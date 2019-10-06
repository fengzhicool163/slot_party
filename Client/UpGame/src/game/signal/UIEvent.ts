module game {

    export class UIEvent {

        // // 如果是免费次数,会在开始前派发这个事件
        // public static FREE_SLOT_START:Signal = new Signal();
        
        // 拉!
        public static SLOT:Signal = new Signal();

        // 拉霸结果
        public static SLOT_RESULT:Signal = new Signal();

        // 拉霸结果
        public static SLOT_CHANGE_SCROLLER:Signal = new Signal();

        // 拉霸结果需要弹窗
        public static SLOT_RESULT_POPUP_END:Signal = new Signal();

        // 拉霸动画结束
        public static SLOT_WHEEL_END:Signal = new Signal();

        // 每条线的奖励结束
        public static SLOT_LINE_REWARD_END:Signal = new Signal();

        // 整个一次拉霸结束了
        public static SLOT_COMPLETE:Signal = new Signal();

        // 选线
        public static LINE:Signal = new Signal();

        // 选下注额
        public static BET:Signal = new Signal();

        //hud 面板得更新
        public static SLOT_HUD:Signal = new Signal();

        // 根据拉霸结果决定要显示的效果,包括big win和super win两种, 参数是number, 1代表bigwin, 2代表superwin
        public static SLOT_SHOW_RESULT:Signal = new Signal();

        public static SLOT_FREE_TIMES = new Signal();

        public static UPDATE_CHEST = new Signal();

        public static SHOW_KEY_ANI = new Signal();

        public static SHOW_KEY_ANI_END:Signal = new Signal();

        public static SHOW_FIRE_ANI_END:Signal = new Signal();

        /*
         * 刷新火焰
         * */
        public static UPDATE_FIRE:Signal = new Signal();
        /*
         * 播放得到烟花
         * */
        public static ACHIEVE_FIRE:Signal = new Signal();

        public static SLOT_COST:Signal = new Signal();
        /*
         * 更新获奖名单
         * */
        public static UPDATE_JACKPOT_LIST:Signal = new Signal();
        /*
         * 播放获奖动画
         * */
        public static SHOW_JACKPOT_ANI:Signal = new Signal();

        /*
         * 播放获奖动画完成
         * */
        public static SHOW_JACKPOT_ANI_END:Signal = new Signal();

        /*
         * 播放补仓动画
         * */
        public static SHOW_SUPPLEMENT_ANI:Signal = new Signal();
        /*
         * 播放补仓动画完成
         * */
        public static SHOW_SUPPLEMENT_ANI_END:Signal = new Signal();


        /*
         * 停止滚动,不回调,不改值
         * */
        public static SHOW_STOP_JACKPOT_NUM:Signal = new Signal();

        /*
         * 开始倍率
         * */
        public static MULTI_RATE_START:Signal = new Signal();

        /*
         * stop倍率
         * */
        public static MULTI_RATE_STOP:Signal = new Signal();

        /*
         * stop倍率
         * */
        public static SHOW_FREE_TIMES:Signal = new Signal();

        /*
         * 更新倍率
         * */
        public static UPDATA_RATE:Signal = new Signal();

        /*
         * stop auto
         */
        public static SLOT_STOP_AUTO:Signal = new Signal();
    }

}