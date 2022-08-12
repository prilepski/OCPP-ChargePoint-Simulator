"use strict";
/*global $ */

import ChargePoint from './ocpp_chargepoint.js';
import * as ocpp from './ocpp_constants.js'

//
// CONST definitions
//

// Keys (stored in local storage)
const WSURL = 'WSURL';
const CPID  = 'CPID';
const TAGID = 'TAG';

// the charge point
var _cp = new ChargePoint();


// Log message to the JS Console and into the Log TextArea 
function logMsg(msg) {
    console.log(msg);
    var html_console = $('#console');
    html_console.append("&#10;" + msg);
    html_console.scrollTop(html_console.get(0).scrollHeight);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function setKey(key,value) {
    localStorage.setItem(key,value)
}

function keyDefaultValue(key) {
    var v=""
    switch(key) {
        case WSURL:
            v="ws://localhost:8080/steve/websocket/CentralSystemService/";
            break;
        case CPID:
            v='CP01';
            break;
        case TAGID:
            v='DEADBEEF';
            break;
    }
    return v
}

function getKey(key) {
    var v = localStorage.getItem(key);
    if (isEmpty(v)) {
        v = keyDefaultValue(key);
    }
    return v
}

function statusChangeCb(s,msg) {
    $('.indicator').hide();
    // Set only proper one
    switch(s){
        case ocpp.CP_DISCONNECTED:
            $('#badge_disconnected').show();
            $('#connect').show();
            $('#disconnect').hide();
            $('#send').hide();
            $('#start').hide();
            $('#stop').hide();
            $('#heartbeat').hide();
            $('#mv').hide();
            $('#status0').hide();
            $('#status1').hide();
            $('#status1_badge_disconnected').show();
            $('#status2_badge_disconnected').show();
            $('#status2').hide();
            $('#data_transfer').hide();
            $('#fwstatusbtn').hide();
            $('#diagstatusbtn').hide();
            _cp.setConnectorStatus(1, ocpp.CONN_UNKNOWN, false);
            _cp.setConnectorStatus(2, ocpp.CONN_UNKNOWN, false);
            break;

        case ocpp.CP_CONNECTING:
            $('#badge_connecting').show();
            $('#connect').hide();
            $('#disconnect').show(); 
            break;

        case ocpp.CP_CONNECTED:
            $('#badge_connected').show();
            $('#connect').hide();
            $('#disconnect').show();
            $('#send').show();
            $('#start').show();
            $('#stop').show();
            $('#heartbeat').show();
            $('#mv').show();
            $('#status0').show();
            $('#status1').show();
            $('#status2').show();
            $('#fwstatusbtn').show();
            $('#diagstatusbtn').show();

            _cp.setStatusNotification($('#FWSTATUS').val(), ocpp.KEY_FW_UPDATE_STATUS);
            _cp.setRequestResponseType($('#FWACCEPTREJECT').val(), ocpp.KEY_FW_UPDATE_RESPONSE);
            _cp.setStatusNotification($('#DIAGSTATUS').val(), ocpp.KEY_DIAGNOSTICS_STATUS);
            _cp.setRequestResponseType($('#DIAGACCEPTREJECT').val(), ocpp.KEY_GET_DIAGNOSTICS_RESPONSE);
            _cp.setRequestResponseType($('#CON1_LOCK_STATUS').val(), ocpp.KEY_UNLOCK_CONNECTOR_RESPONSE + "1");
            _cp.setRequestResponseType($('#CON2_LOCK_STATUS').val(), ocpp.KEY_UNLOCK_CONNECTOR_RESPONSE) + "2";
            _cp.setConnectorStatus(1, ocpp.CONN_AVAILABLE, false);
            _cp.setConnectorStatus(2, ocpp.CONN_AVAILABLE, false);
            _cp.setReservationSupport($("#reservationSupport").val());
    
            // RFU $('#data_transfer').show();
            break;

        case ocpp.CP_AUTHORIZED:
            $('#badge_available').show();
            break;

        case ocpp.CP_INTRANSACTION:
            $('#badge_transaction').show();
            break;

        case ocpp.CP_ERROR:
            $('#badge_error').show();
            if (!isEmpty(msg)) {
                logMsg(msg)
            }
            break;
        case ocpp.CONN_RESERVED:
        case ocpp.CONN_AVAILABLE:
            // connector status state will be updated at the end of the routine
            break;
        default:
            $('#badge_error').show();
            if (!isEmpty(msg)) {
                logMsg(msg)
            }
            else {
                logMsg("ERROR: Unknown status")
            }
    }
    updateConnectorStatusLabel(1);
    updateConnectorStatusLabel(2);
}

function availabilityChangeCb(c,s) {    
    var dom_id="#AVAILABILITY_CON"+c;
    $(dom_id).val(s);
    var dom_id="#STATUS_CON"+c;
    $(dom_id).val(_cp.connectorStatus(c));
}

//
// Show current connector status on the connector tab
// c - connector id
function updateConnectorStatusLabel(c) {
    // HTML supports 2 connectors only now
    if (c != 1 && c != 2)
        return;
    
    // reset current status
    status1_badge_Available
    var dom_id = "#status" + c + "_badge_";
    $(dom_id + ocpp.CONN_AVAILABLE).hide();
    $(dom_id + "Preparing").hide();
    $(dom_id + ocpp.CONN_CHARGING).hide();
    $(dom_id + "SuspendedEV").hide();
    $(dom_id + "SuspendedEVSE").hide();
    $(dom_id + "Finishing").hide();
    $(dom_id + "Reserved").hide();
    $(dom_id + ocpp.CONN_UNAVAILABLE).hide();
    $(dom_id + "Faulted").hide();
    $(dom_id + "Unknown").hide();

    var connector_status = _cp.connectorStatus(c);
    dom_id = "#status" + c + "_badge_" + connector_status;
    $(dom_id).show();
}

//
// Entry point of the simulator
// (attach callbacks to each button and wait for user action)
//
$( document ).ready(function() {

    _cp.setLoggingCallback(logMsg);
    _cp.setStatusChangeCallback(statusChangeCb);
    _cp.setAvailabilityChangeCallback(availabilityChangeCb);
    _cp.setStatus(ocpp.CP_DISCONNECTED);

    // Init the setting form
    $('#WSURL').val(getKey(WSURL))
    $('#CPID').val(getKey(CPID))
    $('#TAG').val(getKey(TAGID))
    $("#metervalue").val(_cp.meterValue());
    availabilityChangeCb(0,_cp.availability(0));
    availabilityChangeCb(1,_cp.availability(1));
    availabilityChangeCb(2,_cp.availability(2));

    // Define settings call back
    $('#cpparams').submit(function(e) {
        const formData = new FormData(e.target);
        for (var pair of formData.entries()) {
            setKey(pair[0],pair[1])
        }
    });

    $('#connect').click(function () {
        $('.indicator').hide();
        _cp.wsConnect(getKey(WSURL),getKey(CPID));
    });

    $('#disconnect').click(function () {
        _cp.wsDisconnect();
    });
    
    $('#send').click(function () {
        _cp.authorize($("#TAG").val());
    });

    $('#start').click(function () {
        _cp.setMeterValue($("#metervalue").val(),false, $('#currentConnectorId').val());        
        _cp.startTransaction($("#TAG").val(), $('#currentConnectorId').val());
    });

    $('#stop').click(function () {
        _cp.setMeterValue($("#metervalue").val(),false, $('#currentConnectorId').val());
        _cp.stopTransaction($("#TAG").val(), $('#currentConnectorId').val());
    });

    $('#mv').click(function () {
        _cp.sendMeterValue($('#currentConnectorId').val());
    });

    $("#mvplus").click(function(){
        var meter = $("#metervalue").val();
        meter = parseInt(meter) + 10;
        $("#metervalue").val(meter); 
        _cp.setMeterValue(meter,false, $('#currentConnectorId').val());
    });


    $('#heartbeat').click(function () {
        _cp.sendHeartbeat();
    });

    $('#CP0_STATUS').change(function () {
        _cp.setConnectorStatus(0,$("#STATUS_CON0").val(),false);
    });
    $('#CP1_STATUS').change(function () {
        _cp.setConnectorStatus(1,$("#STATUS_CON1").val(),false);
        updateConnectorStatusLabel(1);
    });
    $('#CP2_STATUS').change(function () {
        _cp.setConnectorStatus(2,$("#STATUS_CON2").val(),false);
        updateConnectorStatusLabel(2);
    });
    $('#status0').click(function () {
        _cp.setConnectorStatus(0,$("#STATUS_CON0").val(),true);
    });
    $('#status1').click(function () {
        _cp.setConnectorStatus(1,$("#STATUS_CON1").val(),true);
        updateConnectorStatusLabel(1);
    });
    $('#status2').click(function () {
        _cp.setConnectorStatus(2,$("#STATUS_CON2").val(),true);
        updateConnectorStatusLabel(2);
    });

    $('#datareqbtn').click(function () {
        _cp.sendDataRequest($('#VENDORID').val(), $('#MESSAGEID').val(), $('#DATATEXT').val())
    });

    $('#connect').on('change', function () {
        /* if (_websocket) {
            _websocket.close(3001);
        }*/
    });

    $('#FWACCEPTREJECT').on('change', function () {
        _cp.setRequestResponseType($("#FWACCEPTREJECT").val(), ocpp.KEY_FW_UPDATE_RESPONSE);
    });

    $('#fwstatusbtn').click(function () {
        var fwStatus = $("#FWSTATUS").val();
        _cp.sendSelectedStatusNotification(fwStatus, ocpp.REQUEST_FIRMWARE_STATUS_NOTIFICATION);
    });

    $('#FWSTATUS').on('change', function () {
        var fwStatus = $("#FWSTATUS").val();
        _cp.setStatusNotification(fwStatus, ocpp.KEY_FW_UPDATE_STATUS);
    });    

    $('#DIAGACCEPTREJECT').on('change', function () {
        _cp.setRequestResponseType($("#DIAGACCEPTREJECT").val(), ocpp.KEY_GET_DIAGNOSTICS_RESPONSE);
    });

    $('#diagstatusbtn').click(function () {
        var status = $("#DIAGSTATUS").val();
        _cp.sendSelectedStatusNotification(status, ocpp.REQUEST_DIAGNOSTICS_STATUS_NOTIFICATION);
    });

    $('#DIAGSTATUS').on('change', function () {
        var status = $("#DIAGSTATUS").val();
        _cp.setStatusNotification(status, ocpp.KEY_DIAGNOSTICS_STATUS);
    });    

    $('#CON1_LOCK_STATUS').on('change', function () {
        var status = $("#CON1_LOCK_STATUS").val();
        _cp.setRequestResponseType(status, ocpp.KEY_UNLOCK_CONNECTOR_RESPONSE + "1");
    });    

    $('#reservationSupport').on('change', function () {
        var status = $("#reservationSupport").val();
        _cp.setReservationSupport(status);
    });    

    
    logMsg("OCPP Simulator ready");
});