/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_Component3 extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n33:fairygui.GImage;
		public m_n34:fairygui.GLoader;
		public m_n39:fairygui.GImage;
		public m_n40:fairygui.GImage;
		public m_n41:fairygui.GImage;

		public static URL:string = "ui://hbp5g92rs4j44";

		public static createInstance():UI_Component3 {
			return <UI_Component3><any>(fairygui.UIPackage.createObject("hud","Component3"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getControllerAt(0);
			this.m_n33 = <fairygui.GImage><any>(this.getChildAt(0));
			this.m_n34 = <fairygui.GLoader><any>(this.getChildAt(1));
			this.m_n39 = <fairygui.GImage><any>(this.getChildAt(2));
			this.m_n40 = <fairygui.GImage><any>(this.getChildAt(3));
			this.m_n41 = <fairygui.GImage><any>(this.getChildAt(4));
		}
	}
}