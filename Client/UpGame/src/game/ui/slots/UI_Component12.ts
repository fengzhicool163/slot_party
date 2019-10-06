/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component12 extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n12:fairygui.GImage;
		public m_n18:UI_Component3;
		public m_n19:fairygui.GTextField;
		public m_n21:fairygui.GImage;
		public m_n22:fairygui.GTextField;
		public m_n23:fairygui.GTextField;
		public m_n24:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3laha1y1t";

		public static createInstance():UI_Component12 {
			return <UI_Component12><any>(fairygui.UIPackage.createObject("slots","Component12"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n12 = <fairygui.GImage><any>(this.getChild("n12"));
			this.m_n18 = <UI_Component3><any>(this.getChild("n18"));
			this.m_n19 = <fairygui.GTextField><any>(this.getChild("n19"));
			this.m_n21 = <fairygui.GImage><any>(this.getChild("n21"));
			this.m_n22 = <fairygui.GTextField><any>(this.getChild("n22"));
			this.m_n23 = <fairygui.GTextField><any>(this.getChild("n23"));
			this.m_n24 = <fairygui.GTextField><any>(this.getChild("n24"));
		}
	}
}