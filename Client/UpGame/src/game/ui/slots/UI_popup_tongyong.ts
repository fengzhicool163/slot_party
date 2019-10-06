/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup_tongyong extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n0:fairygui.GImage;
		public m_n2:fairygui.GImage;
		public m_n3:fairygui.GTextField;
		public m_n7:UI_Component13;
		public m_n8:UI_Component13;
		public m_n10:fairygui.GImage;
		public m_n9:fairygui.GTextField;
		public m_n14:fairygui.GImage;
		public m_n12:fairygui.GTextField;
		public m_n13:fairygui.GTextField;
		public m_n15:fairygui.GImage;
		public m_n11:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laq6lnk2m";

		public static createInstance():UI_popup_tongyong {
			return <UI_popup_tongyong><any>(fairygui.UIPackage.createObject("slots","popup_tongyong"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n0 = <fairygui.GImage><any>(this.getChild("n0"));
			this.m_n2 = <fairygui.GImage><any>(this.getChild("n2"));
			this.m_n3 = <fairygui.GTextField><any>(this.getChild("n3"));
			this.m_n7 = <UI_Component13><any>(this.getChild("n7"));
			this.m_n8 = <UI_Component13><any>(this.getChild("n8"));
			this.m_n10 = <fairygui.GImage><any>(this.getChild("n10"));
			this.m_n9 = <fairygui.GTextField><any>(this.getChild("n9"));
			this.m_n14 = <fairygui.GImage><any>(this.getChild("n14"));
			this.m_n12 = <fairygui.GTextField><any>(this.getChild("n12"));
			this.m_n13 = <fairygui.GTextField><any>(this.getChild("n13"));
			this.m_n15 = <fairygui.GImage><any>(this.getChild("n15"));
			this.m_n11 = <fairygui.GImage><any>(this.getChild("n11"));
		}
	}
}