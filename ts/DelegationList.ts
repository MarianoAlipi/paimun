export class DelegationList<T> {

    protected list: T[] = [];

    getList(): T[] {
        return this.list;
    }

    addDelegation(value: T) {
        this.list.push(value);
    }

    removeDelegation(index: number) {
        if (index < 0 || index >= this.list.length) {
            return;
        }
        this.list.splice(index, 1);
    }

    removeDelegationByValue(value: T) {
        const index = this.list.indexOf(value);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }

    swapDelegations(index1: number, index2: number) {
        if (index1 < 0 || index1 >= this.list.length || index2 < 0 || index2 >= this.list.length) {
            return;
        }

        const temp = this.list[index1];
        this.list[index1] = this.list[index2];
        this.list[index2] = temp;
    }

    swapDelegationsByValue(delegation1: T, delegation2: T) {
        const index1 = this.list.indexOf(delegation1);
        const index2 = this.list.indexOf(delegation2);

        if (index1 === -1 || index2 === -1) {
            return;
        }

        this.list[index1] = delegation2;
        this.list[index2] = delegation1;
    }

}