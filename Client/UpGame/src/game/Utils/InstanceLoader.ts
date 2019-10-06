module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class InstanceLoader {
        constructor() {

        }

        private static ins: InstanceLoader;
        public static get Ins(): InstanceLoader {
            if(this.ins == null) this.ins = new InstanceLoader();
            return this.ins;
        }
        public getInstance(name: string,...args) {
            if(!egret.hasDefinition(name)) return null;
            var define: any = egret.getDefinitionByName(name);
            var instance = new define(args);
            return instance;
        }
	}
}
