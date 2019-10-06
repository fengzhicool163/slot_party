/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup_rule extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n0:fairygui.GImage;
		public m_n8:fairygui.GImage;
		public m_frame:UI_Component16;
		public m_n3:fairygui.GTextField;
		public m_n18:UI_Component43;
		public m_n32:UI_Component52;
		public m_n36:fairygui.GImage;
		public m_n35:UI_Component54;
		public m_n30:fairygui.GTextField;
		public m_n38:UI_Component55;
		public m_n39:UI_Component65;
		public m_n40:UI_Component66;
		public m_n41:UI_Component67;

		public static URL:string = "ui://3ly9g3laohmyk66";

		public static createInstance():UI_popup_rule {
			return <UI_popup_rule><any>(fairygui.UIPackage.createObject("slots","popup_rule"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n0 = <fairygui.GImage><any>(this.getChild("n0"));
			this.m_n8 = <fairygui.GImage><any>(this.getChild("n8"));
			this.m_frame = <UI_Component16><any>(this.getChild("frame"));
			this.m_n3 = <fairygui.GTextField><any>(this.getChild("n3"));
			this.m_n18 = <UI_Component43><any>(this.getChild("n18"));
			this.m_n32 = <UI_Component52><any>(this.getChild("n32"));
			this.m_n36 = <fairygui.GImage><any>(this.getChild("n36"));
			this.m_n35 = <UI_Component54><any>(this.getChild("n35"));
			this.m_n30 = <fairygui.GTextField><any>(this.getChild("n30"));
			this.m_n38 = <UI_Component55><any>(this.getChild("n38"));
			this.m_n39 = <UI_Component65><any>(this.getChild("n39"));
			this.m_n40 = <UI_Component66><any>(this.getChild("n40"));
			this.m_n41 = <UI_Component67><any>(this.getChild("n41"));
		}
	}
}