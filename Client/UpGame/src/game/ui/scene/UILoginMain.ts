/**
 * Created by a123 on 16-5-24.
 */
module ui {

    export class UILoginMain extends fairygui.GComponent {
        private _view:fairygui.GComponent;
        private _progressBar:fairygui.GProgressBar;

        private _progress:number = 0;
        //private _progressText:egret.TextField;
        public constructor(){
            super();
            //this._progressText = new egret.TextField();
            //this._progressText.size = 50;
            //this._progressText.x = UILayer.ACTUAL_WIDTH / 2 ;
            //this._progressText.y = UILayer.ACTUAL_HEIGHT / 2;
            //this.displayListContainer.addChild(this._progressText);
            game.GameEvent.PRELOADING_PROGRESS.add(this.onProgress, this);
            game.GameEvent.PRELOADING_COMPLETE.add(this.onComplete, this);

            this.onStart();
        }

        private onStart():void {
            this._view = fairygui.UIPackage.createObject('slots', 'loading').asCom;
            this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);

            this._progressBar = this._view.getChild('n11').asProgress;

            this.onUpdateProgress();
            this.addChild(this._view);
        }

        private onProgress(progress:number):void {
            this._progress = progress;
            this.onUpdateProgress();
        }

        private onComplete():void {
            game.GameEvent.PRELOADING_PROGRESS.remove(this.onProgress, this);
            game.GameEvent.PRELOADING_COMPLETE.remove(this.onComplete, this);
        }

        private onUpdateProgress():void {
            this._progressBar.value = this._progress;
            //this._progressText.text = this._progress + "";
        }

        public dispose():void {
            game.GameEvent.PRELOADING_PROGRESS.remove(this.onProgress, this);
            game.GameEvent.PRELOADING_COMPLETE.remove(this.onComplete, this);
        }
    }
}