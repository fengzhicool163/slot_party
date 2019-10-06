/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup_rank extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n0:fairygui.GImage;
		public m_n60:fairygui.GImage;
		public m_n1:fairygui.GImage;
		public m_n75:fairygui.GImage;
		public m_frame:UI_Component16;
		public m_n4:fairygui.GImage;
		public m_n5:fairygui.GTextField;
		public m_n58:fairygui.GTextField;
		public m_n70:UI_Component50;
		public m_n72:UI_Component50;
		public m_n73:UI_Component51;
		public m_n74:UI_Component51;
		public m_n76:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3laha1y1f";

		public static createInstance():UI_popup_rank {
			return <UI_popup_rank><any>(fairygui.UIPackage.createObject("slots","popup_rank"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n0 = <fairygui.GImage><any>(this.getChild("n0"));
			this.m_n60 = <fairygui.GImage><any>(this.getChild("n60"));
			this.m_n1 = <fairygui.GImage><any>(this.getChild("n1"));
			this.m_n75 = <fairygui.GImage><any>(this.getChild("n75"));
			this.m_frame = <UI_Component16><any>(this.getChild("frame"));
			this.m_n4 = <fairygui.GImage><any>(this.getChild("n4"));
			this.m_n5 = <fairygui.GTextField><any>(this.getChild("n5"));
			this.m_n58 = <fairygui.GTextField><any>(this.getChild("n58"));
			this.m_n70 = <UI_Component50><any>(this.getChild("n70"));
			this.m_n72 = <UI_Component50><any>(this.getChild("n72"));
			this.m_n73 = <UI_Component51><any>(this.getChild("n73"));
			this.m_n74 = <UI_Component51><any>(this.getChild("n74"));
			this.m_n76 = <fairygui.GTextField><any>(this.getChild("n76"));
		}
	}
}