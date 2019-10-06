/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component64 extends fairygui.GComponent {
		public m_n190:fairygui.GImage;
		public m_n191:fairygui.GTextField;
		public m_n192:fairygui.GImage;
		public m_n193:fairygui.GImage;
		public m_n194:fairygui.GTextField;
		public m_n195:fairygui.GImage;

		public static URL:string = "ui://3ly9g3lasph8kbt";

		public static createInstance():UI_Component64 {
			return <UI_Component64><any>(fairygui.UIPackage.createObject("slots","Component64"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n190 = <fairygui.GImage><any>(this.getChild("n190"));
			this.m_n191 = <fairygui.GTextField><any>(this.getChild("n191"));
			this.m_n192 = <fairygui.GImage><any>(this.getChild("n192"));
			this.m_n193 = <fairygui.GImage><any>(this.getChild("n193"));
			this.m_n194 = <fairygui.GTextField><any>(this.getChild("n194"));
			this.m_n195 = <fairygui.GImage><any>(this.getChild("n195"));
		}
	}
}