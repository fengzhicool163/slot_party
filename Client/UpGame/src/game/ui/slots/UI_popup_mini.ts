/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup_mini extends fairygui.GComponent {
		public m_n0:fairygui.GImage;
		public m_n2:fairygui.GImage;
		public m_n3:fairygui.GTextField;
		public m_n4:fairygui.GImage;
		public m_n7:UI_Component13;

		public static URL:string = "ui://3ly9g3laha1y1u";

		public static createInstance():UI_popup_mini {
			return <UI_popup_mini><any>(fairygui.UIPackage.createObject("slots","popup_mini"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n0 = <fairygui.GImage><any>(this.getChild("n0"));
			this.m_n2 = <fairygui.GImage><any>(this.getChild("n2"));
			this.m_n3 = <fairygui.GTextField><any>(this.getChild("n3"));
			this.m_n4 = <fairygui.GImage><any>(this.getChild("n4"));
			this.m_n7 = <UI_Component13><any>(this.getChild("n7"));
		}
	}
}