export class DelegationList {
    constructor() {
        this.list = [];
    }
    getList() {
        return this.list;
    }
    addDelegation(value) {
        this.list.push(value);
    }
    removeDelegation(index) {
        if (index < 0 || index >= this.list.length) {
            return;
        }
        this.list.splice(index, 1);
    }
    removeDelegationByValue(value) {
        const index = this.list.indexOf(value);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }
    swapDelegations(index1, index2) {
        if (index1 < 0 || index1 >= this.list.length || index2 < 0 || index2 >= this.list.length) {
            return;
        }
        const temp = this.list[index1];
        this.list[index1] = this.list[index2];
        this.list[index2] = temp;
    }
    swapDelegationsByValue(delegation1, delegation2) {
        const index1 = this.list.indexOf(delegation1);
        const index2 = this.list.indexOf(delegation2);
        if (index1 === -1 || index2 === -1) {
            return;
        }
        this.list[index1] = delegation2;
        this.list[index2] = delegation1;
    }
}
//# sourceMappingURL=DelegationList.js.map