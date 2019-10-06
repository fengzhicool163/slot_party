/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component50 extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n67:fairygui.GImage;
		public m_n68:fairygui.GImage;
		public m_title:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3lapd9ik6h";

		public static createInstance():UI_Component50 {
			return <UI_Component50><any>(fairygui.UIPackage.createObject("slots","Component50"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n67 = <fairygui.GImage><any>(this.getChild("n67"));
			this.m_n68 = <fairygui.GImage><any>(this.getChild("n68"));
			this.m_title = <fairygui.GTextField><any>(this.getChild("title"));
		}
	}
}