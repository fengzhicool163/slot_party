/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup_jiangdan extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_jiangdanjpg:fairygui.GLoader;
		public m_n67:fairygui.GTextField;
		public m_n68:fairygui.GTextField;
		public m_n69:fairygui.GTextField;
		public m_n79:fairygui.GList;
		public m_n80:fairygui.GList;
		public m_n78:fairygui.GList;
		public m_n83:fairygui.GTextField;
		public m_jiangdan_star_png:fairygui.GLoader;
		public m_n85:fairygui.GImage;
		public m_n89:UI_Component50;
		public m_n90:UI_Component50;
		public m_n103:UI_return2;

		public static URL:string = "ui://3ly9g3lapnntk7y";

		public static createInstance():UI_popup_jiangdan {
			return <UI_popup_jiangdan><any>(fairygui.UIPackage.createObject("slots","popup_jiangdan"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_jiangdanjpg = <fairygui.GLoader><any>(this.getChild("jiangdanjpg"));
			this.m_n67 = <fairygui.GTextField><any>(this.getChild("n67"));
			this.m_n68 = <fairygui.GTextField><any>(this.getChild("n68"));
			this.m_n69 = <fairygui.GTextField><any>(this.getChild("n69"));
			this.m_n79 = <fairygui.GList><any>(this.getChild("n79"));
			this.m_n80 = <fairygui.GList><any>(this.getChild("n80"));
			this.m_n78 = <fairygui.GList><any>(this.getChild("n78"));
			this.m_n83 = <fairygui.GTextField><any>(this.getChild("n83"));
			this.m_jiangdan_star_png = <fairygui.GLoader><any>(this.getChild("jiangdan_star_png"));
			this.m_n85 = <fairygui.GImage><any>(this.getChild("n85"));
			this.m_n89 = <UI_Component50><any>(this.getChild("n89"));
			this.m_n90 = <UI_Component50><any>(this.getChild("n90"));
			this.m_n103 = <UI_return2><any>(this.getChild("n103"));
		}
	}
}