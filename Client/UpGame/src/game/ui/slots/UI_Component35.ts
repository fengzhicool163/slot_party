/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component35 extends fairygui.GButton {
		public m_n78:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laoh4mk4i";

		public static createInstance():UI_Component35 {
			return <UI_Component35><any>(fairygui.UIPackage.createObject("slots","Component35"));
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