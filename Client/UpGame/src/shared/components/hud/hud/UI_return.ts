/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_return extends fairygui.GButton {
		public m_n16:fairygui.GImage;

		public static URL:string = "ui://hbp5g92rs4j4e";

		public static createInstance():UI_return {
			return <UI_return><any>(fairygui.UIPackage.createObject("hud","return"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n16 = <fairygui.GImage><any>(this.getChildAt(0));
		}
	}
}