/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component3 extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n33:fairygui.GImage;
		public m_n34:fairygui.GLoader;
		public m_n39:fairygui.GImage;
		public m_n40:fairygui.GImage;
		public m_n41:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lacvhbl";

		public static createInstance():UI_Component3 {
			return <UI_Component3><any>(fairygui.UIPackage.createObject("slots","Component3"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n33 = <fairygui.GImage><any>(this.getChild("n33"));
			this.m_n34 = <fairygui.GLoader><any>(this.getChild("n34"));
			this.m_n39 = <fairygui.GImage><any>(this.getChild("n39"));
			this.m_n40 = <fairygui.GImage><any>(this.getChild("n40"));
			this.m_n41 = <fairygui.GImage><any>(this.getChild("n41"));
		}
	}
}