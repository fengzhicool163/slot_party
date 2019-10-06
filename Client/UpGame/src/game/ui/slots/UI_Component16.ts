/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component16 extends fairygui.GComponent {
		public m_closeButton:UI_closeButton;

		public static URL:string = "ui://3ly9g3la1077k23";

		public static createInstance():UI_Component16 {
			return <UI_Component16><any>(fairygui.UIPackage.createObject("slots","Component16"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_closeButton = <UI_closeButton><any>(this.getChild("closeButton"));
		}
	}
}