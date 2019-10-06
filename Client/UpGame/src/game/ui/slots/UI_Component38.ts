/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component38 extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n122:fairygui.GImage;
		public m_n123:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lawmnuk5p";

		public static createInstance():UI_Component38 {
			return <UI_Component38><any>(fairygui.UIPackage.createObject("slots","Component38"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n122 = <fairygui.GImage><any>(this.getChild("n122"));
			this.m_n123 = <fairygui.GImage><any>(this.getChild("n123"));
		}
	}
}