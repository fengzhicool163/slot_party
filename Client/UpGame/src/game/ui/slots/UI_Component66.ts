/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component66 extends fairygui.GComponent {
		public m_n2:fairygui.GImage;
		public m_n17:fairygui.GTextField;
		public m_jietu3_jpg:fairygui.GLoader;
		public m_jietu4_jpg:fairygui.GLoader;
		public m_n23:fairygui.GTextField;

		public static URL:string = "ui://3ly9g3latm0akch";

		public static createInstance():UI_Component66 {
			return <UI_Component66><any>(fairygui.UIPackage.createObject("slots","Component66"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n2 = <fairygui.GImage><any>(this.getChild("n2"));
			this.m_n17 = <fairygui.GTextField><any>(this.getChild("n17"));
			this.m_jietu3_jpg = <fairygui.GLoader><any>(this.getChild("jietu3_jpg"));
			this.m_jietu4_jpg = <fairygui.GLoader><any>(this.getChild("jietu4_jpg"));
			this.m_n23 = <fairygui.GTextField><any>(this.getChild("n23"));
		}
	}
}