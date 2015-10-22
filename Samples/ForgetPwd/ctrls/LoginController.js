S$.ns("controllers");
controllers.LoginController = S$.registerController((function(){
    function LoginController() {
    }

    LoginController.prototype.onDestroy = function() {
        if(this.loginView)
            S$.viewManager.removeView(this.loginView);
        S$.viewManager.removeView("warndialog");
    }

    LoginController.prototype.onCreate = function() {
        var loginController = this;
    	S$.eventManager.registerEvent("ready", {
    		scope : this,
    		"callback" : function(type, obj) {
                this.loginView = S$.create(views.LoginView, function(email, password, rememberMe, buttonDone){
                    password = BASE64.encoder(password);
                    var data = {
                        "account" : email,
                        "pwd" : password
                    };
                    data = JSON.stringify(data);
                    
                    S$.eventManager.sendEvent("network", {
                        type : "post",
                        url : "/rest/sys/login",
                        scope : this, 
                        headers : {
                            "My-First-Header":"first value",
                        },
                        data : data,
                        success : function(jsonData) {
                            buttonDone();
                            var count = 0;
                            if(jsonData) {
                                console.log(jsonData);   
                            }
                            var mainController = S$.create(controllers.MainController);
                            S$.handleController(mainController);

                            S$.destroyController(loginController);
                        },
                        failed : function(err) {
                            buttonDone();
                            console.log(err["description"]);
                            // var warnView = S$.create({"constructor" : views.WarnView, "id" : "warndialog"}, err["description"]);
                            // S$.viewManager.addView(warnView, $("body"));
                        },
                    });
                });
                S$.viewManager.addView(this.loginView, $("body"));
    		},
    	});	
    }
    
    return LoginController;
})(), {"main" : true});
 


