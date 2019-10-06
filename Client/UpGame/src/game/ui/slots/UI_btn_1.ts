/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_btn_1 extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n120:fairygui.GImage;
		public m_n121:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lawmnuk5o";

		public static createInstance():UI_btn_1 {
			return <UI_btn_1><any>(fairygui.UIPackage.createObject("slots","btn_1"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n120 = <fairygui.GImage><any>(this.getChild("n120"));
			this.m_n121 = <fairygui.GImage><any>(this.getChild("n121"));
		}
	}
}