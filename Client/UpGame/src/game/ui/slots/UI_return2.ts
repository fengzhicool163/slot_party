/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_return2 extends fairygui.GButton {
		public m_n16:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lafev9kcd";

		public static createInstance():UI_return2 {
			return <UI_return2><any>(fairygui.UIPackage.createObject("slots","return2"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n16 = <fairygui.GImage><any>(this.getChild("n16"));
		}
	}
}