module ui.core {

    export class UIReplacementWrapper {

        public static do(comp: fairygui.GComponent, callback?:Function, context?:any): void {
            var name: string = comp.name;
            
            var info: string[] = name.split('_');
            if (info.length == 2) {
                var p: string = info[0],    // 包名
                    c: string = info[1];    // 组件名
                
                var obj: fairygui.GObject = this.wrap(p, c, comp);
                if (!!obj) {
                    comp.removeChildren();
                    comp.addChild(obj);
                }
                if (!!callback) callback.apply(context, [obj]);
            }
        }

        public static wrap(packageName: string, componentName: string, replacer: fairygui.GComponent): fairygui.GObject {
            var pack: fairygui.UIPackage = fairygui.UIPackage.getByName(packageName);
            if (!!pack && replacer) {
                var obj: fairygui.GObject = fairygui.UIPackage.createObject(packageName, componentName);
                if (obj) {
                    obj.setSize(replacer.width, replacer.height);
                    obj.addRelation(replacer, fairygui.RelationType.Width);
                    obj.addRelation(replacer, fairygui.RelationType.Height);

                    return obj;
                }
            }
            return null;
        }

    }

}