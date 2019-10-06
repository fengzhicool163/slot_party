/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component55 extends fairygui.GButton {
		public m_n37:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laynemk74";

		public static createInstance():UI_Component55 {
			return <UI_Component55><any>(fairygui.UIPackage.createObject("slots","Component55"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n37 = <fairygui.GImage><any>(this.getChild("n37"));
		}
	}
}