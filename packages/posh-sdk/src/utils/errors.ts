/**
 * Error classes and error handling utilities
 */

export class PoshSDKError extends Error {
  code: string;
  details?: unknown;
  remediation?: string;

  constructor(message: string, code: string, details?: unknown, remediation?: string) {
    super(message);
    this.name = 'PoshSDKError';
    this.code = code;
    this.details = details;
    this.remediation = remediation;
  }
}

export class ValidationError extends PoshSDKError {
  constructor(message: string, details?: unknown, remediation?: string) {
    super(message, 'VALIDATION_ERROR', details, remediation);
    this.name = 'ValidationError';
  }
}

export class ContractError extends PoshSDKError {
  contractName: string;
  functionName: string;
  revertReason?: string;

  constructor(
    message: string,
    contractName: string,
    functionName: string,
    revertReason?: string,
    details?: unknown,
    remediation?: string
  ) {
    super(message, 'CONTRACT_ERROR', details, remediation);
    this.name = 'ContractError';
    this.contractName = contractName;
    this.functionName = functionName;
    this.revertReason = revertReason;
  }
}

export class NetworkError extends PoshSDKError {
  chainId: number;
  rpcUrl: string;

  constructor(
    message: string,
    chainId: number,
    rpcUrl: string,
    details?: unknown,
    remediation?: string
  ) {
    super(message, 'NETWORK_ERROR', details, remediation);
    this.name = 'NetworkError';
    this.chainId = chainId;
    this.rpcUrl = rpcUrl;
  }
}

export class ConfigurationError extends PoshSDKError {
  constructor(message: string, details?: unknown, remediation?: string) {
    super(message, 'CONFIGURATION_ERROR', details, remediation);
    this.name = 'ConfigurationError';
  }
}

export enum ErrorCode {
  // Validation errors
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_HUMAN_ID = 'INVALID_HUMAN_ID',
  INVALID_CONFIG = 'INVALID_CONFIG',

  // Contract errors
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  NOT_REGISTERED = 'NOT_REGISTERED',
  HUMAN_NOT_FOUND = 'HUMAN_NOT_FOUND',
  PROOF_NOT_FOUND = 'PROOF_NOT_FOUND',

  // Network errors
  RPC_ERROR = 'RPC_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',

  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

  // Provider errors
  PROVIDER_NOT_CONNECTED = 'PROVIDER_NOT_CONNECTED',
  UNSUPPORTED_PROVIDER = 'UNSUPPORTED_PROVIDER',
  WALLET_DISCONNECTED = 'WALLET_DISCONNECTED',
}
