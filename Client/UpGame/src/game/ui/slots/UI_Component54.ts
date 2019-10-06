/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component54 extends fairygui.GButton {
		public m_n34:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laynemk73";

		public static createInstance():UI_Component54 {
			return <UI_Component54><any>(fairygui.UIPackage.createObject("slots","Component54"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n34 = <fairygui.GImage><any>(this.getChild("n34"));
		}
	}
}