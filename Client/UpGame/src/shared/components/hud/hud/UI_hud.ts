/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_hud extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n1:fairygui.GImage;
		public m_n34:UI_Component10;
		public m_n11:fairygui.GImage;
		public m_n3:fairygui.GImage;
		public m_n4:fairygui.GTextField;
		public m_n5:UI_Component5;
		public m_002_shuzi:fairygui.GGraph;
		public m_n9:UI_Component110;
		public m_n7:UI_Component27;
		public m_n8:UI_return;

		public static URL:string = "ui://hbp5g92rs4j40";

		public static createInstance():UI_hud {
			return <UI_hud><any>(fairygui.UIPackage.createObject("hud","hud"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getControllerAt(0);
			this.m_n1 = <fairygui.GImage><any>(this.getChildAt(0));
			this.m_n34 = <UI_Component10><any>(this.getChildAt(1));
			this.m_n11 = <fairygui.GImage><any>(this.getChildAt(2));
			this.m_n3 = <fairygui.GImage><any>(this.getChildAt(3));
			this.m_n4 = <fairygui.GTextField><any>(this.getChildAt(4));
			this.m_n5 = <UI_Component5><any>(this.getChildAt(5));
			this.m_002_shuzi = <fairygui.GGraph><any>(this.getChildAt(6));
			this.m_n9 = <UI_Component110><any>(this.getChildAt(7));
			this.m_n7 = <UI_Component27><any>(this.getChildAt(8));
			this.m_n8 = <UI_return><any>(this.getChildAt(9));
		}
	}
}