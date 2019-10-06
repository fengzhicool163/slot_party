/**
 * Created by zhaikaiyu on 16/12/22.
 */
module ui {

    export class PopUpIds {

        /*
         * 通用提示框,用来报错,钱不够等的提示.
         * */
        public static NOTIFICATION:string = 'notification';

        /*
         * 排行榜弹框
         * */
        public static RANKINGPOP:string = 'rankingpop';

        /*
         * 小奖
         * */
        public static BIG_WIN:string = 'big_win';

        /*
        * 大奖
        */
        public static SUPER_WIN:string = 'super_win';

        /*
         * 游戏更新说明弹窗
         * */
        public static GAME_UPDATES:string = 'game_updates';

        /*
         * 规则说明
         */
        public static SLOT:string = 'slotrule';

        public static RANKING:string = 'ranking';

        public static FANLI:string = 'fanli';

        public static JACKPOT:string = 'jackpot';
    }

    export class UIStatusIds {

        /*
        * 登陆界面
        * */
        public static LOGIN:string = 'login';
        /*
        * 主界面(HUD,DOCK,各个功能翻页)
        * */
        public static MAIN:string = "main";


    }

    export class UIMainIndex {
        public static MAIN:number = 10;


    }

    export class UIMainReason {

        public static GET_CARD:string = 'get_card';

    }

    export class CostType{
        public static CASH:string = "cash";
        public static COIN:string = "coin";
        public static STAMINA:string = "stamina";
        public static EXP:string = "exp";

    }


}