/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_popup extends fairygui.GComponent {
		public m_win1:fairygui.GGraph;
		public m_win2:fairygui.GGraph;
		public m_win3:fairygui.GGraph;
		public m_win6:fairygui.GGraph;
		public m_win5:fairygui.GGraph;
		public m_win4:fairygui.GGraph;
		public m_win7:fairygui.GGraph;

		public static URL:string = "ui://3ly9g3lauupkk7r";

		public static createInstance():UI_popup {
			return <UI_popup><any>(fairygui.UIPackage.createObject("slots","popup"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_win1 = <fairygui.GGraph><any>(this.getChild("win1"));
			this.m_win2 = <fairygui.GGraph><any>(this.getChild("win2"));
			this.m_win3 = <fairygui.GGraph><any>(this.getChild("win3"));
			this.m_win6 = <fairygui.GGraph><any>(this.getChild("win6"));
			this.m_win5 = <fairygui.GGraph><any>(this.getChild("win5"));
			this.m_win4 = <fairygui.GGraph><any>(this.getChild("win4"));
			this.m_win7 = <fairygui.GGraph><any>(this.getChild("win7"));
		}
	}
}