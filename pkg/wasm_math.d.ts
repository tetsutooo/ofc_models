/* tslint:disable */
/* eslint-disable */
export class Rational64 {
  free(): void;
  /**
   * @param {bigint} numerator
   * @param {bigint} denominator
   * @returns {Rational64}
   */
  static new(numerator: bigint, denominator: bigint): Rational64;
  /**
   * @returns {number}
   */
  to_f32(): number;
}
export class System {
  free(): void;
  /**
   * @param {bigint} seed
   * @param {number} alpha
   * @param {number} beta
   * @returns {System}
   */
  static new(seed: bigint, alpha: number, beta: number): System;
  /**
   * @returns {number}
   */
  width(): number;
  /**
   * @returns {number}
   */
  height(): number;
  update(): void;
  /**
   * @returns {Uint8Array}
   */
  get_normalized_z(): Uint8Array;
  /**
   * @returns {Float64Array}
   */
  get_size_distribution(): Float64Array;
  reset_size_distribution(): void;
}
export class Xorshift {
  free(): void;
  /**
   * @param {bigint} seed
   * @returns {Xorshift}
   */
  static new(seed: bigint): Xorshift;
  /**
   * @returns {bigint}
   */
  rand(): bigint;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_xorshift_free: (a: number, b: number) => void;
  readonly xorshift_new: (a: number) => number;
  readonly xorshift_rand: (a: number) => number;
  readonly __wbg_system_free: (a: number, b: number) => void;
  readonly system_new: (a: number, b: number, c: number) => number;
  readonly system_height: (a: number) => number;
  readonly system_update: (a: number) => void;
  readonly system_get_normalized_z: (a: number, b: number) => void;
  readonly system_get_size_distribution: (a: number, b: number) => void;
  readonly system_reset_size_distribution: (a: number) => void;
  readonly system_width: (a: number) => number;
  readonly __wbg_rational64_free: (a: number, b: number) => void;
  readonly rational64_new: (a: number, b: number) => number;
  readonly rational64_to_f32: (a: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
