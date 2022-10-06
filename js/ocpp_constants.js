"use strict";

//
// CONST definitions
//

// Supported Messages (used to store and later validate request and response pairs)
export const REQUEST_FIRMWARE_STATUS_NOTIFICATION = "FirmwareStatusNotification";
export const REQUEST_DIAGNOSTICS_STATUS_NOTIFICATION = "DiagnosticsStatusNotification";
export const REQUEST_UNLOCK_CONNECTOR = "UnlockConnector";
export const REQUEST_START_TRANSACTION = "StartTransaction";
export const REQUEST_STOP_TRANSACTION = "StopTransaction";
export const REQUEST_METER_VALUES = "MeterValues";
export const REQUEST_BOOT_NOTIFICATION = "BootNotification";
export const REQUEST_AUTHORIZE = "Authorize";
export const REQUEST_RESET = "Reset";
export const REQUEST_REMOTE_START_TRANSACTION = "RemoteStartTransaction";
export const REQUEST_REMOTE_STOP_TRANSACTION = "RemoteStopTransaction";
export const REQUEST_TRIGGER_MESSAGE = "TriggerMessage";
export const REQUEST_CHANGE_AVAILABILITY = "ChangeAvailability";
export const REQUEST_RESERVE_NOW = "ReserveNow";
export const REQUEST_CANCEL_RESERVATION = "CancelReservation";
export const REQUEST_UPDATE_FIRMWARE = "UpdateFirmware";
export const REQUEST_GET_DIAGNOSTICS = "GetDiagnostics";
export const REQUEST_HEARTBEAT = "Heartbeat";
export const REQUEST_STATUS_NOTIFICATION = "StatusNotification";
export const REQUEST_NOT_IMPLEMENTED = "NotImplemented";
export const REQUEST_DATA_TRANSFER = "DataTransfer";

// Keys (stored in local or session storage)
export const KEY_CP_STATUS    = 'cp_status';
export const KEY_METER_VALUE  = 'meter_value';
export const KEY_CONN_STATUS  = 'conn_status';
export const KEY_CONN0_STATUS  = 'conn_status0';
export const KEY_CONN1_STATUS  = 'conn_status1';
export const KEY_CONN2_STATUS  = 'conn_status2';
export const KEY_CONN2_LOCK = 'conn_lock2';
export const KEY_CONN_AVAILABILITY   = 'conn_availability';
export const KEY_CONN0_AVAILABILITY  = 'conn_availability0';
export const KEY_CONN1_AVAILABILITY  = 'conn_availability1';
export const KEY_CONN2_AVAILABILITY  = 'conn_availability2';
export const KEY_FW_UPDATE_RESPONSE = 'fw_update_response';
export const KEY_FW_UPDATE_STATUS = REQUEST_FIRMWARE_STATUS_NOTIFICATION;
export const KEY_GET_DIAGNOSTICS_RESPONSE = "diagnostics_response";
export const KEY_DIAGNOSTICS_STATUS = REQUEST_DIAGNOSTICS_STATUS_NOTIFICATION;
export const KEY_UNLOCK_CONNECTOR_RESPONSE = REQUEST_UNLOCK_CONNECTOR; // requestor needs to add connector ID to the end
export const KEY_ACTIVE_TRANSACTION_ID = "TransactionId"; // requestor needs to add connector ID to the end
export const KEY_RESERVATIONS_SUPPORTED = "ReservationsSupported";
export const KEY_ACTIVE_RESERVATION = "ActiveReservation"; //reservation id for selected connector


    
// Charge Point Status
export const CP_ERROR         = 'error';
export const CP_DISCONNECTED  = 'disconnected';
export const CP_CONNECTING    = 'connecting';
export const CP_CONNECTED     = 'connected';
export const CP_AUTHORIZED    = 'authorized';
export const CP_INTRANSACTION = 'in_transaction';

// Connector status
export const CONN_UNKNOWN = "Unknown";
export const CONN_AVAILABLE   = 'Available';
export const CONN_CHARGING    = 'Charging';
export const CONN_UNAVAILABLE = 'Unavailable';
export const CONN_RESERVED = "Reserved";
export const CONN_FAULTED = "Faulted";

// Availability status
export const AVAILABITY_OPERATIVE   = 'Operative';
export const AVAILABITY_INOPERATIVE = 'Inoperative';

// Firmware Update Status
export const RESPONSE_REPLY = 'Reply';
export const RESPONSE_NOT_SUPPORTED = 'NotSupported';
export const RESPONSE_DO_NOT_REPLY = 'DoNotReply';

export const FW_UPDATE_DOWNLOADING = 'Downloading';
export const FW_UPDATE_DOWNLOADED = 'Downloaded';
export const FW_UPDATE_DOWNLOAD_FAILED = 'DownloadFailed';
export const FW_UPDATE_DOWNLOAD_IDLE = 'Idle';
export const FW_UPDATE_INSTALLING = 'Installing';
export const FW_UPDATE_INSTALLED = 'Installed';
export const FW_UPDATE_INSTALLATION_FAILED = 'InstallationFailed';

// Connector Lock Status
export const LOCK_UNLOCKED = 'Unlocked';
export const LOCK_UNLOCK_FAILED = 'UnlockFailed';
export const LOCK_NOT_SUPPORTED = 'NotSupported'

// message structure
export const MSG_TYPE_INDEX = 0;
export const MSG_ID_INDEX = 1;
export const MSG_REQ_TYPE_INDEX = 2;
export const MSG_REQ_JSON_INDEX = 3;

// message types
export const MSG_REQUEST = 2;
export const MSG_RESPONSE = 3;
export const MSG_NOT_IMPLEMENTED = 4;

// response states
export const STATE_ACCEPTED = "Accepted";
export const STATE_FAULTED = "Faulted";
export const STATE_OCCUPIED = "Occupied";
export const STATE_REJECTED = "Rejected";

// COnfiguration parameters
export const CONFIG_MAX_CONNECTORS = 2;
