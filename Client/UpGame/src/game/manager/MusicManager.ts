/**
 * Created by adminuser on 16/6/12.
 */
module game {
    export class MusicManager {
        private static ins: MusicManager;
        public static get Ins(): MusicManager {
            if(this.ins == null) this.ins = new MusicManager();
            return this.ins;
        }

        public static HOME_MUSIC:string = "bjyinyue_mp3";

        private backgroundMusic:egret.Sound;
        private backgroundMusicChannel:egret.SoundChannel;
        private backgroundMusicName:string;

        private _musicIndex:number = 0;  //1是关，0是开
        private _effectIndex:number = 0; //1是关，0是开
        public static isOpenMusic:boolean = true;

        public constructor() {
            //MusicManager.isOpenMusic = true;
            if (model.FeatureSupport.isSupport(model.FeatureSupport.MUSIC)) {
                MusicManager.isOpenMusic = true;
            } else {
                MusicManager.isOpenMusic = false;
            }
        }

        public play(name,isLoop?:boolean):egret.SoundChannel {
            if(!MusicManager.isOpenMusic) return;
            if (this._effectIndex == 1) return;
            // console.log('play effect: ', name);
            var sound:egret.Sound = RES.getRes(name);
            if (sound) {
                // console.log('play effect exist: ', name);
                var soundChannel:egret.SoundChannel = sound.play(0,isLoop? 0 :1);
                return soundChannel;
            } else {
                // console.log('play effect not exist: ', name);
                //如果没有这个音效，则临时加载它，那么下次需要播放的时候，就能听见声音了
                RES.getResAsync(name, function() {}, this);
            }
        }

        public set musicIndex(value){
            this._musicIndex = value;
            if(this._musicIndex == 1){
                this.pauseMusic();
            }else{
                this.replayMusic()
            }
        }

        public get musicIndex(){
            return this._musicIndex;
        }

        public get effectIndex(){
            return this._effectIndex;
        }

        public set effectIndex(value){
            this._effectIndex = value;
        }
        /*
        播放背景音乐
         */
        public playMusic(name):void{
            if(!MusicManager.isOpenMusic) return;
            // if (name == this.backgroundMusicName) {
            //     return;
            // }

            this.backgroundMusicName = name;

            if(this.backgroundMusicChannel){
                //alert("stop:")
                this.backgroundMusicChannel.stop();
                this.backgroundMusicChannel = null;
            }
            if(this._musicIndex == 1){
                return;
            }
            this.loadResAsync(name);
        }


        private loadResAsync(musicName){
            RES.getResAsync(musicName, function(data:any, key:string) {
                if (key == this.backgroundMusicName) {
                    if(this.backgroundMusicChannel){
                        this.backgroundMusicChannel.stop();
                    }
                    this.backgroundMusic = data;
                    //alert("MusicManager.Ins.isMusicOn():" + data)
                    this.backgroundMusicChannel = this.backgroundMusic.play();
                }
            }, this);
        }
        /*
         停止播放背景音乐
         */
        public pauseMusic(){
            if(this.backgroundMusicChannel){
                //alert("stop:")
                this.backgroundMusicChannel.stop();
            }
        }

        public replayMusic(){
            if(this.backgroundMusic){
                this.pauseMusic();
                this.backgroundMusicChannel = this.backgroundMusic.play();
            }else if(this.backgroundMusicName){
                this.loadResAsync(this.backgroundMusicName);
            }else{
                this.backgroundMusicName = MusicManager.HOME_MUSIC;
                this.loadResAsync(this.backgroundMusicName);
            }
        }

        public isMusicOn():boolean {
            if (model.FeatureSupport.isSupport(model.FeatureSupport.MUSIC)) {
                // 0:on, 1:off
                var value = egret.localStorage.getItem(model.FeatureSupport.MUSIC);
                return (value != '1');
            }
            return false;
        }

        public initGameSettings():void {
            // this.initTextureScaleFactor();
            this.setMusicOn(this.isMusicOn());
            //this.setSoundOn(this.isSoundOn());
        }

        public setMusicOn(value:boolean):void {
            egret.localStorage.setItem(model.FeatureSupport.MUSIC, (value ? '0' : '1'));
            game.MusicManager.Ins.musicIndex = (value ? 0 : 1);
            game.MusicManager.Ins.effectIndex = (value ? 0 : 1);
            game.GameEvent.UPDATE_HUD_MUSIC.dispatch();
        }

        public isSoundOn():boolean {
            // if (model.FeatureSupport.isSupport(model.FeatureSupport.MUSIC)) {
            //     // 0:on, 1:off
            //     var value = egret.localStorage.getItem(GameSettingsModel.Options.SOUND);
            //     return (value != '1');
            // }
            //  return false;
            return this.isMusicOn();//暂时音效和音乐同事关闭
        }

        public setSoundOn(value:boolean):void {
            // egret.localStorage.setItem(GameSettingsModel.Options.SOUND, (value ? '0' : '1'));
            // game.MusicManager.Ins.effectIndex = (value ? 0 : 1);
            //
            // fairygui.GRoot.inst.volumeScale = model.GameSettingsModel.Ins.isSoundOn() ? 1 : 0;
            this.setMusicOn(value);
        }
    }

}
