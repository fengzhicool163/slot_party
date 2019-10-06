/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_closeButton extends fairygui.GButton {
		public m_n2:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laha1y1q";

		public static createInstance():UI_closeButton {
			return <UI_closeButton><any>(fairygui.UIPackage.createObject("slots","closeButton"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n2 = <fairygui.GImage><any>(this.getChild("n2"));
		}
	}
}