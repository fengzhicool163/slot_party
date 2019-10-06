/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module components.hud {

	export class UI_Component110 extends fairygui.GButton {
		public m_c1:fairygui.Controller;
		public m_n14:fairygui.GImage;
		public m_n22:fairygui.GMovieClip;
		public m_n21:UI_Component582;
		public m_n17:fairygui.GImage;
		public m_t1:fairygui.Transition;

		public static URL:string = "ui://hbp5g92rs4j4g";

		public static createInstance():UI_Component110 {
			return <UI_Component110><any>(fairygui.UIPackage.createObject("hud","Component110"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getControllerAt(0);
			this.m_n14 = <fairygui.GImage><any>(this.getChildAt(0));
			this.m_n22 = <fairygui.GMovieClip><any>(this.getChildAt(1));
			this.m_n21 = <UI_Component582><any>(this.getChildAt(2));
			this.m_n17 = <fairygui.GImage><any>(this.getChildAt(3));
			this.m_t1 = this.getTransitionAt(0);
		}
	}
}