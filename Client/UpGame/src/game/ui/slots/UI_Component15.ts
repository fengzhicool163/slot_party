/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component15 extends fairygui.GButton {
		public m_n103:fairygui.GImage;
		public m_n104:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3lawmnuk5k";

		public static createInstance():UI_Component15 {
			return <UI_Component15><any>(fairygui.UIPackage.createObject("slots","Component15"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n103 = <fairygui.GImage><any>(this.getChild("n103"));
			this.m_n104 = <fairygui.GTextField><any>(this.getChild("n104"));
		}
	}
}