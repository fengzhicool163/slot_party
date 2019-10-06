/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component41 extends fairygui.GButton {
		public m_n129:fairygui.GImage;
		public m_n126:fairygui.GImage;
		public m_n128:fairygui.GTextField;
		public m_n130:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lar77kk5v";

		public static createInstance():UI_Component41 {
			return <UI_Component41><any>(fairygui.UIPackage.createObject("slots","Component41"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n129 = <fairygui.GImage><any>(this.getChild("n129"));
			this.m_n126 = <fairygui.GImage><any>(this.getChild("n126"));
			this.m_n128 = <fairygui.GTextField><any>(this.getChild("n128"));
			this.m_n130 = <fairygui.GImage><any>(this.getChild("n130"));
		}
	}
}