import { DelegationList } from "./DelegationList.js";
export class WarningsList extends DelegationList {
    addDelegation(value) {
        var _a;
        this.list.push([value[0], (_a = value[1]) !== null && _a !== void 0 ? _a : 1]);
        this.orderList();
    }
    addDelegationByName(value) {
        this.list.push([value, 1]);
        this.orderList();
    }
    increaseWarning(index) {
        this.list[index][1]++;
        if (this.list[index][1] >= 99) {
            this.list[index][1] = 99;
        }
    }
    increaseWarningByName(delegation) {
        const index = this.list.findIndex((value) => value[0].toLowerCase() === delegation.toLowerCase());
        if (index !== -1) {
            this.list[index][1]++;
            if (this.list[index][1] >= 99) {
                this.list[index][1] = 99;
            }
        }
    }
    decreaseWarning(index) {
        this.list[index][1]--;
        if (this.list[index][1] <= 0) {
            this.list[index][1] = 0;
        }
    }
    decreaseWarningByValue(delegation) {
        const index = this.list.findIndex((value) => value[0].toLowerCase() === delegation.toLowerCase());
        if (index !== -1) {
            this.list[index][1]--;
            if (this.list[index][1] <= 0) {
                this.list[index][1] = 0;
            }
        }
    }
    includes(delegation) {
        return this.list.some((value) => value[0].toLowerCase() === delegation.toLowerCase());
    }
    orderList() {
        this.list.sort((a, b) => a[0].localeCompare(b[0]));
    }
}
//# sourceMappingURL=WarningsList.js.map