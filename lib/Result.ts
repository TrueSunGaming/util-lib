export enum ResultType {
    Success,
    Failure,
    FailureFallback
}

interface ResultStructure<T, E> {
    type: ResultType;
    value: T | null;
    error: E | null;
}

export interface SuccessfulResult<T> extends ResultStructure<T, null> {
    type: ResultType.Success;
    value: T;
    error: null;
}

export interface FailureResult<E> extends ResultStructure<null, E> {
    type: ResultType.Failure;
    value: null;
    error: E;
}

export interface FailureFallbackResult<T, E> extends ResultStructure<T, E> {
    type: ResultType.FailureFallback;
    value: T;
    error: E;
}

export type ResultData<T, E> = SuccessfulResult<T> | FailureResult<E> | FailureFallbackResult<T, E>;

export class Result<T, E> {
    private data: ResultData<T, E>;

    constructor(data: ResultData<T, E>) {
        this.data = data;
    }

    static success<T, E>(value: T): Result<T, E> {
        return new Result<T, E>({
            type: ResultType.Success,
            value: value,
            error: null
        });
    }

    static failure<T, E>(error: E, fallback?: T): Result<T, E> {
        if (!fallback) return new Result<T, E>({
            type: ResultType.Failure,
            value: null,
            error: error
        });
        
        return new Result({
            type: ResultType.FailureFallback,
            value: fallback,
            error: error
        });
    }

    get successful(): boolean {
        return this.data.type == ResultType.Success;
    }

    unwrap(): T {
        if (!this.data.value) throw new Error("Failed to unwrap result with error: " + this.data.error);

        return this.data.value;
    }

    unwrapOrNull(): T | null {
        return this.data.value;
    }
}