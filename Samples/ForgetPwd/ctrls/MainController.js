S$.ns("controllers");
controllers.MainController = S$.registerController((function(){
    var sideBarView;
    var sectionTableView;
    var chatServersContentView;
    var reportContentView;
    function MainController() {
    }
    
    MainController.prototype.onCreate = function() {
        // S$.eventManager.registerEvent("ready", {
        //     scope : this,
        //     "callback" : function(type, obj) {
        //     }
        // });
        $("body").css({
            "padding-top": "50px",
        })
    	var navBarView = S$.create(views.NavBarView, "Balancer Console");
        S$.viewManager.addView(navBarView, $("body"));

        sideBarView = S$.create(views.SideBarView);
        S$.viewManager.addView(sideBarView, $("body"));
        sideBarView.addItem("Chat Servers", "chatservers", true, S$.call(this, this.showChatServersView));
        sideBarView.addItem("Report", "report", false, S$.call(this, this.showReportView));
    }
    
    MainController.prototype.showChatServersView = function(id, name) {
        if(chatServersContentView === undefined) {
            chatServersContentView = S$.create(views.ContentView, name);
            sideBarView.setContentView(chatServersContentView);

            sectionTableView = S$.create(views.SectionTableView, "Servers List");
            chatServersContentView.setSectionView(sectionTableView);

            sectionTableView.setHeaders(this.getHeaders());
            // sectionTableView.addRow("1", ["1", "3", "3"]);
            // sectionTableView.addRow("11", ["11", "3", "3fadsfasdfasdfdsafdsafdsfdasfadsfsdfsdfadsfasdf"]);
            // sectionTableView.addRow("12", ["12", "3", "3"]);
            // sectionTableView.addRow("13", ["13", "3", "3"]);
            // sectionTableView.addRow("14", ["14", "3", "3"]);
            // sectionTableView.addRow("15", ["15", "3", "3"]);
            // sectionTableView.addRow("16", ["156", "3", "3"]);
            // sectionTableView.addRow("17", ["16", "3", "3"]);
            // sectionTableView.addRow("18", ["17", "3", "3"]);

            sectionTableView.addTitleBarButton("Refresh", S$.call(this, function(buttonView) {
                this.refreshServerList(buttonView);
            }));

            sectionTableView.addTitleBarButton("Reload", S$.call(this, function(buttonView) {
                this.reloadServerList(buttonView);
            }));
        } else {
            sideBarView.setContentView(chatServersContentView);
        }
    }

    MainController.prototype.showReportView = function(id, name) {
        if(reportContentView === undefined)
            reportContentView = S$.create(views.ContentView, name);
        sideBarView.setContentView(reportContentView);
    }

    MainController.prototype.getHeaders = function(obj) {
        var fields = ["Server", "Domain", "Online Count", "ip", "port", "Score", "Desp", "Time", "Status", "Operations"];
        return fields;
    }

    MainController.prototype.refreshTable = function(servers) {
        sectionTableView.removeAllRows();
        for(var i = 0; i < servers.length; i++) {
            var obj = servers[i];
            var rowData = this.getRow(obj);
            var rowId = this.getRowId(obj);
            var domain = this.getDomain(obj);

            //prepare buttons
            var buttonSize = 2;
            var startButton = S$.create(views.ButtonView, "Start", buttonSize);
            startButton.getParameterMap().append("rowId", rowId).append("domain", domain);
            var shutdownButton = S$.create(views.ButtonView, "Shutdown", buttonSize);
            shutdownButton.getParameterMap().append("rowId", rowId);
            var deleteButton = S$.create(views.ButtonView, "Delete", buttonSize);
            deleteButton.getParameterMap().append("rowId", rowId);
            rowData.push([startButton, shutdownButton, deleteButton]);
            sectionTableView.addRow(rowId, rowData);

            //prepare button callbacks
            startButton.click(S$.call(this, function(buttonView) {
                var startDialog = S$.create(views.DialogView, "Start Chat Server");
                S$.viewManager.addView(startDialog, $("body"));

                var closeButton = S$.create(views.ButtonView, "Close", 3, "default");
                startDialog.addButton(closeButton);
                closeButton.click(S$.call(this, function(buttonView) {
                    startDialog.hide();
                }));

                var button = S$.create(views.ButtonView, "Start", 3, "primary");
                startDialog.addButton(button);

                startDialog.addText("Please provide the chat domain to start chat server. ");

                startDialog.addInput("Chat domain", "domainInput");

                button.getParameterMap().copy(buttonView.getParameterMap());
                button.click(S$.call(this, function(buttonView) {
                    var server = buttonView.getParameterMap().get("rowId");
                    // var domain = buttonView.getParameterMap().get("domain");
                    var domain = startDialog.getInputValue("domainInput");
                    this.startServer(server, domain, startDialog, buttonView);
                    console.log(startDialog.getInputValue("domainInput") + " server " + server + " domain " + domain);
                }));

                startDialog.show();
            }));

            shutdownButton.click(S$.call(this, function(buttonView) {
                var shutdownDialog = S$.create(views.DialogView, "Shutdown Chat Server");
                S$.viewManager.addView(shutdownDialog, $("body"));

                var closeButton = S$.create(views.ButtonView, "Close", 3, "default");
                shutdownDialog.addButton(closeButton);
                closeButton.click(S$.call(this, function(buttonView) {
                    shutdownDialog.hide();
                }));

                var button = S$.create(views.ButtonView, "Shutdown", 3, "danger");
                shutdownDialog.addButton(button);

                shutdownDialog.addText("Do you really want to shutdown server " + buttonView.getParameterMap().get("rowId") + "?");

                button.getParameterMap().copy(buttonView.getParameterMap());
                button.click(S$.call(this, function(buttonView) {
                    var server = buttonView.getParameterMap().get("rowId");
                    // var domain = buttonView.getParameterMap().get("domain");
                    this.shutdownServer(server, shutdownDialog, buttonView);
                }));

                shutdownDialog.show();
            }));

            deleteButton.click(S$.call(this, function(buttonView) {
                var deleteDialog = S$.create(views.DialogView, "Delete obsoleted Chat Server");
                S$.viewManager.addView(deleteDialog, $("body"));

                var closeButton = S$.create(views.ButtonView, "Close", 3, "default");
                deleteDialog.addButton(closeButton);
                closeButton.click(S$.call(this, function(buttonView) {
                    deleteDialog.hide();
                }));

                var button = S$.create(views.ButtonView, "Delete", 3, "danger");
                deleteDialog.addButton(button);

                deleteDialog.addText("Do you really want to delete the OBSOLETED SERVER " + buttonView.getParameterMap().get("rowId") + "? Before delete, you MUST make sure it is really OBSOLETED SERVER! ");

                button.getParameterMap().copy(buttonView.getParameterMap());
                button.click(S$.call(this, function(buttonView) {
                    var server = buttonView.getParameterMap().get("rowId");
                    // var domain = buttonView.getParameterMap().get("domain");
                    this.deleteObsoleted(server, deleteDialog, buttonView);
                }));

                deleteDialog.show();
            }));
        }
    }

    MainController.prototype.getRowId = function(obj) {
        var field = "server";
        var rowId = obj[field];
        return rowId;
    }

    MainController.prototype.getDomain = function(obj) {
        var field = "domain";
        var value = obj[field];
        return value;
    }

    MainController.prototype.getRow = function(obj) {
        var fields = ["server", "domain", "ocount", 
            "ip", "port", "score", "desp", 
            "takes^utils.getMillisecond|ctime^utils.getTime", 
            "status^utils.getStatusOnBalancer|changing^utils.getChangingOnBalancer|statusOnServer^utils.getStatusOnChatServer|changingOnServer^utils.getChangingOnChatServer"];
        var rowData = [];
        for(var i = 0; i < fields.length; i++) {
            var array = fields[i].split("|");
            var str = "";
            for(var j = 0; j < array.length; j++) { 
                var valueCombineArray = array[j].split("^");
                var value = obj[valueCombineArray[0]];
                var method = undefined;
                if(valueCombineArray.length >= 2) {
                    method = valueCombineArray[1];
                }
                if(value !== undefined) {
                    if(method !== undefined) {
                        str = str.concat(eval(method)(value));
                    } else {
                        str = str.concat(value);
                    }
                } else {
                    str = str.concat("null");
                }
                if(j < array.length - 1) 
                    str = str.concat("<br/>");
            }
            rowData.push(str);
        }
        return rowData;
    }

    MainController.prototype.reloadServerList = function(buttonView) {
        buttonView.startLoading();
        S$.eventManager.sendEvent("network", {
                type : "post",
                url : "/rest/apis/monitor/reload",
                scope : this, 
                success : function(jsonData) {
                    buttonView.stopLoading();
                    this.refreshTable(jsonData["servers"]);
                },
                failed : function(err) {
                    buttonView.stopLoading();
                    console.log(err["description"]);
                },
            });
    }

    MainController.prototype.refreshServerList = function(buttonView) {
        buttonView.startLoading();
        S$.eventManager.sendEvent("network", {
                type : "post",
                url : "/rest/apis/monitor/refresh",
                scope : this, 
                success : function(jsonData) {
                    buttonView.stopLoading();
                    this.refreshTable(jsonData["servers"]);
                },
                failed : function(err) {
                    buttonView.stopLoading();
                    console.log(err["description"]);
                },
            });
    }

    MainController.prototype.startServer = function(server, domain, dialogView, buttonView) {
        buttonView.startLoading();
        dialogView.disableButtons();
        var data = {"domain" : domain};
        data = JSON.stringify(data);
        S$.eventManager.sendEvent("network", {
            type : "post",
            url : "/rest/apis/monitor/" + server + "/start",
            data : data, 
            scope : this, 
            success : function(jsonData) {
                var alertView = S$.create(views.AlertView, "Start server " + server + " successfully", "success");
                S$.viewManager.addView(alertView, $("body"));
            },
            failed : function(err) {
            },
            done : function() {
                buttonView.stopLoading();
                dialogView.enableButtons();
                dialogView.hide();
            }
        });
    }

    MainController.prototype.shutdownServer = function(server, dialogView, buttonView) {
        buttonView.startLoading();
        dialogView.disableButtons();
        S$.eventManager.sendEvent("network", {
            type : "post",
            url : "/rest/apis/monitor/" + server + "/shutdown",
            scope : this, 
            success : function(jsonData) {
                var alertView = S$.create(views.AlertView, "Server " + server + " is shutting down...", "success");
                S$.viewManager.addView(alertView, $("body"));
            },
            failed : function(err) {
            },
            done : function() {
                buttonView.stopLoading();
                dialogView.enableButtons();
                dialogView.hide();
            }
        });
    }

    MainController.prototype.deleteObsoleted = function(server, dialogView, buttonView) {
        buttonView.startLoading();
        dialogView.disableButtons();
        S$.eventManager.sendEvent("network", {
            type : "post",
            url : "/rest/apis/monitor/" + server + "/delete",
            scope : this, 
            success : function(jsonData) {
                var alertView = S$.create(views.AlertView, "The obsoleted server " + server + " has been deleted.", "success");
                S$.viewManager.addView(alertView, $("body"));
            },
            failed : function(err) {
            },
            done : function() {
                buttonView.stopLoading();
                dialogView.enableButtons();
                dialogView.hide();
            }
        });
    }

    return MainController;
})());
 


