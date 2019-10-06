/**
 * Created by huangqingfeng on 16/7/20.
 */
module ui {

    export class FGUIExtension {

        public static init():void {
            fairygui.UIObjectFactory.setLoaderExtension(ui.MyGLoader);

            // var p:any = fairygui.GTextField.prototype;
            // __define(p, 'stroke', function (){}, function (){});

            this.hackAS();
            this.hackResize();
            this.initComponentExtensions();
            this.addLocalizationFunctionality();
            this.addSoundForButton();
        }

        public static hackAS():void {
            var p:any = fairygui.GObject.prototype;
            p.asCom = function () {return this;};
            p.asButton = function () {return this;};
            p.asLabel = function () {return this;};
            p.asProgress = function () {return this;};
            p.asTextField = function () {return this;};
            p.asRichTextField = function () {return this;};
            p.asTextInput = function () {return this;};
            p.asLoader = function () {return this;};
            p.asList = function () {return this;};
            p.asGraph = function () {return this;};
            p.asGroup = function () {return this;};
            p.asSlider = function () {return this;};
            p.asComboBox = function () {return this;};
            p.asImage = function () {return this;};
            p.asMovieClip = function () {return this;};
        }

        public static hackResize():void {
            // 用来支持页面缩放
            var p:any = fairygui.GRoot.prototype;
            p.__winResize = function (evt) {
                ui.UILayer.Ins.resizeWin();
                
                this.setSize(UILayer.ACTUAL_WIDTH, UILayer.ACTUAL_HEIGHT);
                console.log("GRoot __winResize", this.width, this.height);
            };
            p = fairygui.GObject.prototype;
            p.handleGrayedChanged = function () {};
            __define(p, 'filters',
                function () {
                    return [];
                }, 
                function (value) {
                    
                }
            );
        }

        public static addLocalizationFunctionality():void {
            // 在构造Component的时候,就把字符串替换掉
            // var p:any = fairygui.GComponent.prototype;
            // p.constructFromResource = function (pkgItem) {
            //     this._packageItem = pkgItem;
            //     var xml = this._packageItem.owner.getItemAsset(this._packageItem);
            //     var prefix = this._packageItem.owner.id + this._packageItem.id;
            //     // var t = getTimer();
            //     var translatedXML = ui.FGUIExtension.translateComponent(xml, prefix);
            //     // console.log('translate spent: ', getTimer() - t, 'ms');
            //     this.constructFromXML(translatedXML);
            // };

            var originalGetByName = fairygui.UIPackage.getByName;
            fairygui.UIPackage.getByName = function (n:string):any {
                var t = FGUIExtension.getLocaleName(n);
                if (t != n) {
                    console.log('[FGUI]', 'mapping', n, t);
                }
                return originalGetByName(t);
            };

            var originalCreate = fairygui.UIPackage.createObject;
            fairygui.UIPackage.createObject = function (pkgName:string, resName:string, userClass?:any):fairygui.GObject {
                pkgName = FGUIExtension.getLocaleName(pkgName);
                return originalCreate(pkgName, resName, userClass);
            };

            // textfiled 
            var p = fairygui.GTextField.prototype;
            var originalTextFieldUpdateText:Function = p['updateTextFieldText'];
            p['updateTextFieldText'] = function ():void {
                var temp = this._text;
                this._text = game.Tools.lang(this._text);
                originalTextFieldUpdateText.call(this);
            };
            // var originalBeforeAdd:Function = p['setup_beforeAdd'];
            // p['setup_beforeAdd'] = function (xml:any):void {
            //     originalBeforeAdd.call(this, xml);
            //     if (model.LocaleModel.Ins.locale == model.LocaleModel.en_US && this._font.indexOf('ui://') != 0) {
            //         this._font = ui.UIUtils.NATIVE_FONT_EN_US;
            //     }
            // }
            p = fairygui.GRichTextField.prototype;
            var originalRichTextFieldSetText = Object.getOwnPropertyDescriptor(p, 'text').set;
            __define(p, 'text',  function () {
                    return this._text;
                },
                function (value) {
                    value = game.Tools.lang(value);
                    originalRichTextFieldSetText.call(this, value);
                }
            );
            p = fairygui.GTextInput.prototype;
            var originalTextInputUpdateText:Function = p['updateTextFieldText'];
            p['updateTextFieldText'] = function ():void {
                if (!!this._promptText && this._promptText.length > 0) {
                    this._promptText = game.Tools.lang(this._promptText);
                }
                if (!!this._text && this._text.length > 0) {
                    this._text = this._text.trim();
                    this._text = game.Tools.lang(this._text);
                }
                originalTextInputUpdateText.call(this);
            };
        }

        private static getLocaleName(pName:string):string {
            var locale = model.LocaleModel.Ins.locale;
            if (locale != model.LocaleModel.DEFAULT_LOCALE) {
                var localeName:string = pName + '_' + locale;
                if (RES.hasRes(localeName))
                    pName = localeName;
            }
            return pName;
        }

        public static initComponentExtensions():void {
            fairygui.UIObjectFactory.setLoaderExtension(ui.MyGLoader);

            var addPackage:Function = fairygui.UIPackage.addPackage;
            fairygui.UIPackage.addPackage = function (res:string):fairygui.UIPackage {
                var pack:fairygui.UIPackage = addPackage(res);
                var str:string;
                if (res == 'general') {
                    // 扩展
                    // str = fairygui.UIPackage.getItemURL('general', 'hero_box');
                    // fairygui.UIObjectFactory.setPackageItemExtension(str, ui.UISoldier);
                    // str = fairygui.UIPackage.getItemURL('general', 'item_card_box');
                    // fairygui.UIObjectFactory.setPackageItemExtension(str, ui.RewardItem);
                    // str = fairygui.UIPackage.getItemURL('general', 'return');
                    // fairygui.UIObjectFactory.setPackageItemExtension(str, ui.ReturnButton);
                    //
                    // var loading:string = fairygui.UIPackage.getItemURL('general', 'loading24');
                    // fairygui.UIConfig.globalModalWaiting = loading;
                    // fairygui.UIObjectFactory.setPackageItemExtension(loading, ScreenLocker);
                }
                return pack;
            }
        }

        public static addSoundForButton():void {
            var __click:Function = fairygui.GButton.prototype['__click'];
            fairygui.GButton.prototype['__click'] = function ():void {
                game.MusicManager.Ins.play('dianjianniu_mp3');

                __click.call(this);
            }
        }

    }

}