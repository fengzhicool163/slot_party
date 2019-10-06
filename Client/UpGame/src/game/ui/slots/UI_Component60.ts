/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component60 extends fairygui.GButton {
		public m_c1:fairygui.Controller;
		public m_n5:fairygui.GImage;
		public m_n8:fairygui.GImage;
		public m_title:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3lahicck7w";

		public static createInstance():UI_Component60 {
			return <UI_Component60><any>(fairygui.UIPackage.createObject("slots","Component60"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n5 = <fairygui.GImage><any>(this.getChild("n5"));
			this.m_n8 = <fairygui.GImage><any>(this.getChild("n8"));
			this.m_title = <fairygui.GTextField><any>(this.getChild("title"));
		}
	}
}