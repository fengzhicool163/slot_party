module game {

    export class UnitUtils {
        public static createPvpTeamUnitData(unit:any, side:number):any {
            return {
                monsterId   :   unit.id,
                level       :   unit.level,
                awakenLevel :   unit.awakenLevel || 0,
                trainingId  :   unit.trainingId || 0,
                HPTrainingId:   unit.HPTrainingId || 0,
                evolutionId  :   unit.evolutionId || 0,
                HPEvolutionId:   unit.HPEvolutionId || 0,
                side        :   side,
                x           :   unit.x,
                y           :   unit.y
            };
        }
    }

    export interface IUnitDataProps {

        monsterId: string;
        level: number;
        awakenLevel: number;
        trainingId: number;
        HPTrainingId: number;
        evolutionId:number;
        HPEvolutionId: number;
        x: number;
        y: number;
        count: number;
    }
}