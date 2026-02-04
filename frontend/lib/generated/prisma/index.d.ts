
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>
/**
 * Model Media
 * 
 */
export type Media = $Result.DefaultSelection<Prisma.$MediaPayload>
/**
 * Model Detection
 * 
 */
export type Detection = $Result.DefaultSelection<Prisma.$DetectionPayload>
/**
 * Model Pothole
 * 
 */
export type Pothole = $Result.DefaultSelection<Prisma.$PotholePayload>
/**
 * Model RoadInfo
 * 
 */
export type RoadInfo = $Result.DefaultSelection<Prisma.$RoadInfoPayload>
/**
 * Model Ticket
 * 
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>
/**
 * Model TicketStatusHistory
 * 
 */
export type TicketStatusHistory = $Result.DefaultSelection<Prisma.$TicketStatusHistoryPayload>
/**
 * Model Worker
 * 
 */
export type Worker = $Result.DefaultSelection<Prisma.$WorkerPayload>
/**
 * Model WorkerLocation
 * 
 */
export type WorkerLocation = $Result.DefaultSelection<Prisma.$WorkerLocationPayload>
/**
 * Model WorkProof
 * 
 */
export type WorkProof = $Result.DefaultSelection<Prisma.$WorkProofPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  CITIZEN: 'CITIZEN',
  WORKER: 'WORKER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const ReportStatus: {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  RESOLVED: 'RESOLVED'
};

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus]


export const MediaType: {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
};

export type MediaType = (typeof MediaType)[keyof typeof MediaType]


export const PriorityLevel: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export type PriorityLevel = (typeof PriorityLevel)[keyof typeof PriorityLevel]


export const TicketStatus: {
  DETECTED: 'DETECTED',
  RANKED: 'RANKED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  AWAITING_VERIFICATION: 'AWAITING_VERIFICATION',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type ReportStatus = $Enums.ReportStatus

export const ReportStatus: typeof $Enums.ReportStatus

export type MediaType = $Enums.MediaType

export const MediaType: typeof $Enums.MediaType

export type PriorityLevel = $Enums.PriorityLevel

export const PriorityLevel: typeof $Enums.PriorityLevel

export type TicketStatus = $Enums.TicketStatus

export const TicketStatus: typeof $Enums.TicketStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.media`: Exposes CRUD operations for the **Media** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Media
    * const media = await prisma.media.findMany()
    * ```
    */
  get media(): Prisma.MediaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.detection`: Exposes CRUD operations for the **Detection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Detections
    * const detections = await prisma.detection.findMany()
    * ```
    */
  get detection(): Prisma.DetectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pothole`: Exposes CRUD operations for the **Pothole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Potholes
    * const potholes = await prisma.pothole.findMany()
    * ```
    */
  get pothole(): Prisma.PotholeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadInfo`: Exposes CRUD operations for the **RoadInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadInfos
    * const roadInfos = await prisma.roadInfo.findMany()
    * ```
    */
  get roadInfo(): Prisma.RoadInfoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticketStatusHistory`: Exposes CRUD operations for the **TicketStatusHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketStatusHistories
    * const ticketStatusHistories = await prisma.ticketStatusHistory.findMany()
    * ```
    */
  get ticketStatusHistory(): Prisma.TicketStatusHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.worker`: Exposes CRUD operations for the **Worker** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workers
    * const workers = await prisma.worker.findMany()
    * ```
    */
  get worker(): Prisma.WorkerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workerLocation`: Exposes CRUD operations for the **WorkerLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkerLocations
    * const workerLocations = await prisma.workerLocation.findMany()
    * ```
    */
  get workerLocation(): Prisma.WorkerLocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workProof`: Exposes CRUD operations for the **WorkProof** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkProofs
    * const workProofs = await prisma.workProof.findMany()
    * ```
    */
  get workProof(): Prisma.WorkProofDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Report: 'Report',
    Media: 'Media',
    Detection: 'Detection',
    Pothole: 'Pothole',
    RoadInfo: 'RoadInfo',
    Ticket: 'Ticket',
    TicketStatusHistory: 'TicketStatusHistory',
    Worker: 'Worker',
    WorkerLocation: 'WorkerLocation',
    WorkProof: 'WorkProof'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "report" | "media" | "detection" | "pothole" | "roadInfo" | "ticket" | "ticketStatusHistory" | "worker" | "workerLocation" | "workProof"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
      Media: {
        payload: Prisma.$MediaPayload<ExtArgs>
        fields: Prisma.MediaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          findFirst: {
            args: Prisma.MediaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          findMany: {
            args: Prisma.MediaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          create: {
            args: Prisma.MediaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          createMany: {
            args: Prisma.MediaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MediaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          delete: {
            args: Prisma.MediaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          update: {
            args: Prisma.MediaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          deleteMany: {
            args: Prisma.MediaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MediaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          upsert: {
            args: Prisma.MediaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          aggregate: {
            args: Prisma.MediaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedia>
          }
          groupBy: {
            args: Prisma.MediaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MediaCountArgs<ExtArgs>
            result: $Utils.Optional<MediaCountAggregateOutputType> | number
          }
        }
      }
      Detection: {
        payload: Prisma.$DetectionPayload<ExtArgs>
        fields: Prisma.DetectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DetectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DetectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>
          }
          findFirst: {
            args: Prisma.DetectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DetectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>
          }
          findMany: {
            args: Prisma.DetectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>[]
          }
          create: {
            args: Prisma.DetectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>
          }
          createMany: {
            args: Prisma.DetectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DetectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>[]
          }
          delete: {
            args: Prisma.DetectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>
          }
          update: {
            args: Prisma.DetectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>
          }
          deleteMany: {
            args: Prisma.DetectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DetectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DetectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>[]
          }
          upsert: {
            args: Prisma.DetectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetectionPayload>
          }
          aggregate: {
            args: Prisma.DetectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDetection>
          }
          groupBy: {
            args: Prisma.DetectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DetectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DetectionCountArgs<ExtArgs>
            result: $Utils.Optional<DetectionCountAggregateOutputType> | number
          }
        }
      }
      Pothole: {
        payload: Prisma.$PotholePayload<ExtArgs>
        fields: Prisma.PotholeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PotholeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PotholeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>
          }
          findFirst: {
            args: Prisma.PotholeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PotholeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>
          }
          findMany: {
            args: Prisma.PotholeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>[]
          }
          create: {
            args: Prisma.PotholeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>
          }
          createMany: {
            args: Prisma.PotholeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PotholeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>[]
          }
          delete: {
            args: Prisma.PotholeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>
          }
          update: {
            args: Prisma.PotholeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>
          }
          deleteMany: {
            args: Prisma.PotholeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PotholeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PotholeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>[]
          }
          upsert: {
            args: Prisma.PotholeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PotholePayload>
          }
          aggregate: {
            args: Prisma.PotholeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePothole>
          }
          groupBy: {
            args: Prisma.PotholeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PotholeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PotholeCountArgs<ExtArgs>
            result: $Utils.Optional<PotholeCountAggregateOutputType> | number
          }
        }
      }
      RoadInfo: {
        payload: Prisma.$RoadInfoPayload<ExtArgs>
        fields: Prisma.RoadInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>
          }
          findFirst: {
            args: Prisma.RoadInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>
          }
          findMany: {
            args: Prisma.RoadInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>[]
          }
          create: {
            args: Prisma.RoadInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>
          }
          createMany: {
            args: Prisma.RoadInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>[]
          }
          delete: {
            args: Prisma.RoadInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>
          }
          update: {
            args: Prisma.RoadInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>
          }
          deleteMany: {
            args: Prisma.RoadInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadInfoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>[]
          }
          upsert: {
            args: Prisma.RoadInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadInfoPayload>
          }
          aggregate: {
            args: Prisma.RoadInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadInfo>
          }
          groupBy: {
            args: Prisma.RoadInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadInfoCountArgs<ExtArgs>
            result: $Utils.Optional<RoadInfoCountAggregateOutputType> | number
          }
        }
      }
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>
        fields: Prisma.TicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicket>
          }
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCountAggregateOutputType> | number
          }
        }
      }
      TicketStatusHistory: {
        payload: Prisma.$TicketStatusHistoryPayload<ExtArgs>
        fields: Prisma.TicketStatusHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketStatusHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketStatusHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>
          }
          findFirst: {
            args: Prisma.TicketStatusHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketStatusHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>
          }
          findMany: {
            args: Prisma.TicketStatusHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>[]
          }
          create: {
            args: Prisma.TicketStatusHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>
          }
          createMany: {
            args: Prisma.TicketStatusHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketStatusHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>[]
          }
          delete: {
            args: Prisma.TicketStatusHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>
          }
          update: {
            args: Prisma.TicketStatusHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>
          }
          deleteMany: {
            args: Prisma.TicketStatusHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketStatusHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketStatusHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>[]
          }
          upsert: {
            args: Prisma.TicketStatusHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketStatusHistoryPayload>
          }
          aggregate: {
            args: Prisma.TicketStatusHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketStatusHistory>
          }
          groupBy: {
            args: Prisma.TicketStatusHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketStatusHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketStatusHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<TicketStatusHistoryCountAggregateOutputType> | number
          }
        }
      }
      Worker: {
        payload: Prisma.$WorkerPayload<ExtArgs>
        fields: Prisma.WorkerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>
          }
          findFirst: {
            args: Prisma.WorkerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>
          }
          findMany: {
            args: Prisma.WorkerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>[]
          }
          create: {
            args: Prisma.WorkerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>
          }
          createMany: {
            args: Prisma.WorkerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>[]
          }
          delete: {
            args: Prisma.WorkerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>
          }
          update: {
            args: Prisma.WorkerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>
          }
          deleteMany: {
            args: Prisma.WorkerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>[]
          }
          upsert: {
            args: Prisma.WorkerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerPayload>
          }
          aggregate: {
            args: Prisma.WorkerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorker>
          }
          groupBy: {
            args: Prisma.WorkerGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkerGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkerCountArgs<ExtArgs>
            result: $Utils.Optional<WorkerCountAggregateOutputType> | number
          }
        }
      }
      WorkerLocation: {
        payload: Prisma.$WorkerLocationPayload<ExtArgs>
        fields: Prisma.WorkerLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkerLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkerLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>
          }
          findFirst: {
            args: Prisma.WorkerLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkerLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>
          }
          findMany: {
            args: Prisma.WorkerLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>[]
          }
          create: {
            args: Prisma.WorkerLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>
          }
          createMany: {
            args: Prisma.WorkerLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkerLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>[]
          }
          delete: {
            args: Prisma.WorkerLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>
          }
          update: {
            args: Prisma.WorkerLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>
          }
          deleteMany: {
            args: Prisma.WorkerLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkerLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkerLocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>[]
          }
          upsert: {
            args: Prisma.WorkerLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkerLocationPayload>
          }
          aggregate: {
            args: Prisma.WorkerLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkerLocation>
          }
          groupBy: {
            args: Prisma.WorkerLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkerLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkerLocationCountArgs<ExtArgs>
            result: $Utils.Optional<WorkerLocationCountAggregateOutputType> | number
          }
        }
      }
      WorkProof: {
        payload: Prisma.$WorkProofPayload<ExtArgs>
        fields: Prisma.WorkProofFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkProofFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkProofFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>
          }
          findFirst: {
            args: Prisma.WorkProofFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkProofFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>
          }
          findMany: {
            args: Prisma.WorkProofFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>[]
          }
          create: {
            args: Prisma.WorkProofCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>
          }
          createMany: {
            args: Prisma.WorkProofCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkProofCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>[]
          }
          delete: {
            args: Prisma.WorkProofDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>
          }
          update: {
            args: Prisma.WorkProofUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>
          }
          deleteMany: {
            args: Prisma.WorkProofDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkProofUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkProofUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>[]
          }
          upsert: {
            args: Prisma.WorkProofUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkProofPayload>
          }
          aggregate: {
            args: Prisma.WorkProofAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkProof>
          }
          groupBy: {
            args: Prisma.WorkProofGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkProofGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkProofCountArgs<ExtArgs>
            result: $Utils.Optional<WorkProofCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    report?: ReportOmit
    media?: MediaOmit
    detection?: DetectionOmit
    pothole?: PotholeOmit
    roadInfo?: RoadInfoOmit
    ticket?: TicketOmit
    ticketStatusHistory?: TicketStatusHistoryOmit
    worker?: WorkerOmit
    workerLocation?: WorkerLocationOmit
    workProof?: WorkProofOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    reports: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | UserCountOutputTypeCountReportsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
  }


  /**
   * Count Type ReportCountOutputType
   */

  export type ReportCountOutputType = {
    media: number
  }

  export type ReportCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | ReportCountOutputTypeCountMediaArgs
  }

  // Custom InputTypes
  /**
   * ReportCountOutputType without action
   */
  export type ReportCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportCountOutputType
     */
    select?: ReportCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReportCountOutputType without action
   */
  export type ReportCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
  }


  /**
   * Count Type MediaCountOutputType
   */

  export type MediaCountOutputType = {
    detections: number
  }

  export type MediaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detections?: boolean | MediaCountOutputTypeCountDetectionsArgs
  }

  // Custom InputTypes
  /**
   * MediaCountOutputType without action
   */
  export type MediaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaCountOutputType
     */
    select?: MediaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MediaCountOutputType without action
   */
  export type MediaCountOutputTypeCountDetectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetectionWhereInput
  }


  /**
   * Count Type TicketCountOutputType
   */

  export type TicketCountOutputType = {
    workProofs: number
    statusHistory: number
  }

  export type TicketCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workProofs?: boolean | TicketCountOutputTypeCountWorkProofsArgs
    statusHistory?: boolean | TicketCountOutputTypeCountStatusHistoryArgs
  }

  // Custom InputTypes
  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketCountOutputType
     */
    select?: TicketCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountWorkProofsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkProofWhereInput
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountStatusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketStatusHistoryWhereInput
  }


  /**
   * Count Type WorkerCountOutputType
   */

  export type WorkerCountOutputType = {
    assignedTickets: number
    locationLogs: number
  }

  export type WorkerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedTickets?: boolean | WorkerCountOutputTypeCountAssignedTicketsArgs
    locationLogs?: boolean | WorkerCountOutputTypeCountLocationLogsArgs
  }

  // Custom InputTypes
  /**
   * WorkerCountOutputType without action
   */
  export type WorkerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerCountOutputType
     */
    select?: WorkerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkerCountOutputType without action
   */
  export type WorkerCountOutputTypeCountAssignedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * WorkerCountOutputType without action
   */
  export type WorkerCountOutputTypeCountLocationLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkerLocationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    clerk_user_id: string | null
    name: string | null
    email: string | null
    role: $Enums.Role | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    clerk_user_id: string | null
    name: string | null
    email: string | null
    role: $Enums.Role | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    clerk_user_id: number
    name: number
    email: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    clerk_user_id?: true
    name?: true
    email?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    clerk_user_id?: true
    name?: true
    email?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    clerk_user_id?: true
    name?: true
    email?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    clerk_user_id: string | null
    name: string | null
    email: string
    role: $Enums.Role
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerk_user_id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
    reports?: boolean | User$reportsArgs<ExtArgs>
    worker?: boolean | User$workerArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerk_user_id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerk_user_id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    clerk_user_id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clerk_user_id" | "name" | "email" | "role" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | User$reportsArgs<ExtArgs>
    worker?: boolean | User$workerArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      reports: Prisma.$ReportPayload<ExtArgs>[]
      worker: Prisma.$WorkerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clerk_user_id: string | null
      name: string | null
      email: string
      role: $Enums.Role
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reports<T extends User$reportsArgs<ExtArgs> = {}>(args?: Subset<T, User$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    worker<T extends User$workerArgs<ExtArgs> = {}>(args?: Subset<T, User$workerArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly clerk_user_id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.reports
   */
  export type User$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    cursor?: ReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * User.worker
   */
  export type User$workerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    where?: WorkerWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _avg: ReportAvgAggregateOutputType | null
    _sum: ReportSumAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    severity: number | null
  }

  export type ReportSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    severity: number | null
  }

  export type ReportMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    status: $Enums.ReportStatus | null
    severity: number | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ReportMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    status: $Enums.ReportStatus | null
    severity: number | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ReportCountAggregateOutputType = {
    id: number
    title: number
    description: number
    latitude: number
    longitude: number
    status: number
    severity: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type ReportAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    severity?: true
  }

  export type ReportSumAggregateInputType = {
    latitude?: true
    longitude?: true
    severity?: true
  }

  export type ReportMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    latitude?: true
    longitude?: true
    status?: true
    severity?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ReportMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    latitude?: true
    longitude?: true
    status?: true
    severity?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ReportCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    latitude?: true
    longitude?: true
    status?: true
    severity?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _avg?: ReportAvgAggregateInputType
    _sum?: ReportSumAggregateInputType
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    id: string
    title: string | null
    description: string | null
    latitude: number
    longitude: number
    status: $Enums.ReportStatus
    severity: number | null
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    userId: string | null
    _count: ReportCountAggregateOutputType | null
    _avg: ReportAvgAggregateOutputType | null
    _sum: ReportSumAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    severity?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Report$userArgs<ExtArgs>
    media?: boolean | Report$mediaArgs<ExtArgs>
    _count?: boolean | ReportCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    severity?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Report$userArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    severity?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Report$userArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    severity?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type ReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "latitude" | "longitude" | "status" | "severity" | "imageUrl" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["report"]>
  export type ReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Report$userArgs<ExtArgs>
    media?: boolean | Report$mediaArgs<ExtArgs>
    _count?: boolean | ReportCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Report$userArgs<ExtArgs>
  }
  export type ReportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Report$userArgs<ExtArgs>
  }

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      media: Prisma.$MediaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      description: string | null
      latitude: number
      longitude: number
      status: $Enums.ReportStatus
      severity: number | null
      imageUrl: string | null
      createdAt: Date
      updatedAt: Date
      userId: string | null
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportWithIdOnly = await prisma.report.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reports and returns the data saved in the database.
     * @param {ReportCreateManyAndReturnArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports and returns the data updated in the database.
     * @param {ReportUpdateManyAndReturnArgs} args - Arguments to update many Reports.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReportUpdateManyAndReturnArgs>(args: SelectSubset<T, ReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Report$userArgs<ExtArgs> = {}>(args?: Subset<T, Report$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    media<T extends Report$mediaArgs<ExtArgs> = {}>(args?: Subset<T, Report$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */
  interface ReportFieldRefs {
    readonly id: FieldRef<"Report", 'String'>
    readonly title: FieldRef<"Report", 'String'>
    readonly description: FieldRef<"Report", 'String'>
    readonly latitude: FieldRef<"Report", 'Float'>
    readonly longitude: FieldRef<"Report", 'Float'>
    readonly status: FieldRef<"Report", 'ReportStatus'>
    readonly severity: FieldRef<"Report", 'Int'>
    readonly imageUrl: FieldRef<"Report", 'String'>
    readonly createdAt: FieldRef<"Report", 'DateTime'>
    readonly updatedAt: FieldRef<"Report", 'DateTime'>
    readonly userId: FieldRef<"Report", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report createManyAndReturn
   */
  export type ReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report updateManyAndReturn
   */
  export type ReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to delete.
     */
    limit?: number
  }

  /**
   * Report.user
   */
  export type Report$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Report.media
   */
  export type Report$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    cursor?: MediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
  }


  /**
   * Model Media
   */

  export type AggregateMedia = {
    _count: MediaCountAggregateOutputType | null
    _min: MediaMinAggregateOutputType | null
    _max: MediaMaxAggregateOutputType | null
  }

  export type MediaMinAggregateOutputType = {
    id: string | null
    mediaUrl: string | null
    mediaType: $Enums.MediaType | null
    uploadedAt: Date | null
    reportId: string | null
  }

  export type MediaMaxAggregateOutputType = {
    id: string | null
    mediaUrl: string | null
    mediaType: $Enums.MediaType | null
    uploadedAt: Date | null
    reportId: string | null
  }

  export type MediaCountAggregateOutputType = {
    id: number
    mediaUrl: number
    mediaType: number
    uploadedAt: number
    reportId: number
    _all: number
  }


  export type MediaMinAggregateInputType = {
    id?: true
    mediaUrl?: true
    mediaType?: true
    uploadedAt?: true
    reportId?: true
  }

  export type MediaMaxAggregateInputType = {
    id?: true
    mediaUrl?: true
    mediaType?: true
    uploadedAt?: true
    reportId?: true
  }

  export type MediaCountAggregateInputType = {
    id?: true
    mediaUrl?: true
    mediaType?: true
    uploadedAt?: true
    reportId?: true
    _all?: true
  }

  export type MediaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Media to aggregate.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Media
    **/
    _count?: true | MediaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaMaxAggregateInputType
  }

  export type GetMediaAggregateType<T extends MediaAggregateArgs> = {
        [P in keyof T & keyof AggregateMedia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedia[P]>
      : GetScalarType<T[P], AggregateMedia[P]>
  }




  export type MediaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithAggregationInput | MediaOrderByWithAggregationInput[]
    by: MediaScalarFieldEnum[] | MediaScalarFieldEnum
    having?: MediaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaCountAggregateInputType | true
    _min?: MediaMinAggregateInputType
    _max?: MediaMaxAggregateInputType
  }

  export type MediaGroupByOutputType = {
    id: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt: Date
    reportId: string
    _count: MediaCountAggregateOutputType | null
    _min: MediaMinAggregateOutputType | null
    _max: MediaMaxAggregateOutputType | null
  }

  type GetMediaGroupByPayload<T extends MediaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaGroupByOutputType[P]>
            : GetScalarType<T[P], MediaGroupByOutputType[P]>
        }
      >
    >


  export type MediaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    uploadedAt?: boolean
    reportId?: boolean
    report?: boolean | ReportDefaultArgs<ExtArgs>
    detections?: boolean | Media$detectionsArgs<ExtArgs>
    _count?: boolean | MediaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>

  export type MediaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    uploadedAt?: boolean
    reportId?: boolean
    report?: boolean | ReportDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>

  export type MediaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    uploadedAt?: boolean
    reportId?: boolean
    report?: boolean | ReportDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>

  export type MediaSelectScalar = {
    id?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    uploadedAt?: boolean
    reportId?: boolean
  }

  export type MediaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mediaUrl" | "mediaType" | "uploadedAt" | "reportId", ExtArgs["result"]["media"]>
  export type MediaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | ReportDefaultArgs<ExtArgs>
    detections?: boolean | Media$detectionsArgs<ExtArgs>
    _count?: boolean | MediaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MediaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | ReportDefaultArgs<ExtArgs>
  }
  export type MediaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | ReportDefaultArgs<ExtArgs>
  }

  export type $MediaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Media"
    objects: {
      report: Prisma.$ReportPayload<ExtArgs>
      detections: Prisma.$DetectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mediaUrl: string
      mediaType: $Enums.MediaType
      uploadedAt: Date
      reportId: string
    }, ExtArgs["result"]["media"]>
    composites: {}
  }

  type MediaGetPayload<S extends boolean | null | undefined | MediaDefaultArgs> = $Result.GetResult<Prisma.$MediaPayload, S>

  type MediaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaCountAggregateInputType | true
    }

  export interface MediaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Media'], meta: { name: 'Media' } }
    /**
     * Find zero or one Media that matches the filter.
     * @param {MediaFindUniqueArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaFindUniqueArgs>(args: SelectSubset<T, MediaFindUniqueArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Media that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaFindUniqueOrThrowArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindFirstArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaFindFirstArgs>(args?: SelectSubset<T, MediaFindFirstArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindFirstOrThrowArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Media that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Media
     * const media = await prisma.media.findMany()
     * 
     * // Get first 10 Media
     * const media = await prisma.media.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaWithIdOnly = await prisma.media.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaFindManyArgs>(args?: SelectSubset<T, MediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Media.
     * @param {MediaCreateArgs} args - Arguments to create a Media.
     * @example
     * // Create one Media
     * const Media = await prisma.media.create({
     *   data: {
     *     // ... data to create a Media
     *   }
     * })
     * 
     */
    create<T extends MediaCreateArgs>(args: SelectSubset<T, MediaCreateArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Media.
     * @param {MediaCreateManyArgs} args - Arguments to create many Media.
     * @example
     * // Create many Media
     * const media = await prisma.media.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaCreateManyArgs>(args?: SelectSubset<T, MediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Media and returns the data saved in the database.
     * @param {MediaCreateManyAndReturnArgs} args - Arguments to create many Media.
     * @example
     * // Create many Media
     * const media = await prisma.media.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Media and only return the `id`
     * const mediaWithIdOnly = await prisma.media.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MediaCreateManyAndReturnArgs>(args?: SelectSubset<T, MediaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Media.
     * @param {MediaDeleteArgs} args - Arguments to delete one Media.
     * @example
     * // Delete one Media
     * const Media = await prisma.media.delete({
     *   where: {
     *     // ... filter to delete one Media
     *   }
     * })
     * 
     */
    delete<T extends MediaDeleteArgs>(args: SelectSubset<T, MediaDeleteArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Media.
     * @param {MediaUpdateArgs} args - Arguments to update one Media.
     * @example
     * // Update one Media
     * const media = await prisma.media.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaUpdateArgs>(args: SelectSubset<T, MediaUpdateArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Media.
     * @param {MediaDeleteManyArgs} args - Arguments to filter Media to delete.
     * @example
     * // Delete a few Media
     * const { count } = await prisma.media.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaDeleteManyArgs>(args?: SelectSubset<T, MediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Media
     * const media = await prisma.media.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaUpdateManyArgs>(args: SelectSubset<T, MediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Media and returns the data updated in the database.
     * @param {MediaUpdateManyAndReturnArgs} args - Arguments to update many Media.
     * @example
     * // Update many Media
     * const media = await prisma.media.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Media and only return the `id`
     * const mediaWithIdOnly = await prisma.media.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MediaUpdateManyAndReturnArgs>(args: SelectSubset<T, MediaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Media.
     * @param {MediaUpsertArgs} args - Arguments to update or create a Media.
     * @example
     * // Update or create a Media
     * const media = await prisma.media.upsert({
     *   create: {
     *     // ... data to create a Media
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Media we want to update
     *   }
     * })
     */
    upsert<T extends MediaUpsertArgs>(args: SelectSubset<T, MediaUpsertArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaCountArgs} args - Arguments to filter Media to count.
     * @example
     * // Count the number of Media
     * const count = await prisma.media.count({
     *   where: {
     *     // ... the filter for the Media we want to count
     *   }
     * })
    **/
    count<T extends MediaCountArgs>(
      args?: Subset<T, MediaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MediaAggregateArgs>(args: Subset<T, MediaAggregateArgs>): Prisma.PrismaPromise<GetMediaAggregateType<T>>

    /**
     * Group by Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MediaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaGroupByArgs['orderBy'] }
        : { orderBy?: MediaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Media model
   */
  readonly fields: MediaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Media.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    report<T extends ReportDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReportDefaultArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    detections<T extends Media$detectionsArgs<ExtArgs> = {}>(args?: Subset<T, Media$detectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Media model
   */
  interface MediaFieldRefs {
    readonly id: FieldRef<"Media", 'String'>
    readonly mediaUrl: FieldRef<"Media", 'String'>
    readonly mediaType: FieldRef<"Media", 'MediaType'>
    readonly uploadedAt: FieldRef<"Media", 'DateTime'>
    readonly reportId: FieldRef<"Media", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Media findUnique
   */
  export type MediaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media findUniqueOrThrow
   */
  export type MediaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media findFirst
   */
  export type MediaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Media.
     */
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media findFirstOrThrow
   */
  export type MediaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Media.
     */
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media findMany
   */
  export type MediaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media create
   */
  export type MediaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The data needed to create a Media.
     */
    data: XOR<MediaCreateInput, MediaUncheckedCreateInput>
  }

  /**
   * Media createMany
   */
  export type MediaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Media.
     */
    data: MediaCreateManyInput | MediaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Media createManyAndReturn
   */
  export type MediaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * The data used to create many Media.
     */
    data: MediaCreateManyInput | MediaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Media update
   */
  export type MediaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The data needed to update a Media.
     */
    data: XOR<MediaUpdateInput, MediaUncheckedUpdateInput>
    /**
     * Choose, which Media to update.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media updateMany
   */
  export type MediaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Media.
     */
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyInput>
    /**
     * Filter which Media to update
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to update.
     */
    limit?: number
  }

  /**
   * Media updateManyAndReturn
   */
  export type MediaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * The data used to update Media.
     */
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyInput>
    /**
     * Filter which Media to update
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Media upsert
   */
  export type MediaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The filter to search for the Media to update in case it exists.
     */
    where: MediaWhereUniqueInput
    /**
     * In case the Media found by the `where` argument doesn't exist, create a new Media with this data.
     */
    create: XOR<MediaCreateInput, MediaUncheckedCreateInput>
    /**
     * In case the Media was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaUpdateInput, MediaUncheckedUpdateInput>
  }

  /**
   * Media delete
   */
  export type MediaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter which Media to delete.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media deleteMany
   */
  export type MediaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Media to delete
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to delete.
     */
    limit?: number
  }

  /**
   * Media.detections
   */
  export type Media$detectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    where?: DetectionWhereInput
    orderBy?: DetectionOrderByWithRelationInput | DetectionOrderByWithRelationInput[]
    cursor?: DetectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetectionScalarFieldEnum | DetectionScalarFieldEnum[]
  }

  /**
   * Media without action
   */
  export type MediaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
  }


  /**
   * Model Detection
   */

  export type AggregateDetection = {
    _count: DetectionCountAggregateOutputType | null
    _avg: DetectionAvgAggregateOutputType | null
    _sum: DetectionSumAggregateOutputType | null
    _min: DetectionMinAggregateOutputType | null
    _max: DetectionMaxAggregateOutputType | null
  }

  export type DetectionAvgAggregateOutputType = {
    confidence: number | null
    bboxX: number | null
    bboxY: number | null
    bboxWidth: number | null
    bboxHeight: number | null
    frameTime: number | null
  }

  export type DetectionSumAggregateOutputType = {
    confidence: number | null
    bboxX: number | null
    bboxY: number | null
    bboxWidth: number | null
    bboxHeight: number | null
    frameTime: number | null
  }

  export type DetectionMinAggregateOutputType = {
    id: string | null
    detectedClass: string | null
    confidence: number | null
    bboxX: number | null
    bboxY: number | null
    bboxWidth: number | null
    bboxHeight: number | null
    frameTime: number | null
    createdAt: Date | null
    mediaId: string | null
  }

  export type DetectionMaxAggregateOutputType = {
    id: string | null
    detectedClass: string | null
    confidence: number | null
    bboxX: number | null
    bboxY: number | null
    bboxWidth: number | null
    bboxHeight: number | null
    frameTime: number | null
    createdAt: Date | null
    mediaId: string | null
  }

  export type DetectionCountAggregateOutputType = {
    id: number
    detectedClass: number
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime: number
    createdAt: number
    mediaId: number
    _all: number
  }


  export type DetectionAvgAggregateInputType = {
    confidence?: true
    bboxX?: true
    bboxY?: true
    bboxWidth?: true
    bboxHeight?: true
    frameTime?: true
  }

  export type DetectionSumAggregateInputType = {
    confidence?: true
    bboxX?: true
    bboxY?: true
    bboxWidth?: true
    bboxHeight?: true
    frameTime?: true
  }

  export type DetectionMinAggregateInputType = {
    id?: true
    detectedClass?: true
    confidence?: true
    bboxX?: true
    bboxY?: true
    bboxWidth?: true
    bboxHeight?: true
    frameTime?: true
    createdAt?: true
    mediaId?: true
  }

  export type DetectionMaxAggregateInputType = {
    id?: true
    detectedClass?: true
    confidence?: true
    bboxX?: true
    bboxY?: true
    bboxWidth?: true
    bboxHeight?: true
    frameTime?: true
    createdAt?: true
    mediaId?: true
  }

  export type DetectionCountAggregateInputType = {
    id?: true
    detectedClass?: true
    confidence?: true
    bboxX?: true
    bboxY?: true
    bboxWidth?: true
    bboxHeight?: true
    frameTime?: true
    createdAt?: true
    mediaId?: true
    _all?: true
  }

  export type DetectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Detection to aggregate.
     */
    where?: DetectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Detections to fetch.
     */
    orderBy?: DetectionOrderByWithRelationInput | DetectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DetectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Detections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Detections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Detections
    **/
    _count?: true | DetectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DetectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DetectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DetectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DetectionMaxAggregateInputType
  }

  export type GetDetectionAggregateType<T extends DetectionAggregateArgs> = {
        [P in keyof T & keyof AggregateDetection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDetection[P]>
      : GetScalarType<T[P], AggregateDetection[P]>
  }




  export type DetectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetectionWhereInput
    orderBy?: DetectionOrderByWithAggregationInput | DetectionOrderByWithAggregationInput[]
    by: DetectionScalarFieldEnum[] | DetectionScalarFieldEnum
    having?: DetectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DetectionCountAggregateInputType | true
    _avg?: DetectionAvgAggregateInputType
    _sum?: DetectionSumAggregateInputType
    _min?: DetectionMinAggregateInputType
    _max?: DetectionMaxAggregateInputType
  }

  export type DetectionGroupByOutputType = {
    id: string
    detectedClass: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime: number | null
    createdAt: Date
    mediaId: string
    _count: DetectionCountAggregateOutputType | null
    _avg: DetectionAvgAggregateOutputType | null
    _sum: DetectionSumAggregateOutputType | null
    _min: DetectionMinAggregateOutputType | null
    _max: DetectionMaxAggregateOutputType | null
  }

  type GetDetectionGroupByPayload<T extends DetectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DetectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DetectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DetectionGroupByOutputType[P]>
            : GetScalarType<T[P], DetectionGroupByOutputType[P]>
        }
      >
    >


  export type DetectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    detectedClass?: boolean
    confidence?: boolean
    bboxX?: boolean
    bboxY?: boolean
    bboxWidth?: boolean
    bboxHeight?: boolean
    frameTime?: boolean
    createdAt?: boolean
    mediaId?: boolean
    media?: boolean | MediaDefaultArgs<ExtArgs>
    pothole?: boolean | Detection$potholeArgs<ExtArgs>
  }, ExtArgs["result"]["detection"]>

  export type DetectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    detectedClass?: boolean
    confidence?: boolean
    bboxX?: boolean
    bboxY?: boolean
    bboxWidth?: boolean
    bboxHeight?: boolean
    frameTime?: boolean
    createdAt?: boolean
    mediaId?: boolean
    media?: boolean | MediaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detection"]>

  export type DetectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    detectedClass?: boolean
    confidence?: boolean
    bboxX?: boolean
    bboxY?: boolean
    bboxWidth?: boolean
    bboxHeight?: boolean
    frameTime?: boolean
    createdAt?: boolean
    mediaId?: boolean
    media?: boolean | MediaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detection"]>

  export type DetectionSelectScalar = {
    id?: boolean
    detectedClass?: boolean
    confidence?: boolean
    bboxX?: boolean
    bboxY?: boolean
    bboxWidth?: boolean
    bboxHeight?: boolean
    frameTime?: boolean
    createdAt?: boolean
    mediaId?: boolean
  }

  export type DetectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "detectedClass" | "confidence" | "bboxX" | "bboxY" | "bboxWidth" | "bboxHeight" | "frameTime" | "createdAt" | "mediaId", ExtArgs["result"]["detection"]>
  export type DetectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | MediaDefaultArgs<ExtArgs>
    pothole?: boolean | Detection$potholeArgs<ExtArgs>
  }
  export type DetectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | MediaDefaultArgs<ExtArgs>
  }
  export type DetectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | MediaDefaultArgs<ExtArgs>
  }

  export type $DetectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Detection"
    objects: {
      media: Prisma.$MediaPayload<ExtArgs>
      pothole: Prisma.$PotholePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      detectedClass: string
      confidence: number
      bboxX: number
      bboxY: number
      bboxWidth: number
      bboxHeight: number
      frameTime: number | null
      createdAt: Date
      mediaId: string
    }, ExtArgs["result"]["detection"]>
    composites: {}
  }

  type DetectionGetPayload<S extends boolean | null | undefined | DetectionDefaultArgs> = $Result.GetResult<Prisma.$DetectionPayload, S>

  type DetectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DetectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DetectionCountAggregateInputType | true
    }

  export interface DetectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Detection'], meta: { name: 'Detection' } }
    /**
     * Find zero or one Detection that matches the filter.
     * @param {DetectionFindUniqueArgs} args - Arguments to find a Detection
     * @example
     * // Get one Detection
     * const detection = await prisma.detection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DetectionFindUniqueArgs>(args: SelectSubset<T, DetectionFindUniqueArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Detection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DetectionFindUniqueOrThrowArgs} args - Arguments to find a Detection
     * @example
     * // Get one Detection
     * const detection = await prisma.detection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DetectionFindUniqueOrThrowArgs>(args: SelectSubset<T, DetectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Detection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionFindFirstArgs} args - Arguments to find a Detection
     * @example
     * // Get one Detection
     * const detection = await prisma.detection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DetectionFindFirstArgs>(args?: SelectSubset<T, DetectionFindFirstArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Detection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionFindFirstOrThrowArgs} args - Arguments to find a Detection
     * @example
     * // Get one Detection
     * const detection = await prisma.detection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DetectionFindFirstOrThrowArgs>(args?: SelectSubset<T, DetectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Detections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Detections
     * const detections = await prisma.detection.findMany()
     * 
     * // Get first 10 Detections
     * const detections = await prisma.detection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const detectionWithIdOnly = await prisma.detection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DetectionFindManyArgs>(args?: SelectSubset<T, DetectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Detection.
     * @param {DetectionCreateArgs} args - Arguments to create a Detection.
     * @example
     * // Create one Detection
     * const Detection = await prisma.detection.create({
     *   data: {
     *     // ... data to create a Detection
     *   }
     * })
     * 
     */
    create<T extends DetectionCreateArgs>(args: SelectSubset<T, DetectionCreateArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Detections.
     * @param {DetectionCreateManyArgs} args - Arguments to create many Detections.
     * @example
     * // Create many Detections
     * const detection = await prisma.detection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DetectionCreateManyArgs>(args?: SelectSubset<T, DetectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Detections and returns the data saved in the database.
     * @param {DetectionCreateManyAndReturnArgs} args - Arguments to create many Detections.
     * @example
     * // Create many Detections
     * const detection = await prisma.detection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Detections and only return the `id`
     * const detectionWithIdOnly = await prisma.detection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DetectionCreateManyAndReturnArgs>(args?: SelectSubset<T, DetectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Detection.
     * @param {DetectionDeleteArgs} args - Arguments to delete one Detection.
     * @example
     * // Delete one Detection
     * const Detection = await prisma.detection.delete({
     *   where: {
     *     // ... filter to delete one Detection
     *   }
     * })
     * 
     */
    delete<T extends DetectionDeleteArgs>(args: SelectSubset<T, DetectionDeleteArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Detection.
     * @param {DetectionUpdateArgs} args - Arguments to update one Detection.
     * @example
     * // Update one Detection
     * const detection = await prisma.detection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DetectionUpdateArgs>(args: SelectSubset<T, DetectionUpdateArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Detections.
     * @param {DetectionDeleteManyArgs} args - Arguments to filter Detections to delete.
     * @example
     * // Delete a few Detections
     * const { count } = await prisma.detection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DetectionDeleteManyArgs>(args?: SelectSubset<T, DetectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Detections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Detections
     * const detection = await prisma.detection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DetectionUpdateManyArgs>(args: SelectSubset<T, DetectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Detections and returns the data updated in the database.
     * @param {DetectionUpdateManyAndReturnArgs} args - Arguments to update many Detections.
     * @example
     * // Update many Detections
     * const detection = await prisma.detection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Detections and only return the `id`
     * const detectionWithIdOnly = await prisma.detection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DetectionUpdateManyAndReturnArgs>(args: SelectSubset<T, DetectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Detection.
     * @param {DetectionUpsertArgs} args - Arguments to update or create a Detection.
     * @example
     * // Update or create a Detection
     * const detection = await prisma.detection.upsert({
     *   create: {
     *     // ... data to create a Detection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Detection we want to update
     *   }
     * })
     */
    upsert<T extends DetectionUpsertArgs>(args: SelectSubset<T, DetectionUpsertArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Detections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionCountArgs} args - Arguments to filter Detections to count.
     * @example
     * // Count the number of Detections
     * const count = await prisma.detection.count({
     *   where: {
     *     // ... the filter for the Detections we want to count
     *   }
     * })
    **/
    count<T extends DetectionCountArgs>(
      args?: Subset<T, DetectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DetectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Detection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DetectionAggregateArgs>(args: Subset<T, DetectionAggregateArgs>): Prisma.PrismaPromise<GetDetectionAggregateType<T>>

    /**
     * Group by Detection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DetectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DetectionGroupByArgs['orderBy'] }
        : { orderBy?: DetectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DetectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDetectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Detection model
   */
  readonly fields: DetectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Detection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DetectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    media<T extends MediaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MediaDefaultArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pothole<T extends Detection$potholeArgs<ExtArgs> = {}>(args?: Subset<T, Detection$potholeArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Detection model
   */
  interface DetectionFieldRefs {
    readonly id: FieldRef<"Detection", 'String'>
    readonly detectedClass: FieldRef<"Detection", 'String'>
    readonly confidence: FieldRef<"Detection", 'Float'>
    readonly bboxX: FieldRef<"Detection", 'Float'>
    readonly bboxY: FieldRef<"Detection", 'Float'>
    readonly bboxWidth: FieldRef<"Detection", 'Float'>
    readonly bboxHeight: FieldRef<"Detection", 'Float'>
    readonly frameTime: FieldRef<"Detection", 'Float'>
    readonly createdAt: FieldRef<"Detection", 'DateTime'>
    readonly mediaId: FieldRef<"Detection", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Detection findUnique
   */
  export type DetectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * Filter, which Detection to fetch.
     */
    where: DetectionWhereUniqueInput
  }

  /**
   * Detection findUniqueOrThrow
   */
  export type DetectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * Filter, which Detection to fetch.
     */
    where: DetectionWhereUniqueInput
  }

  /**
   * Detection findFirst
   */
  export type DetectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * Filter, which Detection to fetch.
     */
    where?: DetectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Detections to fetch.
     */
    orderBy?: DetectionOrderByWithRelationInput | DetectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Detections.
     */
    cursor?: DetectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Detections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Detections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Detections.
     */
    distinct?: DetectionScalarFieldEnum | DetectionScalarFieldEnum[]
  }

  /**
   * Detection findFirstOrThrow
   */
  export type DetectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * Filter, which Detection to fetch.
     */
    where?: DetectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Detections to fetch.
     */
    orderBy?: DetectionOrderByWithRelationInput | DetectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Detections.
     */
    cursor?: DetectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Detections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Detections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Detections.
     */
    distinct?: DetectionScalarFieldEnum | DetectionScalarFieldEnum[]
  }

  /**
   * Detection findMany
   */
  export type DetectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * Filter, which Detections to fetch.
     */
    where?: DetectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Detections to fetch.
     */
    orderBy?: DetectionOrderByWithRelationInput | DetectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Detections.
     */
    cursor?: DetectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Detections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Detections.
     */
    skip?: number
    distinct?: DetectionScalarFieldEnum | DetectionScalarFieldEnum[]
  }

  /**
   * Detection create
   */
  export type DetectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Detection.
     */
    data: XOR<DetectionCreateInput, DetectionUncheckedCreateInput>
  }

  /**
   * Detection createMany
   */
  export type DetectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Detections.
     */
    data: DetectionCreateManyInput | DetectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Detection createManyAndReturn
   */
  export type DetectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * The data used to create many Detections.
     */
    data: DetectionCreateManyInput | DetectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Detection update
   */
  export type DetectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Detection.
     */
    data: XOR<DetectionUpdateInput, DetectionUncheckedUpdateInput>
    /**
     * Choose, which Detection to update.
     */
    where: DetectionWhereUniqueInput
  }

  /**
   * Detection updateMany
   */
  export type DetectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Detections.
     */
    data: XOR<DetectionUpdateManyMutationInput, DetectionUncheckedUpdateManyInput>
    /**
     * Filter which Detections to update
     */
    where?: DetectionWhereInput
    /**
     * Limit how many Detections to update.
     */
    limit?: number
  }

  /**
   * Detection updateManyAndReturn
   */
  export type DetectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * The data used to update Detections.
     */
    data: XOR<DetectionUpdateManyMutationInput, DetectionUncheckedUpdateManyInput>
    /**
     * Filter which Detections to update
     */
    where?: DetectionWhereInput
    /**
     * Limit how many Detections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Detection upsert
   */
  export type DetectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Detection to update in case it exists.
     */
    where: DetectionWhereUniqueInput
    /**
     * In case the Detection found by the `where` argument doesn't exist, create a new Detection with this data.
     */
    create: XOR<DetectionCreateInput, DetectionUncheckedCreateInput>
    /**
     * In case the Detection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DetectionUpdateInput, DetectionUncheckedUpdateInput>
  }

  /**
   * Detection delete
   */
  export type DetectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
    /**
     * Filter which Detection to delete.
     */
    where: DetectionWhereUniqueInput
  }

  /**
   * Detection deleteMany
   */
  export type DetectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Detections to delete
     */
    where?: DetectionWhereInput
    /**
     * Limit how many Detections to delete.
     */
    limit?: number
  }

  /**
   * Detection.pothole
   */
  export type Detection$potholeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    where?: PotholeWhereInput
  }

  /**
   * Detection without action
   */
  export type DetectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Detection
     */
    select?: DetectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Detection
     */
    omit?: DetectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetectionInclude<ExtArgs> | null
  }


  /**
   * Model Pothole
   */

  export type AggregatePothole = {
    _count: PotholeCountAggregateOutputType | null
    _avg: PotholeAvgAggregateOutputType | null
    _sum: PotholeSumAggregateOutputType | null
    _min: PotholeMinAggregateOutputType | null
    _max: PotholeMaxAggregateOutputType | null
  }

  export type PotholeAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    priorityScore: number | null
  }

  export type PotholeSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    priorityScore: number | null
  }

  export type PotholeMinAggregateOutputType = {
    id: string | null
    latitude: number | null
    longitude: number | null
    imageUrl: string | null
    detectionId: string | null
    priorityScore: number | null
    priorityLevel: $Enums.PriorityLevel | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PotholeMaxAggregateOutputType = {
    id: string | null
    latitude: number | null
    longitude: number | null
    imageUrl: string | null
    detectionId: string | null
    priorityScore: number | null
    priorityLevel: $Enums.PriorityLevel | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PotholeCountAggregateOutputType = {
    id: number
    latitude: number
    longitude: number
    imageUrl: number
    detectionId: number
    priorityScore: number
    priorityLevel: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PotholeAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    priorityScore?: true
  }

  export type PotholeSumAggregateInputType = {
    latitude?: true
    longitude?: true
    priorityScore?: true
  }

  export type PotholeMinAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    imageUrl?: true
    detectionId?: true
    priorityScore?: true
    priorityLevel?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PotholeMaxAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    imageUrl?: true
    detectionId?: true
    priorityScore?: true
    priorityLevel?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PotholeCountAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    imageUrl?: true
    detectionId?: true
    priorityScore?: true
    priorityLevel?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PotholeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pothole to aggregate.
     */
    where?: PotholeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Potholes to fetch.
     */
    orderBy?: PotholeOrderByWithRelationInput | PotholeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PotholeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Potholes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Potholes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Potholes
    **/
    _count?: true | PotholeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PotholeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PotholeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PotholeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PotholeMaxAggregateInputType
  }

  export type GetPotholeAggregateType<T extends PotholeAggregateArgs> = {
        [P in keyof T & keyof AggregatePothole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePothole[P]>
      : GetScalarType<T[P], AggregatePothole[P]>
  }




  export type PotholeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PotholeWhereInput
    orderBy?: PotholeOrderByWithAggregationInput | PotholeOrderByWithAggregationInput[]
    by: PotholeScalarFieldEnum[] | PotholeScalarFieldEnum
    having?: PotholeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PotholeCountAggregateInputType | true
    _avg?: PotholeAvgAggregateInputType
    _sum?: PotholeSumAggregateInputType
    _min?: PotholeMinAggregateInputType
    _max?: PotholeMaxAggregateInputType
  }

  export type PotholeGroupByOutputType = {
    id: string
    latitude: number
    longitude: number
    imageUrl: string | null
    detectionId: string
    priorityScore: number | null
    priorityLevel: $Enums.PriorityLevel | null
    createdAt: Date
    updatedAt: Date
    _count: PotholeCountAggregateOutputType | null
    _avg: PotholeAvgAggregateOutputType | null
    _sum: PotholeSumAggregateOutputType | null
    _min: PotholeMinAggregateOutputType | null
    _max: PotholeMaxAggregateOutputType | null
  }

  type GetPotholeGroupByPayload<T extends PotholeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PotholeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PotholeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PotholeGroupByOutputType[P]>
            : GetScalarType<T[P], PotholeGroupByOutputType[P]>
        }
      >
    >


  export type PotholeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    detectionId?: boolean
    priorityScore?: boolean
    priorityLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    detection?: boolean | DetectionDefaultArgs<ExtArgs>
    roadInfo?: boolean | Pothole$roadInfoArgs<ExtArgs>
    ticket?: boolean | Pothole$ticketArgs<ExtArgs>
  }, ExtArgs["result"]["pothole"]>

  export type PotholeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    detectionId?: boolean
    priorityScore?: boolean
    priorityLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    detection?: boolean | DetectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pothole"]>

  export type PotholeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    detectionId?: boolean
    priorityScore?: boolean
    priorityLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    detection?: boolean | DetectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pothole"]>

  export type PotholeSelectScalar = {
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    imageUrl?: boolean
    detectionId?: boolean
    priorityScore?: boolean
    priorityLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PotholeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "latitude" | "longitude" | "imageUrl" | "detectionId" | "priorityScore" | "priorityLevel" | "createdAt" | "updatedAt", ExtArgs["result"]["pothole"]>
  export type PotholeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detection?: boolean | DetectionDefaultArgs<ExtArgs>
    roadInfo?: boolean | Pothole$roadInfoArgs<ExtArgs>
    ticket?: boolean | Pothole$ticketArgs<ExtArgs>
  }
  export type PotholeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detection?: boolean | DetectionDefaultArgs<ExtArgs>
  }
  export type PotholeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detection?: boolean | DetectionDefaultArgs<ExtArgs>
  }

  export type $PotholePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pothole"
    objects: {
      detection: Prisma.$DetectionPayload<ExtArgs>
      roadInfo: Prisma.$RoadInfoPayload<ExtArgs> | null
      ticket: Prisma.$TicketPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      latitude: number
      longitude: number
      imageUrl: string | null
      detectionId: string
      priorityScore: number | null
      priorityLevel: $Enums.PriorityLevel | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pothole"]>
    composites: {}
  }

  type PotholeGetPayload<S extends boolean | null | undefined | PotholeDefaultArgs> = $Result.GetResult<Prisma.$PotholePayload, S>

  type PotholeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PotholeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PotholeCountAggregateInputType | true
    }

  export interface PotholeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pothole'], meta: { name: 'Pothole' } }
    /**
     * Find zero or one Pothole that matches the filter.
     * @param {PotholeFindUniqueArgs} args - Arguments to find a Pothole
     * @example
     * // Get one Pothole
     * const pothole = await prisma.pothole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PotholeFindUniqueArgs>(args: SelectSubset<T, PotholeFindUniqueArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pothole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PotholeFindUniqueOrThrowArgs} args - Arguments to find a Pothole
     * @example
     * // Get one Pothole
     * const pothole = await prisma.pothole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PotholeFindUniqueOrThrowArgs>(args: SelectSubset<T, PotholeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pothole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeFindFirstArgs} args - Arguments to find a Pothole
     * @example
     * // Get one Pothole
     * const pothole = await prisma.pothole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PotholeFindFirstArgs>(args?: SelectSubset<T, PotholeFindFirstArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pothole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeFindFirstOrThrowArgs} args - Arguments to find a Pothole
     * @example
     * // Get one Pothole
     * const pothole = await prisma.pothole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PotholeFindFirstOrThrowArgs>(args?: SelectSubset<T, PotholeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Potholes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Potholes
     * const potholes = await prisma.pothole.findMany()
     * 
     * // Get first 10 Potholes
     * const potholes = await prisma.pothole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const potholeWithIdOnly = await prisma.pothole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PotholeFindManyArgs>(args?: SelectSubset<T, PotholeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pothole.
     * @param {PotholeCreateArgs} args - Arguments to create a Pothole.
     * @example
     * // Create one Pothole
     * const Pothole = await prisma.pothole.create({
     *   data: {
     *     // ... data to create a Pothole
     *   }
     * })
     * 
     */
    create<T extends PotholeCreateArgs>(args: SelectSubset<T, PotholeCreateArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Potholes.
     * @param {PotholeCreateManyArgs} args - Arguments to create many Potholes.
     * @example
     * // Create many Potholes
     * const pothole = await prisma.pothole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PotholeCreateManyArgs>(args?: SelectSubset<T, PotholeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Potholes and returns the data saved in the database.
     * @param {PotholeCreateManyAndReturnArgs} args - Arguments to create many Potholes.
     * @example
     * // Create many Potholes
     * const pothole = await prisma.pothole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Potholes and only return the `id`
     * const potholeWithIdOnly = await prisma.pothole.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PotholeCreateManyAndReturnArgs>(args?: SelectSubset<T, PotholeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pothole.
     * @param {PotholeDeleteArgs} args - Arguments to delete one Pothole.
     * @example
     * // Delete one Pothole
     * const Pothole = await prisma.pothole.delete({
     *   where: {
     *     // ... filter to delete one Pothole
     *   }
     * })
     * 
     */
    delete<T extends PotholeDeleteArgs>(args: SelectSubset<T, PotholeDeleteArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pothole.
     * @param {PotholeUpdateArgs} args - Arguments to update one Pothole.
     * @example
     * // Update one Pothole
     * const pothole = await prisma.pothole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PotholeUpdateArgs>(args: SelectSubset<T, PotholeUpdateArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Potholes.
     * @param {PotholeDeleteManyArgs} args - Arguments to filter Potholes to delete.
     * @example
     * // Delete a few Potholes
     * const { count } = await prisma.pothole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PotholeDeleteManyArgs>(args?: SelectSubset<T, PotholeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Potholes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Potholes
     * const pothole = await prisma.pothole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PotholeUpdateManyArgs>(args: SelectSubset<T, PotholeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Potholes and returns the data updated in the database.
     * @param {PotholeUpdateManyAndReturnArgs} args - Arguments to update many Potholes.
     * @example
     * // Update many Potholes
     * const pothole = await prisma.pothole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Potholes and only return the `id`
     * const potholeWithIdOnly = await prisma.pothole.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PotholeUpdateManyAndReturnArgs>(args: SelectSubset<T, PotholeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pothole.
     * @param {PotholeUpsertArgs} args - Arguments to update or create a Pothole.
     * @example
     * // Update or create a Pothole
     * const pothole = await prisma.pothole.upsert({
     *   create: {
     *     // ... data to create a Pothole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pothole we want to update
     *   }
     * })
     */
    upsert<T extends PotholeUpsertArgs>(args: SelectSubset<T, PotholeUpsertArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Potholes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeCountArgs} args - Arguments to filter Potholes to count.
     * @example
     * // Count the number of Potholes
     * const count = await prisma.pothole.count({
     *   where: {
     *     // ... the filter for the Potholes we want to count
     *   }
     * })
    **/
    count<T extends PotholeCountArgs>(
      args?: Subset<T, PotholeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PotholeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pothole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PotholeAggregateArgs>(args: Subset<T, PotholeAggregateArgs>): Prisma.PrismaPromise<GetPotholeAggregateType<T>>

    /**
     * Group by Pothole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PotholeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PotholeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PotholeGroupByArgs['orderBy'] }
        : { orderBy?: PotholeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PotholeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPotholeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pothole model
   */
  readonly fields: PotholeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pothole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PotholeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    detection<T extends DetectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DetectionDefaultArgs<ExtArgs>>): Prisma__DetectionClient<$Result.GetResult<Prisma.$DetectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    roadInfo<T extends Pothole$roadInfoArgs<ExtArgs> = {}>(args?: Subset<T, Pothole$roadInfoArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    ticket<T extends Pothole$ticketArgs<ExtArgs> = {}>(args?: Subset<T, Pothole$ticketArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pothole model
   */
  interface PotholeFieldRefs {
    readonly id: FieldRef<"Pothole", 'String'>
    readonly latitude: FieldRef<"Pothole", 'Float'>
    readonly longitude: FieldRef<"Pothole", 'Float'>
    readonly imageUrl: FieldRef<"Pothole", 'String'>
    readonly detectionId: FieldRef<"Pothole", 'String'>
    readonly priorityScore: FieldRef<"Pothole", 'Float'>
    readonly priorityLevel: FieldRef<"Pothole", 'PriorityLevel'>
    readonly createdAt: FieldRef<"Pothole", 'DateTime'>
    readonly updatedAt: FieldRef<"Pothole", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pothole findUnique
   */
  export type PotholeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * Filter, which Pothole to fetch.
     */
    where: PotholeWhereUniqueInput
  }

  /**
   * Pothole findUniqueOrThrow
   */
  export type PotholeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * Filter, which Pothole to fetch.
     */
    where: PotholeWhereUniqueInput
  }

  /**
   * Pothole findFirst
   */
  export type PotholeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * Filter, which Pothole to fetch.
     */
    where?: PotholeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Potholes to fetch.
     */
    orderBy?: PotholeOrderByWithRelationInput | PotholeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Potholes.
     */
    cursor?: PotholeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Potholes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Potholes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Potholes.
     */
    distinct?: PotholeScalarFieldEnum | PotholeScalarFieldEnum[]
  }

  /**
   * Pothole findFirstOrThrow
   */
  export type PotholeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * Filter, which Pothole to fetch.
     */
    where?: PotholeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Potholes to fetch.
     */
    orderBy?: PotholeOrderByWithRelationInput | PotholeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Potholes.
     */
    cursor?: PotholeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Potholes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Potholes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Potholes.
     */
    distinct?: PotholeScalarFieldEnum | PotholeScalarFieldEnum[]
  }

  /**
   * Pothole findMany
   */
  export type PotholeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * Filter, which Potholes to fetch.
     */
    where?: PotholeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Potholes to fetch.
     */
    orderBy?: PotholeOrderByWithRelationInput | PotholeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Potholes.
     */
    cursor?: PotholeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Potholes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Potholes.
     */
    skip?: number
    distinct?: PotholeScalarFieldEnum | PotholeScalarFieldEnum[]
  }

  /**
   * Pothole create
   */
  export type PotholeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * The data needed to create a Pothole.
     */
    data: XOR<PotholeCreateInput, PotholeUncheckedCreateInput>
  }

  /**
   * Pothole createMany
   */
  export type PotholeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Potholes.
     */
    data: PotholeCreateManyInput | PotholeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pothole createManyAndReturn
   */
  export type PotholeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * The data used to create many Potholes.
     */
    data: PotholeCreateManyInput | PotholeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pothole update
   */
  export type PotholeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * The data needed to update a Pothole.
     */
    data: XOR<PotholeUpdateInput, PotholeUncheckedUpdateInput>
    /**
     * Choose, which Pothole to update.
     */
    where: PotholeWhereUniqueInput
  }

  /**
   * Pothole updateMany
   */
  export type PotholeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Potholes.
     */
    data: XOR<PotholeUpdateManyMutationInput, PotholeUncheckedUpdateManyInput>
    /**
     * Filter which Potholes to update
     */
    where?: PotholeWhereInput
    /**
     * Limit how many Potholes to update.
     */
    limit?: number
  }

  /**
   * Pothole updateManyAndReturn
   */
  export type PotholeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * The data used to update Potholes.
     */
    data: XOR<PotholeUpdateManyMutationInput, PotholeUncheckedUpdateManyInput>
    /**
     * Filter which Potholes to update
     */
    where?: PotholeWhereInput
    /**
     * Limit how many Potholes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pothole upsert
   */
  export type PotholeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * The filter to search for the Pothole to update in case it exists.
     */
    where: PotholeWhereUniqueInput
    /**
     * In case the Pothole found by the `where` argument doesn't exist, create a new Pothole with this data.
     */
    create: XOR<PotholeCreateInput, PotholeUncheckedCreateInput>
    /**
     * In case the Pothole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PotholeUpdateInput, PotholeUncheckedUpdateInput>
  }

  /**
   * Pothole delete
   */
  export type PotholeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
    /**
     * Filter which Pothole to delete.
     */
    where: PotholeWhereUniqueInput
  }

  /**
   * Pothole deleteMany
   */
  export type PotholeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Potholes to delete
     */
    where?: PotholeWhereInput
    /**
     * Limit how many Potholes to delete.
     */
    limit?: number
  }

  /**
   * Pothole.roadInfo
   */
  export type Pothole$roadInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    where?: RoadInfoWhereInput
  }

  /**
   * Pothole.ticket
   */
  export type Pothole$ticketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
  }

  /**
   * Pothole without action
   */
  export type PotholeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pothole
     */
    select?: PotholeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pothole
     */
    omit?: PotholeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PotholeInclude<ExtArgs> | null
  }


  /**
   * Model RoadInfo
   */

  export type AggregateRoadInfo = {
    _count: RoadInfoCountAggregateOutputType | null
    _avg: RoadInfoAvgAggregateOutputType | null
    _sum: RoadInfoSumAggregateOutputType | null
    _min: RoadInfoMinAggregateOutputType | null
    _max: RoadInfoMaxAggregateOutputType | null
  }

  export type RoadInfoAvgAggregateOutputType = {
    speedLimit: number | null
    trafficImportance: number | null
    priorityFactor: number | null
  }

  export type RoadInfoSumAggregateOutputType = {
    speedLimit: number | null
    trafficImportance: number | null
    priorityFactor: number | null
  }

  export type RoadInfoMinAggregateOutputType = {
    id: string | null
    roadName: string | null
    roadType: string | null
    speedLimit: number | null
    trafficImportance: number | null
    priorityFactor: number | null
    potholeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadInfoMaxAggregateOutputType = {
    id: string | null
    roadName: string | null
    roadType: string | null
    speedLimit: number | null
    trafficImportance: number | null
    priorityFactor: number | null
    potholeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadInfoCountAggregateOutputType = {
    id: number
    roadName: number
    roadType: number
    speedLimit: number
    trafficImportance: number
    priorityFactor: number
    osmData: number
    potholeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoadInfoAvgAggregateInputType = {
    speedLimit?: true
    trafficImportance?: true
    priorityFactor?: true
  }

  export type RoadInfoSumAggregateInputType = {
    speedLimit?: true
    trafficImportance?: true
    priorityFactor?: true
  }

  export type RoadInfoMinAggregateInputType = {
    id?: true
    roadName?: true
    roadType?: true
    speedLimit?: true
    trafficImportance?: true
    priorityFactor?: true
    potholeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadInfoMaxAggregateInputType = {
    id?: true
    roadName?: true
    roadType?: true
    speedLimit?: true
    trafficImportance?: true
    priorityFactor?: true
    potholeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadInfoCountAggregateInputType = {
    id?: true
    roadName?: true
    roadType?: true
    speedLimit?: true
    trafficImportance?: true
    priorityFactor?: true
    osmData?: true
    potholeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoadInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadInfo to aggregate.
     */
    where?: RoadInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadInfos to fetch.
     */
    orderBy?: RoadInfoOrderByWithRelationInput | RoadInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadInfos
    **/
    _count?: true | RoadInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoadInfoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoadInfoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadInfoMaxAggregateInputType
  }

  export type GetRoadInfoAggregateType<T extends RoadInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadInfo[P]>
      : GetScalarType<T[P], AggregateRoadInfo[P]>
  }




  export type RoadInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadInfoWhereInput
    orderBy?: RoadInfoOrderByWithAggregationInput | RoadInfoOrderByWithAggregationInput[]
    by: RoadInfoScalarFieldEnum[] | RoadInfoScalarFieldEnum
    having?: RoadInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadInfoCountAggregateInputType | true
    _avg?: RoadInfoAvgAggregateInputType
    _sum?: RoadInfoSumAggregateInputType
    _min?: RoadInfoMinAggregateInputType
    _max?: RoadInfoMaxAggregateInputType
  }

  export type RoadInfoGroupByOutputType = {
    id: string
    roadName: string | null
    roadType: string | null
    speedLimit: number | null
    trafficImportance: number
    priorityFactor: number
    osmData: JsonValue | null
    potholeId: string
    createdAt: Date
    updatedAt: Date
    _count: RoadInfoCountAggregateOutputType | null
    _avg: RoadInfoAvgAggregateOutputType | null
    _sum: RoadInfoSumAggregateOutputType | null
    _min: RoadInfoMinAggregateOutputType | null
    _max: RoadInfoMaxAggregateOutputType | null
  }

  type GetRoadInfoGroupByPayload<T extends RoadInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadInfoGroupByOutputType[P]>
            : GetScalarType<T[P], RoadInfoGroupByOutputType[P]>
        }
      >
    >


  export type RoadInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadName?: boolean
    roadType?: boolean
    speedLimit?: boolean
    trafficImportance?: boolean
    priorityFactor?: boolean
    osmData?: boolean
    potholeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadInfo"]>

  export type RoadInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadName?: boolean
    roadType?: boolean
    speedLimit?: boolean
    trafficImportance?: boolean
    priorityFactor?: boolean
    osmData?: boolean
    potholeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadInfo"]>

  export type RoadInfoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadName?: boolean
    roadType?: boolean
    speedLimit?: boolean
    trafficImportance?: boolean
    priorityFactor?: boolean
    osmData?: boolean
    potholeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadInfo"]>

  export type RoadInfoSelectScalar = {
    id?: boolean
    roadName?: boolean
    roadType?: boolean
    speedLimit?: boolean
    trafficImportance?: boolean
    priorityFactor?: boolean
    osmData?: boolean
    potholeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoadInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roadName" | "roadType" | "speedLimit" | "trafficImportance" | "priorityFactor" | "osmData" | "potholeId" | "createdAt" | "updatedAt", ExtArgs["result"]["roadInfo"]>
  export type RoadInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
  }
  export type RoadInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
  }
  export type RoadInfoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
  }

  export type $RoadInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadInfo"
    objects: {
      pothole: Prisma.$PotholePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roadName: string | null
      roadType: string | null
      speedLimit: number | null
      trafficImportance: number
      priorityFactor: number
      osmData: Prisma.JsonValue | null
      potholeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roadInfo"]>
    composites: {}
  }

  type RoadInfoGetPayload<S extends boolean | null | undefined | RoadInfoDefaultArgs> = $Result.GetResult<Prisma.$RoadInfoPayload, S>

  type RoadInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadInfoCountAggregateInputType | true
    }

  export interface RoadInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadInfo'], meta: { name: 'RoadInfo' } }
    /**
     * Find zero or one RoadInfo that matches the filter.
     * @param {RoadInfoFindUniqueArgs} args - Arguments to find a RoadInfo
     * @example
     * // Get one RoadInfo
     * const roadInfo = await prisma.roadInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadInfoFindUniqueArgs>(args: SelectSubset<T, RoadInfoFindUniqueArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadInfoFindUniqueOrThrowArgs} args - Arguments to find a RoadInfo
     * @example
     * // Get one RoadInfo
     * const roadInfo = await prisma.roadInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoFindFirstArgs} args - Arguments to find a RoadInfo
     * @example
     * // Get one RoadInfo
     * const roadInfo = await prisma.roadInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadInfoFindFirstArgs>(args?: SelectSubset<T, RoadInfoFindFirstArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoFindFirstOrThrowArgs} args - Arguments to find a RoadInfo
     * @example
     * // Get one RoadInfo
     * const roadInfo = await prisma.roadInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadInfos
     * const roadInfos = await prisma.roadInfo.findMany()
     * 
     * // Get first 10 RoadInfos
     * const roadInfos = await prisma.roadInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadInfoWithIdOnly = await prisma.roadInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadInfoFindManyArgs>(args?: SelectSubset<T, RoadInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadInfo.
     * @param {RoadInfoCreateArgs} args - Arguments to create a RoadInfo.
     * @example
     * // Create one RoadInfo
     * const RoadInfo = await prisma.roadInfo.create({
     *   data: {
     *     // ... data to create a RoadInfo
     *   }
     * })
     * 
     */
    create<T extends RoadInfoCreateArgs>(args: SelectSubset<T, RoadInfoCreateArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadInfos.
     * @param {RoadInfoCreateManyArgs} args - Arguments to create many RoadInfos.
     * @example
     * // Create many RoadInfos
     * const roadInfo = await prisma.roadInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadInfoCreateManyArgs>(args?: SelectSubset<T, RoadInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadInfos and returns the data saved in the database.
     * @param {RoadInfoCreateManyAndReturnArgs} args - Arguments to create many RoadInfos.
     * @example
     * // Create many RoadInfos
     * const roadInfo = await prisma.roadInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadInfos and only return the `id`
     * const roadInfoWithIdOnly = await prisma.roadInfo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadInfo.
     * @param {RoadInfoDeleteArgs} args - Arguments to delete one RoadInfo.
     * @example
     * // Delete one RoadInfo
     * const RoadInfo = await prisma.roadInfo.delete({
     *   where: {
     *     // ... filter to delete one RoadInfo
     *   }
     * })
     * 
     */
    delete<T extends RoadInfoDeleteArgs>(args: SelectSubset<T, RoadInfoDeleteArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadInfo.
     * @param {RoadInfoUpdateArgs} args - Arguments to update one RoadInfo.
     * @example
     * // Update one RoadInfo
     * const roadInfo = await prisma.roadInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadInfoUpdateArgs>(args: SelectSubset<T, RoadInfoUpdateArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadInfos.
     * @param {RoadInfoDeleteManyArgs} args - Arguments to filter RoadInfos to delete.
     * @example
     * // Delete a few RoadInfos
     * const { count } = await prisma.roadInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadInfoDeleteManyArgs>(args?: SelectSubset<T, RoadInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadInfos
     * const roadInfo = await prisma.roadInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadInfoUpdateManyArgs>(args: SelectSubset<T, RoadInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadInfos and returns the data updated in the database.
     * @param {RoadInfoUpdateManyAndReturnArgs} args - Arguments to update many RoadInfos.
     * @example
     * // Update many RoadInfos
     * const roadInfo = await prisma.roadInfo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadInfos and only return the `id`
     * const roadInfoWithIdOnly = await prisma.roadInfo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoadInfoUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadInfoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadInfo.
     * @param {RoadInfoUpsertArgs} args - Arguments to update or create a RoadInfo.
     * @example
     * // Update or create a RoadInfo
     * const roadInfo = await prisma.roadInfo.upsert({
     *   create: {
     *     // ... data to create a RoadInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadInfo we want to update
     *   }
     * })
     */
    upsert<T extends RoadInfoUpsertArgs>(args: SelectSubset<T, RoadInfoUpsertArgs<ExtArgs>>): Prisma__RoadInfoClient<$Result.GetResult<Prisma.$RoadInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoCountArgs} args - Arguments to filter RoadInfos to count.
     * @example
     * // Count the number of RoadInfos
     * const count = await prisma.roadInfo.count({
     *   where: {
     *     // ... the filter for the RoadInfos we want to count
     *   }
     * })
    **/
    count<T extends RoadInfoCountArgs>(
      args?: Subset<T, RoadInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoadInfoAggregateArgs>(args: Subset<T, RoadInfoAggregateArgs>): Prisma.PrismaPromise<GetRoadInfoAggregateType<T>>

    /**
     * Group by RoadInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoadInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadInfoGroupByArgs['orderBy'] }
        : { orderBy?: RoadInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoadInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadInfo model
   */
  readonly fields: RoadInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pothole<T extends PotholeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PotholeDefaultArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoadInfo model
   */
  interface RoadInfoFieldRefs {
    readonly id: FieldRef<"RoadInfo", 'String'>
    readonly roadName: FieldRef<"RoadInfo", 'String'>
    readonly roadType: FieldRef<"RoadInfo", 'String'>
    readonly speedLimit: FieldRef<"RoadInfo", 'Int'>
    readonly trafficImportance: FieldRef<"RoadInfo", 'Float'>
    readonly priorityFactor: FieldRef<"RoadInfo", 'Float'>
    readonly osmData: FieldRef<"RoadInfo", 'Json'>
    readonly potholeId: FieldRef<"RoadInfo", 'String'>
    readonly createdAt: FieldRef<"RoadInfo", 'DateTime'>
    readonly updatedAt: FieldRef<"RoadInfo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadInfo findUnique
   */
  export type RoadInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * Filter, which RoadInfo to fetch.
     */
    where: RoadInfoWhereUniqueInput
  }

  /**
   * RoadInfo findUniqueOrThrow
   */
  export type RoadInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * Filter, which RoadInfo to fetch.
     */
    where: RoadInfoWhereUniqueInput
  }

  /**
   * RoadInfo findFirst
   */
  export type RoadInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * Filter, which RoadInfo to fetch.
     */
    where?: RoadInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadInfos to fetch.
     */
    orderBy?: RoadInfoOrderByWithRelationInput | RoadInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadInfos.
     */
    cursor?: RoadInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadInfos.
     */
    distinct?: RoadInfoScalarFieldEnum | RoadInfoScalarFieldEnum[]
  }

  /**
   * RoadInfo findFirstOrThrow
   */
  export type RoadInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * Filter, which RoadInfo to fetch.
     */
    where?: RoadInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadInfos to fetch.
     */
    orderBy?: RoadInfoOrderByWithRelationInput | RoadInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadInfos.
     */
    cursor?: RoadInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadInfos.
     */
    distinct?: RoadInfoScalarFieldEnum | RoadInfoScalarFieldEnum[]
  }

  /**
   * RoadInfo findMany
   */
  export type RoadInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * Filter, which RoadInfos to fetch.
     */
    where?: RoadInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadInfos to fetch.
     */
    orderBy?: RoadInfoOrderByWithRelationInput | RoadInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadInfos.
     */
    cursor?: RoadInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadInfos.
     */
    skip?: number
    distinct?: RoadInfoScalarFieldEnum | RoadInfoScalarFieldEnum[]
  }

  /**
   * RoadInfo create
   */
  export type RoadInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a RoadInfo.
     */
    data: XOR<RoadInfoCreateInput, RoadInfoUncheckedCreateInput>
  }

  /**
   * RoadInfo createMany
   */
  export type RoadInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadInfos.
     */
    data: RoadInfoCreateManyInput | RoadInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadInfo createManyAndReturn
   */
  export type RoadInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * The data used to create many RoadInfos.
     */
    data: RoadInfoCreateManyInput | RoadInfoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadInfo update
   */
  export type RoadInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a RoadInfo.
     */
    data: XOR<RoadInfoUpdateInput, RoadInfoUncheckedUpdateInput>
    /**
     * Choose, which RoadInfo to update.
     */
    where: RoadInfoWhereUniqueInput
  }

  /**
   * RoadInfo updateMany
   */
  export type RoadInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadInfos.
     */
    data: XOR<RoadInfoUpdateManyMutationInput, RoadInfoUncheckedUpdateManyInput>
    /**
     * Filter which RoadInfos to update
     */
    where?: RoadInfoWhereInput
    /**
     * Limit how many RoadInfos to update.
     */
    limit?: number
  }

  /**
   * RoadInfo updateManyAndReturn
   */
  export type RoadInfoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * The data used to update RoadInfos.
     */
    data: XOR<RoadInfoUpdateManyMutationInput, RoadInfoUncheckedUpdateManyInput>
    /**
     * Filter which RoadInfos to update
     */
    where?: RoadInfoWhereInput
    /**
     * Limit how many RoadInfos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadInfo upsert
   */
  export type RoadInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the RoadInfo to update in case it exists.
     */
    where: RoadInfoWhereUniqueInput
    /**
     * In case the RoadInfo found by the `where` argument doesn't exist, create a new RoadInfo with this data.
     */
    create: XOR<RoadInfoCreateInput, RoadInfoUncheckedCreateInput>
    /**
     * In case the RoadInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadInfoUpdateInput, RoadInfoUncheckedUpdateInput>
  }

  /**
   * RoadInfo delete
   */
  export type RoadInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
    /**
     * Filter which RoadInfo to delete.
     */
    where: RoadInfoWhereUniqueInput
  }

  /**
   * RoadInfo deleteMany
   */
  export type RoadInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadInfos to delete
     */
    where?: RoadInfoWhereInput
    /**
     * Limit how many RoadInfos to delete.
     */
    limit?: number
  }

  /**
   * RoadInfo without action
   */
  export type RoadInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadInfo
     */
    select?: RoadInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadInfo
     */
    omit?: RoadInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadInfoInclude<ExtArgs> | null
  }


  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketMinAggregateOutputType = {
    id: string | null
    ticketNumber: string | null
    status: $Enums.TicketStatus | null
    potholeId: string | null
    assignedWorkerId: string | null
    assignedAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    resolvedAt: Date | null
    estimatedETA: Date | null
    notes: string | null
    adminNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketMaxAggregateOutputType = {
    id: string | null
    ticketNumber: string | null
    status: $Enums.TicketStatus | null
    potholeId: string | null
    assignedWorkerId: string | null
    assignedAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    resolvedAt: Date | null
    estimatedETA: Date | null
    notes: string | null
    adminNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    ticketNumber: number
    status: number
    potholeId: number
    assignedWorkerId: number
    assignedAt: number
    startedAt: number
    completedAt: number
    resolvedAt: number
    routeData: number
    estimatedETA: number
    notes: number
    adminNotes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TicketMinAggregateInputType = {
    id?: true
    ticketNumber?: true
    status?: true
    potholeId?: true
    assignedWorkerId?: true
    assignedAt?: true
    startedAt?: true
    completedAt?: true
    resolvedAt?: true
    estimatedETA?: true
    notes?: true
    adminNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    ticketNumber?: true
    status?: true
    potholeId?: true
    assignedWorkerId?: true
    assignedAt?: true
    startedAt?: true
    completedAt?: true
    resolvedAt?: true
    estimatedETA?: true
    notes?: true
    adminNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    ticketNumber?: true
    status?: true
    potholeId?: true
    assignedWorkerId?: true
    assignedAt?: true
    startedAt?: true
    completedAt?: true
    resolvedAt?: true
    routeData?: true
    estimatedETA?: true
    notes?: true
    adminNotes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithAggregationInput | TicketOrderByWithAggregationInput[]
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }

  export type TicketGroupByOutputType = {
    id: string
    ticketNumber: string
    status: $Enums.TicketStatus
    potholeId: string
    assignedWorkerId: string | null
    assignedAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    resolvedAt: Date | null
    routeData: JsonValue | null
    estimatedETA: Date | null
    notes: string | null
    adminNotes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketNumber?: boolean
    status?: boolean
    potholeId?: boolean
    assignedWorkerId?: boolean
    assignedAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    resolvedAt?: boolean
    routeData?: boolean
    estimatedETA?: boolean
    notes?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
    assignedWorker?: boolean | Ticket$assignedWorkerArgs<ExtArgs>
    workProofs?: boolean | Ticket$workProofsArgs<ExtArgs>
    statusHistory?: boolean | Ticket$statusHistoryArgs<ExtArgs>
    _count?: boolean | TicketCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketNumber?: boolean
    status?: boolean
    potholeId?: boolean
    assignedWorkerId?: boolean
    assignedAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    resolvedAt?: boolean
    routeData?: boolean
    estimatedETA?: boolean
    notes?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
    assignedWorker?: boolean | Ticket$assignedWorkerArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketNumber?: boolean
    status?: boolean
    potholeId?: boolean
    assignedWorkerId?: boolean
    assignedAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    resolvedAt?: boolean
    routeData?: boolean
    estimatedETA?: boolean
    notes?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
    assignedWorker?: boolean | Ticket$assignedWorkerArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectScalar = {
    id?: boolean
    ticketNumber?: boolean
    status?: boolean
    potholeId?: boolean
    assignedWorkerId?: boolean
    assignedAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    resolvedAt?: boolean
    routeData?: boolean
    estimatedETA?: boolean
    notes?: boolean
    adminNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketNumber" | "status" | "potholeId" | "assignedWorkerId" | "assignedAt" | "startedAt" | "completedAt" | "resolvedAt" | "routeData" | "estimatedETA" | "notes" | "adminNotes" | "createdAt" | "updatedAt", ExtArgs["result"]["ticket"]>
  export type TicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
    assignedWorker?: boolean | Ticket$assignedWorkerArgs<ExtArgs>
    workProofs?: boolean | Ticket$workProofsArgs<ExtArgs>
    statusHistory?: boolean | Ticket$statusHistoryArgs<ExtArgs>
    _count?: boolean | TicketCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
    assignedWorker?: boolean | Ticket$assignedWorkerArgs<ExtArgs>
  }
  export type TicketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pothole?: boolean | PotholeDefaultArgs<ExtArgs>
    assignedWorker?: boolean | Ticket$assignedWorkerArgs<ExtArgs>
  }

  export type $TicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ticket"
    objects: {
      pothole: Prisma.$PotholePayload<ExtArgs>
      assignedWorker: Prisma.$WorkerPayload<ExtArgs> | null
      workProofs: Prisma.$WorkProofPayload<ExtArgs>[]
      statusHistory: Prisma.$TicketStatusHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketNumber: string
      status: $Enums.TicketStatus
      potholeId: string
      assignedWorkerId: string | null
      assignedAt: Date | null
      startedAt: Date | null
      completedAt: Date | null
      resolvedAt: Date | null
      routeData: Prisma.JsonValue | null
      estimatedETA: Date | null
      notes: string | null
      adminNotes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ticket"]>
    composites: {}
  }

  type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = $Result.GetResult<Prisma.$TicketPayload, S>

  type TicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ticket'], meta: { name: 'Ticket' } }
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketFindManyArgs>(args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
     */
    create<T extends TicketCreateArgs>(args: SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCreateManyArgs>(args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tickets and returns the data saved in the database.
     * @param {TicketCreateManyAndReturnArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
     */
    delete<T extends TicketDeleteArgs>(args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketUpdateArgs>(args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDeleteManyArgs>(args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketUpdateManyArgs>(args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets and returns the data updated in the database.
     * @param {TicketUpdateManyAndReturnArgs} args - Arguments to update many Tickets.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ticket model
   */
  readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pothole<T extends PotholeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PotholeDefaultArgs<ExtArgs>>): Prisma__PotholeClient<$Result.GetResult<Prisma.$PotholePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignedWorker<T extends Ticket$assignedWorkerArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$assignedWorkerArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    workProofs<T extends Ticket$workProofsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$workProofsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    statusHistory<T extends Ticket$statusHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$statusHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ticket model
   */
  interface TicketFieldRefs {
    readonly id: FieldRef<"Ticket", 'String'>
    readonly ticketNumber: FieldRef<"Ticket", 'String'>
    readonly status: FieldRef<"Ticket", 'TicketStatus'>
    readonly potholeId: FieldRef<"Ticket", 'String'>
    readonly assignedWorkerId: FieldRef<"Ticket", 'String'>
    readonly assignedAt: FieldRef<"Ticket", 'DateTime'>
    readonly startedAt: FieldRef<"Ticket", 'DateTime'>
    readonly completedAt: FieldRef<"Ticket", 'DateTime'>
    readonly resolvedAt: FieldRef<"Ticket", 'DateTime'>
    readonly routeData: FieldRef<"Ticket", 'Json'>
    readonly estimatedETA: FieldRef<"Ticket", 'DateTime'>
    readonly notes: FieldRef<"Ticket", 'String'>
    readonly adminNotes: FieldRef<"Ticket", 'String'>
    readonly createdAt: FieldRef<"Ticket", 'DateTime'>
    readonly updatedAt: FieldRef<"Ticket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket create
   */
  export type TicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ticket createManyAndReturn
   */
  export type TicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
  }

  /**
   * Ticket updateManyAndReturn
   */
  export type TicketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to delete.
     */
    limit?: number
  }

  /**
   * Ticket.assignedWorker
   */
  export type Ticket$assignedWorkerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    where?: WorkerWhereInput
  }

  /**
   * Ticket.workProofs
   */
  export type Ticket$workProofsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    where?: WorkProofWhereInput
    orderBy?: WorkProofOrderByWithRelationInput | WorkProofOrderByWithRelationInput[]
    cursor?: WorkProofWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkProofScalarFieldEnum | WorkProofScalarFieldEnum[]
  }

  /**
   * Ticket.statusHistory
   */
  export type Ticket$statusHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    where?: TicketStatusHistoryWhereInput
    orderBy?: TicketStatusHistoryOrderByWithRelationInput | TicketStatusHistoryOrderByWithRelationInput[]
    cursor?: TicketStatusHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketStatusHistoryScalarFieldEnum | TicketStatusHistoryScalarFieldEnum[]
  }

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
  }


  /**
   * Model TicketStatusHistory
   */

  export type AggregateTicketStatusHistory = {
    _count: TicketStatusHistoryCountAggregateOutputType | null
    _min: TicketStatusHistoryMinAggregateOutputType | null
    _max: TicketStatusHistoryMaxAggregateOutputType | null
  }

  export type TicketStatusHistoryMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    fromStatus: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus | null
    changedBy: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type TicketStatusHistoryMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    fromStatus: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus | null
    changedBy: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type TicketStatusHistoryCountAggregateOutputType = {
    id: number
    ticketId: number
    fromStatus: number
    toStatus: number
    changedBy: number
    reason: number
    createdAt: number
    _all: number
  }


  export type TicketStatusHistoryMinAggregateInputType = {
    id?: true
    ticketId?: true
    fromStatus?: true
    toStatus?: true
    changedBy?: true
    reason?: true
    createdAt?: true
  }

  export type TicketStatusHistoryMaxAggregateInputType = {
    id?: true
    ticketId?: true
    fromStatus?: true
    toStatus?: true
    changedBy?: true
    reason?: true
    createdAt?: true
  }

  export type TicketStatusHistoryCountAggregateInputType = {
    id?: true
    ticketId?: true
    fromStatus?: true
    toStatus?: true
    changedBy?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type TicketStatusHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketStatusHistory to aggregate.
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketStatusHistories to fetch.
     */
    orderBy?: TicketStatusHistoryOrderByWithRelationInput | TicketStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketStatusHistories
    **/
    _count?: true | TicketStatusHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketStatusHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketStatusHistoryMaxAggregateInputType
  }

  export type GetTicketStatusHistoryAggregateType<T extends TicketStatusHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketStatusHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketStatusHistory[P]>
      : GetScalarType<T[P], AggregateTicketStatusHistory[P]>
  }




  export type TicketStatusHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketStatusHistoryWhereInput
    orderBy?: TicketStatusHistoryOrderByWithAggregationInput | TicketStatusHistoryOrderByWithAggregationInput[]
    by: TicketStatusHistoryScalarFieldEnum[] | TicketStatusHistoryScalarFieldEnum
    having?: TicketStatusHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketStatusHistoryCountAggregateInputType | true
    _min?: TicketStatusHistoryMinAggregateInputType
    _max?: TicketStatusHistoryMaxAggregateInputType
  }

  export type TicketStatusHistoryGroupByOutputType = {
    id: string
    ticketId: string
    fromStatus: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy: string | null
    reason: string | null
    createdAt: Date
    _count: TicketStatusHistoryCountAggregateOutputType | null
    _min: TicketStatusHistoryMinAggregateOutputType | null
    _max: TicketStatusHistoryMaxAggregateOutputType | null
  }

  type GetTicketStatusHistoryGroupByPayload<T extends TicketStatusHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketStatusHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketStatusHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketStatusHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], TicketStatusHistoryGroupByOutputType[P]>
        }
      >
    >


  export type TicketStatusHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedBy?: boolean
    reason?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketStatusHistory"]>

  export type TicketStatusHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedBy?: boolean
    reason?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketStatusHistory"]>

  export type TicketStatusHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedBy?: boolean
    reason?: boolean
    createdAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketStatusHistory"]>

  export type TicketStatusHistorySelectScalar = {
    id?: boolean
    ticketId?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    changedBy?: boolean
    reason?: boolean
    createdAt?: boolean
  }

  export type TicketStatusHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "fromStatus" | "toStatus" | "changedBy" | "reason" | "createdAt", ExtArgs["result"]["ticketStatusHistory"]>
  export type TicketStatusHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }
  export type TicketStatusHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }
  export type TicketStatusHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }

  export type $TicketStatusHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketStatusHistory"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      fromStatus: $Enums.TicketStatus | null
      toStatus: $Enums.TicketStatus
      changedBy: string | null
      reason: string | null
      createdAt: Date
    }, ExtArgs["result"]["ticketStatusHistory"]>
    composites: {}
  }

  type TicketStatusHistoryGetPayload<S extends boolean | null | undefined | TicketStatusHistoryDefaultArgs> = $Result.GetResult<Prisma.$TicketStatusHistoryPayload, S>

  type TicketStatusHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketStatusHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketStatusHistoryCountAggregateInputType | true
    }

  export interface TicketStatusHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketStatusHistory'], meta: { name: 'TicketStatusHistory' } }
    /**
     * Find zero or one TicketStatusHistory that matches the filter.
     * @param {TicketStatusHistoryFindUniqueArgs} args - Arguments to find a TicketStatusHistory
     * @example
     * // Get one TicketStatusHistory
     * const ticketStatusHistory = await prisma.ticketStatusHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketStatusHistoryFindUniqueArgs>(args: SelectSubset<T, TicketStatusHistoryFindUniqueArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketStatusHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketStatusHistoryFindUniqueOrThrowArgs} args - Arguments to find a TicketStatusHistory
     * @example
     * // Get one TicketStatusHistory
     * const ticketStatusHistory = await prisma.ticketStatusHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketStatusHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketStatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketStatusHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryFindFirstArgs} args - Arguments to find a TicketStatusHistory
     * @example
     * // Get one TicketStatusHistory
     * const ticketStatusHistory = await prisma.ticketStatusHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketStatusHistoryFindFirstArgs>(args?: SelectSubset<T, TicketStatusHistoryFindFirstArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketStatusHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryFindFirstOrThrowArgs} args - Arguments to find a TicketStatusHistory
     * @example
     * // Get one TicketStatusHistory
     * const ticketStatusHistory = await prisma.ticketStatusHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketStatusHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketStatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketStatusHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketStatusHistories
     * const ticketStatusHistories = await prisma.ticketStatusHistory.findMany()
     * 
     * // Get first 10 TicketStatusHistories
     * const ticketStatusHistories = await prisma.ticketStatusHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketStatusHistoryWithIdOnly = await prisma.ticketStatusHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketStatusHistoryFindManyArgs>(args?: SelectSubset<T, TicketStatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketStatusHistory.
     * @param {TicketStatusHistoryCreateArgs} args - Arguments to create a TicketStatusHistory.
     * @example
     * // Create one TicketStatusHistory
     * const TicketStatusHistory = await prisma.ticketStatusHistory.create({
     *   data: {
     *     // ... data to create a TicketStatusHistory
     *   }
     * })
     * 
     */
    create<T extends TicketStatusHistoryCreateArgs>(args: SelectSubset<T, TicketStatusHistoryCreateArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketStatusHistories.
     * @param {TicketStatusHistoryCreateManyArgs} args - Arguments to create many TicketStatusHistories.
     * @example
     * // Create many TicketStatusHistories
     * const ticketStatusHistory = await prisma.ticketStatusHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketStatusHistoryCreateManyArgs>(args?: SelectSubset<T, TicketStatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketStatusHistories and returns the data saved in the database.
     * @param {TicketStatusHistoryCreateManyAndReturnArgs} args - Arguments to create many TicketStatusHistories.
     * @example
     * // Create many TicketStatusHistories
     * const ticketStatusHistory = await prisma.ticketStatusHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketStatusHistories and only return the `id`
     * const ticketStatusHistoryWithIdOnly = await prisma.ticketStatusHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketStatusHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketStatusHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketStatusHistory.
     * @param {TicketStatusHistoryDeleteArgs} args - Arguments to delete one TicketStatusHistory.
     * @example
     * // Delete one TicketStatusHistory
     * const TicketStatusHistory = await prisma.ticketStatusHistory.delete({
     *   where: {
     *     // ... filter to delete one TicketStatusHistory
     *   }
     * })
     * 
     */
    delete<T extends TicketStatusHistoryDeleteArgs>(args: SelectSubset<T, TicketStatusHistoryDeleteArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketStatusHistory.
     * @param {TicketStatusHistoryUpdateArgs} args - Arguments to update one TicketStatusHistory.
     * @example
     * // Update one TicketStatusHistory
     * const ticketStatusHistory = await prisma.ticketStatusHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketStatusHistoryUpdateArgs>(args: SelectSubset<T, TicketStatusHistoryUpdateArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketStatusHistories.
     * @param {TicketStatusHistoryDeleteManyArgs} args - Arguments to filter TicketStatusHistories to delete.
     * @example
     * // Delete a few TicketStatusHistories
     * const { count } = await prisma.ticketStatusHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketStatusHistoryDeleteManyArgs>(args?: SelectSubset<T, TicketStatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketStatusHistories
     * const ticketStatusHistory = await prisma.ticketStatusHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketStatusHistoryUpdateManyArgs>(args: SelectSubset<T, TicketStatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketStatusHistories and returns the data updated in the database.
     * @param {TicketStatusHistoryUpdateManyAndReturnArgs} args - Arguments to update many TicketStatusHistories.
     * @example
     * // Update many TicketStatusHistories
     * const ticketStatusHistory = await prisma.ticketStatusHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketStatusHistories and only return the `id`
     * const ticketStatusHistoryWithIdOnly = await prisma.ticketStatusHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketStatusHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketStatusHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketStatusHistory.
     * @param {TicketStatusHistoryUpsertArgs} args - Arguments to update or create a TicketStatusHistory.
     * @example
     * // Update or create a TicketStatusHistory
     * const ticketStatusHistory = await prisma.ticketStatusHistory.upsert({
     *   create: {
     *     // ... data to create a TicketStatusHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketStatusHistory we want to update
     *   }
     * })
     */
    upsert<T extends TicketStatusHistoryUpsertArgs>(args: SelectSubset<T, TicketStatusHistoryUpsertArgs<ExtArgs>>): Prisma__TicketStatusHistoryClient<$Result.GetResult<Prisma.$TicketStatusHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryCountArgs} args - Arguments to filter TicketStatusHistories to count.
     * @example
     * // Count the number of TicketStatusHistories
     * const count = await prisma.ticketStatusHistory.count({
     *   where: {
     *     // ... the filter for the TicketStatusHistories we want to count
     *   }
     * })
    **/
    count<T extends TicketStatusHistoryCountArgs>(
      args?: Subset<T, TicketStatusHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketStatusHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TicketStatusHistoryAggregateArgs>(args: Subset<T, TicketStatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetTicketStatusHistoryAggregateType<T>>

    /**
     * Group by TicketStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketStatusHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TicketStatusHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketStatusHistoryGroupByArgs['orderBy'] }
        : { orderBy?: TicketStatusHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TicketStatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketStatusHistory model
   */
  readonly fields: TicketStatusHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketStatusHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketStatusHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TicketStatusHistory model
   */
  interface TicketStatusHistoryFieldRefs {
    readonly id: FieldRef<"TicketStatusHistory", 'String'>
    readonly ticketId: FieldRef<"TicketStatusHistory", 'String'>
    readonly fromStatus: FieldRef<"TicketStatusHistory", 'TicketStatus'>
    readonly toStatus: FieldRef<"TicketStatusHistory", 'TicketStatus'>
    readonly changedBy: FieldRef<"TicketStatusHistory", 'String'>
    readonly reason: FieldRef<"TicketStatusHistory", 'String'>
    readonly createdAt: FieldRef<"TicketStatusHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketStatusHistory findUnique
   */
  export type TicketStatusHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TicketStatusHistory to fetch.
     */
    where: TicketStatusHistoryWhereUniqueInput
  }

  /**
   * TicketStatusHistory findUniqueOrThrow
   */
  export type TicketStatusHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TicketStatusHistory to fetch.
     */
    where: TicketStatusHistoryWhereUniqueInput
  }

  /**
   * TicketStatusHistory findFirst
   */
  export type TicketStatusHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TicketStatusHistory to fetch.
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketStatusHistories to fetch.
     */
    orderBy?: TicketStatusHistoryOrderByWithRelationInput | TicketStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketStatusHistories.
     */
    cursor?: TicketStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketStatusHistories.
     */
    distinct?: TicketStatusHistoryScalarFieldEnum | TicketStatusHistoryScalarFieldEnum[]
  }

  /**
   * TicketStatusHistory findFirstOrThrow
   */
  export type TicketStatusHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TicketStatusHistory to fetch.
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketStatusHistories to fetch.
     */
    orderBy?: TicketStatusHistoryOrderByWithRelationInput | TicketStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketStatusHistories.
     */
    cursor?: TicketStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketStatusHistories.
     */
    distinct?: TicketStatusHistoryScalarFieldEnum | TicketStatusHistoryScalarFieldEnum[]
  }

  /**
   * TicketStatusHistory findMany
   */
  export type TicketStatusHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TicketStatusHistories to fetch.
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketStatusHistories to fetch.
     */
    orderBy?: TicketStatusHistoryOrderByWithRelationInput | TicketStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketStatusHistories.
     */
    cursor?: TicketStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketStatusHistories.
     */
    skip?: number
    distinct?: TicketStatusHistoryScalarFieldEnum | TicketStatusHistoryScalarFieldEnum[]
  }

  /**
   * TicketStatusHistory create
   */
  export type TicketStatusHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a TicketStatusHistory.
     */
    data: XOR<TicketStatusHistoryCreateInput, TicketStatusHistoryUncheckedCreateInput>
  }

  /**
   * TicketStatusHistory createMany
   */
  export type TicketStatusHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketStatusHistories.
     */
    data: TicketStatusHistoryCreateManyInput | TicketStatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketStatusHistory createManyAndReturn
   */
  export type TicketStatusHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many TicketStatusHistories.
     */
    data: TicketStatusHistoryCreateManyInput | TicketStatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketStatusHistory update
   */
  export type TicketStatusHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a TicketStatusHistory.
     */
    data: XOR<TicketStatusHistoryUpdateInput, TicketStatusHistoryUncheckedUpdateInput>
    /**
     * Choose, which TicketStatusHistory to update.
     */
    where: TicketStatusHistoryWhereUniqueInput
  }

  /**
   * TicketStatusHistory updateMany
   */
  export type TicketStatusHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketStatusHistories.
     */
    data: XOR<TicketStatusHistoryUpdateManyMutationInput, TicketStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which TicketStatusHistories to update
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * Limit how many TicketStatusHistories to update.
     */
    limit?: number
  }

  /**
   * TicketStatusHistory updateManyAndReturn
   */
  export type TicketStatusHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * The data used to update TicketStatusHistories.
     */
    data: XOR<TicketStatusHistoryUpdateManyMutationInput, TicketStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which TicketStatusHistories to update
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * Limit how many TicketStatusHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketStatusHistory upsert
   */
  export type TicketStatusHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the TicketStatusHistory to update in case it exists.
     */
    where: TicketStatusHistoryWhereUniqueInput
    /**
     * In case the TicketStatusHistory found by the `where` argument doesn't exist, create a new TicketStatusHistory with this data.
     */
    create: XOR<TicketStatusHistoryCreateInput, TicketStatusHistoryUncheckedCreateInput>
    /**
     * In case the TicketStatusHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketStatusHistoryUpdateInput, TicketStatusHistoryUncheckedUpdateInput>
  }

  /**
   * TicketStatusHistory delete
   */
  export type TicketStatusHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter which TicketStatusHistory to delete.
     */
    where: TicketStatusHistoryWhereUniqueInput
  }

  /**
   * TicketStatusHistory deleteMany
   */
  export type TicketStatusHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketStatusHistories to delete
     */
    where?: TicketStatusHistoryWhereInput
    /**
     * Limit how many TicketStatusHistories to delete.
     */
    limit?: number
  }

  /**
   * TicketStatusHistory without action
   */
  export type TicketStatusHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketStatusHistory
     */
    select?: TicketStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketStatusHistory
     */
    omit?: TicketStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketStatusHistoryInclude<ExtArgs> | null
  }


  /**
   * Model Worker
   */

  export type AggregateWorker = {
    _count: WorkerCountAggregateOutputType | null
    _avg: WorkerAvgAggregateOutputType | null
    _sum: WorkerSumAggregateOutputType | null
    _min: WorkerMinAggregateOutputType | null
    _max: WorkerMaxAggregateOutputType | null
  }

  export type WorkerAvgAggregateOutputType = {
    currentLatitude: number | null
    currentLongitude: number | null
  }

  export type WorkerSumAggregateOutputType = {
    currentLatitude: number | null
    currentLongitude: number | null
  }

  export type WorkerMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    email: string | null
    phone: string | null
    employeeId: string | null
    isActive: boolean | null
    currentLatitude: number | null
    currentLongitude: number | null
    lastLocationUpdate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkerMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    email: string | null
    phone: string | null
    employeeId: string | null
    isActive: boolean | null
    currentLatitude: number | null
    currentLongitude: number | null
    lastLocationUpdate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkerCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    email: number
    phone: number
    employeeId: number
    isActive: number
    currentLatitude: number
    currentLongitude: number
    lastLocationUpdate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkerAvgAggregateInputType = {
    currentLatitude?: true
    currentLongitude?: true
  }

  export type WorkerSumAggregateInputType = {
    currentLatitude?: true
    currentLongitude?: true
  }

  export type WorkerMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    phone?: true
    employeeId?: true
    isActive?: true
    currentLatitude?: true
    currentLongitude?: true
    lastLocationUpdate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkerMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    phone?: true
    employeeId?: true
    isActive?: true
    currentLatitude?: true
    currentLongitude?: true
    lastLocationUpdate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkerCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    phone?: true
    employeeId?: true
    isActive?: true
    currentLatitude?: true
    currentLongitude?: true
    lastLocationUpdate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Worker to aggregate.
     */
    where?: WorkerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workers to fetch.
     */
    orderBy?: WorkerOrderByWithRelationInput | WorkerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workers
    **/
    _count?: true | WorkerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkerMaxAggregateInputType
  }

  export type GetWorkerAggregateType<T extends WorkerAggregateArgs> = {
        [P in keyof T & keyof AggregateWorker]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorker[P]>
      : GetScalarType<T[P], AggregateWorker[P]>
  }




  export type WorkerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkerWhereInput
    orderBy?: WorkerOrderByWithAggregationInput | WorkerOrderByWithAggregationInput[]
    by: WorkerScalarFieldEnum[] | WorkerScalarFieldEnum
    having?: WorkerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkerCountAggregateInputType | true
    _avg?: WorkerAvgAggregateInputType
    _sum?: WorkerSumAggregateInputType
    _min?: WorkerMinAggregateInputType
    _max?: WorkerMaxAggregateInputType
  }

  export type WorkerGroupByOutputType = {
    id: string
    userId: string | null
    name: string
    email: string
    phone: string | null
    employeeId: string
    isActive: boolean
    currentLatitude: number | null
    currentLongitude: number | null
    lastLocationUpdate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: WorkerCountAggregateOutputType | null
    _avg: WorkerAvgAggregateOutputType | null
    _sum: WorkerSumAggregateOutputType | null
    _min: WorkerMinAggregateOutputType | null
    _max: WorkerMaxAggregateOutputType | null
  }

  type GetWorkerGroupByPayload<T extends WorkerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkerGroupByOutputType[P]>
            : GetScalarType<T[P], WorkerGroupByOutputType[P]>
        }
      >
    >


  export type WorkerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    employeeId?: boolean
    isActive?: boolean
    currentLatitude?: boolean
    currentLongitude?: boolean
    lastLocationUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Worker$userArgs<ExtArgs>
    assignedTickets?: boolean | Worker$assignedTicketsArgs<ExtArgs>
    locationLogs?: boolean | Worker$locationLogsArgs<ExtArgs>
    _count?: boolean | WorkerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["worker"]>

  export type WorkerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    employeeId?: boolean
    isActive?: boolean
    currentLatitude?: boolean
    currentLongitude?: boolean
    lastLocationUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Worker$userArgs<ExtArgs>
  }, ExtArgs["result"]["worker"]>

  export type WorkerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    employeeId?: boolean
    isActive?: boolean
    currentLatitude?: boolean
    currentLongitude?: boolean
    lastLocationUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Worker$userArgs<ExtArgs>
  }, ExtArgs["result"]["worker"]>

  export type WorkerSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    employeeId?: boolean
    isActive?: boolean
    currentLatitude?: boolean
    currentLongitude?: boolean
    lastLocationUpdate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "email" | "phone" | "employeeId" | "isActive" | "currentLatitude" | "currentLongitude" | "lastLocationUpdate" | "createdAt" | "updatedAt", ExtArgs["result"]["worker"]>
  export type WorkerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Worker$userArgs<ExtArgs>
    assignedTickets?: boolean | Worker$assignedTicketsArgs<ExtArgs>
    locationLogs?: boolean | Worker$locationLogsArgs<ExtArgs>
    _count?: boolean | WorkerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Worker$userArgs<ExtArgs>
  }
  export type WorkerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Worker$userArgs<ExtArgs>
  }

  export type $WorkerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Worker"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      assignedTickets: Prisma.$TicketPayload<ExtArgs>[]
      locationLogs: Prisma.$WorkerLocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      name: string
      email: string
      phone: string | null
      employeeId: string
      isActive: boolean
      currentLatitude: number | null
      currentLongitude: number | null
      lastLocationUpdate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["worker"]>
    composites: {}
  }

  type WorkerGetPayload<S extends boolean | null | undefined | WorkerDefaultArgs> = $Result.GetResult<Prisma.$WorkerPayload, S>

  type WorkerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkerCountAggregateInputType | true
    }

  export interface WorkerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Worker'], meta: { name: 'Worker' } }
    /**
     * Find zero or one Worker that matches the filter.
     * @param {WorkerFindUniqueArgs} args - Arguments to find a Worker
     * @example
     * // Get one Worker
     * const worker = await prisma.worker.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkerFindUniqueArgs>(args: SelectSubset<T, WorkerFindUniqueArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Worker that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkerFindUniqueOrThrowArgs} args - Arguments to find a Worker
     * @example
     * // Get one Worker
     * const worker = await prisma.worker.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkerFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Worker that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerFindFirstArgs} args - Arguments to find a Worker
     * @example
     * // Get one Worker
     * const worker = await prisma.worker.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkerFindFirstArgs>(args?: SelectSubset<T, WorkerFindFirstArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Worker that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerFindFirstOrThrowArgs} args - Arguments to find a Worker
     * @example
     * // Get one Worker
     * const worker = await prisma.worker.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkerFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkerFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workers
     * const workers = await prisma.worker.findMany()
     * 
     * // Get first 10 Workers
     * const workers = await prisma.worker.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workerWithIdOnly = await prisma.worker.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkerFindManyArgs>(args?: SelectSubset<T, WorkerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Worker.
     * @param {WorkerCreateArgs} args - Arguments to create a Worker.
     * @example
     * // Create one Worker
     * const Worker = await prisma.worker.create({
     *   data: {
     *     // ... data to create a Worker
     *   }
     * })
     * 
     */
    create<T extends WorkerCreateArgs>(args: SelectSubset<T, WorkerCreateArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workers.
     * @param {WorkerCreateManyArgs} args - Arguments to create many Workers.
     * @example
     * // Create many Workers
     * const worker = await prisma.worker.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkerCreateManyArgs>(args?: SelectSubset<T, WorkerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workers and returns the data saved in the database.
     * @param {WorkerCreateManyAndReturnArgs} args - Arguments to create many Workers.
     * @example
     * // Create many Workers
     * const worker = await prisma.worker.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workers and only return the `id`
     * const workerWithIdOnly = await prisma.worker.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkerCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Worker.
     * @param {WorkerDeleteArgs} args - Arguments to delete one Worker.
     * @example
     * // Delete one Worker
     * const Worker = await prisma.worker.delete({
     *   where: {
     *     // ... filter to delete one Worker
     *   }
     * })
     * 
     */
    delete<T extends WorkerDeleteArgs>(args: SelectSubset<T, WorkerDeleteArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Worker.
     * @param {WorkerUpdateArgs} args - Arguments to update one Worker.
     * @example
     * // Update one Worker
     * const worker = await prisma.worker.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkerUpdateArgs>(args: SelectSubset<T, WorkerUpdateArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workers.
     * @param {WorkerDeleteManyArgs} args - Arguments to filter Workers to delete.
     * @example
     * // Delete a few Workers
     * const { count } = await prisma.worker.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkerDeleteManyArgs>(args?: SelectSubset<T, WorkerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workers
     * const worker = await prisma.worker.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkerUpdateManyArgs>(args: SelectSubset<T, WorkerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workers and returns the data updated in the database.
     * @param {WorkerUpdateManyAndReturnArgs} args - Arguments to update many Workers.
     * @example
     * // Update many Workers
     * const worker = await prisma.worker.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workers and only return the `id`
     * const workerWithIdOnly = await prisma.worker.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkerUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Worker.
     * @param {WorkerUpsertArgs} args - Arguments to update or create a Worker.
     * @example
     * // Update or create a Worker
     * const worker = await prisma.worker.upsert({
     *   create: {
     *     // ... data to create a Worker
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Worker we want to update
     *   }
     * })
     */
    upsert<T extends WorkerUpsertArgs>(args: SelectSubset<T, WorkerUpsertArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerCountArgs} args - Arguments to filter Workers to count.
     * @example
     * // Count the number of Workers
     * const count = await prisma.worker.count({
     *   where: {
     *     // ... the filter for the Workers we want to count
     *   }
     * })
    **/
    count<T extends WorkerCountArgs>(
      args?: Subset<T, WorkerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Worker.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkerAggregateArgs>(args: Subset<T, WorkerAggregateArgs>): Prisma.PrismaPromise<GetWorkerAggregateType<T>>

    /**
     * Group by Worker.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkerGroupByArgs['orderBy'] }
        : { orderBy?: WorkerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Worker model
   */
  readonly fields: WorkerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Worker.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Worker$userArgs<ExtArgs> = {}>(args?: Subset<T, Worker$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    assignedTickets<T extends Worker$assignedTicketsArgs<ExtArgs> = {}>(args?: Subset<T, Worker$assignedTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locationLogs<T extends Worker$locationLogsArgs<ExtArgs> = {}>(args?: Subset<T, Worker$locationLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Worker model
   */
  interface WorkerFieldRefs {
    readonly id: FieldRef<"Worker", 'String'>
    readonly userId: FieldRef<"Worker", 'String'>
    readonly name: FieldRef<"Worker", 'String'>
    readonly email: FieldRef<"Worker", 'String'>
    readonly phone: FieldRef<"Worker", 'String'>
    readonly employeeId: FieldRef<"Worker", 'String'>
    readonly isActive: FieldRef<"Worker", 'Boolean'>
    readonly currentLatitude: FieldRef<"Worker", 'Float'>
    readonly currentLongitude: FieldRef<"Worker", 'Float'>
    readonly lastLocationUpdate: FieldRef<"Worker", 'DateTime'>
    readonly createdAt: FieldRef<"Worker", 'DateTime'>
    readonly updatedAt: FieldRef<"Worker", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Worker findUnique
   */
  export type WorkerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * Filter, which Worker to fetch.
     */
    where: WorkerWhereUniqueInput
  }

  /**
   * Worker findUniqueOrThrow
   */
  export type WorkerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * Filter, which Worker to fetch.
     */
    where: WorkerWhereUniqueInput
  }

  /**
   * Worker findFirst
   */
  export type WorkerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * Filter, which Worker to fetch.
     */
    where?: WorkerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workers to fetch.
     */
    orderBy?: WorkerOrderByWithRelationInput | WorkerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workers.
     */
    cursor?: WorkerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workers.
     */
    distinct?: WorkerScalarFieldEnum | WorkerScalarFieldEnum[]
  }

  /**
   * Worker findFirstOrThrow
   */
  export type WorkerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * Filter, which Worker to fetch.
     */
    where?: WorkerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workers to fetch.
     */
    orderBy?: WorkerOrderByWithRelationInput | WorkerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workers.
     */
    cursor?: WorkerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workers.
     */
    distinct?: WorkerScalarFieldEnum | WorkerScalarFieldEnum[]
  }

  /**
   * Worker findMany
   */
  export type WorkerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * Filter, which Workers to fetch.
     */
    where?: WorkerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workers to fetch.
     */
    orderBy?: WorkerOrderByWithRelationInput | WorkerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workers.
     */
    cursor?: WorkerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workers.
     */
    skip?: number
    distinct?: WorkerScalarFieldEnum | WorkerScalarFieldEnum[]
  }

  /**
   * Worker create
   */
  export type WorkerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * The data needed to create a Worker.
     */
    data: XOR<WorkerCreateInput, WorkerUncheckedCreateInput>
  }

  /**
   * Worker createMany
   */
  export type WorkerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workers.
     */
    data: WorkerCreateManyInput | WorkerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Worker createManyAndReturn
   */
  export type WorkerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * The data used to create many Workers.
     */
    data: WorkerCreateManyInput | WorkerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Worker update
   */
  export type WorkerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * The data needed to update a Worker.
     */
    data: XOR<WorkerUpdateInput, WorkerUncheckedUpdateInput>
    /**
     * Choose, which Worker to update.
     */
    where: WorkerWhereUniqueInput
  }

  /**
   * Worker updateMany
   */
  export type WorkerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workers.
     */
    data: XOR<WorkerUpdateManyMutationInput, WorkerUncheckedUpdateManyInput>
    /**
     * Filter which Workers to update
     */
    where?: WorkerWhereInput
    /**
     * Limit how many Workers to update.
     */
    limit?: number
  }

  /**
   * Worker updateManyAndReturn
   */
  export type WorkerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * The data used to update Workers.
     */
    data: XOR<WorkerUpdateManyMutationInput, WorkerUncheckedUpdateManyInput>
    /**
     * Filter which Workers to update
     */
    where?: WorkerWhereInput
    /**
     * Limit how many Workers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Worker upsert
   */
  export type WorkerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * The filter to search for the Worker to update in case it exists.
     */
    where: WorkerWhereUniqueInput
    /**
     * In case the Worker found by the `where` argument doesn't exist, create a new Worker with this data.
     */
    create: XOR<WorkerCreateInput, WorkerUncheckedCreateInput>
    /**
     * In case the Worker was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkerUpdateInput, WorkerUncheckedUpdateInput>
  }

  /**
   * Worker delete
   */
  export type WorkerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
    /**
     * Filter which Worker to delete.
     */
    where: WorkerWhereUniqueInput
  }

  /**
   * Worker deleteMany
   */
  export type WorkerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workers to delete
     */
    where?: WorkerWhereInput
    /**
     * Limit how many Workers to delete.
     */
    limit?: number
  }

  /**
   * Worker.user
   */
  export type Worker$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Worker.assignedTickets
   */
  export type Worker$assignedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Worker.locationLogs
   */
  export type Worker$locationLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    where?: WorkerLocationWhereInput
    orderBy?: WorkerLocationOrderByWithRelationInput | WorkerLocationOrderByWithRelationInput[]
    cursor?: WorkerLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkerLocationScalarFieldEnum | WorkerLocationScalarFieldEnum[]
  }

  /**
   * Worker without action
   */
  export type WorkerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worker
     */
    select?: WorkerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worker
     */
    omit?: WorkerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerInclude<ExtArgs> | null
  }


  /**
   * Model WorkerLocation
   */

  export type AggregateWorkerLocation = {
    _count: WorkerLocationCountAggregateOutputType | null
    _avg: WorkerLocationAvgAggregateOutputType | null
    _sum: WorkerLocationSumAggregateOutputType | null
    _min: WorkerLocationMinAggregateOutputType | null
    _max: WorkerLocationMaxAggregateOutputType | null
  }

  export type WorkerLocationAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    accuracy: number | null
  }

  export type WorkerLocationSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    accuracy: number | null
  }

  export type WorkerLocationMinAggregateOutputType = {
    id: string | null
    workerId: string | null
    latitude: number | null
    longitude: number | null
    accuracy: number | null
    recordedAt: Date | null
  }

  export type WorkerLocationMaxAggregateOutputType = {
    id: string | null
    workerId: string | null
    latitude: number | null
    longitude: number | null
    accuracy: number | null
    recordedAt: Date | null
  }

  export type WorkerLocationCountAggregateOutputType = {
    id: number
    workerId: number
    latitude: number
    longitude: number
    accuracy: number
    recordedAt: number
    _all: number
  }


  export type WorkerLocationAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    accuracy?: true
  }

  export type WorkerLocationSumAggregateInputType = {
    latitude?: true
    longitude?: true
    accuracy?: true
  }

  export type WorkerLocationMinAggregateInputType = {
    id?: true
    workerId?: true
    latitude?: true
    longitude?: true
    accuracy?: true
    recordedAt?: true
  }

  export type WorkerLocationMaxAggregateInputType = {
    id?: true
    workerId?: true
    latitude?: true
    longitude?: true
    accuracy?: true
    recordedAt?: true
  }

  export type WorkerLocationCountAggregateInputType = {
    id?: true
    workerId?: true
    latitude?: true
    longitude?: true
    accuracy?: true
    recordedAt?: true
    _all?: true
  }

  export type WorkerLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkerLocation to aggregate.
     */
    where?: WorkerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerLocations to fetch.
     */
    orderBy?: WorkerLocationOrderByWithRelationInput | WorkerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkerLocations
    **/
    _count?: true | WorkerLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkerLocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkerLocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkerLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkerLocationMaxAggregateInputType
  }

  export type GetWorkerLocationAggregateType<T extends WorkerLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkerLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkerLocation[P]>
      : GetScalarType<T[P], AggregateWorkerLocation[P]>
  }




  export type WorkerLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkerLocationWhereInput
    orderBy?: WorkerLocationOrderByWithAggregationInput | WorkerLocationOrderByWithAggregationInput[]
    by: WorkerLocationScalarFieldEnum[] | WorkerLocationScalarFieldEnum
    having?: WorkerLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkerLocationCountAggregateInputType | true
    _avg?: WorkerLocationAvgAggregateInputType
    _sum?: WorkerLocationSumAggregateInputType
    _min?: WorkerLocationMinAggregateInputType
    _max?: WorkerLocationMaxAggregateInputType
  }

  export type WorkerLocationGroupByOutputType = {
    id: string
    workerId: string
    latitude: number
    longitude: number
    accuracy: number | null
    recordedAt: Date
    _count: WorkerLocationCountAggregateOutputType | null
    _avg: WorkerLocationAvgAggregateOutputType | null
    _sum: WorkerLocationSumAggregateOutputType | null
    _min: WorkerLocationMinAggregateOutputType | null
    _max: WorkerLocationMaxAggregateOutputType | null
  }

  type GetWorkerLocationGroupByPayload<T extends WorkerLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkerLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkerLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkerLocationGroupByOutputType[P]>
            : GetScalarType<T[P], WorkerLocationGroupByOutputType[P]>
        }
      >
    >


  export type WorkerLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workerId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    recordedAt?: boolean
    worker?: boolean | WorkerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workerLocation"]>

  export type WorkerLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workerId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    recordedAt?: boolean
    worker?: boolean | WorkerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workerLocation"]>

  export type WorkerLocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workerId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    recordedAt?: boolean
    worker?: boolean | WorkerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workerLocation"]>

  export type WorkerLocationSelectScalar = {
    id?: boolean
    workerId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    recordedAt?: boolean
  }

  export type WorkerLocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workerId" | "latitude" | "longitude" | "accuracy" | "recordedAt", ExtArgs["result"]["workerLocation"]>
  export type WorkerLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worker?: boolean | WorkerDefaultArgs<ExtArgs>
  }
  export type WorkerLocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worker?: boolean | WorkerDefaultArgs<ExtArgs>
  }
  export type WorkerLocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worker?: boolean | WorkerDefaultArgs<ExtArgs>
  }

  export type $WorkerLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkerLocation"
    objects: {
      worker: Prisma.$WorkerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workerId: string
      latitude: number
      longitude: number
      accuracy: number | null
      recordedAt: Date
    }, ExtArgs["result"]["workerLocation"]>
    composites: {}
  }

  type WorkerLocationGetPayload<S extends boolean | null | undefined | WorkerLocationDefaultArgs> = $Result.GetResult<Prisma.$WorkerLocationPayload, S>

  type WorkerLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkerLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkerLocationCountAggregateInputType | true
    }

  export interface WorkerLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkerLocation'], meta: { name: 'WorkerLocation' } }
    /**
     * Find zero or one WorkerLocation that matches the filter.
     * @param {WorkerLocationFindUniqueArgs} args - Arguments to find a WorkerLocation
     * @example
     * // Get one WorkerLocation
     * const workerLocation = await prisma.workerLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkerLocationFindUniqueArgs>(args: SelectSubset<T, WorkerLocationFindUniqueArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkerLocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkerLocationFindUniqueOrThrowArgs} args - Arguments to find a WorkerLocation
     * @example
     * // Get one WorkerLocation
     * const workerLocation = await prisma.workerLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkerLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkerLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkerLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationFindFirstArgs} args - Arguments to find a WorkerLocation
     * @example
     * // Get one WorkerLocation
     * const workerLocation = await prisma.workerLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkerLocationFindFirstArgs>(args?: SelectSubset<T, WorkerLocationFindFirstArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkerLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationFindFirstOrThrowArgs} args - Arguments to find a WorkerLocation
     * @example
     * // Get one WorkerLocation
     * const workerLocation = await prisma.workerLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkerLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkerLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkerLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkerLocations
     * const workerLocations = await prisma.workerLocation.findMany()
     * 
     * // Get first 10 WorkerLocations
     * const workerLocations = await prisma.workerLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workerLocationWithIdOnly = await prisma.workerLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkerLocationFindManyArgs>(args?: SelectSubset<T, WorkerLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkerLocation.
     * @param {WorkerLocationCreateArgs} args - Arguments to create a WorkerLocation.
     * @example
     * // Create one WorkerLocation
     * const WorkerLocation = await prisma.workerLocation.create({
     *   data: {
     *     // ... data to create a WorkerLocation
     *   }
     * })
     * 
     */
    create<T extends WorkerLocationCreateArgs>(args: SelectSubset<T, WorkerLocationCreateArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkerLocations.
     * @param {WorkerLocationCreateManyArgs} args - Arguments to create many WorkerLocations.
     * @example
     * // Create many WorkerLocations
     * const workerLocation = await prisma.workerLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkerLocationCreateManyArgs>(args?: SelectSubset<T, WorkerLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkerLocations and returns the data saved in the database.
     * @param {WorkerLocationCreateManyAndReturnArgs} args - Arguments to create many WorkerLocations.
     * @example
     * // Create many WorkerLocations
     * const workerLocation = await prisma.workerLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkerLocations and only return the `id`
     * const workerLocationWithIdOnly = await prisma.workerLocation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkerLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkerLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkerLocation.
     * @param {WorkerLocationDeleteArgs} args - Arguments to delete one WorkerLocation.
     * @example
     * // Delete one WorkerLocation
     * const WorkerLocation = await prisma.workerLocation.delete({
     *   where: {
     *     // ... filter to delete one WorkerLocation
     *   }
     * })
     * 
     */
    delete<T extends WorkerLocationDeleteArgs>(args: SelectSubset<T, WorkerLocationDeleteArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkerLocation.
     * @param {WorkerLocationUpdateArgs} args - Arguments to update one WorkerLocation.
     * @example
     * // Update one WorkerLocation
     * const workerLocation = await prisma.workerLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkerLocationUpdateArgs>(args: SelectSubset<T, WorkerLocationUpdateArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkerLocations.
     * @param {WorkerLocationDeleteManyArgs} args - Arguments to filter WorkerLocations to delete.
     * @example
     * // Delete a few WorkerLocations
     * const { count } = await prisma.workerLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkerLocationDeleteManyArgs>(args?: SelectSubset<T, WorkerLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkerLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkerLocations
     * const workerLocation = await prisma.workerLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkerLocationUpdateManyArgs>(args: SelectSubset<T, WorkerLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkerLocations and returns the data updated in the database.
     * @param {WorkerLocationUpdateManyAndReturnArgs} args - Arguments to update many WorkerLocations.
     * @example
     * // Update many WorkerLocations
     * const workerLocation = await prisma.workerLocation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkerLocations and only return the `id`
     * const workerLocationWithIdOnly = await prisma.workerLocation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkerLocationUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkerLocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkerLocation.
     * @param {WorkerLocationUpsertArgs} args - Arguments to update or create a WorkerLocation.
     * @example
     * // Update or create a WorkerLocation
     * const workerLocation = await prisma.workerLocation.upsert({
     *   create: {
     *     // ... data to create a WorkerLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkerLocation we want to update
     *   }
     * })
     */
    upsert<T extends WorkerLocationUpsertArgs>(args: SelectSubset<T, WorkerLocationUpsertArgs<ExtArgs>>): Prisma__WorkerLocationClient<$Result.GetResult<Prisma.$WorkerLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkerLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationCountArgs} args - Arguments to filter WorkerLocations to count.
     * @example
     * // Count the number of WorkerLocations
     * const count = await prisma.workerLocation.count({
     *   where: {
     *     // ... the filter for the WorkerLocations we want to count
     *   }
     * })
    **/
    count<T extends WorkerLocationCountArgs>(
      args?: Subset<T, WorkerLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkerLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkerLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkerLocationAggregateArgs>(args: Subset<T, WorkerLocationAggregateArgs>): Prisma.PrismaPromise<GetWorkerLocationAggregateType<T>>

    /**
     * Group by WorkerLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkerLocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkerLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkerLocationGroupByArgs['orderBy'] }
        : { orderBy?: WorkerLocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkerLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkerLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkerLocation model
   */
  readonly fields: WorkerLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkerLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkerLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    worker<T extends WorkerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkerDefaultArgs<ExtArgs>>): Prisma__WorkerClient<$Result.GetResult<Prisma.$WorkerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkerLocation model
   */
  interface WorkerLocationFieldRefs {
    readonly id: FieldRef<"WorkerLocation", 'String'>
    readonly workerId: FieldRef<"WorkerLocation", 'String'>
    readonly latitude: FieldRef<"WorkerLocation", 'Float'>
    readonly longitude: FieldRef<"WorkerLocation", 'Float'>
    readonly accuracy: FieldRef<"WorkerLocation", 'Float'>
    readonly recordedAt: FieldRef<"WorkerLocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkerLocation findUnique
   */
  export type WorkerLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * Filter, which WorkerLocation to fetch.
     */
    where: WorkerLocationWhereUniqueInput
  }

  /**
   * WorkerLocation findUniqueOrThrow
   */
  export type WorkerLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * Filter, which WorkerLocation to fetch.
     */
    where: WorkerLocationWhereUniqueInput
  }

  /**
   * WorkerLocation findFirst
   */
  export type WorkerLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * Filter, which WorkerLocation to fetch.
     */
    where?: WorkerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerLocations to fetch.
     */
    orderBy?: WorkerLocationOrderByWithRelationInput | WorkerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkerLocations.
     */
    cursor?: WorkerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkerLocations.
     */
    distinct?: WorkerLocationScalarFieldEnum | WorkerLocationScalarFieldEnum[]
  }

  /**
   * WorkerLocation findFirstOrThrow
   */
  export type WorkerLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * Filter, which WorkerLocation to fetch.
     */
    where?: WorkerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerLocations to fetch.
     */
    orderBy?: WorkerLocationOrderByWithRelationInput | WorkerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkerLocations.
     */
    cursor?: WorkerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkerLocations.
     */
    distinct?: WorkerLocationScalarFieldEnum | WorkerLocationScalarFieldEnum[]
  }

  /**
   * WorkerLocation findMany
   */
  export type WorkerLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * Filter, which WorkerLocations to fetch.
     */
    where?: WorkerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkerLocations to fetch.
     */
    orderBy?: WorkerLocationOrderByWithRelationInput | WorkerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkerLocations.
     */
    cursor?: WorkerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkerLocations.
     */
    skip?: number
    distinct?: WorkerLocationScalarFieldEnum | WorkerLocationScalarFieldEnum[]
  }

  /**
   * WorkerLocation create
   */
  export type WorkerLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkerLocation.
     */
    data: XOR<WorkerLocationCreateInput, WorkerLocationUncheckedCreateInput>
  }

  /**
   * WorkerLocation createMany
   */
  export type WorkerLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkerLocations.
     */
    data: WorkerLocationCreateManyInput | WorkerLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkerLocation createManyAndReturn
   */
  export type WorkerLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * The data used to create many WorkerLocations.
     */
    data: WorkerLocationCreateManyInput | WorkerLocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkerLocation update
   */
  export type WorkerLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkerLocation.
     */
    data: XOR<WorkerLocationUpdateInput, WorkerLocationUncheckedUpdateInput>
    /**
     * Choose, which WorkerLocation to update.
     */
    where: WorkerLocationWhereUniqueInput
  }

  /**
   * WorkerLocation updateMany
   */
  export type WorkerLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkerLocations.
     */
    data: XOR<WorkerLocationUpdateManyMutationInput, WorkerLocationUncheckedUpdateManyInput>
    /**
     * Filter which WorkerLocations to update
     */
    where?: WorkerLocationWhereInput
    /**
     * Limit how many WorkerLocations to update.
     */
    limit?: number
  }

  /**
   * WorkerLocation updateManyAndReturn
   */
  export type WorkerLocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * The data used to update WorkerLocations.
     */
    data: XOR<WorkerLocationUpdateManyMutationInput, WorkerLocationUncheckedUpdateManyInput>
    /**
     * Filter which WorkerLocations to update
     */
    where?: WorkerLocationWhereInput
    /**
     * Limit how many WorkerLocations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkerLocation upsert
   */
  export type WorkerLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkerLocation to update in case it exists.
     */
    where: WorkerLocationWhereUniqueInput
    /**
     * In case the WorkerLocation found by the `where` argument doesn't exist, create a new WorkerLocation with this data.
     */
    create: XOR<WorkerLocationCreateInput, WorkerLocationUncheckedCreateInput>
    /**
     * In case the WorkerLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkerLocationUpdateInput, WorkerLocationUncheckedUpdateInput>
  }

  /**
   * WorkerLocation delete
   */
  export type WorkerLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
    /**
     * Filter which WorkerLocation to delete.
     */
    where: WorkerLocationWhereUniqueInput
  }

  /**
   * WorkerLocation deleteMany
   */
  export type WorkerLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkerLocations to delete
     */
    where?: WorkerLocationWhereInput
    /**
     * Limit how many WorkerLocations to delete.
     */
    limit?: number
  }

  /**
   * WorkerLocation without action
   */
  export type WorkerLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkerLocation
     */
    select?: WorkerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkerLocation
     */
    omit?: WorkerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkerLocationInclude<ExtArgs> | null
  }


  /**
   * Model WorkProof
   */

  export type AggregateWorkProof = {
    _count: WorkProofCountAggregateOutputType | null
    _avg: WorkProofAvgAggregateOutputType | null
    _sum: WorkProofSumAggregateOutputType | null
    _min: WorkProofMinAggregateOutputType | null
    _max: WorkProofMaxAggregateOutputType | null
  }

  export type WorkProofAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type WorkProofSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type WorkProofMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    notes: string | null
    latitude: number | null
    longitude: number | null
    submittedAt: Date | null
    isApproved: boolean | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNotes: string | null
  }

  export type WorkProofMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    notes: string | null
    latitude: number | null
    longitude: number | null
    submittedAt: Date | null
    isApproved: boolean | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNotes: string | null
  }

  export type WorkProofCountAggregateOutputType = {
    id: number
    ticketId: number
    imageUrls: number
    notes: number
    latitude: number
    longitude: number
    submittedAt: number
    isApproved: number
    reviewedBy: number
    reviewedAt: number
    reviewNotes: number
    _all: number
  }


  export type WorkProofAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type WorkProofSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type WorkProofMinAggregateInputType = {
    id?: true
    ticketId?: true
    notes?: true
    latitude?: true
    longitude?: true
    submittedAt?: true
    isApproved?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNotes?: true
  }

  export type WorkProofMaxAggregateInputType = {
    id?: true
    ticketId?: true
    notes?: true
    latitude?: true
    longitude?: true
    submittedAt?: true
    isApproved?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNotes?: true
  }

  export type WorkProofCountAggregateInputType = {
    id?: true
    ticketId?: true
    imageUrls?: true
    notes?: true
    latitude?: true
    longitude?: true
    submittedAt?: true
    isApproved?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNotes?: true
    _all?: true
  }

  export type WorkProofAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkProof to aggregate.
     */
    where?: WorkProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkProofs to fetch.
     */
    orderBy?: WorkProofOrderByWithRelationInput | WorkProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkProofs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkProofs
    **/
    _count?: true | WorkProofCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkProofAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkProofSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkProofMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkProofMaxAggregateInputType
  }

  export type GetWorkProofAggregateType<T extends WorkProofAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkProof]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkProof[P]>
      : GetScalarType<T[P], AggregateWorkProof[P]>
  }




  export type WorkProofGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkProofWhereInput
    orderBy?: WorkProofOrderByWithAggregationInput | WorkProofOrderByWithAggregationInput[]
    by: WorkProofScalarFieldEnum[] | WorkProofScalarFieldEnum
    having?: WorkProofScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkProofCountAggregateInputType | true
    _avg?: WorkProofAvgAggregateInputType
    _sum?: WorkProofSumAggregateInputType
    _min?: WorkProofMinAggregateInputType
    _max?: WorkProofMaxAggregateInputType
  }

  export type WorkProofGroupByOutputType = {
    id: string
    ticketId: string
    imageUrls: string[]
    notes: string | null
    latitude: number | null
    longitude: number | null
    submittedAt: Date
    isApproved: boolean | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNotes: string | null
    _count: WorkProofCountAggregateOutputType | null
    _avg: WorkProofAvgAggregateOutputType | null
    _sum: WorkProofSumAggregateOutputType | null
    _min: WorkProofMinAggregateOutputType | null
    _max: WorkProofMaxAggregateOutputType | null
  }

  type GetWorkProofGroupByPayload<T extends WorkProofGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkProofGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkProofGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkProofGroupByOutputType[P]>
            : GetScalarType<T[P], WorkProofGroupByOutputType[P]>
        }
      >
    >


  export type WorkProofSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    imageUrls?: boolean
    notes?: boolean
    latitude?: boolean
    longitude?: boolean
    submittedAt?: boolean
    isApproved?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workProof"]>

  export type WorkProofSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    imageUrls?: boolean
    notes?: boolean
    latitude?: boolean
    longitude?: boolean
    submittedAt?: boolean
    isApproved?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workProof"]>

  export type WorkProofSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    imageUrls?: boolean
    notes?: boolean
    latitude?: boolean
    longitude?: boolean
    submittedAt?: boolean
    isApproved?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workProof"]>

  export type WorkProofSelectScalar = {
    id?: boolean
    ticketId?: boolean
    imageUrls?: boolean
    notes?: boolean
    latitude?: boolean
    longitude?: boolean
    submittedAt?: boolean
    isApproved?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNotes?: boolean
  }

  export type WorkProofOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "imageUrls" | "notes" | "latitude" | "longitude" | "submittedAt" | "isApproved" | "reviewedBy" | "reviewedAt" | "reviewNotes", ExtArgs["result"]["workProof"]>
  export type WorkProofInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }
  export type WorkProofIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }
  export type WorkProofIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
  }

  export type $WorkProofPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkProof"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      imageUrls: string[]
      notes: string | null
      latitude: number | null
      longitude: number | null
      submittedAt: Date
      isApproved: boolean | null
      reviewedBy: string | null
      reviewedAt: Date | null
      reviewNotes: string | null
    }, ExtArgs["result"]["workProof"]>
    composites: {}
  }

  type WorkProofGetPayload<S extends boolean | null | undefined | WorkProofDefaultArgs> = $Result.GetResult<Prisma.$WorkProofPayload, S>

  type WorkProofCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkProofFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkProofCountAggregateInputType | true
    }

  export interface WorkProofDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkProof'], meta: { name: 'WorkProof' } }
    /**
     * Find zero or one WorkProof that matches the filter.
     * @param {WorkProofFindUniqueArgs} args - Arguments to find a WorkProof
     * @example
     * // Get one WorkProof
     * const workProof = await prisma.workProof.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkProofFindUniqueArgs>(args: SelectSubset<T, WorkProofFindUniqueArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkProof that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkProofFindUniqueOrThrowArgs} args - Arguments to find a WorkProof
     * @example
     * // Get one WorkProof
     * const workProof = await prisma.workProof.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkProofFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkProofFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkProof that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofFindFirstArgs} args - Arguments to find a WorkProof
     * @example
     * // Get one WorkProof
     * const workProof = await prisma.workProof.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkProofFindFirstArgs>(args?: SelectSubset<T, WorkProofFindFirstArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkProof that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofFindFirstOrThrowArgs} args - Arguments to find a WorkProof
     * @example
     * // Get one WorkProof
     * const workProof = await prisma.workProof.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkProofFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkProofFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkProofs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkProofs
     * const workProofs = await prisma.workProof.findMany()
     * 
     * // Get first 10 WorkProofs
     * const workProofs = await prisma.workProof.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workProofWithIdOnly = await prisma.workProof.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkProofFindManyArgs>(args?: SelectSubset<T, WorkProofFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkProof.
     * @param {WorkProofCreateArgs} args - Arguments to create a WorkProof.
     * @example
     * // Create one WorkProof
     * const WorkProof = await prisma.workProof.create({
     *   data: {
     *     // ... data to create a WorkProof
     *   }
     * })
     * 
     */
    create<T extends WorkProofCreateArgs>(args: SelectSubset<T, WorkProofCreateArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkProofs.
     * @param {WorkProofCreateManyArgs} args - Arguments to create many WorkProofs.
     * @example
     * // Create many WorkProofs
     * const workProof = await prisma.workProof.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkProofCreateManyArgs>(args?: SelectSubset<T, WorkProofCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkProofs and returns the data saved in the database.
     * @param {WorkProofCreateManyAndReturnArgs} args - Arguments to create many WorkProofs.
     * @example
     * // Create many WorkProofs
     * const workProof = await prisma.workProof.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkProofs and only return the `id`
     * const workProofWithIdOnly = await prisma.workProof.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkProofCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkProofCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkProof.
     * @param {WorkProofDeleteArgs} args - Arguments to delete one WorkProof.
     * @example
     * // Delete one WorkProof
     * const WorkProof = await prisma.workProof.delete({
     *   where: {
     *     // ... filter to delete one WorkProof
     *   }
     * })
     * 
     */
    delete<T extends WorkProofDeleteArgs>(args: SelectSubset<T, WorkProofDeleteArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkProof.
     * @param {WorkProofUpdateArgs} args - Arguments to update one WorkProof.
     * @example
     * // Update one WorkProof
     * const workProof = await prisma.workProof.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkProofUpdateArgs>(args: SelectSubset<T, WorkProofUpdateArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkProofs.
     * @param {WorkProofDeleteManyArgs} args - Arguments to filter WorkProofs to delete.
     * @example
     * // Delete a few WorkProofs
     * const { count } = await prisma.workProof.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkProofDeleteManyArgs>(args?: SelectSubset<T, WorkProofDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkProofs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkProofs
     * const workProof = await prisma.workProof.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkProofUpdateManyArgs>(args: SelectSubset<T, WorkProofUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkProofs and returns the data updated in the database.
     * @param {WorkProofUpdateManyAndReturnArgs} args - Arguments to update many WorkProofs.
     * @example
     * // Update many WorkProofs
     * const workProof = await prisma.workProof.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkProofs and only return the `id`
     * const workProofWithIdOnly = await prisma.workProof.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkProofUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkProofUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkProof.
     * @param {WorkProofUpsertArgs} args - Arguments to update or create a WorkProof.
     * @example
     * // Update or create a WorkProof
     * const workProof = await prisma.workProof.upsert({
     *   create: {
     *     // ... data to create a WorkProof
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkProof we want to update
     *   }
     * })
     */
    upsert<T extends WorkProofUpsertArgs>(args: SelectSubset<T, WorkProofUpsertArgs<ExtArgs>>): Prisma__WorkProofClient<$Result.GetResult<Prisma.$WorkProofPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkProofs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofCountArgs} args - Arguments to filter WorkProofs to count.
     * @example
     * // Count the number of WorkProofs
     * const count = await prisma.workProof.count({
     *   where: {
     *     // ... the filter for the WorkProofs we want to count
     *   }
     * })
    **/
    count<T extends WorkProofCountArgs>(
      args?: Subset<T, WorkProofCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkProofCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkProof.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkProofAggregateArgs>(args: Subset<T, WorkProofAggregateArgs>): Prisma.PrismaPromise<GetWorkProofAggregateType<T>>

    /**
     * Group by WorkProof.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkProofGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkProofGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkProofGroupByArgs['orderBy'] }
        : { orderBy?: WorkProofGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkProofGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkProofGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkProof model
   */
  readonly fields: WorkProofFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkProof.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkProofClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkProof model
   */
  interface WorkProofFieldRefs {
    readonly id: FieldRef<"WorkProof", 'String'>
    readonly ticketId: FieldRef<"WorkProof", 'String'>
    readonly imageUrls: FieldRef<"WorkProof", 'String[]'>
    readonly notes: FieldRef<"WorkProof", 'String'>
    readonly latitude: FieldRef<"WorkProof", 'Float'>
    readonly longitude: FieldRef<"WorkProof", 'Float'>
    readonly submittedAt: FieldRef<"WorkProof", 'DateTime'>
    readonly isApproved: FieldRef<"WorkProof", 'Boolean'>
    readonly reviewedBy: FieldRef<"WorkProof", 'String'>
    readonly reviewedAt: FieldRef<"WorkProof", 'DateTime'>
    readonly reviewNotes: FieldRef<"WorkProof", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WorkProof findUnique
   */
  export type WorkProofFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * Filter, which WorkProof to fetch.
     */
    where: WorkProofWhereUniqueInput
  }

  /**
   * WorkProof findUniqueOrThrow
   */
  export type WorkProofFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * Filter, which WorkProof to fetch.
     */
    where: WorkProofWhereUniqueInput
  }

  /**
   * WorkProof findFirst
   */
  export type WorkProofFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * Filter, which WorkProof to fetch.
     */
    where?: WorkProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkProofs to fetch.
     */
    orderBy?: WorkProofOrderByWithRelationInput | WorkProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkProofs.
     */
    cursor?: WorkProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkProofs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkProofs.
     */
    distinct?: WorkProofScalarFieldEnum | WorkProofScalarFieldEnum[]
  }

  /**
   * WorkProof findFirstOrThrow
   */
  export type WorkProofFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * Filter, which WorkProof to fetch.
     */
    where?: WorkProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkProofs to fetch.
     */
    orderBy?: WorkProofOrderByWithRelationInput | WorkProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkProofs.
     */
    cursor?: WorkProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkProofs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkProofs.
     */
    distinct?: WorkProofScalarFieldEnum | WorkProofScalarFieldEnum[]
  }

  /**
   * WorkProof findMany
   */
  export type WorkProofFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * Filter, which WorkProofs to fetch.
     */
    where?: WorkProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkProofs to fetch.
     */
    orderBy?: WorkProofOrderByWithRelationInput | WorkProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkProofs.
     */
    cursor?: WorkProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkProofs.
     */
    skip?: number
    distinct?: WorkProofScalarFieldEnum | WorkProofScalarFieldEnum[]
  }

  /**
   * WorkProof create
   */
  export type WorkProofCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkProof.
     */
    data: XOR<WorkProofCreateInput, WorkProofUncheckedCreateInput>
  }

  /**
   * WorkProof createMany
   */
  export type WorkProofCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkProofs.
     */
    data: WorkProofCreateManyInput | WorkProofCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkProof createManyAndReturn
   */
  export type WorkProofCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * The data used to create many WorkProofs.
     */
    data: WorkProofCreateManyInput | WorkProofCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkProof update
   */
  export type WorkProofUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkProof.
     */
    data: XOR<WorkProofUpdateInput, WorkProofUncheckedUpdateInput>
    /**
     * Choose, which WorkProof to update.
     */
    where: WorkProofWhereUniqueInput
  }

  /**
   * WorkProof updateMany
   */
  export type WorkProofUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkProofs.
     */
    data: XOR<WorkProofUpdateManyMutationInput, WorkProofUncheckedUpdateManyInput>
    /**
     * Filter which WorkProofs to update
     */
    where?: WorkProofWhereInput
    /**
     * Limit how many WorkProofs to update.
     */
    limit?: number
  }

  /**
   * WorkProof updateManyAndReturn
   */
  export type WorkProofUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * The data used to update WorkProofs.
     */
    data: XOR<WorkProofUpdateManyMutationInput, WorkProofUncheckedUpdateManyInput>
    /**
     * Filter which WorkProofs to update
     */
    where?: WorkProofWhereInput
    /**
     * Limit how many WorkProofs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkProof upsert
   */
  export type WorkProofUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkProof to update in case it exists.
     */
    where: WorkProofWhereUniqueInput
    /**
     * In case the WorkProof found by the `where` argument doesn't exist, create a new WorkProof with this data.
     */
    create: XOR<WorkProofCreateInput, WorkProofUncheckedCreateInput>
    /**
     * In case the WorkProof was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkProofUpdateInput, WorkProofUncheckedUpdateInput>
  }

  /**
   * WorkProof delete
   */
  export type WorkProofDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
    /**
     * Filter which WorkProof to delete.
     */
    where: WorkProofWhereUniqueInput
  }

  /**
   * WorkProof deleteMany
   */
  export type WorkProofDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkProofs to delete
     */
    where?: WorkProofWhereInput
    /**
     * Limit how many WorkProofs to delete.
     */
    limit?: number
  }

  /**
   * WorkProof without action
   */
  export type WorkProofDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkProof
     */
    select?: WorkProofSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkProof
     */
    omit?: WorkProofOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkProofInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    clerk_user_id: 'clerk_user_id',
    name: 'name',
    email: 'email',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    status: 'status',
    severity: 'severity',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const MediaScalarFieldEnum: {
    id: 'id',
    mediaUrl: 'mediaUrl',
    mediaType: 'mediaType',
    uploadedAt: 'uploadedAt',
    reportId: 'reportId'
  };

  export type MediaScalarFieldEnum = (typeof MediaScalarFieldEnum)[keyof typeof MediaScalarFieldEnum]


  export const DetectionScalarFieldEnum: {
    id: 'id',
    detectedClass: 'detectedClass',
    confidence: 'confidence',
    bboxX: 'bboxX',
    bboxY: 'bboxY',
    bboxWidth: 'bboxWidth',
    bboxHeight: 'bboxHeight',
    frameTime: 'frameTime',
    createdAt: 'createdAt',
    mediaId: 'mediaId'
  };

  export type DetectionScalarFieldEnum = (typeof DetectionScalarFieldEnum)[keyof typeof DetectionScalarFieldEnum]


  export const PotholeScalarFieldEnum: {
    id: 'id',
    latitude: 'latitude',
    longitude: 'longitude',
    imageUrl: 'imageUrl',
    detectionId: 'detectionId',
    priorityScore: 'priorityScore',
    priorityLevel: 'priorityLevel',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PotholeScalarFieldEnum = (typeof PotholeScalarFieldEnum)[keyof typeof PotholeScalarFieldEnum]


  export const RoadInfoScalarFieldEnum: {
    id: 'id',
    roadName: 'roadName',
    roadType: 'roadType',
    speedLimit: 'speedLimit',
    trafficImportance: 'trafficImportance',
    priorityFactor: 'priorityFactor',
    osmData: 'osmData',
    potholeId: 'potholeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoadInfoScalarFieldEnum = (typeof RoadInfoScalarFieldEnum)[keyof typeof RoadInfoScalarFieldEnum]


  export const TicketScalarFieldEnum: {
    id: 'id',
    ticketNumber: 'ticketNumber',
    status: 'status',
    potholeId: 'potholeId',
    assignedWorkerId: 'assignedWorkerId',
    assignedAt: 'assignedAt',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    resolvedAt: 'resolvedAt',
    routeData: 'routeData',
    estimatedETA: 'estimatedETA',
    notes: 'notes',
    adminNotes: 'adminNotes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const TicketStatusHistoryScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    changedBy: 'changedBy',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type TicketStatusHistoryScalarFieldEnum = (typeof TicketStatusHistoryScalarFieldEnum)[keyof typeof TicketStatusHistoryScalarFieldEnum]


  export const WorkerScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    email: 'email',
    phone: 'phone',
    employeeId: 'employeeId',
    isActive: 'isActive',
    currentLatitude: 'currentLatitude',
    currentLongitude: 'currentLongitude',
    lastLocationUpdate: 'lastLocationUpdate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkerScalarFieldEnum = (typeof WorkerScalarFieldEnum)[keyof typeof WorkerScalarFieldEnum]


  export const WorkerLocationScalarFieldEnum: {
    id: 'id',
    workerId: 'workerId',
    latitude: 'latitude',
    longitude: 'longitude',
    accuracy: 'accuracy',
    recordedAt: 'recordedAt'
  };

  export type WorkerLocationScalarFieldEnum = (typeof WorkerLocationScalarFieldEnum)[keyof typeof WorkerLocationScalarFieldEnum]


  export const WorkProofScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    imageUrls: 'imageUrls',
    notes: 'notes',
    latitude: 'latitude',
    longitude: 'longitude',
    submittedAt: 'submittedAt',
    isApproved: 'isApproved',
    reviewedBy: 'reviewedBy',
    reviewedAt: 'reviewedAt',
    reviewNotes: 'reviewNotes'
  };

  export type WorkProofScalarFieldEnum = (typeof WorkProofScalarFieldEnum)[keyof typeof WorkProofScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'ReportStatus'
   */
  export type EnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus'>
    


  /**
   * Reference to a field of type 'ReportStatus[]'
   */
  export type ListEnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'MediaType'
   */
  export type EnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType'>
    


  /**
   * Reference to a field of type 'MediaType[]'
   */
  export type ListEnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType[]'>
    


  /**
   * Reference to a field of type 'PriorityLevel'
   */
  export type EnumPriorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorityLevel'>
    


  /**
   * Reference to a field of type 'PriorityLevel[]'
   */
  export type ListEnumPriorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorityLevel[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'TicketStatus'
   */
  export type EnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus'>
    


  /**
   * Reference to a field of type 'TicketStatus[]'
   */
  export type ListEnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    clerk_user_id?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    reports?: ReportListRelationFilter
    worker?: XOR<WorkerNullableScalarRelationFilter, WorkerWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    clerk_user_id?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    reports?: ReportOrderByRelationAggregateInput
    worker?: WorkerOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clerk_user_id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    reports?: ReportListRelationFilter
    worker?: XOR<WorkerNullableScalarRelationFilter, WorkerWhereInput> | null
  }, "id" | "clerk_user_id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    clerk_user_id?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    clerk_user_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    id?: StringFilter<"Report"> | string
    title?: StringNullableFilter<"Report"> | string | null
    description?: StringNullableFilter<"Report"> | string | null
    latitude?: FloatFilter<"Report"> | number
    longitude?: FloatFilter<"Report"> | number
    status?: EnumReportStatusFilter<"Report"> | $Enums.ReportStatus
    severity?: IntNullableFilter<"Report"> | number | null
    imageUrl?: StringNullableFilter<"Report"> | string | null
    createdAt?: DateTimeFilter<"Report"> | Date | string
    updatedAt?: DateTimeFilter<"Report"> | Date | string
    userId?: StringNullableFilter<"Report"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    media?: MediaListRelationFilter
  }

  export type ReportOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    severity?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    media?: MediaOrderByRelationAggregateInput
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    title?: StringNullableFilter<"Report"> | string | null
    description?: StringNullableFilter<"Report"> | string | null
    latitude?: FloatFilter<"Report"> | number
    longitude?: FloatFilter<"Report"> | number
    status?: EnumReportStatusFilter<"Report"> | $Enums.ReportStatus
    severity?: IntNullableFilter<"Report"> | number | null
    imageUrl?: StringNullableFilter<"Report"> | string | null
    createdAt?: DateTimeFilter<"Report"> | Date | string
    updatedAt?: DateTimeFilter<"Report"> | Date | string
    userId?: StringNullableFilter<"Report"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    media?: MediaListRelationFilter
  }, "id">

  export type ReportOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    severity?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: ReportCountOrderByAggregateInput
    _avg?: ReportAvgOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
    _sum?: ReportSumOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Report"> | string
    title?: StringNullableWithAggregatesFilter<"Report"> | string | null
    description?: StringNullableWithAggregatesFilter<"Report"> | string | null
    latitude?: FloatWithAggregatesFilter<"Report"> | number
    longitude?: FloatWithAggregatesFilter<"Report"> | number
    status?: EnumReportStatusWithAggregatesFilter<"Report"> | $Enums.ReportStatus
    severity?: IntNullableWithAggregatesFilter<"Report"> | number | null
    imageUrl?: StringNullableWithAggregatesFilter<"Report"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"Report"> | string | null
  }

  export type MediaWhereInput = {
    AND?: MediaWhereInput | MediaWhereInput[]
    OR?: MediaWhereInput[]
    NOT?: MediaWhereInput | MediaWhereInput[]
    id?: StringFilter<"Media"> | string
    mediaUrl?: StringFilter<"Media"> | string
    mediaType?: EnumMediaTypeFilter<"Media"> | $Enums.MediaType
    uploadedAt?: DateTimeFilter<"Media"> | Date | string
    reportId?: StringFilter<"Media"> | string
    report?: XOR<ReportScalarRelationFilter, ReportWhereInput>
    detections?: DetectionListRelationFilter
  }

  export type MediaOrderByWithRelationInput = {
    id?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    uploadedAt?: SortOrder
    reportId?: SortOrder
    report?: ReportOrderByWithRelationInput
    detections?: DetectionOrderByRelationAggregateInput
  }

  export type MediaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MediaWhereInput | MediaWhereInput[]
    OR?: MediaWhereInput[]
    NOT?: MediaWhereInput | MediaWhereInput[]
    mediaUrl?: StringFilter<"Media"> | string
    mediaType?: EnumMediaTypeFilter<"Media"> | $Enums.MediaType
    uploadedAt?: DateTimeFilter<"Media"> | Date | string
    reportId?: StringFilter<"Media"> | string
    report?: XOR<ReportScalarRelationFilter, ReportWhereInput>
    detections?: DetectionListRelationFilter
  }, "id">

  export type MediaOrderByWithAggregationInput = {
    id?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    uploadedAt?: SortOrder
    reportId?: SortOrder
    _count?: MediaCountOrderByAggregateInput
    _max?: MediaMaxOrderByAggregateInput
    _min?: MediaMinOrderByAggregateInput
  }

  export type MediaScalarWhereWithAggregatesInput = {
    AND?: MediaScalarWhereWithAggregatesInput | MediaScalarWhereWithAggregatesInput[]
    OR?: MediaScalarWhereWithAggregatesInput[]
    NOT?: MediaScalarWhereWithAggregatesInput | MediaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Media"> | string
    mediaUrl?: StringWithAggregatesFilter<"Media"> | string
    mediaType?: EnumMediaTypeWithAggregatesFilter<"Media"> | $Enums.MediaType
    uploadedAt?: DateTimeWithAggregatesFilter<"Media"> | Date | string
    reportId?: StringWithAggregatesFilter<"Media"> | string
  }

  export type DetectionWhereInput = {
    AND?: DetectionWhereInput | DetectionWhereInput[]
    OR?: DetectionWhereInput[]
    NOT?: DetectionWhereInput | DetectionWhereInput[]
    id?: StringFilter<"Detection"> | string
    detectedClass?: StringFilter<"Detection"> | string
    confidence?: FloatFilter<"Detection"> | number
    bboxX?: FloatFilter<"Detection"> | number
    bboxY?: FloatFilter<"Detection"> | number
    bboxWidth?: FloatFilter<"Detection"> | number
    bboxHeight?: FloatFilter<"Detection"> | number
    frameTime?: FloatNullableFilter<"Detection"> | number | null
    createdAt?: DateTimeFilter<"Detection"> | Date | string
    mediaId?: StringFilter<"Detection"> | string
    media?: XOR<MediaScalarRelationFilter, MediaWhereInput>
    pothole?: XOR<PotholeNullableScalarRelationFilter, PotholeWhereInput> | null
  }

  export type DetectionOrderByWithRelationInput = {
    id?: SortOrder
    detectedClass?: SortOrder
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    mediaId?: SortOrder
    media?: MediaOrderByWithRelationInput
    pothole?: PotholeOrderByWithRelationInput
  }

  export type DetectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DetectionWhereInput | DetectionWhereInput[]
    OR?: DetectionWhereInput[]
    NOT?: DetectionWhereInput | DetectionWhereInput[]
    detectedClass?: StringFilter<"Detection"> | string
    confidence?: FloatFilter<"Detection"> | number
    bboxX?: FloatFilter<"Detection"> | number
    bboxY?: FloatFilter<"Detection"> | number
    bboxWidth?: FloatFilter<"Detection"> | number
    bboxHeight?: FloatFilter<"Detection"> | number
    frameTime?: FloatNullableFilter<"Detection"> | number | null
    createdAt?: DateTimeFilter<"Detection"> | Date | string
    mediaId?: StringFilter<"Detection"> | string
    media?: XOR<MediaScalarRelationFilter, MediaWhereInput>
    pothole?: XOR<PotholeNullableScalarRelationFilter, PotholeWhereInput> | null
  }, "id">

  export type DetectionOrderByWithAggregationInput = {
    id?: SortOrder
    detectedClass?: SortOrder
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    mediaId?: SortOrder
    _count?: DetectionCountOrderByAggregateInput
    _avg?: DetectionAvgOrderByAggregateInput
    _max?: DetectionMaxOrderByAggregateInput
    _min?: DetectionMinOrderByAggregateInput
    _sum?: DetectionSumOrderByAggregateInput
  }

  export type DetectionScalarWhereWithAggregatesInput = {
    AND?: DetectionScalarWhereWithAggregatesInput | DetectionScalarWhereWithAggregatesInput[]
    OR?: DetectionScalarWhereWithAggregatesInput[]
    NOT?: DetectionScalarWhereWithAggregatesInput | DetectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Detection"> | string
    detectedClass?: StringWithAggregatesFilter<"Detection"> | string
    confidence?: FloatWithAggregatesFilter<"Detection"> | number
    bboxX?: FloatWithAggregatesFilter<"Detection"> | number
    bboxY?: FloatWithAggregatesFilter<"Detection"> | number
    bboxWidth?: FloatWithAggregatesFilter<"Detection"> | number
    bboxHeight?: FloatWithAggregatesFilter<"Detection"> | number
    frameTime?: FloatNullableWithAggregatesFilter<"Detection"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Detection"> | Date | string
    mediaId?: StringWithAggregatesFilter<"Detection"> | string
  }

  export type PotholeWhereInput = {
    AND?: PotholeWhereInput | PotholeWhereInput[]
    OR?: PotholeWhereInput[]
    NOT?: PotholeWhereInput | PotholeWhereInput[]
    id?: StringFilter<"Pothole"> | string
    latitude?: FloatFilter<"Pothole"> | number
    longitude?: FloatFilter<"Pothole"> | number
    imageUrl?: StringNullableFilter<"Pothole"> | string | null
    detectionId?: StringFilter<"Pothole"> | string
    priorityScore?: FloatNullableFilter<"Pothole"> | number | null
    priorityLevel?: EnumPriorityLevelNullableFilter<"Pothole"> | $Enums.PriorityLevel | null
    createdAt?: DateTimeFilter<"Pothole"> | Date | string
    updatedAt?: DateTimeFilter<"Pothole"> | Date | string
    detection?: XOR<DetectionScalarRelationFilter, DetectionWhereInput>
    roadInfo?: XOR<RoadInfoNullableScalarRelationFilter, RoadInfoWhereInput> | null
    ticket?: XOR<TicketNullableScalarRelationFilter, TicketWhereInput> | null
  }

  export type PotholeOrderByWithRelationInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    detectionId?: SortOrder
    priorityScore?: SortOrderInput | SortOrder
    priorityLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    detection?: DetectionOrderByWithRelationInput
    roadInfo?: RoadInfoOrderByWithRelationInput
    ticket?: TicketOrderByWithRelationInput
  }

  export type PotholeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    detectionId?: string
    AND?: PotholeWhereInput | PotholeWhereInput[]
    OR?: PotholeWhereInput[]
    NOT?: PotholeWhereInput | PotholeWhereInput[]
    latitude?: FloatFilter<"Pothole"> | number
    longitude?: FloatFilter<"Pothole"> | number
    imageUrl?: StringNullableFilter<"Pothole"> | string | null
    priorityScore?: FloatNullableFilter<"Pothole"> | number | null
    priorityLevel?: EnumPriorityLevelNullableFilter<"Pothole"> | $Enums.PriorityLevel | null
    createdAt?: DateTimeFilter<"Pothole"> | Date | string
    updatedAt?: DateTimeFilter<"Pothole"> | Date | string
    detection?: XOR<DetectionScalarRelationFilter, DetectionWhereInput>
    roadInfo?: XOR<RoadInfoNullableScalarRelationFilter, RoadInfoWhereInput> | null
    ticket?: XOR<TicketNullableScalarRelationFilter, TicketWhereInput> | null
  }, "id" | "detectionId">

  export type PotholeOrderByWithAggregationInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    detectionId?: SortOrder
    priorityScore?: SortOrderInput | SortOrder
    priorityLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PotholeCountOrderByAggregateInput
    _avg?: PotholeAvgOrderByAggregateInput
    _max?: PotholeMaxOrderByAggregateInput
    _min?: PotholeMinOrderByAggregateInput
    _sum?: PotholeSumOrderByAggregateInput
  }

  export type PotholeScalarWhereWithAggregatesInput = {
    AND?: PotholeScalarWhereWithAggregatesInput | PotholeScalarWhereWithAggregatesInput[]
    OR?: PotholeScalarWhereWithAggregatesInput[]
    NOT?: PotholeScalarWhereWithAggregatesInput | PotholeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pothole"> | string
    latitude?: FloatWithAggregatesFilter<"Pothole"> | number
    longitude?: FloatWithAggregatesFilter<"Pothole"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"Pothole"> | string | null
    detectionId?: StringWithAggregatesFilter<"Pothole"> | string
    priorityScore?: FloatNullableWithAggregatesFilter<"Pothole"> | number | null
    priorityLevel?: EnumPriorityLevelNullableWithAggregatesFilter<"Pothole"> | $Enums.PriorityLevel | null
    createdAt?: DateTimeWithAggregatesFilter<"Pothole"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pothole"> | Date | string
  }

  export type RoadInfoWhereInput = {
    AND?: RoadInfoWhereInput | RoadInfoWhereInput[]
    OR?: RoadInfoWhereInput[]
    NOT?: RoadInfoWhereInput | RoadInfoWhereInput[]
    id?: StringFilter<"RoadInfo"> | string
    roadName?: StringNullableFilter<"RoadInfo"> | string | null
    roadType?: StringNullableFilter<"RoadInfo"> | string | null
    speedLimit?: IntNullableFilter<"RoadInfo"> | number | null
    trafficImportance?: FloatFilter<"RoadInfo"> | number
    priorityFactor?: FloatFilter<"RoadInfo"> | number
    osmData?: JsonNullableFilter<"RoadInfo">
    potholeId?: StringFilter<"RoadInfo"> | string
    createdAt?: DateTimeFilter<"RoadInfo"> | Date | string
    updatedAt?: DateTimeFilter<"RoadInfo"> | Date | string
    pothole?: XOR<PotholeScalarRelationFilter, PotholeWhereInput>
  }

  export type RoadInfoOrderByWithRelationInput = {
    id?: SortOrder
    roadName?: SortOrderInput | SortOrder
    roadType?: SortOrderInput | SortOrder
    speedLimit?: SortOrderInput | SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
    osmData?: SortOrderInput | SortOrder
    potholeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pothole?: PotholeOrderByWithRelationInput
  }

  export type RoadInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    potholeId?: string
    AND?: RoadInfoWhereInput | RoadInfoWhereInput[]
    OR?: RoadInfoWhereInput[]
    NOT?: RoadInfoWhereInput | RoadInfoWhereInput[]
    roadName?: StringNullableFilter<"RoadInfo"> | string | null
    roadType?: StringNullableFilter<"RoadInfo"> | string | null
    speedLimit?: IntNullableFilter<"RoadInfo"> | number | null
    trafficImportance?: FloatFilter<"RoadInfo"> | number
    priorityFactor?: FloatFilter<"RoadInfo"> | number
    osmData?: JsonNullableFilter<"RoadInfo">
    createdAt?: DateTimeFilter<"RoadInfo"> | Date | string
    updatedAt?: DateTimeFilter<"RoadInfo"> | Date | string
    pothole?: XOR<PotholeScalarRelationFilter, PotholeWhereInput>
  }, "id" | "potholeId">

  export type RoadInfoOrderByWithAggregationInput = {
    id?: SortOrder
    roadName?: SortOrderInput | SortOrder
    roadType?: SortOrderInput | SortOrder
    speedLimit?: SortOrderInput | SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
    osmData?: SortOrderInput | SortOrder
    potholeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoadInfoCountOrderByAggregateInput
    _avg?: RoadInfoAvgOrderByAggregateInput
    _max?: RoadInfoMaxOrderByAggregateInput
    _min?: RoadInfoMinOrderByAggregateInput
    _sum?: RoadInfoSumOrderByAggregateInput
  }

  export type RoadInfoScalarWhereWithAggregatesInput = {
    AND?: RoadInfoScalarWhereWithAggregatesInput | RoadInfoScalarWhereWithAggregatesInput[]
    OR?: RoadInfoScalarWhereWithAggregatesInput[]
    NOT?: RoadInfoScalarWhereWithAggregatesInput | RoadInfoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoadInfo"> | string
    roadName?: StringNullableWithAggregatesFilter<"RoadInfo"> | string | null
    roadType?: StringNullableWithAggregatesFilter<"RoadInfo"> | string | null
    speedLimit?: IntNullableWithAggregatesFilter<"RoadInfo"> | number | null
    trafficImportance?: FloatWithAggregatesFilter<"RoadInfo"> | number
    priorityFactor?: FloatWithAggregatesFilter<"RoadInfo"> | number
    osmData?: JsonNullableWithAggregatesFilter<"RoadInfo">
    potholeId?: StringWithAggregatesFilter<"RoadInfo"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RoadInfo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoadInfo"> | Date | string
  }

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    id?: StringFilter<"Ticket"> | string
    ticketNumber?: StringFilter<"Ticket"> | string
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    potholeId?: StringFilter<"Ticket"> | string
    assignedWorkerId?: StringNullableFilter<"Ticket"> | string | null
    assignedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    startedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    routeData?: JsonNullableFilter<"Ticket">
    estimatedETA?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    notes?: StringNullableFilter<"Ticket"> | string | null
    adminNotes?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    pothole?: XOR<PotholeScalarRelationFilter, PotholeWhereInput>
    assignedWorker?: XOR<WorkerNullableScalarRelationFilter, WorkerWhereInput> | null
    workProofs?: WorkProofListRelationFilter
    statusHistory?: TicketStatusHistoryListRelationFilter
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    status?: SortOrder
    potholeId?: SortOrder
    assignedWorkerId?: SortOrderInput | SortOrder
    assignedAt?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    routeData?: SortOrderInput | SortOrder
    estimatedETA?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    adminNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pothole?: PotholeOrderByWithRelationInput
    assignedWorker?: WorkerOrderByWithRelationInput
    workProofs?: WorkProofOrderByRelationAggregateInput
    statusHistory?: TicketStatusHistoryOrderByRelationAggregateInput
  }

  export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ticketNumber?: string
    potholeId?: string
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    assignedWorkerId?: StringNullableFilter<"Ticket"> | string | null
    assignedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    startedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    routeData?: JsonNullableFilter<"Ticket">
    estimatedETA?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    notes?: StringNullableFilter<"Ticket"> | string | null
    adminNotes?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    pothole?: XOR<PotholeScalarRelationFilter, PotholeWhereInput>
    assignedWorker?: XOR<WorkerNullableScalarRelationFilter, WorkerWhereInput> | null
    workProofs?: WorkProofListRelationFilter
    statusHistory?: TicketStatusHistoryListRelationFilter
  }, "id" | "ticketNumber" | "potholeId">

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    status?: SortOrder
    potholeId?: SortOrder
    assignedWorkerId?: SortOrderInput | SortOrder
    assignedAt?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    routeData?: SortOrderInput | SortOrder
    estimatedETA?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    adminNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketCountOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    OR?: TicketScalarWhereWithAggregatesInput[]
    NOT?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ticket"> | string
    ticketNumber?: StringWithAggregatesFilter<"Ticket"> | string
    status?: EnumTicketStatusWithAggregatesFilter<"Ticket"> | $Enums.TicketStatus
    potholeId?: StringWithAggregatesFilter<"Ticket"> | string
    assignedWorkerId?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    assignedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
    routeData?: JsonNullableWithAggregatesFilter<"Ticket">
    estimatedETA?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    adminNotes?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
  }

  export type TicketStatusHistoryWhereInput = {
    AND?: TicketStatusHistoryWhereInput | TicketStatusHistoryWhereInput[]
    OR?: TicketStatusHistoryWhereInput[]
    NOT?: TicketStatusHistoryWhereInput | TicketStatusHistoryWhereInput[]
    id?: StringFilter<"TicketStatusHistory"> | string
    ticketId?: StringFilter<"TicketStatusHistory"> | string
    fromStatus?: EnumTicketStatusNullableFilter<"TicketStatusHistory"> | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFilter<"TicketStatusHistory"> | $Enums.TicketStatus
    changedBy?: StringNullableFilter<"TicketStatusHistory"> | string | null
    reason?: StringNullableFilter<"TicketStatusHistory"> | string | null
    createdAt?: DateTimeFilter<"TicketStatusHistory"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
  }

  export type TicketStatusHistoryOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    fromStatus?: SortOrderInput | SortOrder
    toStatus?: SortOrder
    changedBy?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    ticket?: TicketOrderByWithRelationInput
  }

  export type TicketStatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketStatusHistoryWhereInput | TicketStatusHistoryWhereInput[]
    OR?: TicketStatusHistoryWhereInput[]
    NOT?: TicketStatusHistoryWhereInput | TicketStatusHistoryWhereInput[]
    ticketId?: StringFilter<"TicketStatusHistory"> | string
    fromStatus?: EnumTicketStatusNullableFilter<"TicketStatusHistory"> | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFilter<"TicketStatusHistory"> | $Enums.TicketStatus
    changedBy?: StringNullableFilter<"TicketStatusHistory"> | string | null
    reason?: StringNullableFilter<"TicketStatusHistory"> | string | null
    createdAt?: DateTimeFilter<"TicketStatusHistory"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
  }, "id">

  export type TicketStatusHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    fromStatus?: SortOrderInput | SortOrder
    toStatus?: SortOrder
    changedBy?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TicketStatusHistoryCountOrderByAggregateInput
    _max?: TicketStatusHistoryMaxOrderByAggregateInput
    _min?: TicketStatusHistoryMinOrderByAggregateInput
  }

  export type TicketStatusHistoryScalarWhereWithAggregatesInput = {
    AND?: TicketStatusHistoryScalarWhereWithAggregatesInput | TicketStatusHistoryScalarWhereWithAggregatesInput[]
    OR?: TicketStatusHistoryScalarWhereWithAggregatesInput[]
    NOT?: TicketStatusHistoryScalarWhereWithAggregatesInput | TicketStatusHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TicketStatusHistory"> | string
    ticketId?: StringWithAggregatesFilter<"TicketStatusHistory"> | string
    fromStatus?: EnumTicketStatusNullableWithAggregatesFilter<"TicketStatusHistory"> | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusWithAggregatesFilter<"TicketStatusHistory"> | $Enums.TicketStatus
    changedBy?: StringNullableWithAggregatesFilter<"TicketStatusHistory"> | string | null
    reason?: StringNullableWithAggregatesFilter<"TicketStatusHistory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TicketStatusHistory"> | Date | string
  }

  export type WorkerWhereInput = {
    AND?: WorkerWhereInput | WorkerWhereInput[]
    OR?: WorkerWhereInput[]
    NOT?: WorkerWhereInput | WorkerWhereInput[]
    id?: StringFilter<"Worker"> | string
    userId?: StringNullableFilter<"Worker"> | string | null
    name?: StringFilter<"Worker"> | string
    email?: StringFilter<"Worker"> | string
    phone?: StringNullableFilter<"Worker"> | string | null
    employeeId?: StringFilter<"Worker"> | string
    isActive?: BoolFilter<"Worker"> | boolean
    currentLatitude?: FloatNullableFilter<"Worker"> | number | null
    currentLongitude?: FloatNullableFilter<"Worker"> | number | null
    lastLocationUpdate?: DateTimeNullableFilter<"Worker"> | Date | string | null
    createdAt?: DateTimeFilter<"Worker"> | Date | string
    updatedAt?: DateTimeFilter<"Worker"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    assignedTickets?: TicketListRelationFilter
    locationLogs?: WorkerLocationListRelationFilter
  }

  export type WorkerOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    currentLatitude?: SortOrderInput | SortOrder
    currentLongitude?: SortOrderInput | SortOrder
    lastLocationUpdate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    assignedTickets?: TicketOrderByRelationAggregateInput
    locationLogs?: WorkerLocationOrderByRelationAggregateInput
  }

  export type WorkerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    email?: string
    employeeId?: string
    AND?: WorkerWhereInput | WorkerWhereInput[]
    OR?: WorkerWhereInput[]
    NOT?: WorkerWhereInput | WorkerWhereInput[]
    name?: StringFilter<"Worker"> | string
    phone?: StringNullableFilter<"Worker"> | string | null
    isActive?: BoolFilter<"Worker"> | boolean
    currentLatitude?: FloatNullableFilter<"Worker"> | number | null
    currentLongitude?: FloatNullableFilter<"Worker"> | number | null
    lastLocationUpdate?: DateTimeNullableFilter<"Worker"> | Date | string | null
    createdAt?: DateTimeFilter<"Worker"> | Date | string
    updatedAt?: DateTimeFilter<"Worker"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    assignedTickets?: TicketListRelationFilter
    locationLogs?: WorkerLocationListRelationFilter
  }, "id" | "userId" | "email" | "employeeId">

  export type WorkerOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    currentLatitude?: SortOrderInput | SortOrder
    currentLongitude?: SortOrderInput | SortOrder
    lastLocationUpdate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkerCountOrderByAggregateInput
    _avg?: WorkerAvgOrderByAggregateInput
    _max?: WorkerMaxOrderByAggregateInput
    _min?: WorkerMinOrderByAggregateInput
    _sum?: WorkerSumOrderByAggregateInput
  }

  export type WorkerScalarWhereWithAggregatesInput = {
    AND?: WorkerScalarWhereWithAggregatesInput | WorkerScalarWhereWithAggregatesInput[]
    OR?: WorkerScalarWhereWithAggregatesInput[]
    NOT?: WorkerScalarWhereWithAggregatesInput | WorkerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Worker"> | string
    userId?: StringNullableWithAggregatesFilter<"Worker"> | string | null
    name?: StringWithAggregatesFilter<"Worker"> | string
    email?: StringWithAggregatesFilter<"Worker"> | string
    phone?: StringNullableWithAggregatesFilter<"Worker"> | string | null
    employeeId?: StringWithAggregatesFilter<"Worker"> | string
    isActive?: BoolWithAggregatesFilter<"Worker"> | boolean
    currentLatitude?: FloatNullableWithAggregatesFilter<"Worker"> | number | null
    currentLongitude?: FloatNullableWithAggregatesFilter<"Worker"> | number | null
    lastLocationUpdate?: DateTimeNullableWithAggregatesFilter<"Worker"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Worker"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Worker"> | Date | string
  }

  export type WorkerLocationWhereInput = {
    AND?: WorkerLocationWhereInput | WorkerLocationWhereInput[]
    OR?: WorkerLocationWhereInput[]
    NOT?: WorkerLocationWhereInput | WorkerLocationWhereInput[]
    id?: StringFilter<"WorkerLocation"> | string
    workerId?: StringFilter<"WorkerLocation"> | string
    latitude?: FloatFilter<"WorkerLocation"> | number
    longitude?: FloatFilter<"WorkerLocation"> | number
    accuracy?: FloatNullableFilter<"WorkerLocation"> | number | null
    recordedAt?: DateTimeFilter<"WorkerLocation"> | Date | string
    worker?: XOR<WorkerScalarRelationFilter, WorkerWhereInput>
  }

  export type WorkerLocationOrderByWithRelationInput = {
    id?: SortOrder
    workerId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    worker?: WorkerOrderByWithRelationInput
  }

  export type WorkerLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkerLocationWhereInput | WorkerLocationWhereInput[]
    OR?: WorkerLocationWhereInput[]
    NOT?: WorkerLocationWhereInput | WorkerLocationWhereInput[]
    workerId?: StringFilter<"WorkerLocation"> | string
    latitude?: FloatFilter<"WorkerLocation"> | number
    longitude?: FloatFilter<"WorkerLocation"> | number
    accuracy?: FloatNullableFilter<"WorkerLocation"> | number | null
    recordedAt?: DateTimeFilter<"WorkerLocation"> | Date | string
    worker?: XOR<WorkerScalarRelationFilter, WorkerWhereInput>
  }, "id">

  export type WorkerLocationOrderByWithAggregationInput = {
    id?: SortOrder
    workerId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    _count?: WorkerLocationCountOrderByAggregateInput
    _avg?: WorkerLocationAvgOrderByAggregateInput
    _max?: WorkerLocationMaxOrderByAggregateInput
    _min?: WorkerLocationMinOrderByAggregateInput
    _sum?: WorkerLocationSumOrderByAggregateInput
  }

  export type WorkerLocationScalarWhereWithAggregatesInput = {
    AND?: WorkerLocationScalarWhereWithAggregatesInput | WorkerLocationScalarWhereWithAggregatesInput[]
    OR?: WorkerLocationScalarWhereWithAggregatesInput[]
    NOT?: WorkerLocationScalarWhereWithAggregatesInput | WorkerLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkerLocation"> | string
    workerId?: StringWithAggregatesFilter<"WorkerLocation"> | string
    latitude?: FloatWithAggregatesFilter<"WorkerLocation"> | number
    longitude?: FloatWithAggregatesFilter<"WorkerLocation"> | number
    accuracy?: FloatNullableWithAggregatesFilter<"WorkerLocation"> | number | null
    recordedAt?: DateTimeWithAggregatesFilter<"WorkerLocation"> | Date | string
  }

  export type WorkProofWhereInput = {
    AND?: WorkProofWhereInput | WorkProofWhereInput[]
    OR?: WorkProofWhereInput[]
    NOT?: WorkProofWhereInput | WorkProofWhereInput[]
    id?: StringFilter<"WorkProof"> | string
    ticketId?: StringFilter<"WorkProof"> | string
    imageUrls?: StringNullableListFilter<"WorkProof">
    notes?: StringNullableFilter<"WorkProof"> | string | null
    latitude?: FloatNullableFilter<"WorkProof"> | number | null
    longitude?: FloatNullableFilter<"WorkProof"> | number | null
    submittedAt?: DateTimeFilter<"WorkProof"> | Date | string
    isApproved?: BoolNullableFilter<"WorkProof"> | boolean | null
    reviewedBy?: StringNullableFilter<"WorkProof"> | string | null
    reviewedAt?: DateTimeNullableFilter<"WorkProof"> | Date | string | null
    reviewNotes?: StringNullableFilter<"WorkProof"> | string | null
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
  }

  export type WorkProofOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    imageUrls?: SortOrder
    notes?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    isApproved?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    ticket?: TicketOrderByWithRelationInput
  }

  export type WorkProofWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkProofWhereInput | WorkProofWhereInput[]
    OR?: WorkProofWhereInput[]
    NOT?: WorkProofWhereInput | WorkProofWhereInput[]
    ticketId?: StringFilter<"WorkProof"> | string
    imageUrls?: StringNullableListFilter<"WorkProof">
    notes?: StringNullableFilter<"WorkProof"> | string | null
    latitude?: FloatNullableFilter<"WorkProof"> | number | null
    longitude?: FloatNullableFilter<"WorkProof"> | number | null
    submittedAt?: DateTimeFilter<"WorkProof"> | Date | string
    isApproved?: BoolNullableFilter<"WorkProof"> | boolean | null
    reviewedBy?: StringNullableFilter<"WorkProof"> | string | null
    reviewedAt?: DateTimeNullableFilter<"WorkProof"> | Date | string | null
    reviewNotes?: StringNullableFilter<"WorkProof"> | string | null
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
  }, "id">

  export type WorkProofOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    imageUrls?: SortOrder
    notes?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    isApproved?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    _count?: WorkProofCountOrderByAggregateInput
    _avg?: WorkProofAvgOrderByAggregateInput
    _max?: WorkProofMaxOrderByAggregateInput
    _min?: WorkProofMinOrderByAggregateInput
    _sum?: WorkProofSumOrderByAggregateInput
  }

  export type WorkProofScalarWhereWithAggregatesInput = {
    AND?: WorkProofScalarWhereWithAggregatesInput | WorkProofScalarWhereWithAggregatesInput[]
    OR?: WorkProofScalarWhereWithAggregatesInput[]
    NOT?: WorkProofScalarWhereWithAggregatesInput | WorkProofScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkProof"> | string
    ticketId?: StringWithAggregatesFilter<"WorkProof"> | string
    imageUrls?: StringNullableListFilter<"WorkProof">
    notes?: StringNullableWithAggregatesFilter<"WorkProof"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"WorkProof"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"WorkProof"> | number | null
    submittedAt?: DateTimeWithAggregatesFilter<"WorkProof"> | Date | string
    isApproved?: BoolNullableWithAggregatesFilter<"WorkProof"> | boolean | null
    reviewedBy?: StringNullableWithAggregatesFilter<"WorkProof"> | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"WorkProof"> | Date | string | null
    reviewNotes?: StringNullableWithAggregatesFilter<"WorkProof"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
    reports?: ReportCreateNestedManyWithoutUserInput
    worker?: WorkerCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
    reports?: ReportUncheckedCreateNestedManyWithoutUserInput
    worker?: WorkerUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: ReportUpdateManyWithoutUserNestedInput
    worker?: WorkerUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: ReportUncheckedUpdateManyWithoutUserNestedInput
    worker?: WorkerUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutReportsInput
    media?: MediaCreateNestedManyWithoutReportInput
  }

  export type ReportUncheckedCreateInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    media?: MediaUncheckedCreateNestedManyWithoutReportInput
  }

  export type ReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutReportsNestedInput
    media?: MediaUpdateManyWithoutReportNestedInput
  }

  export type ReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    media?: MediaUncheckedUpdateManyWithoutReportNestedInput
  }

  export type ReportCreateManyInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaCreateInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    report: ReportCreateNestedOneWithoutMediaInput
    detections?: DetectionCreateNestedManyWithoutMediaInput
  }

  export type MediaUncheckedCreateInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    reportId: string
    detections?: DetectionUncheckedCreateNestedManyWithoutMediaInput
  }

  export type MediaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    report?: ReportUpdateOneRequiredWithoutMediaNestedInput
    detections?: DetectionUpdateManyWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportId?: StringFieldUpdateOperationsInput | string
    detections?: DetectionUncheckedUpdateManyWithoutMediaNestedInput
  }

  export type MediaCreateManyInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    reportId: string
  }

  export type MediaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportId?: StringFieldUpdateOperationsInput | string
  }

  export type DetectionCreateInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    media: MediaCreateNestedOneWithoutDetectionsInput
    pothole?: PotholeCreateNestedOneWithoutDetectionInput
  }

  export type DetectionUncheckedCreateInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    mediaId: string
    pothole?: PotholeUncheckedCreateNestedOneWithoutDetectionInput
  }

  export type DetectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUpdateOneRequiredWithoutDetectionsNestedInput
    pothole?: PotholeUpdateOneWithoutDetectionNestedInput
  }

  export type DetectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mediaId?: StringFieldUpdateOperationsInput | string
    pothole?: PotholeUncheckedUpdateOneWithoutDetectionNestedInput
  }

  export type DetectionCreateManyInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    mediaId: string
  }

  export type DetectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mediaId?: StringFieldUpdateOperationsInput | string
  }

  export type PotholeCreateInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    detection: DetectionCreateNestedOneWithoutPotholeInput
    roadInfo?: RoadInfoCreateNestedOneWithoutPotholeInput
    ticket?: TicketCreateNestedOneWithoutPotholeInput
  }

  export type PotholeUncheckedCreateInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    detectionId: string
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roadInfo?: RoadInfoUncheckedCreateNestedOneWithoutPotholeInput
    ticket?: TicketUncheckedCreateNestedOneWithoutPotholeInput
  }

  export type PotholeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detection?: DetectionUpdateOneRequiredWithoutPotholeNestedInput
    roadInfo?: RoadInfoUpdateOneWithoutPotholeNestedInput
    ticket?: TicketUpdateOneWithoutPotholeNestedInput
  }

  export type PotholeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    detectionId?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadInfo?: RoadInfoUncheckedUpdateOneWithoutPotholeNestedInput
    ticket?: TicketUncheckedUpdateOneWithoutPotholeNestedInput
  }

  export type PotholeCreateManyInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    detectionId: string
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PotholeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PotholeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    detectionId?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadInfoCreateInput = {
    id?: string
    roadName?: string | null
    roadType?: string | null
    speedLimit?: number | null
    trafficImportance?: number
    priorityFactor?: number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    pothole: PotholeCreateNestedOneWithoutRoadInfoInput
  }

  export type RoadInfoUncheckedCreateInput = {
    id?: string
    roadName?: string | null
    roadType?: string | null
    speedLimit?: number | null
    trafficImportance?: number
    priorityFactor?: number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    potholeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadInfoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadName?: NullableStringFieldUpdateOperationsInput | string | null
    roadType?: NullableStringFieldUpdateOperationsInput | string | null
    speedLimit?: NullableIntFieldUpdateOperationsInput | number | null
    trafficImportance?: FloatFieldUpdateOperationsInput | number
    priorityFactor?: FloatFieldUpdateOperationsInput | number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUpdateOneRequiredWithoutRoadInfoNestedInput
  }

  export type RoadInfoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadName?: NullableStringFieldUpdateOperationsInput | string | null
    roadType?: NullableStringFieldUpdateOperationsInput | string | null
    speedLimit?: NullableIntFieldUpdateOperationsInput | number | null
    trafficImportance?: FloatFieldUpdateOperationsInput | number
    priorityFactor?: FloatFieldUpdateOperationsInput | number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    potholeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadInfoCreateManyInput = {
    id?: string
    roadName?: string | null
    roadType?: string | null
    speedLimit?: number | null
    trafficImportance?: number
    priorityFactor?: number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    potholeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadInfoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadName?: NullableStringFieldUpdateOperationsInput | string | null
    roadType?: NullableStringFieldUpdateOperationsInput | string | null
    speedLimit?: NullableIntFieldUpdateOperationsInput | number | null
    trafficImportance?: FloatFieldUpdateOperationsInput | number
    priorityFactor?: FloatFieldUpdateOperationsInput | number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadInfoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadName?: NullableStringFieldUpdateOperationsInput | string | null
    roadType?: NullableStringFieldUpdateOperationsInput | string | null
    speedLimit?: NullableIntFieldUpdateOperationsInput | number | null
    trafficImportance?: FloatFieldUpdateOperationsInput | number
    priorityFactor?: FloatFieldUpdateOperationsInput | number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    potholeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pothole: PotholeCreateNestedOneWithoutTicketInput
    assignedWorker?: WorkerCreateNestedOneWithoutAssignedTicketsInput
    workProofs?: WorkProofCreateNestedManyWithoutTicketInput
    statusHistory?: TicketStatusHistoryCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    potholeId: string
    assignedWorkerId?: string | null
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workProofs?: WorkProofUncheckedCreateNestedManyWithoutTicketInput
    statusHistory?: TicketStatusHistoryUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUpdateOneRequiredWithoutTicketNestedInput
    assignedWorker?: WorkerUpdateOneWithoutAssignedTicketsNestedInput
    workProofs?: WorkProofUpdateManyWithoutTicketNestedInput
    statusHistory?: TicketStatusHistoryUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    potholeId?: StringFieldUpdateOperationsInput | string
    assignedWorkerId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workProofs?: WorkProofUncheckedUpdateManyWithoutTicketNestedInput
    statusHistory?: TicketStatusHistoryUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketCreateManyInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    potholeId: string
    assignedWorkerId?: string | null
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    potholeId?: StringFieldUpdateOperationsInput | string
    assignedWorkerId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketStatusHistoryCreateInput = {
    id?: string
    fromStatus?: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy?: string | null
    reason?: string | null
    createdAt?: Date | string
    ticket: TicketCreateNestedOneWithoutStatusHistoryInput
  }

  export type TicketStatusHistoryUncheckedCreateInput = {
    id?: string
    ticketId: string
    fromStatus?: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type TicketStatusHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutStatusHistoryNestedInput
  }

  export type TicketStatusHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketStatusHistoryCreateManyInput = {
    id?: string
    ticketId: string
    fromStatus?: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type TicketStatusHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketStatusHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutWorkerInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedWorkerInput
    locationLogs?: WorkerLocationCreateNestedManyWithoutWorkerInput
  }

  export type WorkerUncheckedCreateInput = {
    id?: string
    userId?: string | null
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedWorkerInput
    locationLogs?: WorkerLocationUncheckedCreateNestedManyWithoutWorkerInput
  }

  export type WorkerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutWorkerNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedWorkerNestedInput
    locationLogs?: WorkerLocationUpdateManyWithoutWorkerNestedInput
  }

  export type WorkerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedWorkerNestedInput
    locationLogs?: WorkerLocationUncheckedUpdateManyWithoutWorkerNestedInput
  }

  export type WorkerCreateManyInput = {
    id?: string
    userId?: string | null
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerLocationCreateInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    recordedAt?: Date | string
    worker: WorkerCreateNestedOneWithoutLocationLogsInput
  }

  export type WorkerLocationUncheckedCreateInput = {
    id?: string
    workerId: string
    latitude: number
    longitude: number
    accuracy?: number | null
    recordedAt?: Date | string
  }

  export type WorkerLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: WorkerUpdateOneRequiredWithoutLocationLogsNestedInput
  }

  export type WorkerLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workerId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerLocationCreateManyInput = {
    id?: string
    workerId: string
    latitude: number
    longitude: number
    accuracy?: number | null
    recordedAt?: Date | string
  }

  export type WorkerLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workerId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkProofCreateInput = {
    id?: string
    imageUrls?: WorkProofCreateimageUrlsInput | string[]
    notes?: string | null
    latitude?: number | null
    longitude?: number | null
    submittedAt?: Date | string
    isApproved?: boolean | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
    ticket: TicketCreateNestedOneWithoutWorkProofsInput
  }

  export type WorkProofUncheckedCreateInput = {
    id?: string
    ticketId: string
    imageUrls?: WorkProofCreateimageUrlsInput | string[]
    notes?: string | null
    latitude?: number | null
    longitude?: number | null
    submittedAt?: Date | string
    isApproved?: boolean | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
  }

  export type WorkProofUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    ticket?: TicketUpdateOneRequiredWithoutWorkProofsNestedInput
  }

  export type WorkProofUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkProofCreateManyInput = {
    id?: string
    ticketId: string
    imageUrls?: WorkProofCreateimageUrlsInput | string[]
    notes?: string | null
    latitude?: number | null
    longitude?: number | null
    submittedAt?: Date | string
    isApproved?: boolean | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
  }

  export type WorkProofUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkProofUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReportListRelationFilter = {
    every?: ReportWhereInput
    some?: ReportWhereInput
    none?: ReportWhereInput
  }

  export type WorkerNullableScalarRelationFilter = {
    is?: WorkerWhereInput | null
    isNot?: WorkerWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    clerk_user_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    clerk_user_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    clerk_user_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type MediaListRelationFilter = {
    every?: MediaWhereInput
    some?: MediaWhereInput
    none?: MediaWhereInput
  }

  export type MediaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReportCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ReportAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    severity?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ReportSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    severity?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumMediaTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeFilter<$PrismaModel> | $Enums.MediaType
  }

  export type ReportScalarRelationFilter = {
    is?: ReportWhereInput
    isNot?: ReportWhereInput
  }

  export type DetectionListRelationFilter = {
    every?: DetectionWhereInput
    some?: DetectionWhereInput
    none?: DetectionWhereInput
  }

  export type DetectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MediaCountOrderByAggregateInput = {
    id?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    uploadedAt?: SortOrder
    reportId?: SortOrder
  }

  export type MediaMaxOrderByAggregateInput = {
    id?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    uploadedAt?: SortOrder
    reportId?: SortOrder
  }

  export type MediaMinOrderByAggregateInput = {
    id?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    uploadedAt?: SortOrder
    reportId?: SortOrder
  }

  export type EnumMediaTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeWithAggregatesFilter<$PrismaModel> | $Enums.MediaType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMediaTypeFilter<$PrismaModel>
    _max?: NestedEnumMediaTypeFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type MediaScalarRelationFilter = {
    is?: MediaWhereInput
    isNot?: MediaWhereInput
  }

  export type PotholeNullableScalarRelationFilter = {
    is?: PotholeWhereInput | null
    isNot?: PotholeWhereInput | null
  }

  export type DetectionCountOrderByAggregateInput = {
    id?: SortOrder
    detectedClass?: SortOrder
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrder
    createdAt?: SortOrder
    mediaId?: SortOrder
  }

  export type DetectionAvgOrderByAggregateInput = {
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrder
  }

  export type DetectionMaxOrderByAggregateInput = {
    id?: SortOrder
    detectedClass?: SortOrder
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrder
    createdAt?: SortOrder
    mediaId?: SortOrder
  }

  export type DetectionMinOrderByAggregateInput = {
    id?: SortOrder
    detectedClass?: SortOrder
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrder
    createdAt?: SortOrder
    mediaId?: SortOrder
  }

  export type DetectionSumOrderByAggregateInput = {
    confidence?: SortOrder
    bboxX?: SortOrder
    bboxY?: SortOrder
    bboxWidth?: SortOrder
    bboxHeight?: SortOrder
    frameTime?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumPriorityLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityLevelNullableFilter<$PrismaModel> | $Enums.PriorityLevel | null
  }

  export type DetectionScalarRelationFilter = {
    is?: DetectionWhereInput
    isNot?: DetectionWhereInput
  }

  export type RoadInfoNullableScalarRelationFilter = {
    is?: RoadInfoWhereInput | null
    isNot?: RoadInfoWhereInput | null
  }

  export type TicketNullableScalarRelationFilter = {
    is?: TicketWhereInput | null
    isNot?: TicketWhereInput | null
  }

  export type PotholeCountOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrder
    detectionId?: SortOrder
    priorityScore?: SortOrder
    priorityLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PotholeAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    priorityScore?: SortOrder
  }

  export type PotholeMaxOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrder
    detectionId?: SortOrder
    priorityScore?: SortOrder
    priorityLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PotholeMinOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    imageUrl?: SortOrder
    detectionId?: SortOrder
    priorityScore?: SortOrder
    priorityLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PotholeSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    priorityScore?: SortOrder
  }

  export type EnumPriorityLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.PriorityLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPriorityLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumPriorityLevelNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PotholeScalarRelationFilter = {
    is?: PotholeWhereInput
    isNot?: PotholeWhereInput
  }

  export type RoadInfoCountOrderByAggregateInput = {
    id?: SortOrder
    roadName?: SortOrder
    roadType?: SortOrder
    speedLimit?: SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
    osmData?: SortOrder
    potholeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadInfoAvgOrderByAggregateInput = {
    speedLimit?: SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
  }

  export type RoadInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    roadName?: SortOrder
    roadType?: SortOrder
    speedLimit?: SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
    potholeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadInfoMinOrderByAggregateInput = {
    id?: SortOrder
    roadName?: SortOrder
    roadType?: SortOrder
    speedLimit?: SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
    potholeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadInfoSumOrderByAggregateInput = {
    speedLimit?: SortOrder
    trafficImportance?: SortOrder
    priorityFactor?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type WorkProofListRelationFilter = {
    every?: WorkProofWhereInput
    some?: WorkProofWhereInput
    none?: WorkProofWhereInput
  }

  export type TicketStatusHistoryListRelationFilter = {
    every?: TicketStatusHistoryWhereInput
    some?: TicketStatusHistoryWhereInput
    none?: TicketStatusHistoryWhereInput
  }

  export type WorkProofOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketStatusHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    status?: SortOrder
    potholeId?: SortOrder
    assignedWorkerId?: SortOrder
    assignedAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    resolvedAt?: SortOrder
    routeData?: SortOrder
    estimatedETA?: SortOrder
    notes?: SortOrder
    adminNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    status?: SortOrder
    potholeId?: SortOrder
    assignedWorkerId?: SortOrder
    assignedAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    resolvedAt?: SortOrder
    estimatedETA?: SortOrder
    notes?: SortOrder
    adminNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    status?: SortOrder
    potholeId?: SortOrder
    assignedWorkerId?: SortOrder
    assignedAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    resolvedAt?: SortOrder
    estimatedETA?: SortOrder
    notes?: SortOrder
    adminNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumTicketStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTicketStatusNullableFilter<$PrismaModel> | $Enums.TicketStatus | null
  }

  export type TicketScalarRelationFilter = {
    is?: TicketWhereInput
    isNot?: TicketWhereInput
  }

  export type TicketStatusHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedBy?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type TicketStatusHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedBy?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type TicketStatusHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    changedBy?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumTicketStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTicketStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type WorkerLocationListRelationFilter = {
    every?: WorkerLocationWhereInput
    some?: WorkerLocationWhereInput
    none?: WorkerLocationWhereInput
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkerLocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkerCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    currentLatitude?: SortOrder
    currentLongitude?: SortOrder
    lastLocationUpdate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkerAvgOrderByAggregateInput = {
    currentLatitude?: SortOrder
    currentLongitude?: SortOrder
  }

  export type WorkerMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    currentLatitude?: SortOrder
    currentLongitude?: SortOrder
    lastLocationUpdate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkerMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    currentLatitude?: SortOrder
    currentLongitude?: SortOrder
    lastLocationUpdate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkerSumOrderByAggregateInput = {
    currentLatitude?: SortOrder
    currentLongitude?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type WorkerScalarRelationFilter = {
    is?: WorkerWhereInput
    isNot?: WorkerWhereInput
  }

  export type WorkerLocationCountOrderByAggregateInput = {
    id?: SortOrder
    workerId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    recordedAt?: SortOrder
  }

  export type WorkerLocationAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
  }

  export type WorkerLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    workerId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    recordedAt?: SortOrder
  }

  export type WorkerLocationMinOrderByAggregateInput = {
    id?: SortOrder
    workerId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    recordedAt?: SortOrder
  }

  export type WorkerLocationSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type WorkProofCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    imageUrls?: SortOrder
    notes?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    submittedAt?: SortOrder
    isApproved?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNotes?: SortOrder
  }

  export type WorkProofAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type WorkProofMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    notes?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    submittedAt?: SortOrder
    isApproved?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNotes?: SortOrder
  }

  export type WorkProofMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    notes?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    submittedAt?: SortOrder
    isApproved?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNotes?: SortOrder
  }

  export type WorkProofSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ReportCreateNestedManyWithoutUserInput = {
    create?: XOR<ReportCreateWithoutUserInput, ReportUncheckedCreateWithoutUserInput> | ReportCreateWithoutUserInput[] | ReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutUserInput | ReportCreateOrConnectWithoutUserInput[]
    createMany?: ReportCreateManyUserInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type WorkerCreateNestedOneWithoutUserInput = {
    create?: XOR<WorkerCreateWithoutUserInput, WorkerUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutUserInput
    connect?: WorkerWhereUniqueInput
  }

  export type ReportUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReportCreateWithoutUserInput, ReportUncheckedCreateWithoutUserInput> | ReportCreateWithoutUserInput[] | ReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutUserInput | ReportCreateOrConnectWithoutUserInput[]
    createMany?: ReportCreateManyUserInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type WorkerUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WorkerCreateWithoutUserInput, WorkerUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutUserInput
    connect?: WorkerWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReportUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReportCreateWithoutUserInput, ReportUncheckedCreateWithoutUserInput> | ReportCreateWithoutUserInput[] | ReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutUserInput | ReportCreateOrConnectWithoutUserInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutUserInput | ReportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReportCreateManyUserInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutUserInput | ReportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutUserInput | ReportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type WorkerUpdateOneWithoutUserNestedInput = {
    create?: XOR<WorkerCreateWithoutUserInput, WorkerUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutUserInput
    upsert?: WorkerUpsertWithoutUserInput
    disconnect?: WorkerWhereInput | boolean
    delete?: WorkerWhereInput | boolean
    connect?: WorkerWhereUniqueInput
    update?: XOR<XOR<WorkerUpdateToOneWithWhereWithoutUserInput, WorkerUpdateWithoutUserInput>, WorkerUncheckedUpdateWithoutUserInput>
  }

  export type ReportUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReportCreateWithoutUserInput, ReportUncheckedCreateWithoutUserInput> | ReportCreateWithoutUserInput[] | ReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutUserInput | ReportCreateOrConnectWithoutUserInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutUserInput | ReportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReportCreateManyUserInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutUserInput | ReportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutUserInput | ReportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type WorkerUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WorkerCreateWithoutUserInput, WorkerUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutUserInput
    upsert?: WorkerUpsertWithoutUserInput
    disconnect?: WorkerWhereInput | boolean
    delete?: WorkerWhereInput | boolean
    connect?: WorkerWhereUniqueInput
    update?: XOR<XOR<WorkerUpdateToOneWithWhereWithoutUserInput, WorkerUpdateWithoutUserInput>, WorkerUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutReportsInput = {
    create?: XOR<UserCreateWithoutReportsInput, UserUncheckedCreateWithoutReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReportsInput
    connect?: UserWhereUniqueInput
  }

  export type MediaCreateNestedManyWithoutReportInput = {
    create?: XOR<MediaCreateWithoutReportInput, MediaUncheckedCreateWithoutReportInput> | MediaCreateWithoutReportInput[] | MediaUncheckedCreateWithoutReportInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutReportInput | MediaCreateOrConnectWithoutReportInput[]
    createMany?: MediaCreateManyReportInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type MediaUncheckedCreateNestedManyWithoutReportInput = {
    create?: XOR<MediaCreateWithoutReportInput, MediaUncheckedCreateWithoutReportInput> | MediaCreateWithoutReportInput[] | MediaUncheckedCreateWithoutReportInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutReportInput | MediaCreateOrConnectWithoutReportInput[]
    createMany?: MediaCreateManyReportInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumReportStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReportStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutReportsNestedInput = {
    create?: XOR<UserCreateWithoutReportsInput, UserUncheckedCreateWithoutReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReportsInput
    upsert?: UserUpsertWithoutReportsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReportsInput, UserUpdateWithoutReportsInput>, UserUncheckedUpdateWithoutReportsInput>
  }

  export type MediaUpdateManyWithoutReportNestedInput = {
    create?: XOR<MediaCreateWithoutReportInput, MediaUncheckedCreateWithoutReportInput> | MediaCreateWithoutReportInput[] | MediaUncheckedCreateWithoutReportInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutReportInput | MediaCreateOrConnectWithoutReportInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutReportInput | MediaUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: MediaCreateManyReportInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutReportInput | MediaUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutReportInput | MediaUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type MediaUncheckedUpdateManyWithoutReportNestedInput = {
    create?: XOR<MediaCreateWithoutReportInput, MediaUncheckedCreateWithoutReportInput> | MediaCreateWithoutReportInput[] | MediaUncheckedCreateWithoutReportInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutReportInput | MediaCreateOrConnectWithoutReportInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutReportInput | MediaUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: MediaCreateManyReportInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutReportInput | MediaUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutReportInput | MediaUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type ReportCreateNestedOneWithoutMediaInput = {
    create?: XOR<ReportCreateWithoutMediaInput, ReportUncheckedCreateWithoutMediaInput>
    connectOrCreate?: ReportCreateOrConnectWithoutMediaInput
    connect?: ReportWhereUniqueInput
  }

  export type DetectionCreateNestedManyWithoutMediaInput = {
    create?: XOR<DetectionCreateWithoutMediaInput, DetectionUncheckedCreateWithoutMediaInput> | DetectionCreateWithoutMediaInput[] | DetectionUncheckedCreateWithoutMediaInput[]
    connectOrCreate?: DetectionCreateOrConnectWithoutMediaInput | DetectionCreateOrConnectWithoutMediaInput[]
    createMany?: DetectionCreateManyMediaInputEnvelope
    connect?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
  }

  export type DetectionUncheckedCreateNestedManyWithoutMediaInput = {
    create?: XOR<DetectionCreateWithoutMediaInput, DetectionUncheckedCreateWithoutMediaInput> | DetectionCreateWithoutMediaInput[] | DetectionUncheckedCreateWithoutMediaInput[]
    connectOrCreate?: DetectionCreateOrConnectWithoutMediaInput | DetectionCreateOrConnectWithoutMediaInput[]
    createMany?: DetectionCreateManyMediaInputEnvelope
    connect?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
  }

  export type EnumMediaTypeFieldUpdateOperationsInput = {
    set?: $Enums.MediaType
  }

  export type ReportUpdateOneRequiredWithoutMediaNestedInput = {
    create?: XOR<ReportCreateWithoutMediaInput, ReportUncheckedCreateWithoutMediaInput>
    connectOrCreate?: ReportCreateOrConnectWithoutMediaInput
    upsert?: ReportUpsertWithoutMediaInput
    connect?: ReportWhereUniqueInput
    update?: XOR<XOR<ReportUpdateToOneWithWhereWithoutMediaInput, ReportUpdateWithoutMediaInput>, ReportUncheckedUpdateWithoutMediaInput>
  }

  export type DetectionUpdateManyWithoutMediaNestedInput = {
    create?: XOR<DetectionCreateWithoutMediaInput, DetectionUncheckedCreateWithoutMediaInput> | DetectionCreateWithoutMediaInput[] | DetectionUncheckedCreateWithoutMediaInput[]
    connectOrCreate?: DetectionCreateOrConnectWithoutMediaInput | DetectionCreateOrConnectWithoutMediaInput[]
    upsert?: DetectionUpsertWithWhereUniqueWithoutMediaInput | DetectionUpsertWithWhereUniqueWithoutMediaInput[]
    createMany?: DetectionCreateManyMediaInputEnvelope
    set?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    disconnect?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    delete?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    connect?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    update?: DetectionUpdateWithWhereUniqueWithoutMediaInput | DetectionUpdateWithWhereUniqueWithoutMediaInput[]
    updateMany?: DetectionUpdateManyWithWhereWithoutMediaInput | DetectionUpdateManyWithWhereWithoutMediaInput[]
    deleteMany?: DetectionScalarWhereInput | DetectionScalarWhereInput[]
  }

  export type DetectionUncheckedUpdateManyWithoutMediaNestedInput = {
    create?: XOR<DetectionCreateWithoutMediaInput, DetectionUncheckedCreateWithoutMediaInput> | DetectionCreateWithoutMediaInput[] | DetectionUncheckedCreateWithoutMediaInput[]
    connectOrCreate?: DetectionCreateOrConnectWithoutMediaInput | DetectionCreateOrConnectWithoutMediaInput[]
    upsert?: DetectionUpsertWithWhereUniqueWithoutMediaInput | DetectionUpsertWithWhereUniqueWithoutMediaInput[]
    createMany?: DetectionCreateManyMediaInputEnvelope
    set?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    disconnect?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    delete?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    connect?: DetectionWhereUniqueInput | DetectionWhereUniqueInput[]
    update?: DetectionUpdateWithWhereUniqueWithoutMediaInput | DetectionUpdateWithWhereUniqueWithoutMediaInput[]
    updateMany?: DetectionUpdateManyWithWhereWithoutMediaInput | DetectionUpdateManyWithWhereWithoutMediaInput[]
    deleteMany?: DetectionScalarWhereInput | DetectionScalarWhereInput[]
  }

  export type MediaCreateNestedOneWithoutDetectionsInput = {
    create?: XOR<MediaCreateWithoutDetectionsInput, MediaUncheckedCreateWithoutDetectionsInput>
    connectOrCreate?: MediaCreateOrConnectWithoutDetectionsInput
    connect?: MediaWhereUniqueInput
  }

  export type PotholeCreateNestedOneWithoutDetectionInput = {
    create?: XOR<PotholeCreateWithoutDetectionInput, PotholeUncheckedCreateWithoutDetectionInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutDetectionInput
    connect?: PotholeWhereUniqueInput
  }

  export type PotholeUncheckedCreateNestedOneWithoutDetectionInput = {
    create?: XOR<PotholeCreateWithoutDetectionInput, PotholeUncheckedCreateWithoutDetectionInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutDetectionInput
    connect?: PotholeWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MediaUpdateOneRequiredWithoutDetectionsNestedInput = {
    create?: XOR<MediaCreateWithoutDetectionsInput, MediaUncheckedCreateWithoutDetectionsInput>
    connectOrCreate?: MediaCreateOrConnectWithoutDetectionsInput
    upsert?: MediaUpsertWithoutDetectionsInput
    connect?: MediaWhereUniqueInput
    update?: XOR<XOR<MediaUpdateToOneWithWhereWithoutDetectionsInput, MediaUpdateWithoutDetectionsInput>, MediaUncheckedUpdateWithoutDetectionsInput>
  }

  export type PotholeUpdateOneWithoutDetectionNestedInput = {
    create?: XOR<PotholeCreateWithoutDetectionInput, PotholeUncheckedCreateWithoutDetectionInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutDetectionInput
    upsert?: PotholeUpsertWithoutDetectionInput
    disconnect?: PotholeWhereInput | boolean
    delete?: PotholeWhereInput | boolean
    connect?: PotholeWhereUniqueInput
    update?: XOR<XOR<PotholeUpdateToOneWithWhereWithoutDetectionInput, PotholeUpdateWithoutDetectionInput>, PotholeUncheckedUpdateWithoutDetectionInput>
  }

  export type PotholeUncheckedUpdateOneWithoutDetectionNestedInput = {
    create?: XOR<PotholeCreateWithoutDetectionInput, PotholeUncheckedCreateWithoutDetectionInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutDetectionInput
    upsert?: PotholeUpsertWithoutDetectionInput
    disconnect?: PotholeWhereInput | boolean
    delete?: PotholeWhereInput | boolean
    connect?: PotholeWhereUniqueInput
    update?: XOR<XOR<PotholeUpdateToOneWithWhereWithoutDetectionInput, PotholeUpdateWithoutDetectionInput>, PotholeUncheckedUpdateWithoutDetectionInput>
  }

  export type DetectionCreateNestedOneWithoutPotholeInput = {
    create?: XOR<DetectionCreateWithoutPotholeInput, DetectionUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: DetectionCreateOrConnectWithoutPotholeInput
    connect?: DetectionWhereUniqueInput
  }

  export type RoadInfoCreateNestedOneWithoutPotholeInput = {
    create?: XOR<RoadInfoCreateWithoutPotholeInput, RoadInfoUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: RoadInfoCreateOrConnectWithoutPotholeInput
    connect?: RoadInfoWhereUniqueInput
  }

  export type TicketCreateNestedOneWithoutPotholeInput = {
    create?: XOR<TicketCreateWithoutPotholeInput, TicketUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: TicketCreateOrConnectWithoutPotholeInput
    connect?: TicketWhereUniqueInput
  }

  export type RoadInfoUncheckedCreateNestedOneWithoutPotholeInput = {
    create?: XOR<RoadInfoCreateWithoutPotholeInput, RoadInfoUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: RoadInfoCreateOrConnectWithoutPotholeInput
    connect?: RoadInfoWhereUniqueInput
  }

  export type TicketUncheckedCreateNestedOneWithoutPotholeInput = {
    create?: XOR<TicketCreateWithoutPotholeInput, TicketUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: TicketCreateOrConnectWithoutPotholeInput
    connect?: TicketWhereUniqueInput
  }

  export type NullableEnumPriorityLevelFieldUpdateOperationsInput = {
    set?: $Enums.PriorityLevel | null
  }

  export type DetectionUpdateOneRequiredWithoutPotholeNestedInput = {
    create?: XOR<DetectionCreateWithoutPotholeInput, DetectionUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: DetectionCreateOrConnectWithoutPotholeInput
    upsert?: DetectionUpsertWithoutPotholeInput
    connect?: DetectionWhereUniqueInput
    update?: XOR<XOR<DetectionUpdateToOneWithWhereWithoutPotholeInput, DetectionUpdateWithoutPotholeInput>, DetectionUncheckedUpdateWithoutPotholeInput>
  }

  export type RoadInfoUpdateOneWithoutPotholeNestedInput = {
    create?: XOR<RoadInfoCreateWithoutPotholeInput, RoadInfoUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: RoadInfoCreateOrConnectWithoutPotholeInput
    upsert?: RoadInfoUpsertWithoutPotholeInput
    disconnect?: RoadInfoWhereInput | boolean
    delete?: RoadInfoWhereInput | boolean
    connect?: RoadInfoWhereUniqueInput
    update?: XOR<XOR<RoadInfoUpdateToOneWithWhereWithoutPotholeInput, RoadInfoUpdateWithoutPotholeInput>, RoadInfoUncheckedUpdateWithoutPotholeInput>
  }

  export type TicketUpdateOneWithoutPotholeNestedInput = {
    create?: XOR<TicketCreateWithoutPotholeInput, TicketUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: TicketCreateOrConnectWithoutPotholeInput
    upsert?: TicketUpsertWithoutPotholeInput
    disconnect?: TicketWhereInput | boolean
    delete?: TicketWhereInput | boolean
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutPotholeInput, TicketUpdateWithoutPotholeInput>, TicketUncheckedUpdateWithoutPotholeInput>
  }

  export type RoadInfoUncheckedUpdateOneWithoutPotholeNestedInput = {
    create?: XOR<RoadInfoCreateWithoutPotholeInput, RoadInfoUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: RoadInfoCreateOrConnectWithoutPotholeInput
    upsert?: RoadInfoUpsertWithoutPotholeInput
    disconnect?: RoadInfoWhereInput | boolean
    delete?: RoadInfoWhereInput | boolean
    connect?: RoadInfoWhereUniqueInput
    update?: XOR<XOR<RoadInfoUpdateToOneWithWhereWithoutPotholeInput, RoadInfoUpdateWithoutPotholeInput>, RoadInfoUncheckedUpdateWithoutPotholeInput>
  }

  export type TicketUncheckedUpdateOneWithoutPotholeNestedInput = {
    create?: XOR<TicketCreateWithoutPotholeInput, TicketUncheckedCreateWithoutPotholeInput>
    connectOrCreate?: TicketCreateOrConnectWithoutPotholeInput
    upsert?: TicketUpsertWithoutPotholeInput
    disconnect?: TicketWhereInput | boolean
    delete?: TicketWhereInput | boolean
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutPotholeInput, TicketUpdateWithoutPotholeInput>, TicketUncheckedUpdateWithoutPotholeInput>
  }

  export type PotholeCreateNestedOneWithoutRoadInfoInput = {
    create?: XOR<PotholeCreateWithoutRoadInfoInput, PotholeUncheckedCreateWithoutRoadInfoInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutRoadInfoInput
    connect?: PotholeWhereUniqueInput
  }

  export type PotholeUpdateOneRequiredWithoutRoadInfoNestedInput = {
    create?: XOR<PotholeCreateWithoutRoadInfoInput, PotholeUncheckedCreateWithoutRoadInfoInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutRoadInfoInput
    upsert?: PotholeUpsertWithoutRoadInfoInput
    connect?: PotholeWhereUniqueInput
    update?: XOR<XOR<PotholeUpdateToOneWithWhereWithoutRoadInfoInput, PotholeUpdateWithoutRoadInfoInput>, PotholeUncheckedUpdateWithoutRoadInfoInput>
  }

  export type PotholeCreateNestedOneWithoutTicketInput = {
    create?: XOR<PotholeCreateWithoutTicketInput, PotholeUncheckedCreateWithoutTicketInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutTicketInput
    connect?: PotholeWhereUniqueInput
  }

  export type WorkerCreateNestedOneWithoutAssignedTicketsInput = {
    create?: XOR<WorkerCreateWithoutAssignedTicketsInput, WorkerUncheckedCreateWithoutAssignedTicketsInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutAssignedTicketsInput
    connect?: WorkerWhereUniqueInput
  }

  export type WorkProofCreateNestedManyWithoutTicketInput = {
    create?: XOR<WorkProofCreateWithoutTicketInput, WorkProofUncheckedCreateWithoutTicketInput> | WorkProofCreateWithoutTicketInput[] | WorkProofUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: WorkProofCreateOrConnectWithoutTicketInput | WorkProofCreateOrConnectWithoutTicketInput[]
    createMany?: WorkProofCreateManyTicketInputEnvelope
    connect?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
  }

  export type TicketStatusHistoryCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketStatusHistoryCreateWithoutTicketInput, TicketStatusHistoryUncheckedCreateWithoutTicketInput> | TicketStatusHistoryCreateWithoutTicketInput[] | TicketStatusHistoryUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketStatusHistoryCreateOrConnectWithoutTicketInput | TicketStatusHistoryCreateOrConnectWithoutTicketInput[]
    createMany?: TicketStatusHistoryCreateManyTicketInputEnvelope
    connect?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
  }

  export type WorkProofUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<WorkProofCreateWithoutTicketInput, WorkProofUncheckedCreateWithoutTicketInput> | WorkProofCreateWithoutTicketInput[] | WorkProofUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: WorkProofCreateOrConnectWithoutTicketInput | WorkProofCreateOrConnectWithoutTicketInput[]
    createMany?: WorkProofCreateManyTicketInputEnvelope
    connect?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
  }

  export type TicketStatusHistoryUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketStatusHistoryCreateWithoutTicketInput, TicketStatusHistoryUncheckedCreateWithoutTicketInput> | TicketStatusHistoryCreateWithoutTicketInput[] | TicketStatusHistoryUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketStatusHistoryCreateOrConnectWithoutTicketInput | TicketStatusHistoryCreateOrConnectWithoutTicketInput[]
    createMany?: TicketStatusHistoryCreateManyTicketInputEnvelope
    connect?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
  }

  export type EnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PotholeUpdateOneRequiredWithoutTicketNestedInput = {
    create?: XOR<PotholeCreateWithoutTicketInput, PotholeUncheckedCreateWithoutTicketInput>
    connectOrCreate?: PotholeCreateOrConnectWithoutTicketInput
    upsert?: PotholeUpsertWithoutTicketInput
    connect?: PotholeWhereUniqueInput
    update?: XOR<XOR<PotholeUpdateToOneWithWhereWithoutTicketInput, PotholeUpdateWithoutTicketInput>, PotholeUncheckedUpdateWithoutTicketInput>
  }

  export type WorkerUpdateOneWithoutAssignedTicketsNestedInput = {
    create?: XOR<WorkerCreateWithoutAssignedTicketsInput, WorkerUncheckedCreateWithoutAssignedTicketsInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutAssignedTicketsInput
    upsert?: WorkerUpsertWithoutAssignedTicketsInput
    disconnect?: WorkerWhereInput | boolean
    delete?: WorkerWhereInput | boolean
    connect?: WorkerWhereUniqueInput
    update?: XOR<XOR<WorkerUpdateToOneWithWhereWithoutAssignedTicketsInput, WorkerUpdateWithoutAssignedTicketsInput>, WorkerUncheckedUpdateWithoutAssignedTicketsInput>
  }

  export type WorkProofUpdateManyWithoutTicketNestedInput = {
    create?: XOR<WorkProofCreateWithoutTicketInput, WorkProofUncheckedCreateWithoutTicketInput> | WorkProofCreateWithoutTicketInput[] | WorkProofUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: WorkProofCreateOrConnectWithoutTicketInput | WorkProofCreateOrConnectWithoutTicketInput[]
    upsert?: WorkProofUpsertWithWhereUniqueWithoutTicketInput | WorkProofUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: WorkProofCreateManyTicketInputEnvelope
    set?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    disconnect?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    delete?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    connect?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    update?: WorkProofUpdateWithWhereUniqueWithoutTicketInput | WorkProofUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: WorkProofUpdateManyWithWhereWithoutTicketInput | WorkProofUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: WorkProofScalarWhereInput | WorkProofScalarWhereInput[]
  }

  export type TicketStatusHistoryUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketStatusHistoryCreateWithoutTicketInput, TicketStatusHistoryUncheckedCreateWithoutTicketInput> | TicketStatusHistoryCreateWithoutTicketInput[] | TicketStatusHistoryUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketStatusHistoryCreateOrConnectWithoutTicketInput | TicketStatusHistoryCreateOrConnectWithoutTicketInput[]
    upsert?: TicketStatusHistoryUpsertWithWhereUniqueWithoutTicketInput | TicketStatusHistoryUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketStatusHistoryCreateManyTicketInputEnvelope
    set?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    disconnect?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    delete?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    connect?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    update?: TicketStatusHistoryUpdateWithWhereUniqueWithoutTicketInput | TicketStatusHistoryUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketStatusHistoryUpdateManyWithWhereWithoutTicketInput | TicketStatusHistoryUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketStatusHistoryScalarWhereInput | TicketStatusHistoryScalarWhereInput[]
  }

  export type WorkProofUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<WorkProofCreateWithoutTicketInput, WorkProofUncheckedCreateWithoutTicketInput> | WorkProofCreateWithoutTicketInput[] | WorkProofUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: WorkProofCreateOrConnectWithoutTicketInput | WorkProofCreateOrConnectWithoutTicketInput[]
    upsert?: WorkProofUpsertWithWhereUniqueWithoutTicketInput | WorkProofUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: WorkProofCreateManyTicketInputEnvelope
    set?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    disconnect?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    delete?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    connect?: WorkProofWhereUniqueInput | WorkProofWhereUniqueInput[]
    update?: WorkProofUpdateWithWhereUniqueWithoutTicketInput | WorkProofUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: WorkProofUpdateManyWithWhereWithoutTicketInput | WorkProofUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: WorkProofScalarWhereInput | WorkProofScalarWhereInput[]
  }

  export type TicketStatusHistoryUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketStatusHistoryCreateWithoutTicketInput, TicketStatusHistoryUncheckedCreateWithoutTicketInput> | TicketStatusHistoryCreateWithoutTicketInput[] | TicketStatusHistoryUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketStatusHistoryCreateOrConnectWithoutTicketInput | TicketStatusHistoryCreateOrConnectWithoutTicketInput[]
    upsert?: TicketStatusHistoryUpsertWithWhereUniqueWithoutTicketInput | TicketStatusHistoryUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketStatusHistoryCreateManyTicketInputEnvelope
    set?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    disconnect?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    delete?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    connect?: TicketStatusHistoryWhereUniqueInput | TicketStatusHistoryWhereUniqueInput[]
    update?: TicketStatusHistoryUpdateWithWhereUniqueWithoutTicketInput | TicketStatusHistoryUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketStatusHistoryUpdateManyWithWhereWithoutTicketInput | TicketStatusHistoryUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketStatusHistoryScalarWhereInput | TicketStatusHistoryScalarWhereInput[]
  }

  export type TicketCreateNestedOneWithoutStatusHistoryInput = {
    create?: XOR<TicketCreateWithoutStatusHistoryInput, TicketUncheckedCreateWithoutStatusHistoryInput>
    connectOrCreate?: TicketCreateOrConnectWithoutStatusHistoryInput
    connect?: TicketWhereUniqueInput
  }

  export type NullableEnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus | null
  }

  export type TicketUpdateOneRequiredWithoutStatusHistoryNestedInput = {
    create?: XOR<TicketCreateWithoutStatusHistoryInput, TicketUncheckedCreateWithoutStatusHistoryInput>
    connectOrCreate?: TicketCreateOrConnectWithoutStatusHistoryInput
    upsert?: TicketUpsertWithoutStatusHistoryInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutStatusHistoryInput, TicketUpdateWithoutStatusHistoryInput>, TicketUncheckedUpdateWithoutStatusHistoryInput>
  }

  export type UserCreateNestedOneWithoutWorkerInput = {
    create?: XOR<UserCreateWithoutWorkerInput, UserUncheckedCreateWithoutWorkerInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkerInput
    connect?: UserWhereUniqueInput
  }

  export type TicketCreateNestedManyWithoutAssignedWorkerInput = {
    create?: XOR<TicketCreateWithoutAssignedWorkerInput, TicketUncheckedCreateWithoutAssignedWorkerInput> | TicketCreateWithoutAssignedWorkerInput[] | TicketUncheckedCreateWithoutAssignedWorkerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedWorkerInput | TicketCreateOrConnectWithoutAssignedWorkerInput[]
    createMany?: TicketCreateManyAssignedWorkerInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type WorkerLocationCreateNestedManyWithoutWorkerInput = {
    create?: XOR<WorkerLocationCreateWithoutWorkerInput, WorkerLocationUncheckedCreateWithoutWorkerInput> | WorkerLocationCreateWithoutWorkerInput[] | WorkerLocationUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkerLocationCreateOrConnectWithoutWorkerInput | WorkerLocationCreateOrConnectWithoutWorkerInput[]
    createMany?: WorkerLocationCreateManyWorkerInputEnvelope
    connect?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutAssignedWorkerInput = {
    create?: XOR<TicketCreateWithoutAssignedWorkerInput, TicketUncheckedCreateWithoutAssignedWorkerInput> | TicketCreateWithoutAssignedWorkerInput[] | TicketUncheckedCreateWithoutAssignedWorkerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedWorkerInput | TicketCreateOrConnectWithoutAssignedWorkerInput[]
    createMany?: TicketCreateManyAssignedWorkerInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type WorkerLocationUncheckedCreateNestedManyWithoutWorkerInput = {
    create?: XOR<WorkerLocationCreateWithoutWorkerInput, WorkerLocationUncheckedCreateWithoutWorkerInput> | WorkerLocationCreateWithoutWorkerInput[] | WorkerLocationUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkerLocationCreateOrConnectWithoutWorkerInput | WorkerLocationCreateOrConnectWithoutWorkerInput[]
    createMany?: WorkerLocationCreateManyWorkerInputEnvelope
    connect?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutWorkerNestedInput = {
    create?: XOR<UserCreateWithoutWorkerInput, UserUncheckedCreateWithoutWorkerInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkerInput
    upsert?: UserUpsertWithoutWorkerInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkerInput, UserUpdateWithoutWorkerInput>, UserUncheckedUpdateWithoutWorkerInput>
  }

  export type TicketUpdateManyWithoutAssignedWorkerNestedInput = {
    create?: XOR<TicketCreateWithoutAssignedWorkerInput, TicketUncheckedCreateWithoutAssignedWorkerInput> | TicketCreateWithoutAssignedWorkerInput[] | TicketUncheckedCreateWithoutAssignedWorkerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedWorkerInput | TicketCreateOrConnectWithoutAssignedWorkerInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutAssignedWorkerInput | TicketUpsertWithWhereUniqueWithoutAssignedWorkerInput[]
    createMany?: TicketCreateManyAssignedWorkerInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutAssignedWorkerInput | TicketUpdateWithWhereUniqueWithoutAssignedWorkerInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutAssignedWorkerInput | TicketUpdateManyWithWhereWithoutAssignedWorkerInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type WorkerLocationUpdateManyWithoutWorkerNestedInput = {
    create?: XOR<WorkerLocationCreateWithoutWorkerInput, WorkerLocationUncheckedCreateWithoutWorkerInput> | WorkerLocationCreateWithoutWorkerInput[] | WorkerLocationUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkerLocationCreateOrConnectWithoutWorkerInput | WorkerLocationCreateOrConnectWithoutWorkerInput[]
    upsert?: WorkerLocationUpsertWithWhereUniqueWithoutWorkerInput | WorkerLocationUpsertWithWhereUniqueWithoutWorkerInput[]
    createMany?: WorkerLocationCreateManyWorkerInputEnvelope
    set?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    disconnect?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    delete?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    connect?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    update?: WorkerLocationUpdateWithWhereUniqueWithoutWorkerInput | WorkerLocationUpdateWithWhereUniqueWithoutWorkerInput[]
    updateMany?: WorkerLocationUpdateManyWithWhereWithoutWorkerInput | WorkerLocationUpdateManyWithWhereWithoutWorkerInput[]
    deleteMany?: WorkerLocationScalarWhereInput | WorkerLocationScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutAssignedWorkerNestedInput = {
    create?: XOR<TicketCreateWithoutAssignedWorkerInput, TicketUncheckedCreateWithoutAssignedWorkerInput> | TicketCreateWithoutAssignedWorkerInput[] | TicketUncheckedCreateWithoutAssignedWorkerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssignedWorkerInput | TicketCreateOrConnectWithoutAssignedWorkerInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutAssignedWorkerInput | TicketUpsertWithWhereUniqueWithoutAssignedWorkerInput[]
    createMany?: TicketCreateManyAssignedWorkerInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutAssignedWorkerInput | TicketUpdateWithWhereUniqueWithoutAssignedWorkerInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutAssignedWorkerInput | TicketUpdateManyWithWhereWithoutAssignedWorkerInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type WorkerLocationUncheckedUpdateManyWithoutWorkerNestedInput = {
    create?: XOR<WorkerLocationCreateWithoutWorkerInput, WorkerLocationUncheckedCreateWithoutWorkerInput> | WorkerLocationCreateWithoutWorkerInput[] | WorkerLocationUncheckedCreateWithoutWorkerInput[]
    connectOrCreate?: WorkerLocationCreateOrConnectWithoutWorkerInput | WorkerLocationCreateOrConnectWithoutWorkerInput[]
    upsert?: WorkerLocationUpsertWithWhereUniqueWithoutWorkerInput | WorkerLocationUpsertWithWhereUniqueWithoutWorkerInput[]
    createMany?: WorkerLocationCreateManyWorkerInputEnvelope
    set?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    disconnect?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    delete?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    connect?: WorkerLocationWhereUniqueInput | WorkerLocationWhereUniqueInput[]
    update?: WorkerLocationUpdateWithWhereUniqueWithoutWorkerInput | WorkerLocationUpdateWithWhereUniqueWithoutWorkerInput[]
    updateMany?: WorkerLocationUpdateManyWithWhereWithoutWorkerInput | WorkerLocationUpdateManyWithWhereWithoutWorkerInput[]
    deleteMany?: WorkerLocationScalarWhereInput | WorkerLocationScalarWhereInput[]
  }

  export type WorkerCreateNestedOneWithoutLocationLogsInput = {
    create?: XOR<WorkerCreateWithoutLocationLogsInput, WorkerUncheckedCreateWithoutLocationLogsInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutLocationLogsInput
    connect?: WorkerWhereUniqueInput
  }

  export type WorkerUpdateOneRequiredWithoutLocationLogsNestedInput = {
    create?: XOR<WorkerCreateWithoutLocationLogsInput, WorkerUncheckedCreateWithoutLocationLogsInput>
    connectOrCreate?: WorkerCreateOrConnectWithoutLocationLogsInput
    upsert?: WorkerUpsertWithoutLocationLogsInput
    connect?: WorkerWhereUniqueInput
    update?: XOR<XOR<WorkerUpdateToOneWithWhereWithoutLocationLogsInput, WorkerUpdateWithoutLocationLogsInput>, WorkerUncheckedUpdateWithoutLocationLogsInput>
  }

  export type WorkProofCreateimageUrlsInput = {
    set: string[]
  }

  export type TicketCreateNestedOneWithoutWorkProofsInput = {
    create?: XOR<TicketCreateWithoutWorkProofsInput, TicketUncheckedCreateWithoutWorkProofsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutWorkProofsInput
    connect?: TicketWhereUniqueInput
  }

  export type WorkProofUpdateimageUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type TicketUpdateOneRequiredWithoutWorkProofsNestedInput = {
    create?: XOR<TicketCreateWithoutWorkProofsInput, TicketUncheckedCreateWithoutWorkProofsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutWorkProofsInput
    upsert?: TicketUpsertWithoutWorkProofsInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutWorkProofsInput, TicketUpdateWithoutWorkProofsInput>, TicketUncheckedUpdateWithoutWorkProofsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMediaTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeFilter<$PrismaModel> | $Enums.MediaType
  }

  export type NestedEnumMediaTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MediaType | EnumMediaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MediaType[] | ListEnumMediaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMediaTypeWithAggregatesFilter<$PrismaModel> | $Enums.MediaType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMediaTypeFilter<$PrismaModel>
    _max?: NestedEnumMediaTypeFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumPriorityLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityLevelNullableFilter<$PrismaModel> | $Enums.PriorityLevel | null
  }

  export type NestedEnumPriorityLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.PriorityLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPriorityLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumPriorityLevelNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTicketStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTicketStatusNullableFilter<$PrismaModel> | $Enums.TicketStatus | null
  }

  export type NestedEnumTicketStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTicketStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ReportCreateWithoutUserInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: MediaCreateNestedManyWithoutReportInput
  }

  export type ReportUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: MediaUncheckedCreateNestedManyWithoutReportInput
  }

  export type ReportCreateOrConnectWithoutUserInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutUserInput, ReportUncheckedCreateWithoutUserInput>
  }

  export type ReportCreateManyUserInputEnvelope = {
    data: ReportCreateManyUserInput | ReportCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WorkerCreateWithoutUserInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketCreateNestedManyWithoutAssignedWorkerInput
    locationLogs?: WorkerLocationCreateNestedManyWithoutWorkerInput
  }

  export type WorkerUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedWorkerInput
    locationLogs?: WorkerLocationUncheckedCreateNestedManyWithoutWorkerInput
  }

  export type WorkerCreateOrConnectWithoutUserInput = {
    where: WorkerWhereUniqueInput
    create: XOR<WorkerCreateWithoutUserInput, WorkerUncheckedCreateWithoutUserInput>
  }

  export type ReportUpsertWithWhereUniqueWithoutUserInput = {
    where: ReportWhereUniqueInput
    update: XOR<ReportUpdateWithoutUserInput, ReportUncheckedUpdateWithoutUserInput>
    create: XOR<ReportCreateWithoutUserInput, ReportUncheckedCreateWithoutUserInput>
  }

  export type ReportUpdateWithWhereUniqueWithoutUserInput = {
    where: ReportWhereUniqueInput
    data: XOR<ReportUpdateWithoutUserInput, ReportUncheckedUpdateWithoutUserInput>
  }

  export type ReportUpdateManyWithWhereWithoutUserInput = {
    where: ReportScalarWhereInput
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyWithoutUserInput>
  }

  export type ReportScalarWhereInput = {
    AND?: ReportScalarWhereInput | ReportScalarWhereInput[]
    OR?: ReportScalarWhereInput[]
    NOT?: ReportScalarWhereInput | ReportScalarWhereInput[]
    id?: StringFilter<"Report"> | string
    title?: StringNullableFilter<"Report"> | string | null
    description?: StringNullableFilter<"Report"> | string | null
    latitude?: FloatFilter<"Report"> | number
    longitude?: FloatFilter<"Report"> | number
    status?: EnumReportStatusFilter<"Report"> | $Enums.ReportStatus
    severity?: IntNullableFilter<"Report"> | number | null
    imageUrl?: StringNullableFilter<"Report"> | string | null
    createdAt?: DateTimeFilter<"Report"> | Date | string
    updatedAt?: DateTimeFilter<"Report"> | Date | string
    userId?: StringNullableFilter<"Report"> | string | null
  }

  export type WorkerUpsertWithoutUserInput = {
    update: XOR<WorkerUpdateWithoutUserInput, WorkerUncheckedUpdateWithoutUserInput>
    create: XOR<WorkerCreateWithoutUserInput, WorkerUncheckedCreateWithoutUserInput>
    where?: WorkerWhereInput
  }

  export type WorkerUpdateToOneWithWhereWithoutUserInput = {
    where?: WorkerWhereInput
    data: XOR<WorkerUpdateWithoutUserInput, WorkerUncheckedUpdateWithoutUserInput>
  }

  export type WorkerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUpdateManyWithoutAssignedWorkerNestedInput
    locationLogs?: WorkerLocationUpdateManyWithoutWorkerNestedInput
  }

  export type WorkerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedWorkerNestedInput
    locationLogs?: WorkerLocationUncheckedUpdateManyWithoutWorkerNestedInput
  }

  export type UserCreateWithoutReportsInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
    worker?: WorkerCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReportsInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
    worker?: WorkerUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReportsInput, UserUncheckedCreateWithoutReportsInput>
  }

  export type MediaCreateWithoutReportInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    detections?: DetectionCreateNestedManyWithoutMediaInput
  }

  export type MediaUncheckedCreateWithoutReportInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    detections?: DetectionUncheckedCreateNestedManyWithoutMediaInput
  }

  export type MediaCreateOrConnectWithoutReportInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutReportInput, MediaUncheckedCreateWithoutReportInput>
  }

  export type MediaCreateManyReportInputEnvelope = {
    data: MediaCreateManyReportInput | MediaCreateManyReportInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutReportsInput = {
    update: XOR<UserUpdateWithoutReportsInput, UserUncheckedUpdateWithoutReportsInput>
    create: XOR<UserCreateWithoutReportsInput, UserUncheckedCreateWithoutReportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReportsInput, UserUncheckedUpdateWithoutReportsInput>
  }

  export type UserUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: WorkerUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    worker?: WorkerUncheckedUpdateOneWithoutUserNestedInput
  }

  export type MediaUpsertWithWhereUniqueWithoutReportInput = {
    where: MediaWhereUniqueInput
    update: XOR<MediaUpdateWithoutReportInput, MediaUncheckedUpdateWithoutReportInput>
    create: XOR<MediaCreateWithoutReportInput, MediaUncheckedCreateWithoutReportInput>
  }

  export type MediaUpdateWithWhereUniqueWithoutReportInput = {
    where: MediaWhereUniqueInput
    data: XOR<MediaUpdateWithoutReportInput, MediaUncheckedUpdateWithoutReportInput>
  }

  export type MediaUpdateManyWithWhereWithoutReportInput = {
    where: MediaScalarWhereInput
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyWithoutReportInput>
  }

  export type MediaScalarWhereInput = {
    AND?: MediaScalarWhereInput | MediaScalarWhereInput[]
    OR?: MediaScalarWhereInput[]
    NOT?: MediaScalarWhereInput | MediaScalarWhereInput[]
    id?: StringFilter<"Media"> | string
    mediaUrl?: StringFilter<"Media"> | string
    mediaType?: EnumMediaTypeFilter<"Media"> | $Enums.MediaType
    uploadedAt?: DateTimeFilter<"Media"> | Date | string
    reportId?: StringFilter<"Media"> | string
  }

  export type ReportCreateWithoutMediaInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutReportsInput
  }

  export type ReportUncheckedCreateWithoutMediaInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ReportCreateOrConnectWithoutMediaInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutMediaInput, ReportUncheckedCreateWithoutMediaInput>
  }

  export type DetectionCreateWithoutMediaInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    pothole?: PotholeCreateNestedOneWithoutDetectionInput
  }

  export type DetectionUncheckedCreateWithoutMediaInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    pothole?: PotholeUncheckedCreateNestedOneWithoutDetectionInput
  }

  export type DetectionCreateOrConnectWithoutMediaInput = {
    where: DetectionWhereUniqueInput
    create: XOR<DetectionCreateWithoutMediaInput, DetectionUncheckedCreateWithoutMediaInput>
  }

  export type DetectionCreateManyMediaInputEnvelope = {
    data: DetectionCreateManyMediaInput | DetectionCreateManyMediaInput[]
    skipDuplicates?: boolean
  }

  export type ReportUpsertWithoutMediaInput = {
    update: XOR<ReportUpdateWithoutMediaInput, ReportUncheckedUpdateWithoutMediaInput>
    create: XOR<ReportCreateWithoutMediaInput, ReportUncheckedCreateWithoutMediaInput>
    where?: ReportWhereInput
  }

  export type ReportUpdateToOneWithWhereWithoutMediaInput = {
    where?: ReportWhereInput
    data: XOR<ReportUpdateWithoutMediaInput, ReportUncheckedUpdateWithoutMediaInput>
  }

  export type ReportUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutReportsNestedInput
  }

  export type ReportUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DetectionUpsertWithWhereUniqueWithoutMediaInput = {
    where: DetectionWhereUniqueInput
    update: XOR<DetectionUpdateWithoutMediaInput, DetectionUncheckedUpdateWithoutMediaInput>
    create: XOR<DetectionCreateWithoutMediaInput, DetectionUncheckedCreateWithoutMediaInput>
  }

  export type DetectionUpdateWithWhereUniqueWithoutMediaInput = {
    where: DetectionWhereUniqueInput
    data: XOR<DetectionUpdateWithoutMediaInput, DetectionUncheckedUpdateWithoutMediaInput>
  }

  export type DetectionUpdateManyWithWhereWithoutMediaInput = {
    where: DetectionScalarWhereInput
    data: XOR<DetectionUpdateManyMutationInput, DetectionUncheckedUpdateManyWithoutMediaInput>
  }

  export type DetectionScalarWhereInput = {
    AND?: DetectionScalarWhereInput | DetectionScalarWhereInput[]
    OR?: DetectionScalarWhereInput[]
    NOT?: DetectionScalarWhereInput | DetectionScalarWhereInput[]
    id?: StringFilter<"Detection"> | string
    detectedClass?: StringFilter<"Detection"> | string
    confidence?: FloatFilter<"Detection"> | number
    bboxX?: FloatFilter<"Detection"> | number
    bboxY?: FloatFilter<"Detection"> | number
    bboxWidth?: FloatFilter<"Detection"> | number
    bboxHeight?: FloatFilter<"Detection"> | number
    frameTime?: FloatNullableFilter<"Detection"> | number | null
    createdAt?: DateTimeFilter<"Detection"> | Date | string
    mediaId?: StringFilter<"Detection"> | string
  }

  export type MediaCreateWithoutDetectionsInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    report: ReportCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateWithoutDetectionsInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
    reportId: string
  }

  export type MediaCreateOrConnectWithoutDetectionsInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutDetectionsInput, MediaUncheckedCreateWithoutDetectionsInput>
  }

  export type PotholeCreateWithoutDetectionInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roadInfo?: RoadInfoCreateNestedOneWithoutPotholeInput
    ticket?: TicketCreateNestedOneWithoutPotholeInput
  }

  export type PotholeUncheckedCreateWithoutDetectionInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roadInfo?: RoadInfoUncheckedCreateNestedOneWithoutPotholeInput
    ticket?: TicketUncheckedCreateNestedOneWithoutPotholeInput
  }

  export type PotholeCreateOrConnectWithoutDetectionInput = {
    where: PotholeWhereUniqueInput
    create: XOR<PotholeCreateWithoutDetectionInput, PotholeUncheckedCreateWithoutDetectionInput>
  }

  export type MediaUpsertWithoutDetectionsInput = {
    update: XOR<MediaUpdateWithoutDetectionsInput, MediaUncheckedUpdateWithoutDetectionsInput>
    create: XOR<MediaCreateWithoutDetectionsInput, MediaUncheckedCreateWithoutDetectionsInput>
    where?: MediaWhereInput
  }

  export type MediaUpdateToOneWithWhereWithoutDetectionsInput = {
    where?: MediaWhereInput
    data: XOR<MediaUpdateWithoutDetectionsInput, MediaUncheckedUpdateWithoutDetectionsInput>
  }

  export type MediaUpdateWithoutDetectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    report?: ReportUpdateOneRequiredWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateWithoutDetectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportId?: StringFieldUpdateOperationsInput | string
  }

  export type PotholeUpsertWithoutDetectionInput = {
    update: XOR<PotholeUpdateWithoutDetectionInput, PotholeUncheckedUpdateWithoutDetectionInput>
    create: XOR<PotholeCreateWithoutDetectionInput, PotholeUncheckedCreateWithoutDetectionInput>
    where?: PotholeWhereInput
  }

  export type PotholeUpdateToOneWithWhereWithoutDetectionInput = {
    where?: PotholeWhereInput
    data: XOR<PotholeUpdateWithoutDetectionInput, PotholeUncheckedUpdateWithoutDetectionInput>
  }

  export type PotholeUpdateWithoutDetectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadInfo?: RoadInfoUpdateOneWithoutPotholeNestedInput
    ticket?: TicketUpdateOneWithoutPotholeNestedInput
  }

  export type PotholeUncheckedUpdateWithoutDetectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadInfo?: RoadInfoUncheckedUpdateOneWithoutPotholeNestedInput
    ticket?: TicketUncheckedUpdateOneWithoutPotholeNestedInput
  }

  export type DetectionCreateWithoutPotholeInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    media: MediaCreateNestedOneWithoutDetectionsInput
  }

  export type DetectionUncheckedCreateWithoutPotholeInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
    mediaId: string
  }

  export type DetectionCreateOrConnectWithoutPotholeInput = {
    where: DetectionWhereUniqueInput
    create: XOR<DetectionCreateWithoutPotholeInput, DetectionUncheckedCreateWithoutPotholeInput>
  }

  export type RoadInfoCreateWithoutPotholeInput = {
    id?: string
    roadName?: string | null
    roadType?: string | null
    speedLimit?: number | null
    trafficImportance?: number
    priorityFactor?: number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadInfoUncheckedCreateWithoutPotholeInput = {
    id?: string
    roadName?: string | null
    roadType?: string | null
    speedLimit?: number | null
    trafficImportance?: number
    priorityFactor?: number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadInfoCreateOrConnectWithoutPotholeInput = {
    where: RoadInfoWhereUniqueInput
    create: XOR<RoadInfoCreateWithoutPotholeInput, RoadInfoUncheckedCreateWithoutPotholeInput>
  }

  export type TicketCreateWithoutPotholeInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedWorker?: WorkerCreateNestedOneWithoutAssignedTicketsInput
    workProofs?: WorkProofCreateNestedManyWithoutTicketInput
    statusHistory?: TicketStatusHistoryCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutPotholeInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    assignedWorkerId?: string | null
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workProofs?: WorkProofUncheckedCreateNestedManyWithoutTicketInput
    statusHistory?: TicketStatusHistoryUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutPotholeInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutPotholeInput, TicketUncheckedCreateWithoutPotholeInput>
  }

  export type DetectionUpsertWithoutPotholeInput = {
    update: XOR<DetectionUpdateWithoutPotholeInput, DetectionUncheckedUpdateWithoutPotholeInput>
    create: XOR<DetectionCreateWithoutPotholeInput, DetectionUncheckedCreateWithoutPotholeInput>
    where?: DetectionWhereInput
  }

  export type DetectionUpdateToOneWithWhereWithoutPotholeInput = {
    where?: DetectionWhereInput
    data: XOR<DetectionUpdateWithoutPotholeInput, DetectionUncheckedUpdateWithoutPotholeInput>
  }

  export type DetectionUpdateWithoutPotholeInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUpdateOneRequiredWithoutDetectionsNestedInput
  }

  export type DetectionUncheckedUpdateWithoutPotholeInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mediaId?: StringFieldUpdateOperationsInput | string
  }

  export type RoadInfoUpsertWithoutPotholeInput = {
    update: XOR<RoadInfoUpdateWithoutPotholeInput, RoadInfoUncheckedUpdateWithoutPotholeInput>
    create: XOR<RoadInfoCreateWithoutPotholeInput, RoadInfoUncheckedCreateWithoutPotholeInput>
    where?: RoadInfoWhereInput
  }

  export type RoadInfoUpdateToOneWithWhereWithoutPotholeInput = {
    where?: RoadInfoWhereInput
    data: XOR<RoadInfoUpdateWithoutPotholeInput, RoadInfoUncheckedUpdateWithoutPotholeInput>
  }

  export type RoadInfoUpdateWithoutPotholeInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadName?: NullableStringFieldUpdateOperationsInput | string | null
    roadType?: NullableStringFieldUpdateOperationsInput | string | null
    speedLimit?: NullableIntFieldUpdateOperationsInput | number | null
    trafficImportance?: FloatFieldUpdateOperationsInput | number
    priorityFactor?: FloatFieldUpdateOperationsInput | number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadInfoUncheckedUpdateWithoutPotholeInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadName?: NullableStringFieldUpdateOperationsInput | string | null
    roadType?: NullableStringFieldUpdateOperationsInput | string | null
    speedLimit?: NullableIntFieldUpdateOperationsInput | number | null
    trafficImportance?: FloatFieldUpdateOperationsInput | number
    priorityFactor?: FloatFieldUpdateOperationsInput | number
    osmData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUpsertWithoutPotholeInput = {
    update: XOR<TicketUpdateWithoutPotholeInput, TicketUncheckedUpdateWithoutPotholeInput>
    create: XOR<TicketCreateWithoutPotholeInput, TicketUncheckedCreateWithoutPotholeInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutPotholeInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutPotholeInput, TicketUncheckedUpdateWithoutPotholeInput>
  }

  export type TicketUpdateWithoutPotholeInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedWorker?: WorkerUpdateOneWithoutAssignedTicketsNestedInput
    workProofs?: WorkProofUpdateManyWithoutTicketNestedInput
    statusHistory?: TicketStatusHistoryUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutPotholeInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedWorkerId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workProofs?: WorkProofUncheckedUpdateManyWithoutTicketNestedInput
    statusHistory?: TicketStatusHistoryUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type PotholeCreateWithoutRoadInfoInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    detection: DetectionCreateNestedOneWithoutPotholeInput
    ticket?: TicketCreateNestedOneWithoutPotholeInput
  }

  export type PotholeUncheckedCreateWithoutRoadInfoInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    detectionId: string
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket?: TicketUncheckedCreateNestedOneWithoutPotholeInput
  }

  export type PotholeCreateOrConnectWithoutRoadInfoInput = {
    where: PotholeWhereUniqueInput
    create: XOR<PotholeCreateWithoutRoadInfoInput, PotholeUncheckedCreateWithoutRoadInfoInput>
  }

  export type PotholeUpsertWithoutRoadInfoInput = {
    update: XOR<PotholeUpdateWithoutRoadInfoInput, PotholeUncheckedUpdateWithoutRoadInfoInput>
    create: XOR<PotholeCreateWithoutRoadInfoInput, PotholeUncheckedCreateWithoutRoadInfoInput>
    where?: PotholeWhereInput
  }

  export type PotholeUpdateToOneWithWhereWithoutRoadInfoInput = {
    where?: PotholeWhereInput
    data: XOR<PotholeUpdateWithoutRoadInfoInput, PotholeUncheckedUpdateWithoutRoadInfoInput>
  }

  export type PotholeUpdateWithoutRoadInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detection?: DetectionUpdateOneRequiredWithoutPotholeNestedInput
    ticket?: TicketUpdateOneWithoutPotholeNestedInput
  }

  export type PotholeUncheckedUpdateWithoutRoadInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    detectionId?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUncheckedUpdateOneWithoutPotholeNestedInput
  }

  export type PotholeCreateWithoutTicketInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    detection: DetectionCreateNestedOneWithoutPotholeInput
    roadInfo?: RoadInfoCreateNestedOneWithoutPotholeInput
  }

  export type PotholeUncheckedCreateWithoutTicketInput = {
    id?: string
    latitude: number
    longitude: number
    imageUrl?: string | null
    detectionId: string
    priorityScore?: number | null
    priorityLevel?: $Enums.PriorityLevel | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roadInfo?: RoadInfoUncheckedCreateNestedOneWithoutPotholeInput
  }

  export type PotholeCreateOrConnectWithoutTicketInput = {
    where: PotholeWhereUniqueInput
    create: XOR<PotholeCreateWithoutTicketInput, PotholeUncheckedCreateWithoutTicketInput>
  }

  export type WorkerCreateWithoutAssignedTicketsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutWorkerInput
    locationLogs?: WorkerLocationCreateNestedManyWithoutWorkerInput
  }

  export type WorkerUncheckedCreateWithoutAssignedTicketsInput = {
    id?: string
    userId?: string | null
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: WorkerLocationUncheckedCreateNestedManyWithoutWorkerInput
  }

  export type WorkerCreateOrConnectWithoutAssignedTicketsInput = {
    where: WorkerWhereUniqueInput
    create: XOR<WorkerCreateWithoutAssignedTicketsInput, WorkerUncheckedCreateWithoutAssignedTicketsInput>
  }

  export type WorkProofCreateWithoutTicketInput = {
    id?: string
    imageUrls?: WorkProofCreateimageUrlsInput | string[]
    notes?: string | null
    latitude?: number | null
    longitude?: number | null
    submittedAt?: Date | string
    isApproved?: boolean | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
  }

  export type WorkProofUncheckedCreateWithoutTicketInput = {
    id?: string
    imageUrls?: WorkProofCreateimageUrlsInput | string[]
    notes?: string | null
    latitude?: number | null
    longitude?: number | null
    submittedAt?: Date | string
    isApproved?: boolean | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
  }

  export type WorkProofCreateOrConnectWithoutTicketInput = {
    where: WorkProofWhereUniqueInput
    create: XOR<WorkProofCreateWithoutTicketInput, WorkProofUncheckedCreateWithoutTicketInput>
  }

  export type WorkProofCreateManyTicketInputEnvelope = {
    data: WorkProofCreateManyTicketInput | WorkProofCreateManyTicketInput[]
    skipDuplicates?: boolean
  }

  export type TicketStatusHistoryCreateWithoutTicketInput = {
    id?: string
    fromStatus?: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type TicketStatusHistoryUncheckedCreateWithoutTicketInput = {
    id?: string
    fromStatus?: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type TicketStatusHistoryCreateOrConnectWithoutTicketInput = {
    where: TicketStatusHistoryWhereUniqueInput
    create: XOR<TicketStatusHistoryCreateWithoutTicketInput, TicketStatusHistoryUncheckedCreateWithoutTicketInput>
  }

  export type TicketStatusHistoryCreateManyTicketInputEnvelope = {
    data: TicketStatusHistoryCreateManyTicketInput | TicketStatusHistoryCreateManyTicketInput[]
    skipDuplicates?: boolean
  }

  export type PotholeUpsertWithoutTicketInput = {
    update: XOR<PotholeUpdateWithoutTicketInput, PotholeUncheckedUpdateWithoutTicketInput>
    create: XOR<PotholeCreateWithoutTicketInput, PotholeUncheckedCreateWithoutTicketInput>
    where?: PotholeWhereInput
  }

  export type PotholeUpdateToOneWithWhereWithoutTicketInput = {
    where?: PotholeWhereInput
    data: XOR<PotholeUpdateWithoutTicketInput, PotholeUncheckedUpdateWithoutTicketInput>
  }

  export type PotholeUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detection?: DetectionUpdateOneRequiredWithoutPotholeNestedInput
    roadInfo?: RoadInfoUpdateOneWithoutPotholeNestedInput
  }

  export type PotholeUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    detectionId?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    priorityLevel?: NullableEnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadInfo?: RoadInfoUncheckedUpdateOneWithoutPotholeNestedInput
  }

  export type WorkerUpsertWithoutAssignedTicketsInput = {
    update: XOR<WorkerUpdateWithoutAssignedTicketsInput, WorkerUncheckedUpdateWithoutAssignedTicketsInput>
    create: XOR<WorkerCreateWithoutAssignedTicketsInput, WorkerUncheckedCreateWithoutAssignedTicketsInput>
    where?: WorkerWhereInput
  }

  export type WorkerUpdateToOneWithWhereWithoutAssignedTicketsInput = {
    where?: WorkerWhereInput
    data: XOR<WorkerUpdateWithoutAssignedTicketsInput, WorkerUncheckedUpdateWithoutAssignedTicketsInput>
  }

  export type WorkerUpdateWithoutAssignedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutWorkerNestedInput
    locationLogs?: WorkerLocationUpdateManyWithoutWorkerNestedInput
  }

  export type WorkerUncheckedUpdateWithoutAssignedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: WorkerLocationUncheckedUpdateManyWithoutWorkerNestedInput
  }

  export type WorkProofUpsertWithWhereUniqueWithoutTicketInput = {
    where: WorkProofWhereUniqueInput
    update: XOR<WorkProofUpdateWithoutTicketInput, WorkProofUncheckedUpdateWithoutTicketInput>
    create: XOR<WorkProofCreateWithoutTicketInput, WorkProofUncheckedCreateWithoutTicketInput>
  }

  export type WorkProofUpdateWithWhereUniqueWithoutTicketInput = {
    where: WorkProofWhereUniqueInput
    data: XOR<WorkProofUpdateWithoutTicketInput, WorkProofUncheckedUpdateWithoutTicketInput>
  }

  export type WorkProofUpdateManyWithWhereWithoutTicketInput = {
    where: WorkProofScalarWhereInput
    data: XOR<WorkProofUpdateManyMutationInput, WorkProofUncheckedUpdateManyWithoutTicketInput>
  }

  export type WorkProofScalarWhereInput = {
    AND?: WorkProofScalarWhereInput | WorkProofScalarWhereInput[]
    OR?: WorkProofScalarWhereInput[]
    NOT?: WorkProofScalarWhereInput | WorkProofScalarWhereInput[]
    id?: StringFilter<"WorkProof"> | string
    ticketId?: StringFilter<"WorkProof"> | string
    imageUrls?: StringNullableListFilter<"WorkProof">
    notes?: StringNullableFilter<"WorkProof"> | string | null
    latitude?: FloatNullableFilter<"WorkProof"> | number | null
    longitude?: FloatNullableFilter<"WorkProof"> | number | null
    submittedAt?: DateTimeFilter<"WorkProof"> | Date | string
    isApproved?: BoolNullableFilter<"WorkProof"> | boolean | null
    reviewedBy?: StringNullableFilter<"WorkProof"> | string | null
    reviewedAt?: DateTimeNullableFilter<"WorkProof"> | Date | string | null
    reviewNotes?: StringNullableFilter<"WorkProof"> | string | null
  }

  export type TicketStatusHistoryUpsertWithWhereUniqueWithoutTicketInput = {
    where: TicketStatusHistoryWhereUniqueInput
    update: XOR<TicketStatusHistoryUpdateWithoutTicketInput, TicketStatusHistoryUncheckedUpdateWithoutTicketInput>
    create: XOR<TicketStatusHistoryCreateWithoutTicketInput, TicketStatusHistoryUncheckedCreateWithoutTicketInput>
  }

  export type TicketStatusHistoryUpdateWithWhereUniqueWithoutTicketInput = {
    where: TicketStatusHistoryWhereUniqueInput
    data: XOR<TicketStatusHistoryUpdateWithoutTicketInput, TicketStatusHistoryUncheckedUpdateWithoutTicketInput>
  }

  export type TicketStatusHistoryUpdateManyWithWhereWithoutTicketInput = {
    where: TicketStatusHistoryScalarWhereInput
    data: XOR<TicketStatusHistoryUpdateManyMutationInput, TicketStatusHistoryUncheckedUpdateManyWithoutTicketInput>
  }

  export type TicketStatusHistoryScalarWhereInput = {
    AND?: TicketStatusHistoryScalarWhereInput | TicketStatusHistoryScalarWhereInput[]
    OR?: TicketStatusHistoryScalarWhereInput[]
    NOT?: TicketStatusHistoryScalarWhereInput | TicketStatusHistoryScalarWhereInput[]
    id?: StringFilter<"TicketStatusHistory"> | string
    ticketId?: StringFilter<"TicketStatusHistory"> | string
    fromStatus?: EnumTicketStatusNullableFilter<"TicketStatusHistory"> | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFilter<"TicketStatusHistory"> | $Enums.TicketStatus
    changedBy?: StringNullableFilter<"TicketStatusHistory"> | string | null
    reason?: StringNullableFilter<"TicketStatusHistory"> | string | null
    createdAt?: DateTimeFilter<"TicketStatusHistory"> | Date | string
  }

  export type TicketCreateWithoutStatusHistoryInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pothole: PotholeCreateNestedOneWithoutTicketInput
    assignedWorker?: WorkerCreateNestedOneWithoutAssignedTicketsInput
    workProofs?: WorkProofCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutStatusHistoryInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    potholeId: string
    assignedWorkerId?: string | null
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workProofs?: WorkProofUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutStatusHistoryInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutStatusHistoryInput, TicketUncheckedCreateWithoutStatusHistoryInput>
  }

  export type TicketUpsertWithoutStatusHistoryInput = {
    update: XOR<TicketUpdateWithoutStatusHistoryInput, TicketUncheckedUpdateWithoutStatusHistoryInput>
    create: XOR<TicketCreateWithoutStatusHistoryInput, TicketUncheckedCreateWithoutStatusHistoryInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutStatusHistoryInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutStatusHistoryInput, TicketUncheckedUpdateWithoutStatusHistoryInput>
  }

  export type TicketUpdateWithoutStatusHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUpdateOneRequiredWithoutTicketNestedInput
    assignedWorker?: WorkerUpdateOneWithoutAssignedTicketsNestedInput
    workProofs?: WorkProofUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutStatusHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    potholeId?: StringFieldUpdateOperationsInput | string
    assignedWorkerId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workProofs?: WorkProofUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type UserCreateWithoutWorkerInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
    reports?: ReportCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWorkerInput = {
    id?: string
    clerk_user_id?: string | null
    name?: string | null
    email: string
    role?: $Enums.Role
    createdAt?: Date | string
    reports?: ReportUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWorkerInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkerInput, UserUncheckedCreateWithoutWorkerInput>
  }

  export type TicketCreateWithoutAssignedWorkerInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pothole: PotholeCreateNestedOneWithoutTicketInput
    workProofs?: WorkProofCreateNestedManyWithoutTicketInput
    statusHistory?: TicketStatusHistoryCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutAssignedWorkerInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    potholeId: string
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workProofs?: WorkProofUncheckedCreateNestedManyWithoutTicketInput
    statusHistory?: TicketStatusHistoryUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutAssignedWorkerInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutAssignedWorkerInput, TicketUncheckedCreateWithoutAssignedWorkerInput>
  }

  export type TicketCreateManyAssignedWorkerInputEnvelope = {
    data: TicketCreateManyAssignedWorkerInput | TicketCreateManyAssignedWorkerInput[]
    skipDuplicates?: boolean
  }

  export type WorkerLocationCreateWithoutWorkerInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    recordedAt?: Date | string
  }

  export type WorkerLocationUncheckedCreateWithoutWorkerInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    recordedAt?: Date | string
  }

  export type WorkerLocationCreateOrConnectWithoutWorkerInput = {
    where: WorkerLocationWhereUniqueInput
    create: XOR<WorkerLocationCreateWithoutWorkerInput, WorkerLocationUncheckedCreateWithoutWorkerInput>
  }

  export type WorkerLocationCreateManyWorkerInputEnvelope = {
    data: WorkerLocationCreateManyWorkerInput | WorkerLocationCreateManyWorkerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutWorkerInput = {
    update: XOR<UserUpdateWithoutWorkerInput, UserUncheckedUpdateWithoutWorkerInput>
    create: XOR<UserCreateWithoutWorkerInput, UserUncheckedCreateWithoutWorkerInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkerInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkerInput, UserUncheckedUpdateWithoutWorkerInput>
  }

  export type UserUpdateWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: ReportUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerk_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: ReportUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TicketUpsertWithWhereUniqueWithoutAssignedWorkerInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutAssignedWorkerInput, TicketUncheckedUpdateWithoutAssignedWorkerInput>
    create: XOR<TicketCreateWithoutAssignedWorkerInput, TicketUncheckedCreateWithoutAssignedWorkerInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutAssignedWorkerInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutAssignedWorkerInput, TicketUncheckedUpdateWithoutAssignedWorkerInput>
  }

  export type TicketUpdateManyWithWhereWithoutAssignedWorkerInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutAssignedWorkerInput>
  }

  export type TicketScalarWhereInput = {
    AND?: TicketScalarWhereInput | TicketScalarWhereInput[]
    OR?: TicketScalarWhereInput[]
    NOT?: TicketScalarWhereInput | TicketScalarWhereInput[]
    id?: StringFilter<"Ticket"> | string
    ticketNumber?: StringFilter<"Ticket"> | string
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    potholeId?: StringFilter<"Ticket"> | string
    assignedWorkerId?: StringNullableFilter<"Ticket"> | string | null
    assignedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    startedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    resolvedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    routeData?: JsonNullableFilter<"Ticket">
    estimatedETA?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    notes?: StringNullableFilter<"Ticket"> | string | null
    adminNotes?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
  }

  export type WorkerLocationUpsertWithWhereUniqueWithoutWorkerInput = {
    where: WorkerLocationWhereUniqueInput
    update: XOR<WorkerLocationUpdateWithoutWorkerInput, WorkerLocationUncheckedUpdateWithoutWorkerInput>
    create: XOR<WorkerLocationCreateWithoutWorkerInput, WorkerLocationUncheckedCreateWithoutWorkerInput>
  }

  export type WorkerLocationUpdateWithWhereUniqueWithoutWorkerInput = {
    where: WorkerLocationWhereUniqueInput
    data: XOR<WorkerLocationUpdateWithoutWorkerInput, WorkerLocationUncheckedUpdateWithoutWorkerInput>
  }

  export type WorkerLocationUpdateManyWithWhereWithoutWorkerInput = {
    where: WorkerLocationScalarWhereInput
    data: XOR<WorkerLocationUpdateManyMutationInput, WorkerLocationUncheckedUpdateManyWithoutWorkerInput>
  }

  export type WorkerLocationScalarWhereInput = {
    AND?: WorkerLocationScalarWhereInput | WorkerLocationScalarWhereInput[]
    OR?: WorkerLocationScalarWhereInput[]
    NOT?: WorkerLocationScalarWhereInput | WorkerLocationScalarWhereInput[]
    id?: StringFilter<"WorkerLocation"> | string
    workerId?: StringFilter<"WorkerLocation"> | string
    latitude?: FloatFilter<"WorkerLocation"> | number
    longitude?: FloatFilter<"WorkerLocation"> | number
    accuracy?: FloatNullableFilter<"WorkerLocation"> | number | null
    recordedAt?: DateTimeFilter<"WorkerLocation"> | Date | string
  }

  export type WorkerCreateWithoutLocationLogsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutWorkerInput
    assignedTickets?: TicketCreateNestedManyWithoutAssignedWorkerInput
  }

  export type WorkerUncheckedCreateWithoutLocationLogsInput = {
    id?: string
    userId?: string | null
    name: string
    email: string
    phone?: string | null
    employeeId: string
    isActive?: boolean
    currentLatitude?: number | null
    currentLongitude?: number | null
    lastLocationUpdate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssignedWorkerInput
  }

  export type WorkerCreateOrConnectWithoutLocationLogsInput = {
    where: WorkerWhereUniqueInput
    create: XOR<WorkerCreateWithoutLocationLogsInput, WorkerUncheckedCreateWithoutLocationLogsInput>
  }

  export type WorkerUpsertWithoutLocationLogsInput = {
    update: XOR<WorkerUpdateWithoutLocationLogsInput, WorkerUncheckedUpdateWithoutLocationLogsInput>
    create: XOR<WorkerCreateWithoutLocationLogsInput, WorkerUncheckedCreateWithoutLocationLogsInput>
    where?: WorkerWhereInput
  }

  export type WorkerUpdateToOneWithWhereWithoutLocationLogsInput = {
    where?: WorkerWhereInput
    data: XOR<WorkerUpdateWithoutLocationLogsInput, WorkerUncheckedUpdateWithoutLocationLogsInput>
  }

  export type WorkerUpdateWithoutLocationLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutWorkerNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssignedWorkerNestedInput
  }

  export type WorkerUncheckedUpdateWithoutLocationLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    employeeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    currentLatitude?: NullableFloatFieldUpdateOperationsInput | number | null
    currentLongitude?: NullableFloatFieldUpdateOperationsInput | number | null
    lastLocationUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssignedWorkerNestedInput
  }

  export type TicketCreateWithoutWorkProofsInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pothole: PotholeCreateNestedOneWithoutTicketInput
    assignedWorker?: WorkerCreateNestedOneWithoutAssignedTicketsInput
    statusHistory?: TicketStatusHistoryCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutWorkProofsInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    potholeId: string
    assignedWorkerId?: string | null
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistory?: TicketStatusHistoryUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutWorkProofsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutWorkProofsInput, TicketUncheckedCreateWithoutWorkProofsInput>
  }

  export type TicketUpsertWithoutWorkProofsInput = {
    update: XOR<TicketUpdateWithoutWorkProofsInput, TicketUncheckedUpdateWithoutWorkProofsInput>
    create: XOR<TicketCreateWithoutWorkProofsInput, TicketUncheckedCreateWithoutWorkProofsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutWorkProofsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutWorkProofsInput, TicketUncheckedUpdateWithoutWorkProofsInput>
  }

  export type TicketUpdateWithoutWorkProofsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUpdateOneRequiredWithoutTicketNestedInput
    assignedWorker?: WorkerUpdateOneWithoutAssignedTicketsNestedInput
    statusHistory?: TicketStatusHistoryUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutWorkProofsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    potholeId?: StringFieldUpdateOperationsInput | string
    assignedWorkerId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistory?: TicketStatusHistoryUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type ReportCreateManyUserInput = {
    id?: string
    title?: string | null
    description?: string | null
    latitude: number
    longitude: number
    status?: $Enums.ReportStatus
    severity?: number | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUpdateManyWithoutReportNestedInput
  }

  export type ReportUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUncheckedUpdateManyWithoutReportNestedInput
  }

  export type ReportUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    severity?: NullableIntFieldUpdateOperationsInput | number | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaCreateManyReportInput = {
    id?: string
    mediaUrl: string
    mediaType: $Enums.MediaType
    uploadedAt?: Date | string
  }

  export type MediaUpdateWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detections?: DetectionUpdateManyWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detections?: DetectionUncheckedUpdateManyWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateManyWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    mediaType?: EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetectionCreateManyMediaInput = {
    id?: string
    detectedClass?: string
    confidence: number
    bboxX: number
    bboxY: number
    bboxWidth: number
    bboxHeight: number
    frameTime?: number | null
    createdAt?: Date | string
  }

  export type DetectionUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUpdateOneWithoutDetectionNestedInput
  }

  export type DetectionUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUncheckedUpdateOneWithoutDetectionNestedInput
  }

  export type DetectionUncheckedUpdateManyWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    detectedClass?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    bboxX?: FloatFieldUpdateOperationsInput | number
    bboxY?: FloatFieldUpdateOperationsInput | number
    bboxWidth?: FloatFieldUpdateOperationsInput | number
    bboxHeight?: FloatFieldUpdateOperationsInput | number
    frameTime?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkProofCreateManyTicketInput = {
    id?: string
    imageUrls?: WorkProofCreateimageUrlsInput | string[]
    notes?: string | null
    latitude?: number | null
    longitude?: number | null
    submittedAt?: Date | string
    isApproved?: boolean | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNotes?: string | null
  }

  export type TicketStatusHistoryCreateManyTicketInput = {
    id?: string
    fromStatus?: $Enums.TicketStatus | null
    toStatus: $Enums.TicketStatus
    changedBy?: string | null
    reason?: string | null
    createdAt?: Date | string
  }

  export type WorkProofUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkProofUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkProofUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageUrls?: WorkProofUpdateimageUrlsInput | string[]
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketStatusHistoryUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketStatusHistoryUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketStatusHistoryUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableEnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus | null
    toStatus?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateManyAssignedWorkerInput = {
    id?: string
    ticketNumber: string
    status?: $Enums.TicketStatus
    potholeId: string
    assignedAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    resolvedAt?: Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: Date | string | null
    notes?: string | null
    adminNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkerLocationCreateManyWorkerInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    recordedAt?: Date | string
  }

  export type TicketUpdateWithoutAssignedWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pothole?: PotholeUpdateOneRequiredWithoutTicketNestedInput
    workProofs?: WorkProofUpdateManyWithoutTicketNestedInput
    statusHistory?: TicketStatusHistoryUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutAssignedWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    potholeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workProofs?: WorkProofUncheckedUpdateManyWithoutTicketNestedInput
    statusHistory?: TicketStatusHistoryUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutAssignedWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    potholeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    routeData?: NullableJsonNullValueInput | InputJsonValue
    estimatedETA?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adminNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerLocationUpdateWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerLocationUncheckedUpdateWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkerLocationUncheckedUpdateManyWithoutWorkerInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}