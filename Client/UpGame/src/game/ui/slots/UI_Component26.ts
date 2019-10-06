/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component26 extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n51:fairygui.GImage;
		public m_n52:fairygui.GImage;
		public m_n54:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3laq6lnk32";

		public static createInstance():UI_Component26 {
			return <UI_Component26><any>(fairygui.UIPackage.createObject("slots","Component26"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n51 = <fairygui.GImage><any>(this.getChild("n51"));
			this.m_n52 = <fairygui.GImage><any>(this.getChild("n52"));
			this.m_n54 = <fairygui.GTextField><any>(this.getChild("n54"));
		}
	}
}