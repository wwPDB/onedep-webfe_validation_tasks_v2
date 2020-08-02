/*
 * File:  validationTasksCommon.js  
 *
 *        largely a minimall modified version of 
 * File:  annTasksCommon.js
 * Date:  21-April-2012  J. Westbrook
 *
 * Updates:
 *  23-April-2012  jdw -  Revise session model.
 *  23-April-2012  jdw -  Separate applet launch and load operations.
 *  29-June-2012   jdw -  Remove foundation methods -
 *   1-July-2012   jdw -  Fixed column table option fixed
 *                 jdw -  Assembly selection callback assigned to button 
 *                     -  download option -
 *   4-July-2012   jdw -  added form configuration for "other annotation tasks"
 *                     -  new session called on reloading upload page.
 *   6-July-2012   jdw -  add support to preserve and recover command line arguments.
 *                     -  add file label for edit option
 *   8-July-2012   jdw -  use local url for editor module.
 *   9-July-2012   rds -  Fixed jmol dialog bug fix with different browser dependencies.
 *  10-July-2012   rds -  Fixed bug fix for ajax file upload for older browsers.
 *   2-Aug -2012   jdw -  Fix initialization problem with entryId/FileName 
 *  31-Jan -2013   jdw -  Add additional upload for experimental data - 
 *  20-Feb-2013    jdw -  errortext->statustext
 *  29-Apr-2013    jdw -  Add plugin from sequence module for handling manual input of assembly details.
 *  02-Apr-2013    jdw -  Add provenance in assembly results table 
 *  04-Apr-2013    jdw -  Add map calculation option.
 *  03-May-2013    jdw -  Fix iframe size for the editor 
 *  07-Oct-2013    zk  -  Add additional correspondence to depositor
 *  09-Oct-2013    zk  -  Add manual coordinate editing
 *  18-Oct-2013    jdw -  Add new dcc tasks
 *  12-Nov-2013    jdw -  Add jsmol functions 
 *  13-Nov-2013    jdw -  Add jsmol map display functions
 *  15-Nov-2013    jdw    Fixed update problem with jquery.ief plugin
 *  25-Nov-2013    jdw    Fixed upload problem for secondary structure and coordinate transformation
 *  12-Dec-2013    jdw    Add options for merging replacement coordinates and replacing terminal atoms.
 *  16-Jan-2014    jdw    Update JMOL configuration
 *  28-Jan-2014    jdw    reset iframe height for editor module to 3.5K 
 *  09-Feb-2014    jdw    add finish call back
 *
 * 10-Feb-2014     jdw    v2
 * 17-Feb-2014     jdw    disable old footer handling
 * 18-Mar-2014     jdw    fix check report update id's
 * 19-Mar-2014     jdw    add sidebar navigation to check reports
 *                        add top menu item highlighting
 * 23-Mar-2014     jdw    Add close confirmations
 *  2-Apr-2014     jdw    Reorganize the modal confirmation dialog and progress display handling.
 * 13-Jun-2014     jdw    Add entryinfo service
 * 22-Sep-2014     jdw    include the entryCsFileName as a context parameter  
 */
//
// --------------------------------------------------------------------------------------------------------
var fullTaskIdList = ['#solvent-task-form', '#link-task-form', '#secstruct-task-form',  '#nafeature-task-form', '#site-task-form', 
		              '#extracheck-task-form', '#valreport-task-form', '#mapcalc-task-form', '#dcc-calc-task-form', '#dcc-refine-calc-task-form', '#trans-coord-task-form',  
		              '#special-position-task-form', '#biso-full-task-form',  '#terminal-atoms-task-form',  '#merge-xyz-task-form',  '#geom-valid-task-form',
		              '#dict-check-task-form','#reassign-altids-task-form' ]

var fullTaskDict  = {'#solvent-task-form'          : '/service/validation_tasks_v2/solventcalc',
		             '#link-task-form'             : '/service/validation_tasks_v2/linkcalc',
		             '#secstruct-task-form'        : '/service/validation_tasks_v2/secstructcalc',
		             '#nafeature-task-form'        : '/service/validation_tasks_v2/naFeaturescalc',
		             '#site-task-form'             : '/service/validation_tasks_v2/sitecalc',
		             '#dict-check-task-form'       : '/service/validation_tasks_v2/dictcheck',
		             '#extracheck-task-form'       : '/service/validation_tasks_v2/extracheck',
		             '#valreport-task-form'        : '/service/validation_tasks_v2/valreport',
		             '#mapcalc-task-form'          : '/service/validation_tasks_v2/mapcalc',
		             '#dcc-calc-task-form'         : '/service/validation_tasks_v2/dcccalc',
		             '#dcc-refine-calc-task-form'  : '/service/validation_tasks_v2/dccrefinecalc',
		             '#trans-coord-task-form'      : '/service/validation_tasks_v2/transformcoordcalc',
		             '#special-position-task-form' : '/service/validation_tasks_v2/specialpositioncalc',
		             '#biso-full-task-form'        : '/service/validation_tasks_v2/bisofullcalc',
		             '#terminal-atoms-task-form'   : '/service/validation_tasks_v2/terminalatomscalc',
		             '#merge-xyz-task-form'        : '/service/validation_tasks_v2/mergexyzcalc',
		             '#geom-valid-task-form'       : '/service/validation_tasks_v2/geomvalidcalc',
                     '#reassign-altids-task-form'  : '/service/validation_tasks_v2/reassignaltidscalc',
		            };
//
var uploadFromIdServiceUrl = '/service/validation_tasks_v2/uploadfromid';
var uploadServiceUrl = '/service/validation_tasks_v2/upload';
var newSessionServiceUrl = '/service/validation_tasks_v2/newsession';
var endSessionServiceUrl = '/service/validation_tasks_v2/finish';

var jmolLaunchServiceUrl = '/service/validation_tasks_v2/launchjmol';
var jmolWithMapLaunchServiceUrl = '/service/validation_tasks_v2/launchjmolwithmap';
var mapFlag=false;
var assemblyCalcServiceUrl = '/service/validation_tasks_v2/assemblycalc';
var assemblyRestartServiceUrl = '/service/validation_tasks_v2/assemblyrestart';
var assemblySelectServiceUrl = '/service/validation_tasks_v2/assemblyselect';

var assemblyLoadFormServiceUrl = '/service/validation_tasks_v2/assemblyloadform';
var assemblySaveFormServiceUrl = '/service/validation_tasks_v2/assemblysaveform';

var assemblyLoadDepInfoServiceUrl = '/service/validation_tasks_v2/assemblyloaddepinfo';
var depInfoDisplayFlag = 'false';

var getSessionInfoServiceUrl = '/service/validation_tasks_v2/getsessioninfo';



var correspondenceSelectServiceUrl = '/service/validation_tasks_v2/getcorrespondencetemplate';
var correspondenceGenerateServiceUrl = '/service/validation_tasks_v2/generatecorrespondence';

var coordFormServiceUrl = '/service/validation_tasks_v2/manualcoordeditorform';
var coordEditorSavingServiceUrl = '/service/validation_tasks_v2/manualcoordeditorsave';
var coordUpdateServiceUrl = '/service/validation_tasks_v2/manualcoordeditorupdate';
var checkReportIdOpsUrl = '/service/validation_tasks_v2/checkreports';

// --------------------------------------------------------------------------------------------------------
// Globals -
//
var sessionId = '';
var entryId = '';
var entryFileName = '';
var entryExpFileName = '';
var entryCsFileName = '';
var successFlag = 'false';
var errorFlag = '';
var errotText = '';
var wfStatus='';
var standaloneMode='';
var autostartMode='';
var pagePath='';
//

//
// Globals for JSmol
//
var jsmolAppOpen={};
var jsmolAppDict={};



/*window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};*/

(function(){var b,d,c=this,a=c.console;c.log=b=function(){d.push(arguments);a&&a.log[a.firebug?"apply":"call"](a,Array.prototype.slice.call(arguments))};c.logargs=function(e){b(e,arguments.callee.caller.arguments)};b.history=d=[]})();
String.prototype.startsWith = function (str){
	return this.indexOf(str) == 0;
};

function setDownloadModelFileUrl(id) {
    var url;
    var fn;
    if (entryFileName.length > 0) {
        fn = entryFileName;
        url = "/sessions/" + sessionId + "/" + fn;
    } else {
        url = "#";
        fn = "";
    }
    $(id).attr("href", url);
    $(id).html(fn);
    $(id).show();
}
function getDownloadModelFileLabel() {
    var fn;
    if (entryFileName.length > 0) {
        fn = "Download annotated model file: ";
    } else {
        fn = "No model file uploaded";
    }
    return fn;
}

function setDownloadExpFileUrl(id) {
    var url;
    var fn;
    if (entryExpFileName.length > 0) {
        fn = entryExpFileName;
        url = "/sessions/" + sessionId + "/" + fn;
    } else {
        url = "#";
        fn = "";
    }
    $(id).attr("href", url);
    $(id).html(fn);
    $(id).show();
}
function getDownloadExpFileLabel() {
    var fn;
    if (entryExpFileName.length > 0) {
        fn = "Download reflection data file: ";
    } else {
        //fn = "No reflection data file uploaded";
    }
    return fn;
}
//
function setDownloadCsFileUrl(id) {
    var url;
    var fn;
    if (entryCsFileName.length > 0) {
        fn = entryCsFileName;
        url = "/sessions/" + sessionId + "/" + fn;
    } else {
        url = "#";
        fn = "";
    }
    $(id).attr("href", url);
    $(id).html(fn);
    $(id).show();
}
function getDownloadCsFileLabel() {
    var fn;
    if (entryCsFileName.length > 0) {
        fn = "Download chemical shifts data file: ";
    } else {
        //fn = "No chemical shifts file uploaded";
    }
    return fn;
}



function uploadFile(serviceUrl, formElementId, progressElementId) {
    var bar = $('.bar');
    var percent = $('.percent');
    var serviceData = {};
    serviceData = getServiceContext();
    logContext("Starting uploadFile ");
    $(progressElementId).find('div').hide();
    var options = {
          beforeSubmit: function (arr, $form, options) {
	            arr.push({
                        "name": "sessionid",
                        "value": sessionId
                    });
                    arr.push({
                        "name": "entryid",
                        "value": entryId
                    });
                    arr.push({
                        "name": "entryfilename",
                        "value": entryFileName
                    });
                    arr.push({
                        "name": "entryexpfilename",
                        "value": entryExpFileName
                    });
                    arr.push({
                        "name": "entrycsfilename",
                        "value": entryCsFileName
                    });

	  },
	
	beforeSend: function () {
	    $(progressElementId).find('div').show();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        success:   function (jsonObj) {
	    if (jsonObj.errorflag) {
		$(formElementId + " div.op-status ").html(jsonObj.statustext);
		$(formElementId + " div.op-status ").show();
	    } else {
		if ("entryid" in jsonObj) {
		    entryId = jsonObj.entryid;
		}
		if ("entryfilename" in jsonObj) {
		    entryFileName = jsonObj.entryfilename;
		}
		if ("entryexpfilename" in jsonObj) {
		    entryExpFileName = jsonObj.entryexpfilename;
		}
		if ("entrycsfilename" in jsonObj) {
		    entryCsFileName = jsonObj.entrycsfilename;
		}
		logContext("After upload from idcode");
		$(formElementId + " div.op-status ").html(jsonObj.htmlcontent);
		$(formElementId + " div.op-status ").show();
		//
		$('#span_identifier').html(entryId).removeClass('displaynone');
		$('title').html("Val: " + entryId);
		appendContextToMenuUrls();
		$(progressElementId).find('div').hide(3000);
	    }
        },
        dataType: 'json'
    };
    $(formElementId).ajaxForm(options);
}

function uploadFromId(serviceUrl, formElementId) {
    logContext("Starting uploadFromId");
    $(formElementId + " div.op-status ").hide();

    var options = {
	url: serviceUrl,
        dataType: 'json',
        beforeSubmit: function (arr, $form, options) {
	    arr.push({
                "name": "sessionid",
                "value": sessionId
            });
	},
        success:   function (jsonObj) {
	    if (jsonObj.errorflag) {
		$(formElementId + " div.op-status ").html(jsonObj.statustext);
		$(formElementId + " div.op-status ").show();
	    } else {
		if ("entryid" in jsonObj) {
		    entryId = jsonObj.entryid;
		}
		if ("entryfilename" in jsonObj) {
		    entryFileName = jsonObj.entryfilename;
		}
		if ("entryexpfilename" in jsonObj) {
		    entryExpFileName = jsonObj.entryexpfilename;
		}
		if ("entrycsfilename" in jsonObj) {
		    entryCsFileName = jsonObj.entrycsfilename;
		}
		logContext("After upload from idcode");
		$(formElementId + " div.op-status ").html(jsonObj.htmlcontent);
		$(formElementId + " div.op-status ").show();
		//
		$('#span_identifier').html(entryId).removeClass('displaynone');
		$('title').html("Val: " + entryId);
		appendContextToMenuUrls();
	    }
        },
    };
    $(formElementId).ajaxForm(options);
}


function newSession(context) {
    var retObj;
    clearServiceContext();
    var serviceData = getServiceContext();
    logContext("Calling newsession ");
    //$.ajax({url: newSessionServiceUrl, async: false, data: {context: context}, type: 'post', success: assignSession } );
    $.ajax({
        url: newSessionServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    //
    assignContext(retObj);
    logContext("After newsession ");
    appendContextToMenuUrls();
}

function closeWindow() {
    if (navigator.userAgent.match(/firefox/i) ){
	logContext("Call window for firefox");
	window.open('','_parent','');
	window.close();
    } else  {
	logContext("Call window for webkit");
	var win=window.open("","_self");
	win.close();
    }
}

function prepareToFinish(callback) {
    var isComplete=false;

    $("#confirm-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Completion confirmation",
        height: 250,
        width: 400,
        async: true,
	close: function( event, ui ) {
	    logContext("Close action starts ... isComplete status " + isComplete);
	    if (isComplete) {
		callback();
	    }
	    logContext("Close action ends ... ");
	},
        buttons: {
            "Done": function () {
		isComplete=true;
                $(this).dialog('close');
            },
            "Cancel": function () {
		isComplete=false;
                $(this).dialog('close');
            }
        }
    });

}

function endSession() {
    logContext("Starting endSession ");
    var serviceData = getServiceContext();
    $.ajax({
        url: endSessionServiceUrl,
        async: true,
        data: serviceData,
        type: 'post',
        beforeSend: function() {
            progressStart();
	    $("#confirm-dialog").html("Ready to leave this module?");
        },
        success: function (jsonObj) {
	    progressEnd();
	    if (jsonObj.errorflag) {
		$("#op-status").html(jsonObj.statustext);
	    } else {
		$("#op-status").html(jsonObj.htmlcontent);
		$(window).unbind('beforeunload')
		closeWindow();
	    }
        }
    });
}


function updateDownloadOptions(jsonObj) {
    var url;
    var el;
    var fn;
    var arr;
    var htmlS;
    if ("logfiles" in jsonObj) {
        arr = jsonObj.logfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-logfiles").html(htmlS);
            $("#download-logfiles-label").html("Log files:");
            $("#download-logfiles").show();
            $("#download-logfiles-label").show();
        }
    }
    if ("assemblymodelfiles" in jsonObj) {
        arr = jsonObj.assemblymodelfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-assembly-model-files").html(htmlS);
            $("#download-assembly-model-files-label").html("Assembly model files:");
            $("#download-assembly-model-files").show();
            $("#download-assembly-model-files-label").show();
        }
    }
    if ("siteresultfiles" in jsonObj) {
        arr = jsonObj.siteresultfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-site-result-files").html(htmlS);
            $("#download-site-result-files-label").html("Site result files:");
            $("#download-site-result-files").show();
            $("#download-site-result-files-label").show();
        }
    }
    if ("pisareports" in jsonObj) {
        arr = jsonObj.pisareports;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-pisa-report-files").html(htmlS);
            $("#download-pisa-report-files-label").html("Pisa report files:");
            $("#download-pisa-report-files").show();
            $("#download-pisa-report-files-label").show();
        }
    }
    if ("checkreportfiles" in jsonObj) {
        arr = jsonObj.checkreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-check-report-files").html(htmlS);
            $("#download-check-report-files-label").html("Dictionary check reports:");
            $("#download-check-report-files").show();
            $("#download-check-report-files-label").show();
        }
    }

    if ("valreportfiles" in jsonObj) {
        arr = jsonObj.valreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-val-report-files").html(htmlS);
            $("#download-val-report-files-label").html("Validation reports:");
            $("#download-val-report-files").show();
            $("#download-val-report-files-label").show();
        }
    }

    if ("mapfiles" in jsonObj) {
        arr = jsonObj.mapfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-map-files").html(htmlS);
            $("#download-map-files-label").html("Map files:");
            $("#download-map-files").show();
            $("#download-map-files-label").show();
        }
    }
    if ("csfiles" in jsonObj) {
        arr = jsonObj.csfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-cs-files").html(htmlS);
            $("#download-cs-files-label").html("Chemical shift files:");
            $("#download-cs-files").show();
            $("#download-cs-files-label").show();
        }
    }

    // ok
    if ("dccfiles" in jsonObj) {
        arr = jsonObj.dccfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-dcc-files").html(htmlS);
            $("#download-dcc-files-label").html("DCC files:");
            $("#download-dcc-files").show();
            $("#download-dcc-files-label").show();
        }
    }
    // ok
    if ("extracheckreportfiles" in jsonObj) {
        arr = jsonObj.extracheckreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-extra-check-report-files").html(htmlS);
            $("#download-extra-check-report-files-label").html("Extra check reports:");
            $("#download-extra-check-report-files").show();
            $("#download-extra-check-report-files-label").show();
        }
    }
    if ("emdxmlreportfiles" in jsonObj) {
        arr = jsonObj.emdxmlreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-extra-check-report-files").html(htmlS);
            $("#download-extra-check-report-files-label").html("EMD XML reports:");
            $("#download-extra-check-report-files").show();
            $("#download-extra-check-report-files-label").show();
        }
    }
    // ok
    if ("correspondencefile" in jsonObj) {
        arr = jsonObj.correspondencefile;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-correspondence-to-depositor-file").html(htmlS);
            $("#download-correspondence-to-depositor-file-label").html("Correspondence to depositor:");
            $("#download-correspondence-to-depositor-file").show();
            $("#download-correspondence-to-depositor-file-label").show();
        }
    }
}

function updateAnnotTasksState(jsonObj) {

    for (var i =0; i < fullTaskIdList.length; i++) {
	logContext("updating task state for form " + 	fullTaskIdList[i]);
	taskFormCompletionOp(jsonObj,	fullTaskIdList[i]);
    }
}

function getSessionInfo() {
    var retObj;
    var serviceData = getServiceContext();
    logContext("Calling getSessionInfo() for entry " + entryId);
    $.ajax({
        url: getSessionInfoServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    return retObj;
}

function activateAssemblyInputButton() {
    $('#assembly-input-form-container').dialog({bgiframe: true,autoOpen: false,modal: false,height: 500,width: $(window).width()*0.8,
						close: function (event, ui) {
						    $('#assembly-input-form-container').empty();
						}
					       });
    $('#assembly-input-form-button').click(function(){
	var serviceData = getServiceContext();
	// var refId=$(this).parent().prev().find('a').attr('id');
	var placeholder="click-to-edit"
	$.ajax({
            url: assemblyLoadFormServiceUrl,
            data: serviceData,
            dataType: 'json',
            success: function (jsonObj) {
		$('#assembly-input-form-container').html(jsonObj.htmlcontent).dialog("open");
		$('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
		$('.ief').ief({
		    onstart:function(){
			if ($(this).hasClass('greyedout')){
			    $(this).attr('placeholder',$(this).html()).empty();
			}
		    },
		    oncommit:function(){
			if ($(this).hasClass('greyedout') && !$(this).is(":empty")){
			    $(this).removeClass('greyedout');
			} else if ($(this).hasClass('greyedout')) {
			    $(this).html(placeholder).addClass('greyedout');
			} else if ($(this).is(":empty")) {
			    $(this).html(placeholder).addClass('greyedout');
			}
		    },
		    oncancel:function(){
			if ($(this).is(":empty")){
			    $(this).html(placeholder).addClass('greyedout');
			}
		    }
		});
		$('.assembly_ajaxform').ajaxForm({
		    beforeSubmit: function (formData, jqForm, options) {
			formData.push({name:'sessionid',value:sessionId});
			formData.push({name:'entryid',value:entryId});
			formData.push({name:'entryfilename',value:entryFileName});
			formData.push({name:'entryexpfilename',value:entryExpFileName});
			formData.push({name:'entrycsfilename',value:entryCsFileName});
		    }, 		
		    success: function (jsonOBJ) {
			logContext("Assembly form updated " + jsonOBJ);
			if (jsonOBJ.errorflag) {
			    $("#assembly-form-status").html(jsonOBJ.statustext);
			} else {
			    $('#assembly-update-button').show();			
			    $("#assembly-form-status").html(jsonOBJ.htmlcontent);
			    $('#assembly-input-form-container').dialog("close");
			}
			$("#assembly-form-status").show();
		    }
		});

	    }
	});
    });
}

function activateAssemblyDepInfoButton() {
    logContext("Call activateAssemblyDepInfoButton");
    $('#assembly-dep-info-hide-button').click(function(){
	depInfoDisplayFlag = 'false';
	$('#assembly-dep-info-container').hide();
	$('#assembly-dep-info-button').show();
	$('#assembly-dep-info-hide-button').hide();	
    });

    $('#assembly-dep-info-button').click(function(){
	var serviceData = getServiceContext();
	$.ajax({
	    url: assemblyLoadDepInfoServiceUrl,
	    data: serviceData,
	    dataType: 'json',
	    success: function (jsonObj) {
		$('#assembly-dep-info-container').html(jsonObj.htmlcontent);
		$('#assembly-dep-info-container').show();
		depInfoDisplayFlag = 'true';
		$('#assembly-dep-info-button').hide();
		$('#assembly-dep-info-hide-button').show();
	    }
	});
    });
}

function restartAssemblySession() {
    var retObj;
    var serviceData = getServiceContext();
    logContext("Calling restart assembly context for entry " + entryId);
    $.ajax({
	url: assemblyLoadDepInfoServiceUrl,
	data: serviceData,
	dataType: 'json',
	success: function (jsonObj) {
	    $('#assembly-dep-info-container-alt').html(jsonObj.htmlcontent);
	    $('#assembly-dep-info-container-alt').show();
	    depInfoDisplayFlag = 'true';
	    //$('#assembly-dep-info-button').hide();
	    //$('#assembly-dep-info-hide-button').show();
	}
    });


    //$.ajax({url: newSessionServiceUrl, async: false, data: {context: context}, type: 'post', success: assignSession } );
    //$.ajax({url: newSessionServiceUrl, async: false, data: serviceData, type: 'post', success: function(jsonObj) {retObj=jsonObj;} });
    $.ajax({
        url: assemblyRestartServiceUrl,
        data: serviceData,
        dataType: 'json',
        success: function (jsonObj) {
            logContext("Returned from assembly restart");
            updateCompletionStatus(jsonObj, '#assemblyForm');
            var assemCount = jsonObj.assemcount;
            logContext("Assembly count is " + assemCount);
            if (assemCount > 0) {
                $('#assembly-html-container').html(jsonObj.tablecontent);		    
                $('#assembly-html-container').show();		    
		setAssemblyViewCallback();
                //getAssemblyTable(jsonObj.rowdata);
                $('#assembly-update-button').show();

            } else {
                if (jsonObj.errorflag) {
                    $("#assembly-container-alt").html(jsonObj.statustext);
                } else {
                    $("#assembly-container-alt").html(jsonObj.htmlcontent);
                }
                $("#assembly-container-alt").show();
            }
            updateCompletionStatus(jsonObj, '#assemblyForm');
            var selectText = jsonObj.selecttext;
            $('#assembly-update-status').html(selectText);
            $('#assembly-update-status').show();
            $('#assembly-calc-button').show();
            var assemArgs = jsonObj.assemblyargs;
            logContext("restarting with arguments " + assemArgs);
            if (assemArgs.length > 0) {
                $("#assemblyargs").val(assemArgs);
            }
        }
    });
}
function appendContextToMenuUrls() {
    // append the current session id to menu urls
    $("fieldset legend a, #top-menu-options li a, .navbar-header a" ).attr('href', function (index, href) {
        ret = href.split("?")[0];
        if (sessionId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'sessionid=' + sessionId;
        }
        if (entryId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryid=' + entryId;
        }
        if (entryFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryfilename=' + entryFileName;
        }

        if (entryExpFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryexpfilename=' + entryExpFileName;
        }

        if (entryCsFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entrycsfilename=' + entryCsFileName;
        }

        if (standaloneMode.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'standalonemode=' + standaloneMode;
        }

        if (autostartMode.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'autostartmode=' + autostartMode;
        }

        //console.log("index = " + index + " href " + href + " ret = " + ret);
        return ret;
    });
    //JDW ###
    if (entryId.length > 0) {
	getEntryInfo();
    }

}

function getEntryInfo() {
    //logContext("Calling getEntryInfo");
    var entryInfoUrl = '/service/validation_tasks_v2/entryinfo';
    var serviceData = getServiceContext();
    $.ajax({
        url: entryInfoUrl,
        async: true,
        data: serviceData,
        dataType: 'json',
        type: 'post',
        success: function (jsonObj) {
	    if ("struct_title" in jsonObj  && jsonObj.struct_title.length > 0) {
		$('#my_title').remove();
		$('.page-header').append('<h5 id="my_title"> Title: ' + jsonObj.struct_title + '</h5>');
	    }
            if ("comb_id" in jsonObj && jsonObj.comb_id.length > 0) {
		$('title').html("Val: " + jsonObj.comb_id);
	    } else if ("pdb_id" in jsonObj && jsonObj.pdb_id.length > 0) {
		$('title').html("Val: " + jsonObj.pdb_id + '/' + entryId);
	    }
        }
    });
    //
    //logContext("After getEntryInfo ");
}

function assignContext(jsonObj) {
    sessionId = jsonObj.sessionid;
    //  message  =jsonObj.htmlcontent;
    errorFlag = jsonObj.errorflag;
    errorText = jsonObj.statustext;
    if ('entryid' in jsonObj) {
        entryId = jsonObj.entryid;
    }
    if ('entryfilename' in jsonObj) {
        entryFileName = jsonObj.entryfilename;
    }
    if ('entryexpfilename' in jsonObj) {
        entryExpFileName = jsonObj.entryexpfilename;
    }
    if ('entrycsfilename' in jsonObj) {
        entryCsFileName = jsonObj.entrycsfilename;
    }
    if ('standalonemode' in jsonObj) {
        standaloneMode = jsonObj.standalonemode;
    }

}

function logContext(message) {
  log("%lc: " + message + " ( session id " + sessionId + " entry id " + entryId + " entry filename " + entryFileName + " entry exp filename " + entryExpFileName + " entry cs filename " + entryCsFileName + ")");
}

function getCurrentContext() {
    var myUrl = $(location).attr('href');
    params = $.url(myUrl).param();
    pagePath = $.url(myUrl).attr('relative');
    if ("sessionid" in params) {
        sessionId = params.sessionid;
    }
    if ("entryid" in params) {
        entryId = params.entryid;
	$('#span_identifier').html(entryId).removeClass('displaynone');
	$('title').html("Val: " + entryId);
    }
    if ("entryfilename" in params) {
        entryFileName = params.entryfilename;
    }
    if ("entryexpfilename" in params) {
        entryExpFileName = params.entryexpfilename;
    }

    if ("entrycsfilename" in params) {
        entryCsFileName = params.entrycsfilename;
    }

    if ("wfstatus" in params) {
        wfStatus = params.wfstatus;
    }

    if ("standalonemode" in params) {
        standaloneMode = params.standalonemode;
    }

    autostartMode = '';
    if ("autostartmode" in params) {
        autostartMode = params.autostartmode;
    }
    
    if (standaloneMode == 'y' || ($("#upload-dialog").length > 0)) {
	    standaloneMode='y';
    }

    if (standaloneMode == 'y') {
	    $(".workflow-only").hide();
	    $(".standalone-only").show();
    } else {
	    $(".standalone-only").hide();	
	    $(".workflow-only").show();
    }
    logContext("Leaving getCurrentContext() with wfstatus = " + wfStatus + " standaloneMode " + standaloneMode);
}

function clearServiceContext() {
  sessionId='';
  entryId='';
  entryFileName='';
  entryExpFileName='';
  entryCsFileName='';
    //standaloneMode='n';
}
  

function getServiceContext() {
    var sc = {};
    sc.sessionid = sessionId;
    sc.entryid = entryId;
    sc.entryfilename = entryFileName;
    sc.entryexpfilename = entryExpFileName;
    sc.entrycsfilename = entryCsFileName;
    //sc.standalonemode  = standaloneMode;
    return sc;
}

function getDisplayButtonLabel() {
    var retS = '';
    if (entryFileName.length > 0) {
        retS = "Current data file: " + entryFileName;
    } else {
        retS = "No current data file ";
    }
    return retS;
}
function setOptionButtonVisible(id) {
    if (entryFileName.length > 0) {
        $(id).show();
    } else {
        $(id).hide();
    }
}

function loadFileJmol(fileName, jmolMode) {
    var setupCmds = '';
    if (jmolMode == 'wireframe') setupCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 100; depth 40; slab on;";
    else {
        setupCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 100; depth 40; slab on;";
    }
    if ($('#jmolApplet0').size() > 0) {
        var filePath = "/sessions/" + sessionId + "/" + fileName;
        var jmolCmds = "load " + filePath + "; " + setupCmds;
        document.jmolApplet0.script(jmolCmds);
    }
}
function loadAssemblyJmol(assemblyId, jmolMode) {
    // OBSOLETE CODE
    var setupCmds = '';
    if (jmolMode == 'wireframe') {
		setupCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 100; depth 40; slab on;";
	} else {
        setupCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 100; depth 40; slab on;";
    }
    if ($('#jmolApplet0').size() > 0) {
        var filePath = document.location.protocol + "//" + document.domain + "/sessions/" + sessionId + "/" + entryId + "-assembly-model-" + assemblyId + ".cif";
        var jmolCmds = "load " + filePath + "; " + setupCmds;
        document.jmolApplet0.script(jmolCmds);
    }
}
function setAssemblyViewCallback() {
    // make assembly view links ajax
    $('.assem_viewable').click(function () {
        var serviceUrl = $(this).attr('href');
        logContext("++++++++ Using  assembly service url " + serviceUrl);
        var serviceData = getServiceContext();
        $.ajax({
            url: serviceUrl,
            data: serviceData,
            dataType: 'json',
            success: function (jsonOBJ) {
                logContext("Launching new Jmol applet");
                $('#jmol-dialog-assem').html(jsonOBJ.htmlcontent).dialog({
                    bgiframe: true,
                    autoOpen: true,
                    modal: false,
                    height: 700,
                    width: 700,
                    close: function (event, ui) {
			$("#jmol-dialog-assem").empty();
                    }
                });
            }
        });
        return false;
    });
}

function hideEditFrame() {
    $('#edit-frame').addClass('displaynone');
    $('#wrap').show();
    $('#footer').show();
}
function progressStart() {
    $("#loading").fadeIn('slow').spin("large", "black");
}
function progressEnd() {
    $("#loading").fadeOut('fast').spin(false);
}

function updateCompletionStatusWf(statusHtml, formId) {
  $(formId + ' div.op-status').html(statusHtml);
  $(formId + ' div.op-status').removeClass('error-status');
  $(formId + ' div.op-status').show();
}

function updateCompletionStatus(jsonObj, statusId) {
    var retHtml = jsonObj.htmlcontent;
    var errFlag = jsonObj.errorflag;
    var errText = jsonObj.statustext;
    //  if (errText.length > 0 ) {
    if (errFlag) {
        $(statusId + ' div.op-status').html(errText);
        $(statusId + ' div.op-status').addClass('error-status');
    } else {
        $(statusId + ' div.op-status').html(retHtml);
        $(statusId + ' div.op-status').removeClass('error-status');
    }
    $(statusId + ' div.op-status').show();
}

function updateReportContent(jsonObj, contentId) {
    var retHtml = jsonObj.htmlcontent;
    var errFlag = jsonObj.errorflag;
    logContext('Updating report content  = ' + contentId);
    if (! errFlag) {
	//logContext('Updating report content  with = ' + retHtml);
	// logContext('Selection container ' + $(contentId).length  ); 
	//logContext('Selection report div ' + $(contentId + ' div.report-content').length  ); 
	//$(contentId + ' div.report-content').append(retHtml);
	$(contentId + ' div.report-content').html(retHtml);
	$(contentId + ' div.report-content').show();
    }
}

function updateLinkContent(jsonObj, contentId) {
    var retHtml = jsonObj.htmllinkcontent;
    logContext('Updating link content id = ' + contentId);
    if (retHtml.length > 0) {
      logContext('Updating link content  with = ' + retHtml);
      logContext('Selection container ' + $(contentId).length  ); 
      logContext('Selection link div '  + $(contentId + ' div.op-links').length  ); 
      $(contentId + ' div.op-links ').html(retHtml);
      $(contentId + ' div.op-links ').show();
    }
}

function updateFormStatus(jsonObj) {

    var formId = jsonObj.taskformid;
    var statusText = jsonObj.statustext;
    logContext("updateformstatus   >> " + formId + " statustext " + statusText);
    if (formId.length > 0 && statusText.length > 0) {
	var errFlag = jsonObj.errorflag;
	if (errFlag) {
            $(formId + ' fieldset div.my-task-form-status').html(statusText);
            $(formId + ' fieldset div.my-task-form-status').addClass('error-status');
	} else {
            $(formId + ' fieldset div.my-task-form-status').html(statusText);
            $(formId + ' fieldset div.my-task-form-status').removeClass('error-status');
	}
	$(formId + ' fieldset div.my-task-form-status').show();
    }
}

function updateFormLinkContent(jsonObj) {
    var formId = jsonObj.taskformid;
    var linkList = jsonObj.links;
    if (linkList.length > 0 && formId.length > 0) {
	linkHtml = '<span class="my-task-form-url-list">Download: ' + linkList.join(' ')  +  '</span>'
	$(formId + ' fieldset div.my-task-form-links ').html(linkHtml);
	$(formId + ' fieldset div.my-task-form-links ').show();
    }
}

function taskFormCompletionOp(jsonObj, formId) {
    logContext("Completion processing for  >> " + formId);
    updateFormStatus(jsonObj[formId]);
    updateFormLinkContent(jsonObj[formId]);
    $(formId + ' fieldset input.my-task-form-submit ').show();
    progressEnd();
}

function updateTaskFormContent(arr,formId) {
    arr.push({ "name": "sessionid",           "value": sessionId    });
    arr.push({ "name": "entryid",             "value": entryId    });
    arr.push({ "name": "entryfilename",       "value": entryFileName    });
    arr.push({ "name": "entryexpfilename",    "value": entryExpFileName    });
    arr.push({ "name": "entrycsfilename",    "value": entryCsFileName    });
    arr.push({ "name": "taskformid",          "value": formId   });
}

function taskFormPrepOp(arr, formId) {
    logContext("Before link calculation >> " + formId);
    progressStart();
    $(formId + ' fieldset div.my-task-form-status').hide();
    $(formId + ' fieldset input.my-task-form-submit ').hide();
    updateTaskFormContent(arr,formId);
}

//
// jdw add methods for JSmol
//

function initJsmolApp(appName, id, buttonId) {
    var xSize=700;
    var ySize=700;
    Jmol._binaryTypes = [".map",".omap",".gz",".jpg",".png",".zip",".jmol",".bin",".smol",".spartan",".mrc",".pse"];
    Info = {
        j2sPath: "/assets/applets/jmol-dev/jsmol/j2s",
        serverURL: "/assets/applets/jmol-dev/jsmol/php/jsmol.php",
	//serverURL: "http://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
        width:  xSize,
        height: ySize,
        debug: false,
        color: "0xC0C0C0",
        disableJ2SLoadMonitor: true,
        disableInitialConsole: true,
        addSelectionOptions: false,
        use: "HTML5",
        readyFunction: null,
        script: ""
    };
    Jmol.setDocument(0);
    jsmolAppDict[appName]=Jmol.getApplet(appName,Info);


    $(id).html(Jmol.getAppletHtml(jsmolAppDict[appName])).dialog({
        bgiframe: true,
        autoOpen: true,
        modal: false,
        height: xSize,
        width: ySize,
        close: function (event, ui) {
	    $(id).attr("disabled", false);
	    if ( buttonId.length  > 0) {
		$(buttonId).attr("disabled", false);
	    }
	    jsmolAppOpen[appName]=false;
        }
    });
    jsmolAppOpen[appName]=true;
    $('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
}


function loadFileJsmol(appName, id, filePath, jmolMode) {
    if (!jsmolAppOpen[appName] ) {
	initJsmolApp(appName,id,'')
    }
    var setupCmds = '';
    if (jmolMode == 'wireframe') {
	setupCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 100; depth 40; slab on;";
    } else if (jmolMode == 'cpk') {
	setupCmds = "background white; wireframe off; spacefill on; color chain; labels off; slab 100; depth 40; slab on";
    } else {
	setupCmds = "";
    }
    var jmolCmds = "load " + filePath + "; " + setupCmds;
    Jmol.script(jsmolAppDict[appName], jmolCmds);
}


function loadFileWithMapJsmol(appName, id, xyzFilePath, mapFilePath, jmolMode) {
    if (!jsmolAppOpen[appName] ) {
	initJsmolApp(appName,id,'')
    }
    var setupCmds = '';
    if (jmolMode == 'map-style-1') {
	mapCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 50;  depth 20; slab on; isosurface surf_15 color [x3050F8] sigma 1.5 within 2.0 {*} '" + mapFilePath + "' mesh nofill;"
    } else if (jmolMode == 'map-style-2') {
	mapCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 50; depth 20; slab on; refresh; isosurface downsample 2 cutoff 0.5 boundbox '" + mapFilePath + "'  mesh nofill; isosurface display within 2.0 {*};"
    } else {
	mapCmds = "";
    }
    var jmolCmds = "load " + xyzFilePath + "; " + mapCmds;
    Jmol.script(jsmolAppDict[appName], jmolCmds);
}

function setupSideBar() {
    /*
     *   For control of side nav bar -- 
     */
    var $window = $(window);
    var $body = $(document.body);
    
    var navHeight = $('.navbar').outerHeight(true) + 10;
    $body.scrollspy({
	target: '.bs-sidebar',
	offset: navHeight
    });
	
    $window.on('load', function() {
	$body.scrollspy('refresh')
    });
    
    $('.bs-docs-container [href=#]').click(function(e) {
	e.preventDefault()
    });
    
    // back to top
    setTimeout(function() {
	var $sideBar = $('.bs-sidebar')
	
	$sideBar.affix({
            offset: {
		top: function() {
                    var offsetTop = $sideBar.offset().top
                    var sideBarMargin = parseInt($sideBar.children(0).css('margin-top'), 10)
                    var navOuterHeight = $('.bs-docs-nav').height()
                    return (this.top = offsetTop - navOuterHeight - sideBarMargin)
		},
		bottom: function() {
                    return (this.bottom = $('.bs-footer').outerHeight(true))
		}
            }
	})
    }, 100);
}

function handleCLoseWindow() {
    var inFormOrLink;
    $('a').on('click', function() { inFormOrLink = true; });
    $('form').on('submit', function() { inFormOrLink = true; });
    
    $(window).bind('beforeunload', function(eventObject) {
	var returnValue = undefined;
	if (! inFormOrLink) {
	    returnValue = "Do you really want to close?";
	}
	eventObject.returnValue = returnValue;
	return returnValue;
    });
}

//
// Document ready entry point
//
$(document).ready(function () {
    $("#uploadProgress").find('*').hide();
    $("#assembly-table-container").hide();
    getCurrentContext();
    //
    // Warn about out of workflow condition --- 
    //
    if ($("#wf-startup-dialog").length > 0) {
	if (wfStatus == 'completed') {
	    $("#op-status").html("Workflow status update successful!");
	} else if (wfStatus == 'failed'){
	    $("#op-status").html("Workflow status update failed!   Proceed with caution!");
	}
    }

    //  Add session context to navbar menu items
    appendContextToMenuUrls();

    if (sessionId.length == 0) {
        newSession('request session');
        logContext('Assigning new session id  = ' + sessionId);
    }

    if ($("#wf-finish-dialog").length > 0) {
	logContext("Calling endsession ");
	//endSession();
	prepareToFinish(endSession);
    }

    if ($("#upload-dialog").length > 0) {
	standaloneMode='y';
        newSession('reset session before upload');
	uploadFromId(uploadFromIdServiceUrl,"#id-form");
        uploadFile(uploadServiceUrl, "#upload-model", "#uploadProgress");
        uploadFile(uploadServiceUrl, "#upload-exp",   "#uploadProgress");
	$('#span_identifier').html("").addClass('displaynone');
	$('title').html("");
    }


    //<!-- Viewer  operations for model and map display-->
    if ($("#jmol-dialog").length > 0) {
	// jsmol options
	setOptionButtonVisible("#jsmol-opener-button-1");
        $('#jsmol-opener-button-1').click(function () {
	    logContext("Launching Jsmol One");
            var filePath = "/sessions/" + sessionId + "/" + entryFileName;
	    jsmolAppOpen["myApp1"]=false;
	    initJsmolApp("myApp1",'#jsmol-dialog-1','#jsmol-opener-button-1');
	    loadFileJsmol("myApp1", "#jsmol-dialog-1", filePath,'wireframe');
	    $('#jsmol-opener-button-1').attr("disabled", true);
	});

	if (mapFlag) {
            $('#jsmol-with-map-opener-button-1').click(function () {
		logContext("Launching Jsmol One");
		var filePath = "/sessions/" + sessionId + "/" + entryFileName;
		var mapPath = "/sessions/" + sessionId + "/" + entryId + "_map-2fofc_P1.map";
		jsmolAppOpen["myApp1"]=false;
		initJsmolApp("myApp1",'#jsmol-dialog-1','#jsmol-with-map-opener-button-1');
		loadFileWithMapJsmol("myApp1", "#jsmol-dialog-1", filePath,mapPath,'map-style-1');
		$('#jsmol-with-map-opener-button-1').attr("disabled", true);
	    });
            $('#jsmol-with-map-opener-button-1').show();
	} else {
	    logContext("Hiding jmol with map button");
            $('#jsmol-with-map-opener-button-1').hide();
	}
	
	// jmol options

	setOptionButtonVisible("#jmol-opener-button");
        $("#display-button-label").html(getDisplayButtonLabel());
        $('#jmol-opener-button').click(function () {
            if ($('#jmolApplet0').size() == 0) {
                var serviceData = getServiceContext();
                $.ajax({
                    url: jmolLaunchServiceUrl,
                    data: serviceData,
                    dataType: 'json',
                    success: function (jsonOBJ) {
                        logContext("Launching new Jmol applet");
                        $('#jmol-dialog').html(jsonOBJ.htmlcontent).dialog({
                            bgiframe: true,
                            autoOpen: true,
                            modal: false,
                            height: 700,
                            width: 700,
                            close: function (event, ui) {
                                $("#jmol-dialog").attr("disabled", false);
                                //$("#jmol-dialog").empty();
                                $('#jmol-opener-button').attr("disabled", false);
                            }
                        });
                        $('#jmol-opener-button').attr("disabled", true);
			$('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
                    }
                });
            } else {
                logContext("Loading existing Jmol applet with file " + entryFileName);
                $("#jmol-dialog").dialog('open');
                loadFileJmol(entryFileName, 'wireframe');
                $('#jmol-opener-button').attr("disabled", true);
            }
        });

        $('#jmol-with-map-opener-button').click(function () {
            var serviceData = getServiceContext();
            $.ajax({
                url: jmolWithMapLaunchServiceUrl,
                data: serviceData,
                dataType: 'json',
                success: function (jsonOBJ) {
                    logContext("Launching new Jmol applet with map content");
                    $('#jmol-dialog').html(jsonOBJ.htmlcontent).dialog({
                        bgiframe: true,
                        autoOpen: true,
                        modal: false,
                        height: 700,
                        width: 700,
                        close: function (event, ui) {
                            $("#jmol-dialog").attr("disabled", false);
                            $('#jmol-with-map-opener-button').attr("disabled", false);
                        }
                    });
                    $('#jmol-with-map-opener-button').attr("disabled", true);
		    $('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
                }
            });
        });

	logContext("mapFlag in jmol with map button sect " + mapFlag);	
	if (mapFlag) {
            $('#jmol-with-map-opener-button').show();
	} else {
	    logContext("Hiding jmol with map button");
            $('#jmol-with-map-opener-button').hide();
	}
    }
    <!-- Assembly operations -->
    if ($("#assembly-dialog").length > 0) {
	
        $('#assembly-update-button').hide();
        $('#assembly-update-status').hide();
	//$('#assembly-dep-info-hide-button').hide();
	//$('#assembly-dep-info-button').show();
        $("#assembly-container-alt").hide();
        //$("#assembly-dep-info-container").hide();
        $("#assembly-button-label").html(getDisplayButtonLabel());
        setOptionButtonVisible("#assembly-calc-button");
        <!-- assembly form -->
        $('#assemblyForm div.op-status').hide();
        $('#assemblyForm').ajaxForm({
            url: assemblyCalcServiceUrl,
	    cache:  true,
            dataType: 'json',
            success: function (jsonObj) {
                logContext("Returned from assembly calculation");
                progressEnd();
                //
                updateCompletionStatus(jsonObj, '#assemblyForm');
                var assemCount = jsonObj.assemcount;
                logContext("Assembly count is " + assemCount);
                if (assemCount > 0) {
                    $('#assembly-html-container').html(jsonObj.tablecontent);		    
                    $('#assembly-html-container').show();		    
		    setAssemblyViewCallback();
                    //getAssemblyTable(jsonObj.rowdata);
                    $('#assembly-update-button').show();
                } else {
                    if (jsonObj.errorflag) {
                        $("#assembly-container-alt").html(jsonObj.statustext);
                    } else {
                        $("#assembly-container-alt").html(jsonObj.htmlcontent);
                    }
                    $("#assembly-container-alt").show();
                }
                updateCompletionStatus(jsonObj, '#assemblyForm');
                $('#assembly-update-status').hide();
                $('#assembly-calc-button').show();
            },
            beforeSubmit: function (arr, $form, options) {
                progressStart();
                $('#assembly-calc-button').hide();
                $("#assembly-container-alt").hide();
                //console.log(toString(arr));
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            }
        });

        $('#assembly-update-button').click(function () {
            var serviceData = getServiceContext();
            var checkList = '';
	    var provenanceList = '';
            $.each($('input.assem_select:checked'), function (i) {
                checkList += $(this).val() + ","
            });
            logContext("Assembly selection : " + checkList);

            $.each($('select.assem_prov option:selected'), function (i) {
                provenanceList += $(this).parent().attr('name') +":"+$(this).val() + ","
            });
            logContext("Assembly provenance : " + provenanceList);
            serviceData.selected = checkList;
            serviceData.provenance = provenanceList;

            //
            //$('#assembly-calc-button').hide();
            $('#assembly-update-button').hide();
            progressStart();
            $.ajax({
                url: assemblySelectServiceUrl,
                data: serviceData,
                dataType: 'json',
                success: function (jsonObj) {
                    logContext("Completed assembly selection update");
                    progressEnd();
                    $('#assembly-update-button').show();
                    if (jsonObj.errorflag) {
                        $('#assembly-update-status').html(jsonObj.statustext);
                        $('#assembly-update-status').addClass('error-status');
                    } else {
                        $('#assembly-update-status').html(jsonObj.htmlcontent);
                        $('#assembly-update-status').removeClass('error-status');
                    }
                    $('#assembly-update-status').show();
                }
            });

        });
	activateAssemblyInputButton();
	//activateAssemblyDepInfoButton();
        restartAssemblySession();
    }
    <!-- end assembly operations -->

    <!-- Download task operations -->
    if ($("#download-dialog").length > 0) {
        $("#download-logfiles").hide();
        $("#download-logfiles-label").hide();
        var sObj = getSessionInfo();
        updateDownloadOptions(sObj);
        //
        $('#download-model-url').hide();
        $("#download-model-url-label").html(getDownloadModelFileLabel());
        setDownloadModelFileUrl("#download-model-url");
	//
        $('#download-exp-url').hide();
        $("#download-exp-url-label").html(getDownloadExpFileLabel());
        setDownloadExpFileUrl("#download-exp-url");

        $('#download-cs-url').hide();
        $("#download-cs-url-label").html(getDownloadCsFileLabel());
        setDownloadCsFileUrl("#download-cs-url");


    }
    <!-- Annotation task operations -->
    if ($("#task-dialog").length > 0) {
        if (entryFileName.length > 0) {
            //
            var sObj = getSessionInfo();
            updateAnnotTasksState(sObj);
            //
            $("#task-alt-dialog").html("Annotating file: " + entryFileName);
            $("#task-alt-dialog").show();
            $("#task-dialog").show();

	    for ( var myTask in fullTaskDict) {
		    <!-- lite up the task form -->
		    $(myTask).ajaxForm({
			url: fullTaskDict[myTask],
			dataType: 'json',
			success: function (jsonObj,statusText, xhr, $form) {
			    taskFormCompletionOp(jsonObj,"#" + $form.attr('id'));
			},
			beforeSubmit: function (arr, $form, options) {
			    taskFormPrepOp(arr,"#" + $form.attr('id'));
			}
		    });
	    }
        } else {
            $("#task-dialog").hide();
            $("#task-alt-dialog").html("No file uploaded");
            $("#task-alt-dialog").show();
        }
    }

    <!-- edit operations -->
    if ($("#edit-dialog").length > 0) {
        setOptionButtonVisible("#edit-opener-button");
        $("#edit-button-label").html(getDisplayButtonLabel());
        $('#edit-opener-button').click(function () {
            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=annotation&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();
            $("#edit-frame").attr("src", url).removeClass("displaynone");
            // $("#edit-frame").height($('#edit-frame')[0].contentDocument.documentElement.scrollHeight+30);
            // $("#edit-frame").height($('#edit-frame')[0].contentWindow.document.body.offsetHeight+'px');
	    // JDW workaround
	    $("#edit-frame").height(3500);
            //$("#edit-frame").iframeAutoHeight({
            //    debug: true,
            //    heightOffset: 300
            //});
        });
        $('#edit-opener-button-alt').click(function () {
            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=summaryreport&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();

            $("#edit-frame").attr("src", url).removeClass("displaynone");
	    $("#edit-frame").height(3500);
        });

    }

    <!-- buster-report operations -->
    if ($("#buster-report-dialog").length > 0) {
	logContext(" Found dialog ");
        $("#buster-report-button-label").html(getDisplayButtonLabel());

        var serviceData = getServiceContext();
        $.ajax({
            url: '/service/validation_tasks_v2/getbusterreport',
            data: serviceData,
            dataType: 'json',
            beforeSend: function() {
                progressStart();
            },
            success: function (jsonObj) {
                progressEnd();
                $('#buster-report-table-container').html(jsonObj.htmlcontent);
                $('#buster-report-table-container').show();
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
    }

    <!-- correspondence operations -->
    if ($("#correspondence-dialog").length > 0) {
	logContext(" Found correspondence dialog ");
        function textbox_toggle(cbox) {
            var id = $(cbox).attr('id');
            var splitarr = id.split('_');
            var textbox = '#text_' + splitarr[1];
            var style = $(textbox).attr("style");
	    //JDWJDW
	    logContext("textbox_toggle id " + id + " textbox " + textbox + " style " + style);

            var display = $(textbox).css('display');
/*
            if (($(cbox).is(':checked') && style == 'display: none;') ||
               (!$(cbox).is(':checked') && style != 'display: none;')) {
*/
            if (($(cbox).is(':checked') && display == 'none') || (!$(cbox).is(':checked') && display != 'none')) {
                $(textbox).toggle('fast');
            }
        }
   
        $("#correspondence-button-label").html(getDisplayButtonLabel());
/*
        $('.check_box').on("click", function() {
            textbox_toggle(this);
        });

        $('.global_check').on("click", function() {
            var type = $(this).val();
            $('#correspondenceForm').find('input[type="checkbox"]').each(function() {
                if (type == "Check all")
                    $(this).prop('checked', true);
                else if (type == "Uncheck all")
                    $(this).prop('checked', false);
                textbox_toggle(this);
            });
        });

        $('#correspondenceForm').ajaxForm({
            url: correspondenceGenerateServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                var indexArr = new Array();
                for (var i = 0; i < arr.length; ++i) {
                    if (arr[i].name == 'number_question') {
                        indexArr.push(arr[i].name);
                    } else {
                        var list = arr[i].name.split('_');
                        if (list[0] == 'question') {
                            indexArr.push(arr[i].name);
                            indexArr.push('text_' + list[1]);
                        }
                    }
                }
                var newArr = new Array();
                for (var i = 0; i < arr.length; ++i) {
                    if (indexArr.indexOf(arr[i].name) == -1) {
                        newArr.push(i);
                    }
                }
                newArr.sort(function(a,b){return b-a});
                for (var i = 0; i < newArr.length; ++i) {
                     arr.splice(newArr[i], 1);
                }
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });

            },
            success: function (jsonObj) {
                progressEnd();
                alert(jsonObj.textcontent);
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
*/

        var serviceData = getServiceContext();
        $.ajax({
            url: correspondenceSelectServiceUrl,
            data: serviceData,
            dataType: 'json',
            beforeSend: function() {
                progressStart();
            },
            success: function (jsonObj) {
                progressEnd();
                $('#correspondence-content').html(jsonObj.htmlcontent);
		//JDW
		$('.check_box').on("click", function() {
		    textbox_toggle(this);
		});

                $('.control-button').on("click", function() {
                    var cmd = $(this).attr('value');
                    if (cmd == 'Show Select Option') {
                        for (var i = 1; i < 5; i++) {
                             $('#control_button' + i).attr('value', 'Show Full Letter');
                        }
                        $('#full_letter').hide();
                        $('#select_option').show();
                    } else {
                        for (var i = 1; i < 5; i++) {
                             $('#control_button' + i).attr('value', 'Show Select Option');
                        }
                        $('#full_letter').show();
                        $('#select_option').hide();
                    }
                });

                $('.update-letter').on("click", function() {
                    var val = $('#number_question').attr('value');
                    var count = 0;
                    var major_text = '';
                    for (var i = 0; i < parseInt(val); i++) {
                        if ($('#question_' + i).is(':checked')) {
                            var title = $('#question_' + i).attr('value');
                            if ($('#majorflag_' + i).is(':checked')) {
                                count += 1;
                                major_text += '\n' + count + '. ';
                                if (title.indexOf('Free text question') == -1) {
                                    major_text += title + '\n\n';
                                }
                                major_text += $('#text_' + i).val().trim() + '\n\n';
                            }
                        }
                    }
                    var minor_text = '';
                    for (var i = 0; i < parseInt(val); i++) {
                        if ($('#question_' + i).is(':checked')) {
                            var title = $('#question_' + i).attr('value');
                            if ($('#majorflag_' + i).is(':checked')) continue;
                            count += 1;
                            minor_text += '\n' + count + '. '
                            if (title.indexOf('Free text question') == -1) {
                                minor_text += title + '\n\n'
                            }
                            minor_text += $('#text_' + i).val().trim() + '\n\n';
                        }
                    }
                    for (var i = 1; i < 5; i++) {
                         $('#control_button' + i).attr('value', 'Show Select Option');
                    }
                    var header = $('#letter_header').html().trim();
                    var mm_text = $('#minor').html().trim();
                    var rel_text = $('#minor_release').html().trim();
                    var text = '';
                    if (major_text != '') {
                        mm_text = $('#major').html().trim();
                        rel_text = $('#major_release').html().trim();
                        text = major_text + '\n\n' + $('#major_minor_addition').html().trim() + '\n\n' + minor_text;
                    } else {
                        text = minor_text;
                    }
                    var footer = $('#letter_footer').html().trim();
                    $('#full_text').val(header + '\n\n' + mm_text + '\n\n' + text + '\n\n' + rel_text + '\n\n' + footer);
                    $('#full_letter').show();
                    $('#select_option').hide();
                });

                $('.check_box_div').on("click", function() {
                    var id = $(this).attr('id');
                    var style = $('#liganddiv').attr("style");
                    if (($(this).is(':checked') && style == 'display: none;') ||
                        (!$(this).is(':checked') && style != 'display: none;')) {
                        $('#liganddiv').toggle('fast');
                    }
                });

                $('.add_context').on("click", function() {
                    list = $(this).attr('id').split('_');
                    var text_id = list[1];
                    var id = list[2];
                    if (ligandList.indexOf(id) == -1) {
                        ligandList.push(id);
                    }
                    if (ligandList.length > 0) {
                        var context = $('#ligand_template').html();
                        if (ligandList.length > 1) {
                            context = context.replace('group exists', 'groups exist');
                        }
                        for (var i = 0; i < ligandList.length; ++i) {
                             context +=  $('#ligand_' + ligandList[i]).html(); + '\n'
                        }
                        $('#question_' + text_id).prop('checked', true);
                        $('#text_' + text_id).html(context);
                    }
                });

                $('.remove_context').on("click", function() {
                    list = $(this).attr('id').split('_');
                    var text_id = list[1];
                    var id = list[2];
                    var idx = ligandList.indexOf(id);
                    if (idx != -1) {
                        ligandList.splice(idx, 1);
                    }
                    if (ligandList.length == 0) {
                        $('#question_' + text_id).prop('checked', false);
                        $('#text_' + text_id).html('');
                    } else {
                        var context = $('#ligand_template').html();
                        if (ligandList.length > 1) {
                            context = context.replace('group exists', 'groups exist');
                        }
                        for (var i = 0; i < ligandList.length; ++i) {
                             context +=  $('#ligand_' + ligandList[i]).html(); + '\n'
                        }
                        $('#text_' + text_id).html(context);
                    }
                });

                $('#correspondenceForm').ajaxForm({
                    url: correspondenceGenerateServiceUrl,
                    dataType: 'json',
		    type: 'post',
                    beforeSubmit: function (arr, $form, options) {
                        progressStart();
                        arr.push({
                            "name": "sessionid",
                            "value": sessionId
                        });
                        arr.push({
                            "name": "entryid",
                            "value": entryId
                        });
                        arr.push({
                            "name": "entryfilename",
                            "value": entryFileName
                        });
                        arr.push({
                            "name": "entryexpfilename",
                            "value": entryExpFileName
                        });
                    },
                    success: function (jsonObj) {
                        progressEnd();
                        alert(jsonObj.textcontent);
                        return false;
                    },
                    error: function (data, status, e) {
                        progressEnd();
                        alert(e);
                        return false;
                    }
                });

                $('#correspondence-content').show();

            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
    }

    <!-- coord operations -->
    if ($("#coord-dialog").length > 0) {
	//alert("coord-dialog found");

        //$.ajax({url: '/editormodule/js/jquery/plugins/jquery.jeditable.mini.js', async: false, dataType: 'script'});

        $("#coord-button-label").html(getDisplayButtonLabel());

        var chainids = '';
        var select_data = '';

        function isPDBNumber(value) {
            if (value == null || value == '' || value.match(/^[-]?\d*$/) != value) {
                 alert('Invalid number: ' + value);
                 return false;
            }
            return true;
        }

        function isPDBChainID(value) {
            if (value == null || value == '' || value.match(/^[a-zA-Z0-9]+$/) != value ||
                value.length > 4) {
                 alert('Invalid chain ID: ' + value);
                 return false;
            }
            return true;
        }

        function isAltInsCode(value, label) {
            if (value == null || value == '' || value.match(/^[?A-Za-z]$/) != value) {
                 alert('Invalid ' + label + ': ' + value);
                 return false;
            }
            return true;
        }


        function isOccupancy(value) {
            if (value == null || value == '' || value.match(/^[0-1]\.?\d*$/) != value) {
                 alert('Invalid occupancy: ' + value);
                 return false;
            }
            var f = parseFloat(value);
            if (f <= 0.0 || f > 1.0) {
                 alert('Invalid occupancy: ' + value);
                 return false;
            }
            return true;
        }
        function validate_form($form) {
            var clist = chainids.split(',');
            var existChainIds = new Object();
            for (var i = 0; i < clist.length; i++) {
                 existChainIds[clist[i]] = clist[i];
            }

            var polyChain = new Object();
            var rstatus = true;
            $form.find('input[type="text"]').each(function() {
                var id = $(this).attr('id');
                var value = $(this).attr('value').trim();
                if (value != '') {
                    var tlist = id.split('_');
                    if (tlist[0] == 'chainId') {
                        if (!isPDBChainID(value))
                            rstatus = false;
                        else if (tlist[1] == '0')
                            existChainIds[tlist[2]] = value;
                    } else if (tlist[0] == 'chainNum') {
                        if (!isPDBNumber(value)) rstatus = false;
                        if (tlist[1] == 'Polymer') {
                            if (polyChain.hasOwnProperty(tlist[3]))
                                 polyChain[tlist[3]] += 1
                            else polyChain[tlist[3]] = 1
                        }
                    } else if (tlist[0] == 'chainRangeNum') {
                        if (polyChain.hasOwnProperty(tlist[2]))
                             polyChain[tlist[2]] += 1
                        else polyChain[tlist[2]] = 1
                    }
                }
            });
   
            for (var property in polyChain) {
                 if (polyChain[property] > 1) {
                     alert('Please only fill in one of "Renumbering Polymer Starting from:"/'
                         + '"Renumbering Polymer using Range:" boxes for chain ' + property);
                     rstatus = false;
                 }
            }

            var assignChainIds = new Object();
            for (var property in existChainIds) {
                 if (assignChainIds.hasOwnProperty(existChainIds[property])) {
                     alert('Assign chain ID ' + existChainIds[property] + ' to multiple chains');
                     rstatus = false;
                 }
                 assignChainIds[existChainIds[property]] = 1
            }
            return rstatus;
        }

        $('.jshead').on("click", function() {
            var style = $(this).next().attr("style");
            $(this).next().toggle('slow');
            return false;
        });

        $('.tblhead').on("click", function() {
            var id = $(this).attr('id');
            var tblid = '#table_' + id;
            $(tblid).toggle('fast');
        });

        $('#coordEditorForm').ajaxForm({
            url: coordUpdateServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                if (!validate_form($form)) return false;
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            },
            success: function (jsonObj) {
                progressEnd();
                if (!jsonObj.errorflag) {
                    alert(jsonObj.textcontent);
                    $('#coord-content').hide();
                    $('#coord-update-button').attr('disabled','disabled');
                } else alert(jsonObj.errortext);
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });

        var serviceData = getServiceContext();
        $.ajax({
            url: coordFormServiceUrl,
            data: serviceData,
            dataType: 'json',
            beforeSend: function() {
                progressStart();
            },
            success: function (jsonObj) {
                progressEnd();
                if ("chainids" in jsonObj) chainids = jsonObj.chainids;
                if ("select" in jsonObj) select_data = jsonObj.select;
                $('#coord-content').html(jsonObj.htmlcontent);

		$('.jshead').on("click", function() {
		    $(this).next().toggle('slow');
		    return false;
		});

                $('#coord-content').show();

                $('.editable_text').editable(coordEditorSavingServiceUrl, {
	            type      : 'text',
	            cancel    : 'Cancel',
	            submit    : 'OK',
	            width     : '60px',
	            submitdata : { sessionid: sessionId, entryid: entryId },
	            onsubmit: function(settings, tag) {
	                 var value = $(tag).find('input').val();
	                 var id = $(tag).attr('id');
	                 var tlist = id.split('_');
	                 var rstatus = true;
	                 if (tlist[0] == 'resChainId')
	                     rstatus = isPDBChainID(value);
	                 else if (tlist[0] == 'resNum')
        	             rstatus = isPDBNumber(value);
                         else if (tlist[0] == 'resIns')
                             rstatus = isAltInsCode(value, 'insertion code');
	                 else if (tlist[0] == 'resLoc')
	                     rstatus = isAltInsCode(value, 'alternate location indicator');
	                 else if (tlist[0] == 'atomLoc')
	                     rstatus = isAltInsCode(value, 'alternate location indicator');
	                 else if (tlist[0] == 'atomOcc')
	                     rstatus = isOccupancy(value);
	                 if (rstatus == false) {
	                     tag.reset();
	                     return false;
	                 } else return true;
	            }
	        });

                $('.editable_select').editable(coordEditorSavingServiceUrl, { 
                    data      : select_data,
                    type      : 'select',
                    submit    : 'OK',
                    submitdata : { sessionid: sessionId, entryid: entryId }
                });

		$('.editable_select_YN').editable(coordEditorSavingServiceUrl, {
                    data      : " { 'Y':'Y', 'N':'N' } ",
                    type      : 'select',
                    submit    : 'OK',
                    submitdata : { sessionid: sessionId, entryid: entryId }
                });

            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
    } <!-- end coord dialog -->



    if ($("#check-report-dialog").length > 0) {
        if (entryFileName.length > 0) {
	    if (entryExpFileName.length > 0) {
		    $("#check-report-alt-dialog").html("Checking files: " + entryFileName + "&nbsp;" + entryExpFileName);
	    } else {
		    $("#check-report-alt-dialog").html("Checking file: " + entryFileName);
	    }
            $("#check-report-alt-dialog").show();
            $("#check-report-dialog").show();
	    
	    $('#check-report-idops-form').ajaxForm({
	        url: checkReportIdOpsUrl,
                dataType: 'json',
                success: function (jsonObj) {
		    logContext("Operation completed");
		    var errFlag = jsonObj.errorflag;
		    var errText = jsonObj.statustext;
		    if (errFlag) {
			$('#check-report-idops-form div.op-status').html(errText);
			$('#check-report-idops-form div.op-status').addClass('error-status');
		    }
		    //updateCompletionStatus(jsonObj, '#check-report-idops-form');
		    updateLinkContent(jsonObj,      '#check-report-idops-form');
		    updateReportContent(jsonObj, '#check-report-container');
		    //$('#check-report-container  div.report-content').show();
		    $('#check-report-idops-button').show();
	    	    progressEnd();
		    if ($("#consolidated-report-section").length > 0) {    
			setupSideBar();
		    }    
                },
                beforeSubmit: function (arr, $form, options) {
		    $('#check-report-idops-form div.op-status').hide();
		    $('#check-report-idops-form div.op-links').hide();
		    $('#check-report-container  div.report-content').hide();
		    
		    progressStart();
		    $('#check-report-idops-button').hide();
		    arr.push({
                        "name": "sessionid",
                        "value": sessionId
		    });
		    arr.push({
			"name": "entryid",
			"value": entryId
		    });
		    arr.push({
			"name": "entryfilename",
			"value": entryFileName
		    });
		    arr.push({
			    "name": "entryexpfilename",
			    "value": entryExpFileName
		    });

		    arr.push({
			    "name": "entrycsfilename",
			    "value": entryCsFileName
		    });

		    arr.push({
			"name": "filesource",
			"value": "session"
		    });
		    
                }
	    });
            if (autostartMode == 'y') $('#check-report-idops-button').trigger('click');
	} else { 
            $("#check-report-dialog").hide();
            $("#check-report-alt-dialog").html("No file uploaded");
            $("#check-report-alt-dialog").show();
	}
    } <!-- end of check-report-diag -->


    //   <!-- make the nav item for the current page active -->
   $('.nav a[href="' + pagePath + '"]').parent().addClass('active');
    //
    handleCLoseWindow();

}); // end-ready

