/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component57 extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n83:fairygui.GImage;
		public m_n70:UI_Component10;
		public m_n75:fairygui.GTextField;
		public m_n76:fairygui.GTextField;
		public m_n77:fairygui.GTextField;
		public m_n78:fairygui.GImage;
		public m_n79:fairygui.GImage;
		public m_n80:fairygui.GImage;
		public m_n82:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3lapnntk7z";

		public static createInstance():UI_Component57 {
			return <UI_Component57><any>(fairygui.UIPackage.createObject("slots","Component57"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n83 = <fairygui.GImage><any>(this.getChild("n83"));
			this.m_n70 = <UI_Component10><any>(this.getChild("n70"));
			this.m_n75 = <fairygui.GTextField><any>(this.getChild("n75"));
			this.m_n76 = <fairygui.GTextField><any>(this.getChild("n76"));
			this.m_n77 = <fairygui.GTextField><any>(this.getChild("n77"));
			this.m_n78 = <fairygui.GImage><any>(this.getChild("n78"));
			this.m_n79 = <fairygui.GImage><any>(this.getChild("n79"));
			this.m_n80 = <fairygui.GImage><any>(this.getChild("n80"));
			this.m_n82 = <fairygui.GTextField><any>(this.getChild("n82"));
		}
	}
}