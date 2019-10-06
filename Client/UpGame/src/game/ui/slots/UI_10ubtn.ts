/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_10ubtn extends fairygui.GButton {
		public m_button:fairygui.Controller;
		public m_n75:fairygui.GImage;
		public m_n91:fairygui.GImage;

		public static URL:string = "ui://3ly9g3laaxfsk8o";

		public static createInstance():UI_10ubtn {
			return <UI_10ubtn><any>(fairygui.UIPackage.createObject("slots","10ubtn"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_button = this.getController("button");
			this.m_n75 = <fairygui.GImage><any>(this.getChild("n75"));
			this.m_n91 = <fairygui.GImage><any>(this.getChild("n91"));
		}
	}
}