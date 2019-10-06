/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_500ubtn extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n77:fairygui.GImage;
		public m_n94:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laaxfsk8r";

		public static createInstance():UI_500ubtn {
			return <UI_500ubtn><any>(fairygui.UIPackage.createObject("slots","500ubtn"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n77 = <fairygui.GImage><any>(this.getChild("n77"));
			this.m_n94 = <fairygui.GImage><any>(this.getChild("n94"));
		}
	}
}