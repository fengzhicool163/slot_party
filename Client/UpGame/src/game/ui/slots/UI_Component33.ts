/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component33 extends fairygui.GButton {
		public m_c1:fairygui.Controller;
		public m_n12:UI_Component34;
		public m_n13:UI_Component35;
		public m_jiantou:fairygui.GGraph;
		public m_dianji:fairygui.GGraph;

		public static URL:string = "ui://3ly9g3laoh4mk4g";

		public static createInstance():UI_Component33 {
			return <UI_Component33><any>(fairygui.UIPackage.createObject("slots","Component33"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n12 = <UI_Component34><any>(this.getChild("n12"));
			this.m_n13 = <UI_Component35><any>(this.getChild("n13"));
			this.m_jiantou = <fairygui.GGraph><any>(this.getChild("jiantou"));
			this.m_dianji = <fairygui.GGraph><any>(this.getChild("dianji"));
		}
	}
}