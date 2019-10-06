/**
 * Created by a123 on 17-1-16.
 */
module ui{
    export class Rule extends BasePopup{
        private current:number= 0;
        public max:number = 4;
        public constructor() {
            super('slots', 'popup_rule');
        }

        public onUpdate():void{
            this.init();
        }

        private get rule():ui.slots.UI_popup_rule {
            return this.view as ui.slots.UI_popup_rule;
        }

        public init():void{
            this.view.getChild('n38').asCom.addClickListener(this.btnLeft,this);
            this.view.getChild('n35').asCom.addClickListener(this.btnRight , this);

            this.rule.getControllerAt(0).addEventListener(
                fairygui.StateChangeEvent.CHANGED,
                this.onControllerChanged,
                this);

            this.onControllerChanged();
        }

        public btnLeft():void{
            if(this.current <= 0){
                return;
            }
            this.current--;
            this.view.getController('c1').selectedIndex = this.current;
        }

        public btnRight():void{
            if(this.current>= this.max){
                return;
            }
            this.current++;
            this.view.getController('c1').selectedIndex = this.current;

        }


        private onControllerChanged():void {
            if (this.view.getControllerAt(0).selectedIndex == 2) {
                // 加载倍率玩法截图//注调
                this.rule.m_n40.m_jietu3_jpg.url = 'resource/assets/dynamic/jietu3.jpg';
                this.rule.m_n40.m_jietu4_jpg.url = 'resource/assets/dynamic/jietu4.jpg';



            }else if (this.view.getControllerAt(0).selectedIndex == 3) {
                // 加载倍率玩法截图//注调
                this.rule.m_n41.m_xiazhu_jpg.url = 'resource/assets/dynamic/xiazhu.jpg';
                this.rule.m_n41.m_shouji_jpg.url = 'resource/assets/dynamic/shouji.jpg';

            }else if (this.view.getControllerAt(0).selectedIndex == 0) {
                // 加载倍率玩法截图//注调
                this.rule.m_n18.m_xianshu1_jpg.url = 'resource/assets/dynamic/xianshu1.jpg';
                this.rule.m_n18.m_xianshu2_jpg.url = 'resource/assets/dynamic/xianshu2.jpg';
                this.rule.m_n18.m_xianshu3_jpg.url = 'resource/assets/dynamic/xianshu3.jpg';
                this.rule.m_n18.m_xianshu4_jpg.url = 'resource/assets/dynamic/xianshu4.jpg';
            }else if (this.view.getControllerAt(0).selectedIndex == 4) {
                // 加载倍率玩法截图//注调
                //this.rule.m_n49.m_jiangshi_jpg.url = 'resource/assets/dynamic/jiangshi.jpg';
                //this.rule.m_n49.m_xiazhu_jpg.url = 'resource/assets/dynamic/xiazhu.jpg';
            }else if (this.view.getControllerAt(0).selectedIndex == 1) {
                // 加载倍率玩法截图//注调
                this.rule.m_n39.m_jietu1_jpg.url = 'resource/assets/dynamic/jietu1.jpg';
                this.rule.m_n39.m_jietu2_jpg.url = 'resource/assets/dynamic/jietu2.jpg';
            }

        }

    }
}