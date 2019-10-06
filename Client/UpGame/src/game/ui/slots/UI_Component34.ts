/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component34 extends fairygui.GButton {
		public m_n78:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laoh4mk4h";

		public static createInstance():UI_Component34 {
			return <UI_Component34><any>(fairygui.UIPackage.createObject("slots","Component34"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n78 = <fairygui.GImage><any>(this.getChild("n78"));
		}
	}
}