/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component78 extends fairygui.GComponent {
		public m_n19:fairygui.GImage;
		public m_n20:fairygui.GImage;
		public m_n29:fairygui.GTextField;
		public m_n30:fairygui.GTextField;
		public m_n31:fairygui.GTextField;
		public m_n32:fairygui.GTextField;
		public m_n33:fairygui.GTextField;
		public m_n34:fairygui.GTextField;
		public m_n36:fairygui.GImage;
		public m_n38:fairygui.GTextField;
		public m_n39:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3las8lpkcb";

		public static createInstance():UI_Component78 {
			return <UI_Component78><any>(fairygui.UIPackage.createObject("slots","Component78"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n19 = <fairygui.GImage><any>(this.getChild("n19"));
			this.m_n20 = <fairygui.GImage><any>(this.getChild("n20"));
			this.m_n29 = <fairygui.GTextField><any>(this.getChild("n29"));
			this.m_n30 = <fairygui.GTextField><any>(this.getChild("n30"));
			this.m_n31 = <fairygui.GTextField><any>(this.getChild("n31"));
			this.m_n32 = <fairygui.GTextField><any>(this.getChild("n32"));
			this.m_n33 = <fairygui.GTextField><any>(this.getChild("n33"));
			this.m_n34 = <fairygui.GTextField><any>(this.getChild("n34"));
			this.m_n36 = <fairygui.GImage><any>(this.getChild("n36"));
			this.m_n38 = <fairygui.GTextField><any>(this.getChild("n38"));
			this.m_n39 = <fairygui.GTextField><any>(this.getChild("n39"));
		}
	}
}