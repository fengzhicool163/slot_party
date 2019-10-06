/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_100ubtn extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n76:fairygui.GImage;
		public m_n92:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laaxfsk8l";

		public static createInstance():UI_100ubtn {
			return <UI_100ubtn><any>(fairygui.UIPackage.createObject("slots","100ubtn"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n76 = <fairygui.GImage><any>(this.getChild("n76"));
			this.m_n92 = <fairygui.GImage><any>(this.getChild("n92"));
		}
	}
}