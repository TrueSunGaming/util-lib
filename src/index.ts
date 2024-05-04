import { Factory } from "../lib";

interface Common {
    say(): void;
}

class A implements Common {
    private msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    say(): void {
        console.log(this.msg, "from A");
    }
}

class B implements Common {
    private msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    say(): void {
        console.log(this.msg, "from B");
    }
}

const factory: Factory<string, Common, [string]> = new Factory<string, Common, [string]>([
    ["a", A],
    ["b", B]
]);

const a: A = factory.create("a", "hello");
const b: B = factory.create("b", "hello");
a.say();
b.say();