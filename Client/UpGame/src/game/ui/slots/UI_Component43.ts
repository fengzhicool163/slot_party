/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component43 extends fairygui.GComponent {
		public m_n2:fairygui.GImage;
		public m_n17:fairygui.GTextField;
		public m_xianshu1_jpg:fairygui.GLoader;
		public m_xianshu2_jpg:fairygui.GLoader;
		public m_xianshu3_jpg:fairygui.GLoader;
		public m_xianshu4_jpg:fairygui.GLoader;

		public static URL:string = "ui://3ly9g3laohmyk68";

		public static createInstance():UI_Component43 {
			return <UI_Component43><any>(fairygui.UIPackage.createObject("slots","Component43"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n2 = <fairygui.GImage><any>(this.getChild("n2"));
			this.m_n17 = <fairygui.GTextField><any>(this.getChild("n17"));
			this.m_xianshu1_jpg = <fairygui.GLoader><any>(this.getChild("xianshu1_jpg"));
			this.m_xianshu2_jpg = <fairygui.GLoader><any>(this.getChild("xianshu2_jpg"));
			this.m_xianshu3_jpg = <fairygui.GLoader><any>(this.getChild("xianshu3_jpg"));
			this.m_xianshu4_jpg = <fairygui.GLoader><any>(this.getChild("xianshu4_jpg"));
		}
	}
}