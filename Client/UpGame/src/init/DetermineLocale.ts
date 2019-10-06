/**
 * Created by liangrui on 15/11/2016.
 */

module init {

    export class DetermineLocale extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_do() {
            this.initSupportLanguages();

            // 是否需要强制指定语言
            if (PPGame.urlParams && PPGame.urlParams['locale']) {
                model.LocaleModel.Ins.locale = PPGame.urlParams['locale'];
            }

            var locale = model.LocaleModel.Ins.locale;
            if (!locale) {
                this.setToDefaultLocale();
            } else {
                this.done();
            }
        }

        protected done():void {
            console.log('determine locale:', model.LocaleModel.Ins.locale);
            super.done();
        }

        private initSupportLanguages() {
            switch (PPGame.EDITION) {
                case PPEdition.ASIA:
                    model.LocaleModel.SUPPORTED_LANGUAGES = ['zh_TW'];
                    break;
                case PPEdition.MIDDLE_EAST:
                    model.LocaleModel.SUPPORTED_LANGUAGES = ['ar'];
                    break;
            }
        }

        private setToDefaultLocale() {
            model.LocaleModel.Ins.locale = model.LocaleModel.SUPPORTED_LANGUAGES[0];
            this.done();
        }
    }
}