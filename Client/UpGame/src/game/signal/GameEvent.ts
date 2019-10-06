module game {

	export class GameEvent {

		/*
		* 服务器时间同步了!
		* */
		public static SERVER_TIME_UPDATE:Signal = new Signal();

		/*
		* 锁定屏幕不让点击下面的元素
		* 参数：
		*	show: true/false 必须，代表是否可见
		* */
		public static LOCK_SCREEN:Signal = new Signal();

        /*
        * UI大界面的切换,参数来源于UIStatusIds
        * */
        public static UI_SWITCH:Signal = new Signal();
        /*
        * UI界面切换完成
        * */
        public static UI_SWITCHED:Signal = new Signal();
		/*
		* 在首页内部切换页签
		* */
		public static UI_SWITCH_INSIDE_MAIN:Signal = new Signal();

		/*
		* UI加载过程中Lock住整个屏幕
		* */
		public static UI_LOADING_LOCK:Signal = new Signal();

		/*
		* preloading进度
		* */
		public static PRELOADING_PROGRESS:Signal = new Signal();
		/*
		* preloading结束
		* */
		public static PRELOADING_COMPLETE:Signal = new Signal();

		/*
		* 需要显示加载进度的加载器
		* 参数:
		*	show: true/false，表示开始和结束
		*	progress: number，表示进度(可选)
		*/
		public static SHOW_PROGRESS_LOADING:Signal = new Signal();

		/*
		 * 刷新HUD的U钻
		 * */
		public static UPDATE_HUD_DIAMOND:Signal = new Signal();

		/*
		 * 刷新HUD的音乐开关
		 * */
		public static UPDATE_HUD_MUSIC: Signal = new Signal();
		
		public static UPDATE_QUEST_REDDOT: Signal = new Signal();

		public static DISPLAY_HORSERACELAMP: Signal = new Signal();

		/*
		 * 收集完成时 播放的女孩动画
		 */
		public static COLLECT_COMPLETE_ANIMATION:Signal = new Signal();

		/*
		 * 收集失败时 播放的动画
		 */
		public static COLLECT_FAIL_ANIMATION:Signal = new Signal();

		/*
		 * 待机状态的 女孩动画
		 */
		public static COLLECT_COMMON_ANIMATION:Signal = new Signal();

		/*
		 * 更新收集栏的数据 ，在摇奖getslotment 接口中更新
		 */
		public static UPDATE_COLLECT:Signal = new Signal();

		/*
		 * 更新party回合
		 */
		public static UPDATE_PARTY:Signal = new Signal();

		/*
		 * 收集到元素的飞入动画
		 */
		public static COLLECT_EFFECT:Signal = new Signal();

		/*
		 * 收集到元素的飞入动画完成
		 */
		public static SHOW_COLLECT_EFFECT_END:Signal = new Signal();

		/*
		 * 多倍率动画的开始
		 */
		public static MULTI_RATE_START:Signal = new Signal();


		/*
		 * 多倍率动画的结束
		 */
		public static MULTI_RATE_STOP:Signal = new Signal();


		/*
		 * 转换背景
		 */
		public static CHANG_BACK_GROUND:Signal = new Signal();

		/*
		 * 更新美女动画状态
		 */
		public static UPDATE_UNIT:Signal = new Signal();

		/*
		 * 更新all美女动画状态
		 */
		public static UPDATE_ALL_UNIT:Signal = new Signal();

		/*
		 * 切换界面
		 */
		public static SHOW_CHANGE_SCROLLER_END:Signal = new Signal();

		/*
		 * 切换界面
		 */
		public static SET_SCROLLER:Signal = new Signal();
	}
}
