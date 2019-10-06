/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_Component5 extends fairygui.GButton {
		public m_n36:fairygui.GImage;

		public static URL:string = "ui://hbp5g92rs4j49";

		public static createInstance():UI_Component5 {
			return <UI_Component5><any>(fairygui.UIPackage.createObject("hud","Component5"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n36 = <fairygui.GImage><any>(this.getChildAt(0));
		}
	}
}