/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component8 extends fairygui.GButton {
		public m_c1:fairygui.Controller;
		public m_n193:fairygui.GImage;
		public m_n194:fairygui.GTextField;
		public m_n195:fairygui.GImage;
		public m_dianjitexiao :fairygui.GGraph;
		public m_tishi :fairygui.GGraph;

		public static URL:string = "ui://3ly9g3laj3bpka4";

		public static createInstance():UI_Component8 {
			return <UI_Component8><any>(fairygui.UIPackage.createObject("slots","Component8"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n193 = <fairygui.GImage><any>(this.getChild("n193"));
			this.m_n194 = <fairygui.GTextField><any>(this.getChild("n194"));
			this.m_n195 = <fairygui.GImage><any>(this.getChild("n195"));
			this.m_dianjitexiao  = <fairygui.GGraph><any>(this.getChild("dianjitexiao "));
			this.m_tishi  = <fairygui.GGraph><any>(this.getChild("tishi "));
		}
	}
}