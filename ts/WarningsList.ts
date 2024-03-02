import { DelegationList } from "./DelegationList.js";

export class WarningsList extends DelegationList<[string, number]> {

    addDelegation(value: [string, number?]) {
        this.list.push([value[0], value[1] ?? 1]);
        this.orderList();
    }

    addDelegationByName(value: string) {
        this.list.push([value, 1]);
        this.orderList();
    }

    increaseWarning(index: number) {
        this.list[index][1]++;

        if (this.list[index][1] >= 99) {
            this.list[index][1] = 99;
        }
    }

    increaseWarningByName(delegation: string) {
        const index = this.list.findIndex((value) => value[0].toLowerCase() === delegation.toLowerCase());
        if (index !== -1) {
            this.list[index][1]++;

            if (this.list[index][1] >= 99) {
                this.list[index][1] = 99;
            }
        }
    }

    decreaseWarning(index: number) {
        this.list[index][1]--;

        if (this.list[index][1] <= 0) {
            this.list[index][1] = 0;
        }
    }

    decreaseWarningByValue(delegation: string) {
        const index = this.list.findIndex((value) => value[0].toLowerCase() === delegation.toLowerCase());
        if (index !== -1) {
            this.list[index][1]--;

            if (this.list[index][1] <= 0) {
                this.list[index][1] = 0;
            }
        }
    }

    includes(delegation: string) {
        return this.list.some((value) => value[0].toLowerCase() === delegation.toLowerCase());
    }

    orderList() {
        this.list.sort((a, b) => a[0].localeCompare(b[0]));
    }
}
