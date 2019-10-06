/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_Component27 extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n73:fairygui.GImage;
		public m_n72:fairygui.GImage;

		public static URL:string = "ui://hbp5g92rs4j4b";

		public static createInstance():UI_Component27 {
			return <UI_Component27><any>(fairygui.UIPackage.createObject("hud","Component27"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getControllerAt(0);
			this.m_n73 = <fairygui.GImage><any>(this.getChildAt(0));
			this.m_n72 = <fairygui.GImage><any>(this.getChildAt(1));
		}
	}
}