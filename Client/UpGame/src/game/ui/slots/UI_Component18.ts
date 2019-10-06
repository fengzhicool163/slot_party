/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component18 extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_n192:UI_Component11;
		public m_n193:UI_Component9;
		public m_n194:UI_Component17;
		public m_n195:UI_Component8;
		public m_n207:fairygui.GImage;
		public m_n201:fairygui.GImage;
		public m_n203:fairygui.GTextField;
		public m_jinxingzhong:fairygui.GGraph;

		public static URL:string = "ui://3ly9g3laj3bpkal";

		public static createInstance():UI_Component18 {
			return <UI_Component18><any>(fairygui.UIPackage.createObject("slots","Component18"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_n192 = <UI_Component11><any>(this.getChild("n192"));
			this.m_n193 = <UI_Component9><any>(this.getChild("n193"));
			this.m_n194 = <UI_Component17><any>(this.getChild("n194"));
			this.m_n195 = <UI_Component8><any>(this.getChild("n195"));
			this.m_n207 = <fairygui.GImage><any>(this.getChild("n207"));
			this.m_n201 = <fairygui.GImage><any>(this.getChild("n201"));
			this.m_n203 = <fairygui.GTextField><any>(this.getChild("n203"));
			this.m_jinxingzhong = <fairygui.GGraph><any>(this.getChild("jinxingzhong"));
		}
	}
}