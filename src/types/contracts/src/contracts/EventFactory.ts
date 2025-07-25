/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace EventFactory {
  export type EventMetadataStruct = {
    organizer: AddressLike;
    eventContract: AddressLike;
    category: string;
    ipfsMetadataURI: string;
    timestamp: BigNumberish;
    isActive: boolean;
  };

  export type EventMetadataStructOutput = [
    organizer: string,
    eventContract: string,
    category: string,
    ipfsMetadataURI: string,
    timestamp: bigint,
    isActive: boolean
  ] & {
    organizer: string;
    eventContract: string;
    category: string;
    ipfsMetadataURI: string;
    timestamp: bigint;
    isActive: boolean;
  };
}

export interface EventFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "categoryEvents"
      | "createEvent"
      | "events"
      | "getEventMetadata"
      | "getEventsByCategory"
      | "getEventsByOrganizer"
      | "getTotalEvents"
      | "organizerEvents"
      | "owner"
      | "renounceOwnership"
      | "toggleEventStatus"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "EventCreated"
      | "EventStatusChanged"
      | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "categoryEvents",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createEvent",
    values: [
      string,
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "events",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getEventMetadata",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getEventsByCategory",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getEventsByOrganizer",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalEvents",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "organizerEvents",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "toggleEventStatus",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "categoryEvents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createEvent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "events", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getEventMetadata",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEventsByCategory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEventsByOrganizer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalEvents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "organizerEvents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "toggleEventStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace EventCreatedEvent {
  export type InputTuple = [
    eventId: BigNumberish,
    organizer: AddressLike,
    eventContract: AddressLike,
    category: string,
    ipfsMetadataURI: string
  ];
  export type OutputTuple = [
    eventId: bigint,
    organizer: string,
    eventContract: string,
    category: string,
    ipfsMetadataURI: string
  ];
  export interface OutputObject {
    eventId: bigint;
    organizer: string;
    eventContract: string;
    category: string;
    ipfsMetadataURI: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EventStatusChangedEvent {
  export type InputTuple = [eventId: BigNumberish, isActive: boolean];
  export type OutputTuple = [eventId: bigint, isActive: boolean];
  export interface OutputObject {
    eventId: bigint;
    isActive: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface EventFactory extends BaseContract {
  connect(runner?: ContractRunner | null): EventFactory;
  waitForDeployment(): Promise<this>;

  interface: EventFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  categoryEvents: TypedContractMethod<
    [arg0: string, arg1: BigNumberish],
    [bigint],
    "view"
  >;

  createEvent: TypedContractMethod<
    [
      name: string,
      symbol: string,
      category: string,
      ipfsMetadataURI: string,
      startTime: BigNumberish,
      endTime: BigNumberish,
      maxAttendees: BigNumberish
    ],
    [[bigint, string] & { eventId: bigint; eventContract: string }],
    "nonpayable"
  >;

  events: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, string, string, bigint, boolean] & {
        organizer: string;
        eventContract: string;
        category: string;
        ipfsMetadataURI: string;
        timestamp: bigint;
        isActive: boolean;
      }
    ],
    "view"
  >;

  getEventMetadata: TypedContractMethod<
    [eventId: BigNumberish],
    [EventFactory.EventMetadataStructOutput],
    "view"
  >;

  getEventsByCategory: TypedContractMethod<
    [category: string],
    [bigint[]],
    "view"
  >;

  getEventsByOrganizer: TypedContractMethod<
    [organizer: AddressLike],
    [bigint[]],
    "view"
  >;

  getTotalEvents: TypedContractMethod<[], [bigint], "view">;

  organizerEvents: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [bigint],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  toggleEventStatus: TypedContractMethod<
    [eventId: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "categoryEvents"
  ): TypedContractMethod<[arg0: string, arg1: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "createEvent"
  ): TypedContractMethod<
    [
      name: string,
      symbol: string,
      category: string,
      ipfsMetadataURI: string,
      startTime: BigNumberish,
      endTime: BigNumberish,
      maxAttendees: BigNumberish
    ],
    [[bigint, string] & { eventId: bigint; eventContract: string }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "events"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, string, string, bigint, boolean] & {
        organizer: string;
        eventContract: string;
        category: string;
        ipfsMetadataURI: string;
        timestamp: bigint;
        isActive: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getEventMetadata"
  ): TypedContractMethod<
    [eventId: BigNumberish],
    [EventFactory.EventMetadataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getEventsByCategory"
  ): TypedContractMethod<[category: string], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getEventsByOrganizer"
  ): TypedContractMethod<[organizer: AddressLike], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getTotalEvents"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "organizerEvents"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "toggleEventStatus"
  ): TypedContractMethod<[eventId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "EventCreated"
  ): TypedContractEvent<
    EventCreatedEvent.InputTuple,
    EventCreatedEvent.OutputTuple,
    EventCreatedEvent.OutputObject
  >;
  getEvent(
    key: "EventStatusChanged"
  ): TypedContractEvent<
    EventStatusChangedEvent.InputTuple,
    EventStatusChangedEvent.OutputTuple,
    EventStatusChangedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "EventCreated(uint256,address,address,string,string)": TypedContractEvent<
      EventCreatedEvent.InputTuple,
      EventCreatedEvent.OutputTuple,
      EventCreatedEvent.OutputObject
    >;
    EventCreated: TypedContractEvent<
      EventCreatedEvent.InputTuple,
      EventCreatedEvent.OutputTuple,
      EventCreatedEvent.OutputObject
    >;

    "EventStatusChanged(uint256,bool)": TypedContractEvent<
      EventStatusChangedEvent.InputTuple,
      EventStatusChangedEvent.OutputTuple,
      EventStatusChangedEvent.OutputObject
    >;
    EventStatusChanged: TypedContractEvent<
      EventStatusChangedEvent.InputTuple,
      EventStatusChangedEvent.OutputTuple,
      EventStatusChangedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
