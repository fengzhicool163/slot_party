/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component59 extends fairygui.GComponent {
		public m_n7:fairygui.GImage;
		public m_n35:fairygui.GComponent;

		public static URL:string = "ui://3ly9g3laspdsk8f";

		public static createInstance():UI_Component59 {
			return <UI_Component59><any>(fairygui.UIPackage.createObject("slots","Component59"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n7 = <fairygui.GImage><any>(this.getChild("n7"));
			this.m_n35 = <fairygui.GComponent><any>(this.getChild("n35"));
		}
	}
}