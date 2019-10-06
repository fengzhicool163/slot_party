/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component56 extends fairygui.GButton {
		public m_n41:fairygui.GImage;
		public m_n42:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3laf0uhk77";

		public static createInstance():UI_Component56 {
			return <UI_Component56><any>(fairygui.UIPackage.createObject("slots","Component56"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n41 = <fairygui.GImage><any>(this.getChild("n41"));
			this.m_n42 = <fairygui.GTextField><any>(this.getChild("n42"));
		}
	}
}