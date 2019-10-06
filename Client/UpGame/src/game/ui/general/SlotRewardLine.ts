module ui {

    export class SlotRewardLine extends egret.Sprite {

        private _frames:game.Animation[] = [];

        public constructor() {
            super();
        }

        public clear():void {
            while (this._frames.length > 0) {
                var frame:game.Animation = this._frames.shift();
                frame.stop();
            }
            
            this.removeChildren();
            this.graphics.clear();
        }

        private _globalPoint:egret.Point;
        public draw(rewardNum:number, rects:egret.Rectangle[], line:number[]):void {
            if (rects && rects.length > 0) {
                if (!this._globalPoint) {
                    this._globalPoint = new egret.Point();
                    this.localToGlobal(0, 0, this._globalPoint);
                }

                for (var j:number = 0; j < rects.length; j ++) {
                    rects[j].x -= this._globalPoint.x;
                    rects[j].y -= this._globalPoint.y;
                }

                // 先搞框
                this.drawRect(rects, rewardNum);

                // 如果是最后一格那就都不用画了
                if (rewardNum == view.SlotWheel.MAX_SCROLLER) return;

                // 再画线
                // 先定形
                this.graphics.lineStyle(4, 0xF96DFF);
                // 在定性
                switch (line) {
                    case view.SlotWheel.LINE1:
                    case view.SlotWheel.LINE2:
                    case view.SlotWheel.LINE3:
                        this.drawLine123(rewardNum, rects);
                        break;
                    case view.SlotWheel.LINE4:
                    case view.SlotWheel.LINE5:
                        this.drawLine45(rewardNum, rects, line);
                        break;
                    case view.SlotWheel.LINE6:
                    case view.SlotWheel.LINE7:
                        this.drawLine67(rewardNum, rects, line);
                        break;
                    case view.SlotWheel.LINE8:
                    case view.SlotWheel.LINE9:
                        this.drawLine89(rewardNum, rects, line);
                        break;
                }
                // 结束
                this.graphics.endFill();
            }
        }

        private drawLine123(rewardNum: number, rects: egret.Rectangle[]): void {
            var startX: number = rects[rewardNum - 1].right,
                startY: number = rects[rewardNum - 1].top + rects[rewardNum - 1].height / 2,
                endX: number = rects[rects.length - 1].right,
                endY: number = rects[rects.length - 1].top + rects[rects.length - 1].height / 2;
            
            this._drawLine([[startX, startY], [endX, endY]]);
        }

        private drawLine45(rewardNum: number, rects: egret.Rectangle[], line: number[]): void {
            var points: number[][] = [],
                self = this;

            function p1(): number[] {
                var gap = line[rewardNum] - line[rewardNum - 1];
                if (gap > 0) {
                    // 中奖的最后一个的下一个在上一个下面
                    return [rects[rewardNum - 1].right, rects[rewardNum - 1].bottom];
                } else {
                    return [rects[rewardNum - 1].right, rects[rewardNum - 1].top];
                }
            }

            function p2(): number[] {
                var p: egret.Point = self.toCenter(rects[rewardNum]);
                return [p.x, p.y];
            }

            function p3(): number[] {
                var gap = line[rewardNum] - line[rewardNum - 1];
                if (gap > 0) {
                    // 中奖的最后一个的下一个在上一个下面
                    return [rects[rewardNum - 1].right, rects[rewardNum - 1].bottom];
                } else {
                    return [rects[rewardNum - 1].right, rects[rewardNum - 1].top];
                }
            }

            function p4(): number[] {
                var gap: number = line[line.length - 1] - line[line.length - 2];
                if (gap > 0) {
                    // 最后一个在上一个下面
                    return [rects[rects.length - 1].right, rects[rects.length - 1].bottom];
                } else {
                    return [rects[rects.length - 1].right, rects[rects.length - 1].top];
                }
            }

            switch (rewardNum) {
                case 2:
                    points.push(p1());
                    points.push(p2());
                    points.push(p4());
                    break;
                case 3:
                    points.push(p3());
                    points.push(p4());
                    break;
                case 4:
                    points.push(p3());
                    points.push(p4());
                    break;
            }
            this._drawLine(points);
        }

        private drawLine67(rewardNum: number, rects: egret.Rectangle[], line: number[]): void {
            var points: number[][] = [],
                r: egret.Rectangle,
                p: egret.Point;

            var lastRect: egret.Rectangle;
            var nextRect: egret.Rectangle;

            for (var i: number = 0; i < rewardNum; i++) {
                lastRect = i == 0 ? null : rects[i - 1];
                r = rects[i];
                nextRect = i == rects.length - 1 ? null : rects[i + 1];
                points = [];

                if (nextRect.y > r.y) {
                    points.push([r.right - r.width / 4, r.bottom]);
                    points.push([nextRect.left + nextRect.width / 4, nextRect.top]);
                } else {
                    points.push([r.right - r.width / 4, r.top]);
                    points.push([nextRect.left + nextRect.width / 4, nextRect.bottom]);
                }
                this._drawLine(points);
            }
            points = [];
            points.push(nextRect.y > r.y ? [r.right - r.width / 4, r.bottom] : [r.right - r.width / 4, r.top]);

            for (i = rewardNum; i < rects.length - 1; i++) {
                r = rects[i];
                p = this.toCenter(rects[i]);
                points.push([p.x, p.y]);
            }

            lastRect = r;
            r = rects[rects.length - 1];
            points.push(r.y > lastRect.y ? [r.right, r.bottom] : [r.right, r.top]);

            this._drawLine(points);
        }

        private drawLine89(rewardNum: number, rects: egret.Rectangle[], line: number[]): void {
            var points: number[][] = [],
                r: egret.Rectangle,
                p: egret.Point;
            
            r = rects[rects.length - 1];
            points.unshift([r.right, r.top + r.height / 2]);
            p = this.toCenter(r);
            points.unshift([p.x, p.y]);

            var nextRect: egret.Rectangle = r;
            r = rects[rects.length - 2];
            if (rewardNum == 4) {
                points.unshift(nextRect.y > r.y ?
                    [r.right, r.bottom] :
                    [r.right, r.top]);
            } else {
                p = this.toCenter(r);
                points.unshift([p.x, p.y]);
            }

            nextRect = r;
            r = rects[rects.length - 3];
            if (rewardNum == 3) {
                points.unshift(nextRect.y > r.y ?
                    [r.right, r.bottom] :
                    [r.right, r.top]);
            }

            nextRect = r;
            r = rects[rects.length - 4];
            if (rewardNum == 2) {
                points.unshift(nextRect.y > r.y ?
                    [r.right, r.bottom] :
                    [r.right, r.top]);
            }

            this._drawLine(points);
        }

        private _drawLine(points: number[][]): void {
            var first: number[] = points.shift();
            this.graphics.moveTo(first[0], first[1]);
            for (var i: number = 0; i < points.length; i++) {
                this.graphics.lineTo(points[i][0], points[i][1]);
            }    
        }

        private drawRect(rects: egret.Rectangle[], len: number): void {
            // 先搞框
            var frame: game.Animation;
            for (var i: number = 0; i < len; i++) {
                frame = this.getAnim();
                frame.anim.x = rects[i].x;
                frame.anim.y = rects[i].y + (rects[i].height - frame.anim.height) / 2;
                // frame.scaleX = 0.8;
                // frame.scaleY = 0.8;
                // frame.width = rects[i].width;
                // frame.height = rects[i].height;
                this.addChild(frame.anim);
                this._frames.push(frame);
            }
        }

        private _center: egret.Point;
        private toCenter(rect: egret.Rectangle): egret.Point {
            if (!this._center) this._center = new egret.Point();

            this._center.x = rect.left + rect.width / 2;
            this._center.y = rect.top + rect.height / 2;

            return this._center;
        }

        private getAnim():game.Animation {
            return game.Animation.get('laohujinew004', 'mc_laohujinew001yc_kuang')
                .play(true);
        }

    }

}