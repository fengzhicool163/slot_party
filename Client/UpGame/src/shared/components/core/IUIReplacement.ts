module components.core {

    export interface IUIReplacement {

        setParams(repalcer: fairygui.GComponent, logicClass: any): IUIReplacement;
        init();
        onComplete(callback: Function, context?: any): IUIReplacement;

    }

}