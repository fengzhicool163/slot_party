module components.hud {

    export interface ISlotHud {

        controller: fairygui.Controller;
        returnBtn: fairygui.GComponent;
        headComp: fairygui.GComponent;
        nameText: fairygui.GTextField;
        diamondGraph: fairygui.GGraph;
        diamondText: egret.TextField;
        chargeBtn: fairygui.GComponent;
        musicBtn: fairygui.GComponent;
        taskComp: fairygui.GComponent;

    }

}