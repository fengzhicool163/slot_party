/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component39 extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n124:fairygui.GImage;
		public m_n125:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lawmnuk5q";

		public static createInstance():UI_Component39 {
			return <UI_Component39><any>(fairygui.UIPackage.createObject("slots","Component39"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n124 = <fairygui.GImage><any>(this.getChild("n124"));
			this.m_n125 = <fairygui.GImage><any>(this.getChild("n125"));
		}
	}
}