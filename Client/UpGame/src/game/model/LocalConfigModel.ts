/**
 * Created by liangrui on 5/6/16.
 */

module model {

    export class LocalConfigModel {

        private static _ins:LocalConfigModel;

        public static get Ins():LocalConfigModel {
            if (!this._ins) this._ins = new model.LocalConfigModel();
            return this._ins;
        }

        private _gameConfig:any = null;

        public get gameConfig():any {
            if (!this._gameConfig) this._gameConfig = game.Tools.loadGameConfig();
            return this._gameConfig;
        }

        /*
        * 老虎机每个滚动项的顺序
        */
        public getUnitRowsR():any[][] {
            var l = 5;
            var rows:any[][] = [];
            
            for (var i:number = 0; i < l; i ++) {
                rows.push([]);
            }
            var data:any = _.where(this.gameConfig.slotsgameunit.all, {table: 1});
            for (var i:number = 0; i < data.length; i ++) {
                rows[0].push(data[i]['row1']);
                rows[1].push(data[i]['row2']);
                rows[2].push(data[i]['row3']);
                rows[3].push(data[i]['row4']);
                rows[4].push(data[i]['row5']);
            }
            return rows;
        }

        public getUnitRowsS():any[][] {
            var l = 5;
            var rows:any[][] = [];

            for (var i:number = 0; i < l; i ++) {
                rows.push([]);
            }
            //for (var i:number = 0; i < this.gameConfig.slotsgameunit.all.length; i ++) {
            //    rows[0].push(this.gameConfig.slotsgameunit.all[i]['row1']);
            //    rows[1].push(this.gameConfig.slotsgameunit.all[i]['row2']);
            //    rows[2].push(this.gameConfig.slotsgameunit.all[i]['row3']);
            //    rows[3].push(this.gameConfig.slotsgameunit.all[i]['row4']);
            //    rows[4].push(this.gameConfig.slotsgameunit.all[i]['row5']);
            //}
            var data:any = _.where(this.gameConfig.slotsgameunit.all, {table: 2});
            for (var i:number = 0; i < data.length; i ++) {
                rows[0].push(data[i]['row1']);
                rows[1].push(data[i]['row2']);
                rows[2].push(data[i]['row3']);
                rows[3].push(data[i]['row4']);
                rows[4].push(data[i]['row5']);
            }
            return rows;
        }

        /*
         * 获得all任务单位数据
         */
        public getTaskAllUnit():any[] {
            return this.gameConfig.slotsgameminigame.all;
        }

        /*
         * 获得任务单位数据
         */
        public getTaskUnit(unit:string):any {
            var data:any = _.where(this.gameConfig.slotsgameminigame.all, {unit: unit});
            if(data.length > 0)return data[0];
            return null;
        }

        /*
         * 获得任务单位数据
         */
        public getTaskUnitPoint(unit:string):number {
            var data:any = this.getTaskUnit(unit);
            if(data)return data['unitPoint'];
            return 0;
        }

        /*
        * big win
        */
        public getBigWin():number {
            return this.gameConfig.slotsgamecontent.all[0]['bigwin'];
        }

        /*
        * super win
        */
        public getSuperWin():number {
            return this.gameConfig.slotsgamecontent.all[0]['superwin'];
        }

        public slotsgamecontent(key:string):any{
            return this.gameConfig.slotsgamecontent.all[0][key];
        }

        /*
         * pointValue
         */
        public getPoint001():number {
            return this.gameConfig.slotsgameminigame.all[0]['pointValue'];
        }
        public getPoint002():number {
            return this.gameConfig.slotsgameminigame.all[1]['pointValue'];
            //return  3;
        }

        public getCollectDataById(taskId:string):any{
            var task = parseInt(taskId);
            return _.where(this.gameConfig.slotsgameminigame.all , {id:task})[0];
        }

    }
}