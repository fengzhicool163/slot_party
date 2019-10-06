/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component17 extends fairygui.GButton {
		public m_c1:fairygui.Controller;
		public m_n195:fairygui.GImage;
		public m_n196:fairygui.GTextField;
		public m_n197:fairygui.GImage;
		public m_dianjitexiao :fairygui.GGraph;
		public m_tishi :fairygui.GGraph;

		public static URL:string = "ui://3ly9g3laj3bpka7";

		public static createInstance():UI_Component17 {
			return <UI_Component17><any>(fairygui.UIPackage.createObject("slots","Component17"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n195 = <fairygui.GImage><any>(this.getChild("n195"));
			this.m_n196 = <fairygui.GTextField><any>(this.getChild("n196"));
			this.m_n197 = <fairygui.GImage><any>(this.getChild("n197"));
			this.m_dianjitexiao  = <fairygui.GGraph><any>(this.getChild("dianjitexiao "));
			this.m_tishi  = <fairygui.GGraph><any>(this.getChild("tishi "));
		}
	}
}