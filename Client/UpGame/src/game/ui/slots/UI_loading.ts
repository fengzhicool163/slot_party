/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_loading extends fairygui.GComponent {
		public m_n11:UI_progress_bar;
		public m_n12:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laq6lnk2s";

		public static createInstance():UI_loading {
			return <UI_loading><any>(fairygui.UIPackage.createObject("slots","loading"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n11 = <UI_progress_bar><any>(this.getChild("n11"));
			this.m_n12 = <fairygui.GImage><any>(this.getChild("n12"));
		}
	}
}