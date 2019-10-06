/**
 * Created by liangrui on 23/12/2016.
 */

module model {

    export class UpSDKModel {

        private static _ins: UpSDKModel;

        public static get Ins(): UpSDKModel {
            if (!this._ins) this._ins = new model.UpSDKModel();
            return this._ins;
        }

        private _upSDK:any;
        private _upProtoParser:any;
        private _uid:string;
        private _userToken:string;
        private _profile:any;

        public constructor() {
            this._upSDK = window  && window['UpSDK'];
            this._upProtoParser = window  && window['UpliveProto'];
        }

        public getProtoParser():any {
            return this._upProtoParser;
        }

        public reqGetUserInfo(callback?:Function, context?:any):void {
            var self = this;
            this._uid = PPGame.urlParams['userId'] || "1004186";
            // 本地调试只能写死一个用户id进行调试
            if (PPGame.isLocalhost) {
                // 梁睿的uid
                // self._uid = '5010497';
                // self._userToken = '61cgvcvbc0c5a3L1ST';
                // 大超
                // self._uid = '3000083';
                // self._userToken = '61cb1xjb880450CaSR';
                // 秀蛾
                self._uid = '5010499';
                self._userToken = '61d1EJf42382abL1SV';
                // 大超第2个号
                // self._uid = '1004186';
                // self._userToken = '61cQ7P052d0e964DEY';

                if (PPGame.urlParams['env'] == 'prodstage') {
                    // 侯帅的号
                    self._uid = '5238543';
                    self._userToken = '61ciFQd3d489e9Lymd';
                }
            } else {
                // this._upSDK.getConfigs({
                //     invalid: 1, // 0：usertoken失效；1: 第一次获取usertoken
                //     complete: function(opt) {
                //         // 返回当前用户信息
                //         // opt = {language: 'zh-CN', uid: '1000100', usertoken: '61cMxXgc7aeb024CAe'}
                //         if (opt) {
                //             self._uid = opt.uid;
                //             self._userToken = opt.usertoken;
                //             alert(self._userToken)
                //         }
                //         if (self._uid && self._userToken) {
                //             if (callback) callback.apply(context);
                //         } else {
                //             ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                //                 content: game.Tools.lang('用戶信息獲取失敗')
                //             });
                //         }
                //     }
                // });


            }
            var obj:any = {};
            this._profile = {}
            obj.uid = this._uid;
            obj.userToken = this._userToken;
            obj.username = this._profile.username;
            obj.upliveCode = this._profile.upliveCode || '';
            obj.avatar = this._profile.avatar || '';
            obj.gender = this._profile.gender || 0;
            obj.grade = this._profile.grade || 0;

            model.UserModel.Ins.userProfile = obj;
            if (callback) callback.apply(context);
        }

        public goPay():void {
            PPGame.Ins.trackEvent(PPTrackEvent.PAY, PPPayStep.REQUEST_PAY);
            this._upSDK.gopay({
                complete: function (result) {
                    if (result && result.success == 1) {
                        model.UserModel.Ins.deliveryDiamond();
                    }
                }
            });
        }

        public reqGetUserProfile(callback?:Function, context?:any):void {
            // if (DEBUG) {
            //     model.UserModel.Ins.userProfile = {
            //         uid: '123', 
            //         userToken: 'abcdefg',
            //         username: 'dubidu',
            //         upliveCode: '123',
            //         avatar: '',
            //         gender: 1,
            //         grade: 2,
            //         diamond: 500
            //     };

            //     if (callback) callback.apply(context);
            //     return;
            // }
            var cfg = {
                service: 'service',
                api: '/profile/get',
                header: {
                    userToken: this._userToken
                }
            };
            var data = {
                vuid: this._uid
            };
            var businessData = new this._upProtoParser.Profile.Get.Request(data);
            var url = PPGame.ENV.UPLIVE_PROTO_URL;
            var router = '?' + window['$'].param(cfg);
            var isHideLoading = false;
            var isProtobuf = true;
            var self = this;
            //alert("请求getUserProfile:" + router)
            GeneralServerRequest.req(router, businessData, {
                context: self,
                onSuccess: function(result:any):void {
                    var data:any = self._upProtoParser.Profile.Get.Response.decode(result);
                    console.log('profile', data);

                    self._profile = data && data.profile;

                    var obj:any = {};
                    obj.uid = this._uid;
                    obj.userToken = this._userToken;
                    obj.username = this._profile.username;
                    obj.upliveCode = this._profile.upliveCode || '';
                    obj.avatar = this._profile.avatar || '';
                    obj.gender = this._profile.gender || 0;
                    obj.grade = this._profile.grade || 0;

                    var diamond:number = 0;
                    if (this._profile && this._profile.balance && this._profile.balance.diamond) {
                        diamond = window['longToString'] && window['longToString'](this._profile.balance.diamond);
                    }
                    obj.diamond = parseInt(diamond + "") || 0;
                    //alert("请求getUserProfileSucess")
                    //alert("请求getUserProfileSucess" + obj.diamond)
                    model.UserModel.Ins.userProfile = obj;

                    if (callback) callback.apply(context);
                },
                onFail: function(result:any, errorCode:number):void {
                    ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                        content: game.Tools.lang('用戶信息獲取失敗')
                    });
                }
            }, url, isHideLoading, isProtobuf);
        }
    }
}