/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component67 extends fairygui.GComponent {
		public m_n2:fairygui.GImage;
		public m_n28:fairygui.GImage;
		public m_n31:fairygui.GImage;
		public m_n29:fairygui.GImage;
		public m_n24:fairygui.GImage;
		public m_n25:fairygui.GImage;
		public m_n26:fairygui.GImage;
		public m_n27:fairygui.GImage;
		public m_n30:fairygui.GTextField;
		public m_n32:fairygui.GTextField;
		public m_n33:fairygui.GTextField;
		public m_n34:fairygui.GTextField;
		public m_n35:fairygui.GTextField;
		public m_xiazhu_jpg:fairygui.GLoader;
		public m_shouji_jpg:fairygui.GLoader;

		public static URL:string = "ui://3ly9g3latm0akci";

		public static createInstance():UI_Component67 {
			return <UI_Component67><any>(fairygui.UIPackage.createObject("slots","Component67"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n2 = <fairygui.GImage><any>(this.getChild("n2"));
			this.m_n28 = <fairygui.GImage><any>(this.getChild("n28"));
			this.m_n31 = <fairygui.GImage><any>(this.getChild("n31"));
			this.m_n29 = <fairygui.GImage><any>(this.getChild("n29"));
			this.m_n24 = <fairygui.GImage><any>(this.getChild("n24"));
			this.m_n25 = <fairygui.GImage><any>(this.getChild("n25"));
			this.m_n26 = <fairygui.GImage><any>(this.getChild("n26"));
			this.m_n27 = <fairygui.GImage><any>(this.getChild("n27"));
			this.m_n30 = <fairygui.GTextField><any>(this.getChild("n30"));
			this.m_n32 = <fairygui.GTextField><any>(this.getChild("n32"));
			this.m_n33 = <fairygui.GTextField><any>(this.getChild("n33"));
			this.m_n34 = <fairygui.GTextField><any>(this.getChild("n34"));
			this.m_n35 = <fairygui.GTextField><any>(this.getChild("n35"));
			this.m_xiazhu_jpg = <fairygui.GLoader><any>(this.getChild("xiazhu_jpg"));
			this.m_shouji_jpg = <fairygui.GLoader><any>(this.getChild("shouji_jpg"));
		}
	}
}