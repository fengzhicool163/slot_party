/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_progress_bar extends fairygui.GProgressBar {
		public m_n9:fairygui.GImage;
		public m_bar:fairygui.GImage;
		public m_title:fairygui.GTextField;
		public m_n12:fairygui.GMovieClip;

		public static URL:string = "ui://3ly9g3laq6lnk2v";

		public static createInstance():UI_progress_bar {
			return <UI_progress_bar><any>(fairygui.UIPackage.createObject("slots","progress_bar"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_n9 = <fairygui.GImage><any>(this.getChild("n9"));
			this.m_bar = <fairygui.GImage><any>(this.getChild("bar"));
			this.m_title = <fairygui.GTextField><any>(this.getChild("title"));
			this.m_n12 = <fairygui.GMovieClip><any>(this.getChild("n12"));
		}
	}
}