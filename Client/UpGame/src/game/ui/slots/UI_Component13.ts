/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component13 extends fairygui.GButton {
		public m_n5:fairygui.GImage;
		public m_title:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3laha1y1x";

		public static createInstance():UI_Component13 {
			return <UI_Component13><any>(fairygui.UIPackage.createObject("slots","Component13"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n5 = <fairygui.GImage><any>(this.getChild("n5"));
			this.m_title = <fairygui.GTextField><any>(this.getChild("title"));
		}
	}
}