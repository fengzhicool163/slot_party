/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.slots {

	export class UI_slots extends fairygui.GComponent {
		public m_c1:fairygui.Controller;
		public m_bgwan_jpg:fairygui.GLoader;
		public m_bg_jpg:fairygui.GLoader;
		public m_bg01:fairygui.GGraph;
		public m_n185:fairygui.GImage;
		public m_n187:fairygui.GImage;
		public m_n137:fairygui.GImage;
		public m_n203:fairygui.GImage;
		public m_n213:fairygui.GImage;
		public m_n211:fairygui.GImage;
		public m_n186:fairygui.GImage;
		public m_n188:fairygui.GImage;
		public m_girl004:fairygui.GGraph;
		public m_girl004st:fairygui.GGraph;
		public m_n209:fairygui.GImage;
		public m_n206:fairygui.GImage;
		public m_n224:fairygui.GImage;
		public m_girl003:fairygui.GGraph;
		public m_girl003st:fairygui.GGraph;
		public m_girl002:fairygui.GGraph;
		public m_girl002st:fairygui.GGraph;
		public m_girl001:fairygui.GGraph;
		public m_girl001st:fairygui.GGraph;
		public m_n214:fairygui.GImage;
		public m_n212:fairygui.GImage;
		public m_n210:fairygui.GImage;
		public m_n207:fairygui.GImage;
		public m_dianjitexiao:fairygui.GGraph;
		public m_paiduideng:fairygui.GGraph;
		public m_dengguang:fairygui.GGraph;
		public m_dengqiu:fairygui.GGraph;
		public m_xiangbing02:fairygui.GGraph;
		public m_xiangbing01:fairygui.GGraph;
		public m_n85:fairygui.GImage;
		public m_n190:fairygui.GImage;
		public m_n134:fairygui.GImage;
		public m_guang1:fairygui.GGraph;
		public m_guang2:fairygui.GGraph;
		public m_guang3:fairygui.GGraph;
		public m_guang4:fairygui.GGraph;
		public m_guang5:fairygui.GGraph;
		public m_n41:UI_Component32;
		public m_n142:UI_Component56;
		public m_n129:UI_Component41;
		public m_n223:UI_Component64;
		public m_n104:UI_Component15;
		public m_n81:UI_100ubtn;
		public m_n80:UI_10ubtn;
		public m_n82:UI_500ubtn;
		public m_paiduikaishi:fairygui.GGraph;
		public m_hud_hud:fairygui.GComponent;
		public m_n121:UI_btn_1;
		public m_laohujinew001_shuzi:fairygui.GGraph;
		public m_n123:UI_Component38;
		public m_n125:UI_Component39;
		public m_chushuzi01:fairygui.GGraph;
		public m_n135:fairygui.GTextField;
		public m_laohujinew001_dianji2:fairygui.GGraph;
		public m_n9:UI_Component33;
		public m_n156:UI_Component59;
		public m_n192:UI_Component18;
		public m_n181:fairygui.GComponent;
		public m_zuanshi:fairygui.GGraph;
		public m_yaoshi:fairygui.GGraph;
		public m_yanhua:fairygui.GGraph;
		public m_chushuzi02:fairygui.GGraph;
		public m_chushuzi03:fairygui.GGraph;

		public static URL:string = "ui://3ly9g3lanix7k3r";

		public static createInstance():UI_slots {
			return <UI_slots><any>(fairygui.UIPackage.createObject("slots","slots"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_c1 = this.getController("c1");
			this.m_bgwan_jpg = <fairygui.GLoader><any>(this.getChild("bgwan_jpg"));
			this.m_bg_jpg = <fairygui.GLoader><any>(this.getChild("bg_jpg"));
			this.m_bg01 = <fairygui.GGraph><any>(this.getChild("bg01"));
			this.m_n185 = <fairygui.GImage><any>(this.getChild("n185"));
			this.m_n187 = <fairygui.GImage><any>(this.getChild("n187"));
			this.m_n137 = <fairygui.GImage><any>(this.getChild("n137"));
			this.m_n203 = <fairygui.GImage><any>(this.getChild("n203"));
			this.m_n213 = <fairygui.GImage><any>(this.getChild("n213"));
			this.m_n211 = <fairygui.GImage><any>(this.getChild("n211"));
			this.m_n186 = <fairygui.GImage><any>(this.getChild("n186"));
			this.m_n188 = <fairygui.GImage><any>(this.getChild("n188"));
			this.m_girl004 = <fairygui.GGraph><any>(this.getChild("girl004"));
			this.m_girl004st = <fairygui.GGraph><any>(this.getChild("girl004st"));
			this.m_n209 = <fairygui.GImage><any>(this.getChild("n209"));
			this.m_n206 = <fairygui.GImage><any>(this.getChild("n206"));
			this.m_n224 = <fairygui.GImage><any>(this.getChild("n224"));
			this.m_girl003 = <fairygui.GGraph><any>(this.getChild("girl003"));
			this.m_girl003st = <fairygui.GGraph><any>(this.getChild("girl003st"));
			this.m_girl002 = <fairygui.GGraph><any>(this.getChild("girl002"));
			this.m_girl002st = <fairygui.GGraph><any>(this.getChild("girl002st"));
			this.m_girl001 = <fairygui.GGraph><any>(this.getChild("girl001"));
			this.m_girl001st = <fairygui.GGraph><any>(this.getChild("girl001st"));
			this.m_n214 = <fairygui.GImage><any>(this.getChild("n214"));
			this.m_n212 = <fairygui.GImage><any>(this.getChild("n212"));
			this.m_n210 = <fairygui.GImage><any>(this.getChild("n210"));
			this.m_n207 = <fairygui.GImage><any>(this.getChild("n207"));
			this.m_dianjitexiao = <fairygui.GGraph><any>(this.getChild("dianjitexiao"));
			this.m_paiduideng = <fairygui.GGraph><any>(this.getChild("paiduideng"));
			this.m_dengguang = <fairygui.GGraph><any>(this.getChild("dengguang"));
			this.m_dengqiu = <fairygui.GGraph><any>(this.getChild("dengqiu"));
			this.m_xiangbing02 = <fairygui.GGraph><any>(this.getChild("xiangbing02"));
			this.m_xiangbing01 = <fairygui.GGraph><any>(this.getChild("xiangbing01"));
			this.m_n85 = <fairygui.GImage><any>(this.getChild("n85"));
			this.m_n190 = <fairygui.GImage><any>(this.getChild("n190"));
			this.m_n134 = <fairygui.GImage><any>(this.getChild("n134"));
			this.m_guang1 = <fairygui.GGraph><any>(this.getChild("guang1"));
			this.m_guang2 = <fairygui.GGraph><any>(this.getChild("guang2"));
			this.m_guang3 = <fairygui.GGraph><any>(this.getChild("guang3"));
			this.m_guang4 = <fairygui.GGraph><any>(this.getChild("guang4"));
			this.m_guang5 = <fairygui.GGraph><any>(this.getChild("guang5"));
			this.m_n41 = <UI_Component32><any>(this.getChild("n41"));
			this.m_n142 = <UI_Component56><any>(this.getChild("n142"));
			this.m_n129 = <UI_Component41><any>(this.getChild("n129"));
			this.m_n223 = <UI_Component64><any>(this.getChild("n223"));
			this.m_n104 = <UI_Component15><any>(this.getChild("n104"));
			this.m_n81 = <UI_100ubtn><any>(this.getChild("n81"));
			this.m_n80 = <UI_10ubtn><any>(this.getChild("n80"));
			this.m_n82 = <UI_500ubtn><any>(this.getChild("n82"));
			this.m_paiduikaishi = <fairygui.GGraph><any>(this.getChild("paiduikaishi"));
			this.m_hud_hud = <fairygui.GComponent><any>(this.getChild("hud_hud"));
			this.m_n121 = <UI_btn_1><any>(this.getChild("n121"));
			this.m_laohujinew001_shuzi = <fairygui.GGraph><any>(this.getChild("laohujinew001_shuzi"));
			this.m_n123 = <UI_Component38><any>(this.getChild("n123"));
			this.m_n125 = <UI_Component39><any>(this.getChild("n125"));
			this.m_chushuzi01 = <fairygui.GGraph><any>(this.getChild("chushuzi01"));
			this.m_n135 = <fairygui.GTextField><any>(this.getChild("n135"));
			this.m_laohujinew001_dianji2 = <fairygui.GGraph><any>(this.getChild("laohujinew001_dianji2"));
			this.m_n9 = <UI_Component33><any>(this.getChild("n9"));
			this.m_n156 = <UI_Component59><any>(this.getChild("n156"));
			this.m_n192 = <UI_Component18><any>(this.getChild("n192"));
			this.m_n181 = <fairygui.GComponent><any>(this.getChild("n181"));
			this.m_zuanshi = <fairygui.GGraph><any>(this.getChild("zuanshi"));
			this.m_yaoshi = <fairygui.GGraph><any>(this.getChild("yaoshi"));
			this.m_yanhua = <fairygui.GGraph><any>(this.getChild("yanhua"));
			this.m_chushuzi02 = <fairygui.GGraph><any>(this.getChild("chushuzi02"));
			this.m_chushuzi03 = <fairygui.GGraph><any>(this.getChild("chushuzi03"));
		}
	}
}