import { makeAutoObservable } from "mobx";

export class CounterStore {
    count = 0;

    constructor() {
        makeAutoObservable(this);
    }

    increment = () => {
        this.count += 1;
    };

    get doubleCount() {
        return this.count * 2;
    }
}

export const counterStore = new CounterStore();
