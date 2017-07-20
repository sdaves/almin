// LICENSE : MIT
"use strict";

import { Dispatcher } from "./Dispatcher";
import { UseCase } from "./UseCase";
import { UseCaseLike } from "./UseCaseLike";

/**
 * Transaction data structure
 */
export interface Transaction {
    // Transaction name
    readonly name: string;
}

/**
 * Dispatch Payload Meta arguments.
 * @private
 */
export interface DispatcherPayloadMetaArgs {
    useCase?: UseCaseLike;
    dispatcher?: Dispatcher | Dispatcher;
    isUseCaseFinished?: boolean;
    parentUseCase?: UseCase | null;
    isTrusted: boolean;
    transaction?: Transaction;
}

/**
 * `DispatcherPayloadMeta` is a meta object for `payload`.
 *
 * When `Dispatcher` dispatch `payload` with `DispatcherPayloadMeta` instance object.
 *
 * ```js
 * const dispatcher = new Dispatcher();
 * dispatcher.onDispatch((payload, meta) => {
 *    console.log(meta); // instance of DispatcherPayloadMeta
 *    console.log(meta.useCase); // reference to UseCase
 *    console.log(meta.parentUseCase); // reference to Parent UseCase
 *    console.log(meta.dispatcher); // reference to Dispatcher
 *    console.log(meta.timeStamp); // Timestamp
 *    console.log(meta.isTrusted); // Is it system payload?
 * });
 * ```
 */
export interface DispatcherPayloadMeta {
    /**
     * A reference to the useCase/dispatcher to which the payload was originally dispatched.
     */
    readonly useCase: UseCaseLike | null;

    /**
     * A dispatcher of the payload
     * In other word, the payload is dispatched by `this.dispatcher`
     *
     * ## Dispatcher in a useCase
     *
     * In following example, this.dispatcher is same with this.useCase.
     *
     * ```js
     * class Example extends UseCase {
     *     execute(){
     *        this.dispatch({ type })
     *     // ^^^^
     *     // === this dispatcher === this.useCase
     *     }
     * }
     * ```
     */
    readonly dispatcher: UseCase | Dispatcher | null;

    /**
     * A parent useCase of the `this.useCase`,
     * When useCase is nesting, parentUseCase is a UseCase.
     */
    readonly parentUseCase: UseCase | Dispatcher | null;

    /**
     * A timeStamp is created time of the meta.
     */
    readonly timeStamp: number;

    /**
     * If the payload object is generated by Almin, true.
     *
     * The use can use it for detecting "Is the payload generated by system(almin)?".
     * It is similar with https://www.w3.org/TR/DOM-Level-3-Events/#trusted-events
     */
    readonly isTrusted: boolean;

    /**
     * If the useCase is finished, return true.
     * Most of useCase is fixed value.
     * But, DidExecutedPayload's value is case by case.
     * In `DidExecutedPayload`, the value is false if the UseCase#execute return a promise.
     * See https://github.com/almin/almin/issues/149
     */
    readonly isUseCaseFinished: boolean;

    /**
     * If the payload object is dispatched in a transaction, to be transaction object
     * otherwise, to be undefined
     */
    transaction?: Transaction;
}

/**
 * Internal implementation
 * @private
 */
export class DispatcherPayloadMetaImpl implements DispatcherPayloadMeta {
    readonly useCase: UseCaseLike | null;
    readonly dispatcher: UseCase | Dispatcher | null;
    readonly parentUseCase: UseCase | Dispatcher | null;
    readonly timeStamp: number;
    readonly isTrusted: boolean;
    readonly isUseCaseFinished: boolean;
    transaction?: Transaction;

    constructor(args: DispatcherPayloadMetaArgs) {
        this.useCase = args.useCase || null;
        this.dispatcher = args.dispatcher === undefined ? null : args.dispatcher;
        this.parentUseCase = args.parentUseCase || null;
        this.timeStamp = Date.now();
        this.isTrusted = args.isTrusted;
        this.isUseCaseFinished = args.isUseCaseFinished !== undefined ? args.isUseCaseFinished : false;
        this.transaction = args.transaction;
    }
}
