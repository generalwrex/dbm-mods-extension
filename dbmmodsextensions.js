'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs     = require('fs');
const path   = require('path');
var liveServer = require("live-server");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    console.log('DBM Mods Extensions Loaded!');
    let changedEvent;
    let disposable = vscode.commands.registerCommand('dbmmodsextensions.loadMod', function () {

        try {
            if(vscode.window.activeTextEditor){

                const modFileName = vscode.window.activeTextEditor.document.fileName;
                console.log(`Loading Mod: ${modFileName}`);

                let mod = require(modFileName);
                let html;
                let newHTML;

                const tmpFolder = path.join(require('os').tmpdir(), 'dbmmod');
                const tmpFile = mod.name.replace(' ', '_') + `.temp.html` ;
                          

                if(!fs.existsSync(tmpFolder))
                {
                  fs.mkdirSync(tmpFolder);
                }

                console.log(`Setting Temp Mod: ${path.join(tmpFolder, tmpFile)}`);

                if(mod && mod.name && mod.html){              
                    vscode.window.showInformationMessage(`${mod.name} loaded into DBM Mods Extensions`);
                  
                    const buildFile = function(modFile){
                      delete require.cache[require.resolve(modFile)];
                      mod = require(modFile);
                      html = mod.html(false, data);  

                      var entire = mod.init.toString(); 
                      var body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));



                      html += `\n<script>  



document.addEventListener("DOMContentLoaded", function(event) {
  this.glob = {};
  this.document = document;

  this.glob.variableChange = function(element, id){
      var idEle = document.getElementById(id);
      if(idEle) idEle.style.display = "";     
  };  
  
  try {
     ${body}            
  } catch (error) {
    console.error(error);
  }
  
         
});
                      </script>\n`;


                      console.log(`Building Mod HTML..`);
                      fs.writeFileSync(path.join(tmpFolder, tmpFile), buildHTML(mod.name, html));
                    }
                    changedEvent = vscode.workspace.onDidSaveTextDocument(e =>  buildFile(modFileName));

                    buildFile(modFileName);
                    console.log(`Wrote Temp File..`);
                    if(fs.existsSync(path.join(tmpFolder, tmpFile))) {
                        loadIntoServer(tmpFolder,'./' + tmpFile);                      
                        vscode.window.showInformationMessage(`${mod.name} loaded into your Browser!`);
                    }
                }                     
            } 
        } catch (error) {
            console.error(error.stack ? error.stack : error);
        }         
    });
    context.subscriptions.push(changedEvent);
    context.subscriptions.push(disposable);
}
exports.activate = activate;



// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function loadIntoServer(filePath, file){
  
    var params = {
        port: 8181, // Set the server port. Defaults to 8080.
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: filePath, // Set root directory that's being served. Defaults to cwd.
        open: true, // When false, it won't load your browser by default.
        ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        file: file, // When set, serve this file for every 404 (useful for single-page applications)
        wait: 500, // Waits for all changes, before reloading. Defaults to 0 sec.
        mount: [['/components', './node_modules']], // Mount a directory to a route.
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
        middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
    };
    liveServer.start(params);
    console.log(`Mod HTML is being served locally.`);
}

var data = {
    sendTargets: [
      '<option value="0" selected>Same Channel</option><option value="1">Command Author</option><option value="2">Mentioned User</option><option value="3">Mentioned Channel</option><option value="4">Default Channel</option><option value="5">Temp Variable</option><option value="6">Server Variable</option><option value="7">Global Variable</option>',
      '<option value="4" selected>Default Channel</option><option value="5">Temp Variable</option><option value="6">Server Variable</option><option value="7">Global Variable</option>'
    ],
    members: [
      '<option value="0" selected>Mentioned User</option><option value="1">Command Author</option><option value="2">Temp Variable</option><option value="3">Server Variable</option><option value="4">Global Variable</option>',
      '<option value="2" selected>Temp Variable</option><option value="3">Server Variable</option><option value="4">Global Variable</option>'
    ],
    roles: [
      '<option value="0" selected>Mentioned Role</option><option value="1">1st Author Role</option><option value="2">1st Server Role</option><option value="3">Temp Variable</option><option value="4">Server Variable</option><option value="5">Global Variable</option>',
      '<option value="2" selected>1st Server Role</option><option value="3">Temp Variable</option><option value="4">Server Variable</option><option value="5">Global Variable</option>'
    ],
    channels: [
      '<option value="0" selected>Same Channel</option><option value="1">Mentioned Channel</option><option value="2">Default Channel</option><option value="3">Temp Variable</option><option value="4">Server Variable</option><option value="5">Global Variable</option>',
      '<option value="2" selected>Default Channel</option><option value="3">Temp Variable</option><option value="4">Server Variable</option><option value="5">Global Variable</option>'
    ],
    voiceChannels: [
      '<option value="0" selected>Command Author\'s Voice Ch.</option><option value="1">Mentioned User\'s Voice Ch.</option><option value="2">Default Voice Channel</option><option value="3">Temp Variable</option><option value="4">Server Variable</option><option value="5">Global Variable</option>',
      '<option value="2">Default Voice Channel</option><option value="3">Temp Variable</option><option value="4">Server Variable</option><option value="5">Global Variable</option>'
    ],
    variables: [
      '<option value="0" selected>Nothing</option><option value="1">Temp Variable</option><option value="2">Server Variable</option><option value="3">Global Variable</option>',
      '<option value="1" selected>Temp Variable</option><option value="2">Server Variable</option><option value="3">Global Variable</option>'
    ],
    messages: [
      '<option value="0" selected>Command Message</option><option value="1">Temp Variable</option><option value="2">Server Variable</option><option value="3">Global Variable</option>',
      '<option value="1" selected>Temp Variable</option><option value="2">Server Variable</option><option value="3">Global Variable</option>'
    ],
    servers: [
      '<option value="0" selected>Current Server</option><option value="1">Temp Variable</option><option value="2">Server Variable</option><option value="3">Global Variable</option>',
      '<option value="0" selected>Current Server</option><option value="1">Temp Variable</option><option value="2">Server Variable</option><option value="3">Global Variable</option>'
    ],
    lists: [
      '<option value="0" selected>Server Members</option><option value="1">Server Channels</option><option value="2">Server Roles</option><option value="3">Server Emojis</option><option value="4">All Bot Servers</option><option value="5">Mentioned User Roles</option><option value="6">Command Author Roles</option><option value="7">Temp Variable</option><option value="8">Server Variable</option><option value="9">Global Variable</option>',
      '<option value="0" selected>Server Members</option><option value="1">Server Channels</option><option value="2">Server Roles</option><option value="3">Server Emojis</option><option value="4">All Bot Servers</option><option value="7">Temp Variable</option><option value="8">Server Variable</option><option value="9">Global Variable</option>'
    ],
    conditions: [
      '<div style="float: left; width: 35%;">If True:<br><select id="iftrue" class="round" onchange="glob.onChangeTrue(this)"><option value="0" selected>Continue Actions</option><option value="1">Stop Action Sequence</option><option value="2">Jump To Action</option><option value="3">Skip Next Actions</option></select></div><div id="iftrueContainer" style="display: none; float: right; width: 60%;"><span id="iftrueName">Action Number</span>:<br><input id="iftrueVal" class="round" type="text"></div></div><br><br><br><div style="padding-top: 8px;"><div style="float: left; width: 35%;">If False:<br><select id="iffalse" class="round" onchange="glob.onChangeFalse(this)"><option value="0">Continue Actions</option><option value="1" selected>Stop Action Sequence</option><option value="2">Jump To Action</option><option value="3">Skip Next Actions</option></select></div><div id="iffalseContainer" style="display: none; float: right; width: 60%;"><span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>'
    ],
    permissions: [
      '<option value="CREATE_INSTANT_INVITE">Create Instant Invite</option><option value="MANAGE_PERMISSIONS">Manage Permissions</option><option value="MANAGE_CHANNELS">Manage Channel</option><option value="MANAGE_WEBHOOKS">Manage Webhooks</option><option value="READ_MESSAGES">Read Messages</option><option value="SEND_MESSAGES">Send Messages</option><option value="SEND_TTS_MESSAGES">Send TTS Messages</option><option value="MANAGE_MESSAGES">Manage Messages</option><option value="EMBED_LINKS">Embed Links</option><option value="ATTACH_FILES">Attach Files</option><option value="READ_MESSAGE_HISTORY">Read Message History</option><option value="MENTION_EVERYONE">Mention Everyone</option><option value="USE_EXTERNAL_EMOJIS">Use External Emojis</option><option value="ADD_REACTIONS">Add Reactions</option>',
      '<option value="CREATE_INSTANT_INVITE">Create Instant Invite</option><option value="MANAGE_PERMISSIONS">Manage Permissions</option><option value="MANAGE_CHANNELS">Manage Channel</option><option value="MANAGE_WEBHOOKS">Manage Webhooks</option><option value="CONNECT">Connect to Voice</option><option value="SPEAK">Speak in Voice</option><option value="MUTE_MEMBERS">Mute Members</option><option value="DEAFEN_MEMBERS">Defean Members</option><option value="MOVE_MEMBERS">Move Members</option><option value="USE_VAD">Use VAD</option>',
      '<option value="ADMINISTRATOR">Administrator</option><option value="MANAGE_GUILD">Manage Guild</option><option value="MANAGE_NICKNAMES">Manage Nicknames</option><option value="MANAGE_ROLES">Manage Roles</option><option value="MANAGE_EMOJIS">Manage Emojis</option><option value="KICK_MEMBERS">Kick Members</option><option value="BAN_MEMBERS">Ban Members</option><option value="VIEW_AUDIT_LOG">View Audit Log</option><option value="CHANGE_NICKNAME">Change Nickname</option><option value="CREATE_INSTANT_INVITE">Create Instant Invite</option><option value="MANAGE_PERMISSIONS">Manage Permissions</option><option value="MANAGE_CHANNELS">Manage Channel</option><option value="MANAGE_WEBHOOKS">Manage Webhooks</option><option value="READ_MESSAGES">Read Messages</option><option value="SEND_MESSAGES">Send Messages</option><option value="SEND_TTS_MESSAGES">Send TTS Messages</option><option value="MANAGE_MESSAGES">Manage Messages</option><option value="EMBED_LINKS">Embed Links</option><option value="ATTACH_FILES">Attach Files</option><option value="READ_MESSAGE_HISTORY">Read Message History</option><option value="MENTION_EVERYONE">Mention Everyone</option><option value="USE_EXTERNAL_EMOJIS">Use External Emojis</option><option value="ADD_REACTIONS">Add Reactions</option><option value="CONNECT">Connect to Voice</option><option value="SPEAK">Speak in Voice</option><option value="MUTE_MEMBERS">Mute Members</option><option value="DEAFEN_MEMBERS">Defean Members</option><option value="MOVE_MEMBERS">Move Members</option><option value="USE_VAD">Use VAD</option>'
    ]
  };
  
function buildHTML(name, insert){
  return ` <html>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.11.8/semantic.min.css"/>
	<head>
		<meta charset="UTF-8">
	</head>
  <body>
  <div style="width: 570px; height: 490px; margin-left: auto; margin-right: auto;"><html><head><meta charset="UTF-8"></head><body style="height: 490px;"><div id="leSideBar" class="ui left inverted sidebar" style="background-color: #242629;"><div id="leSideBarContent"></div></div><div class="pusher"> <div id="theHead"><div style="text-align: center;"><br><div style="width: 100%;"><button id="action-label" class="ui icon button" onclick="openSidebar()">${name}</button></div><br></div></div><div class="action-input"><div id="action-main">`+insert+`</div><div class="action-footer"><button id="createAction" class="tiny ui labeled icon button" onclick="finish()"><i class="plus icon"></i>Create Action</button></div></div><div class="ui modal" style="width: 540px; height: 300px; overflow-y: scroll;" id="scrollArea"></div></body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.11.8/semantic.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.js"></script>
  <style>
  body,div.tabs,select#actions,select#commands{overflow:hidden}input:focus,textarea:focus{outline-width:0}.action-main{position:relative}p#settings-description{color:#222}.ui.multiple.dropdown>.label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;vertical-align:top;white-space:normal;font-size:1em;padding:.35714286em .78571429em;margin:.14285714rem .28571429rem .14285714rem 0;box-shadow:0 0 0 1px rgba(34,36,38,.15) inset}body{color:#ccc;background-color:#36393e;transition:.5s}body.running{background-color:#001427!important}a:link{color:#99b3ff}div.action-holder,div.event-action-holder{width:240px;float:left;max-width:240px;padding-top:22px}select#commands{height:120px}select#actions{position:static}div.footer{position:static;float:right;width:100%;height:100%;right:0;bottom:100px;left:220px;text-align:left}div.infooter{padding-top:49px}div.einfooter{padding-top:77px}div.actionButtonDiv{width:90%;padding:10px 10px 10px 0;text-align:left}button.actionButtons{width:120px;padding-right:20px;padding-left:20px;float:right}div.emyactions button,div.myactions button,div.tabs button{float:left;outline:0;cursor:pointer;transition:.2s}div.tabs{border:1px solid #ccc;background-color:#f1f1f1}div.tabs button{width:33%;background-color:inherit;border:none;padding:12px 20px}div.tabs button:hover{background-color:#ddd}div.tabs button.active{background-color:#ccc}div.myactions{overflow-y:auto;overflow-x:hidden;border:1px solid #ccc;background-color:#53585f}div.myactions button{overflow:hidden;width:100%;height:20px;text-align:left;color:#e3e5e8;background-color:#53585f;border:none}div.myactions button:hover{background-color:#777e88}div.myactions button.active{background-color:#4676b9}div.emyactions{overflow:auto;overflow-x:hidden;border:1px solid #ccc;background-color:#53585f}div.emyactions button{overflow:hidden;width:100%;height:20px;text-align:left;color:#e3e5e8;background-color:#53585f;border:none}div.emyactions button:hover{background-color:#777e88}button#a_tab,div.emyactions button.active{background-color:#4676b9}input,select,textarea{color:#e3e5e8;background-color:#53585f}.page{display:none}input{padding-bottom:2px}textarea{border:1px solid #eee;border-radius:4px;box-sizing:border-box;display:block;padding-left:8px}input#alias-input,input#ename,input#etemp,input#etemp2,input#name,input.settings{border:1px solid #eee;box-sizing:border-box;display:block;height:28px;padding-left:8px}textarea::selection{background:#b8dbff}button#a_tab.active,button#a_tab.active:hover{background-color:#315381}button#a_tab:hover{background-color:#3f6aa6}input::selection{background:#b8dbff}input#alias-input,input#ename,input#etemp,input#etemp2,input#name{border-radius:4px}input.settings{font-family:monospace;width:100%;border-radius:4px}input.round,select.round{width:100%;border:1px solid #eee;border-radius:4px;box-sizing:border-box;display:block;height:28px;padding-left:8px}::-webkit-scrollbar{width:8px;height:8px;background-color:#36393e}::-webkit-scrollbar-track{background-color:#36393e}::-webkit-scrollbar-thumb{background-color:#e0e1e2}#aliases,#moduleManager{height:380px;border-radius:10px;background-color:#36393e;border:2px solid #000}button.opener,button.openerChild{color:#eee;width:100%;border:none;text-align:left;outline:0;cursor:pointer}.modalChild{height:240px;margin-left:70px;margin-top:15px;overflow-y:scroll}#action-label{padding:10px 15px;cursor:pointer;outline:0}button.opener{background-color:#36393e;padding:8px;font-size:14px;transition:.4s}button.openerChild{background-color:#474b52;padding:6px;font-size:12px}button.opener:after,button.openerChild:after{color:#777;font-weight:700;float:right;margin-left:5px}button.openerChild.active,button.openerChild:hover{background-color:#53585f}button.opener:after{content:'+'}button.opener.active:after{content:"-"}div.dropContent{background-color:#fff;max-height:0;overflow:hidden;transition:max-height .2s ease-out}#theHead,.action-footer{background-color:#242629;text-align:center}.ui.dropdown{text-align:center;width:200px}input[type=text]{width:90%}.action-input{margin:0 auto;padding-top:6px;max-width:640px;width:94%;height:80%}.action-input h1{margin-top:0}#theHead{right:0;top:0;left:0}.action-footer{width:570px;position:absolute;margin-left:auto;margin-right:auto;top:431px;padding:1rem}#leSideBarContent{margin-right:10px;width:220px}#leSideBar{width:232px;margin:10px}#leSideBar::-webkit-scrollbar{width:12px;background-color:#242629}#leSideBar::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);border-radius:10px;background-color:#242629}#leSideBar::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);background-color:#555}input::-webkit-calendar-picker-indicator{opacity:100;background-color:transparent;transform:scale(.7,.7)}input::-webkit-calendar-picker-indicator:hover{background-color:transparent}.emojiButton{width:36px;height:36px;padding:2px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;margin:4px 2px;-webkit-transition-duration:.4s;transition-duration:.4s;cursor:pointer;background-color:#fff;color:#000;border:2px solid #4CAF50}.emojiButton:hover{background-color:#4CAF50;color:#fff}.row{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px;padding-right:15px;padding-left:15px}.col{-ms-flex-preferred-size:0;flex-basis:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;max-width:100%}.col-1,.col-auto{-webkit-box-flex:0}.col-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:none}.col-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-2,.col-3{-webkit-box-flex:0}.col-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-4,.col-5{-webkit-box-flex:0}.col-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-6,.col-7{-webkit-box-flex:0}.col-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-8,.col-9{-webkit-box-flex:0}.col-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-10,.col-11{-webkit-box-flex:0}.col-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-12{-webkit-box-flex:0;-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.mt-0,.my-0{margin-top:0!important}.mr-0,.mx-0{margin-right:0!important}.mb-0,.my-0{margin-bottom:0!important}.ml-0,.mx-0{margin-left:0!important}.m-1{margin:.25rem!important}.mt-1,.my-1{margin-top:.25rem!important}.mr-1,.mx-1{margin-right:.25rem!important}.mb-1,.my-1{margin-bottom:.25rem!important}.ml-1,.mx-1{margin-left:.25rem!important}.m-2{margin:.5rem!important}.mt-2,.my-2{margin-top:.5rem!important}.mr-2,.mx-2{margin-right:.5rem!important}.mb-2,.my-2{margin-bottom:.5rem!important}.ml-2,.mx-2{margin-left:.5rem!important}.m-3{margin:1rem!important}.mt-3,.my-3{margin-top:1rem!important}.mr-3,.mx-3{margin-right:1rem!important}.mb-3,.my-3{margin-bottom:1rem!important}.ml-3,.mx-3{margin-left:1rem!important}.m-4{margin:1.5rem!important}.mt-4,.my-4{margin-top:1.5rem!important}.mr-4,.mx-4{margin-right:1.5rem!important}.mb-4,.my-4{margin-bottom:1.5rem!important}.ml-4,.mx-4{margin-left:1.5rem!important}.m-5{margin:3rem!important}.mt-5,.my-5{margin-top:3rem!important}.mr-5,.mx-5{margin-right:3rem!important}.mb-5,.my-5{margin-bottom:3rem!important}.ml-5,.mx-5{margin-left:3rem!important}.p-0{padding:0!important}.pt-0,.py-0{padding-top:0!important}.pr-0,.px-0{padding-right:0!important}.pb-0,.py-0{padding-bottom:0!important}.pl-0,.px-0{padding-left:0!important}.p-1{padding:.25rem!important}.pt-1,.py-1{padding-top:.25rem!important}.pr-1,.px-1{padding-right:.25rem!important}.pb-1,.py-1{padding-bottom:.25rem!important}.pl-1,.px-1{padding-left:.25rem!important}.p-2{padding:.5rem!important}.pt-2,.py-2{padding-top:.5rem!important}.pr-2,.px-2{padding-right:.5rem!important}.pb-2,.py-2{padding-bottom:.5rem!important}.pl-2,.px-2{padding-left:.5rem!important}.p-3{padding:1rem!important}.pt-3,.py-3{padding-top:1rem!important}.pr-3,.px-3{padding-right:1rem!important}.pb-3,.py-3{padding-bottom:1rem!important}.pl-3,.px-3{padding-left:1rem!important}.p-4{padding:1.5rem!important}.pt-4,.py-4{padding-top:1.5rem!important}.pr-4,.px-4{padding-right:1.5rem!important}.pb-4,.py-4{padding-bottom:1.5rem!important}.pl-4,.px-4{padding-left:1.5rem!important}.p-5{padding:3rem!important}.pt-5,.py-5{padding-top:3rem!important}.pr-5,.px-5{padding-right:3rem!important}.pb-5,.py-5{padding-bottom:3rem!important}.pl-5,.px-5{padding-left:3rem!important}.m-auto{margin:auto!important}.mt-auto,.my-auto{margin-top:auto!important}.mr-auto,.mx-auto{margin-right:auto!important}.mb-auto,.my-auto{margin-bottom:auto!important}.ml-auto,.mx-auto{margin-left:auto!important}
  </style>
  </html>`;
}

