/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_Component582 extends fairygui.GComponent {
		public m_n18:fairygui.GImage;
		public m_n19:fairygui.GImage;
		public m_n20:fairygui.GTextField;

		public static URL:string = "ui://hbp5g92rs4j4i";

		public static createInstance():UI_Component582 {
			return <UI_Component582><any>(fairygui.UIPackage.createObject("hud","Component582"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n18 = <fairygui.GImage><any>(this.getChildAt(0));
			this.m_n19 = <fairygui.GImage><any>(this.getChildAt(1));
			this.m_n20 = <fairygui.GTextField><any>(this.getChildAt(2));
		}
	}
}