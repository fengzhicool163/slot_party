/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component10 extends fairygui.GComponent {
		public m_n34:UI_Component3;

		public static URL:string = "ui://3ly9g3lazvj1k27";

		public static createInstance():UI_Component10 {
			return <UI_Component10><any>(fairygui.UIPackage.createObject("slots","Component10"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n34 = <UI_Component3><any>(this.getChild("n34"));
		}
	}
}