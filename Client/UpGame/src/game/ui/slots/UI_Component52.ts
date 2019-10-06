/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_Component52 extends fairygui.GComponent {
		public m_n24:UI_Component44;
		public m_n25:UI_Component45;
		public m_n26:UI_Component46;
		public m_n27:UI_Component47;
		public m_n28:UI_Component48;
		public m_n29:UI_Component49;
		public m_n30:UI_Component78;

		public static URL:string = "ui://3ly9g3lagmvxk70";

		public static createInstance():UI_Component52 {
			return <UI_Component52><any>(fairygui.UIPackage.createObject("slots","Component52"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n24 = <UI_Component44><any>(this.getChild("n24"));
			this.m_n25 = <UI_Component45><any>(this.getChild("n25"));
			this.m_n26 = <UI_Component46><any>(this.getChild("n26"));
			this.m_n27 = <UI_Component47><any>(this.getChild("n27"));
			this.m_n28 = <UI_Component48><any>(this.getChild("n28"));
			this.m_n29 = <UI_Component49><any>(this.getChild("n29"));
			this.m_n30 = <UI_Component78><any>(this.getChild("n30"));
		}
	}
}