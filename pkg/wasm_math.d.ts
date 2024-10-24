/* tslint:disable */
/* eslint-disable */
export class SingleDefectModel {
  free(): void;
  /**
   * @param {bigint} seed
   * @param {number} alpha
   * @param {number} beta
   * @returns {SingleDefectModel}
   */
  static new(seed: bigint, alpha: number, beta: number): SingleDefectModel;
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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_singledefectmodel_free: (a: number, b: number) => void;
  readonly singledefectmodel_new: (a: number, b: number, c: number) => number;
  readonly singledefectmodel_height: (a: number) => number;
  readonly singledefectmodel_update: (a: number) => void;
  readonly singledefectmodel_get_normalized_z: (a: number, b: number) => void;
  readonly singledefectmodel_get_size_distribution: (a: number, b: number) => void;
  readonly singledefectmodel_reset_size_distribution: (a: number) => void;
  readonly singledefectmodel_width: (a: number) => number;
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
