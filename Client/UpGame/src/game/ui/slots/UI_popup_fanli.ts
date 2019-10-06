/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup_fanli extends fairygui.GComponent {
		public m_n0:fairygui.GImage;
		public m_n41:fairygui.GImage;
		public m_frame:UI_Component16;
		public m_n42:fairygui.GTextField;
		public m_n43:fairygui.GTextField;
		public m_n44:fairygui.GImage;
		public m_n45:fairygui.GImage;
		public m_n46:fairygui.GImage;
		public m_n47:fairygui.GImage;
		public m_n49:UI_Component60;
		public m_n50:fairygui.GTextField;
		public m_n51:fairygui.GTextField;
		public m_n52:fairygui.GTextField;
		public m_n54:fairygui.GTextField;
		public m_n55:fairygui.GTextField;
		public m_n56:fairygui.GTextField;
		public m_n57:fairygui.GTextField;
		public m_n59:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3laf0uhk79";

		public static createInstance():UI_popup_fanli {
			return <UI_popup_fanli><any>(fairygui.UIPackage.createObject("slots","popup_fanli"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n0 = <fairygui.GImage><any>(this.getChild("n0"));
			this.m_n41 = <fairygui.GImage><any>(this.getChild("n41"));
			this.m_frame = <UI_Component16><any>(this.getChild("frame"));
			this.m_n42 = <fairygui.GTextField><any>(this.getChild("n42"));
			this.m_n43 = <fairygui.GTextField><any>(this.getChild("n43"));
			this.m_n44 = <fairygui.GImage><any>(this.getChild("n44"));
			this.m_n45 = <fairygui.GImage><any>(this.getChild("n45"));
			this.m_n46 = <fairygui.GImage><any>(this.getChild("n46"));
			this.m_n47 = <fairygui.GImage><any>(this.getChild("n47"));
			this.m_n49 = <UI_Component60><any>(this.getChild("n49"));
			this.m_n50 = <fairygui.GTextField><any>(this.getChild("n50"));
			this.m_n51 = <fairygui.GTextField><any>(this.getChild("n51"));
			this.m_n52 = <fairygui.GTextField><any>(this.getChild("n52"));
			this.m_n54 = <fairygui.GTextField><any>(this.getChild("n54"));
			this.m_n55 = <fairygui.GTextField><any>(this.getChild("n55"));
			this.m_n56 = <fairygui.GTextField><any>(this.getChild("n56"));
			this.m_n57 = <fairygui.GTextField><any>(this.getChild("n57"));
			this.m_n59 = <fairygui.GTextField><any>(this.getChild("n59"));
		}
	}
}