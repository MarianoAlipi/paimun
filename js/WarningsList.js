import { DelegationList } from "./DelegationList.js";
export class WarningsList extends DelegationList {
    addDelegation(value) {
        var _a;
        this.list.push([value[0], (_a = value[1]) !== null && _a !== void 0 ? _a : 1]);
    }
    addDelegationByName(value) {
        this.list.push([value, 1]);
    }
    increaseWarning(index) {
        this.list[index][1]++;
    }
    increaseWarningByValue(delegation) {
        const index = this.list.findIndex((value) => value[0] === delegation);
        if (index !== -1) {
            this.list[index][1]++;
        }
    }
    decreaseWarning(index) {
        this.list[index][1]--;
    }
    decreaseWarningByValue(delegation) {
        const index = this.list.findIndex((value) => value[0] === delegation);
        if (index !== -1) {
            this.list[index][1]--;
        }
    }
}
//# sourceMappingURL=WarningsList.js.map