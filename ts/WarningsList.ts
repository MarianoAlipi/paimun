import { DelegationList } from "./DelegationList.js";

export class WarningsList extends DelegationList<[string, number]> {

    addDelegation(value: [string, number?]) {
        this.list.push([value[0], value[1] ?? 1]);
    }

    addDelegationByName(value: string) {
        this.list.push([value, 1]);
    }

    increaseWarning(index: number) {
        this.list[index][1]++;
    }

    increaseWarningByValue(delegation: string) {
        const index = this.list.findIndex((value) => value[0] === delegation);
        if (index !== -1) {
            this.list[index][1]++;
        }
    }

    decreaseWarning(index: number) {
        this.list[index][1]--;
    }

    decreaseWarningByValue(delegation: string) {
        const index = this.list.findIndex((value) => value[0] === delegation);
        if (index !== -1) {
            this.list[index][1]--;
        }
    }
}