S$.ns("controllers");
controllers.ForgetPasswordController = S$.registerController((function(){
    function ForgetPasswordController() {
    }

    ForgetPasswordController.prototype.onDestroy = function() {
        if(this.ForgetPasswordView)
            S$.viewManager.removeView(this.ForgetPasswordView);
        S$.viewManager.removeView("warndialog");
    }
    
    ForgetPasswordController.prototype.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    
    ForgetPasswordController.prototype.onCreate = function() {
        var ForgetPasswordController = this;
    	S$.eventManager.registerEvent("ready", {
    		scope : this,
    		"callback" : function(type, obj) {
    			var ticketId = this.getUrlParam("t");
    			if(ticketId == null || ticketId.length == 0) {
    				$("body").css({
    		            "padding-top": "300px",
    		            "padding-bottom": "40px",
    		            "background-color": "#eee",
    		    	});
    				$("body").append('<h2 id="title">Link error, please try again.</h2>');
    				$("#title").addClass("text-center");
    				return;
    			}
    			
                this.ForgetPasswordView = S$.create(views.ForgetPasswordView, S$.call(this, function(password, confirmation, buttonDone){
                	var ticketId = this.getUrlParam("t");
                	if(ticketId == null || ticketId.length == 0) {
                		var alertView = S$.create(views.AlertView, "Link error, please try again.", "warning");
                		S$.viewManager.addView(alertView, $("body"));
                		buttonDone();
                		return;
                	}
                	if(password != confirmation) {
                		var alertView = S$.create(views.AlertView, "The confirmed password is not same as the previous password !", "warning");
                		S$.viewManager.addView(alertView, $("body"));
                		buttonDone();
                		$("#passworddiv").addClass("has-error");
                		$("#confirmdiv").addClass("has-error");
                		return;
                	}
                	if(password.length < 6 || password.length > 20) {
                		var alertView = S$.create(views.AlertView, "Your password needs to be shorter or equal than 20 and greater or equal than 6 !", "warning");
                		S$.viewManager.addView(alertView, $("body"));
                		buttonDone();
                		$("#passworddiv").addClass("has-error");
                		return;
                	}
                	password = BASE64.encoder(password);
                	confirmation = BASE64.encoder(confirmation);
                    var data = {
                        "password" : password,
                        "confirmation" : confirmation
                    };
                    data = JSON.stringify(data);
                    
                    S$.eventManager.sendEvent("network", {
                        type : "post",
                        url : "/rest/open/forgetpassword?t=" + ticketId,
                        scope : this, 
                        headers : {
                            "My-First-Header":"first value",
                        },
                        contentType : "application/json",
                        data : data,
                        success : function(jsonData) {
                        	buttonDone();
                        	$("#inputpassword").remove();
            				$("#inputConfirmation").remove();
            				$("#reset").remove();
            				$("#title").text("Reset password successfully");
            				$("#title").addClass("text-center");
            				$("#loginForm").removeClass();
            				$("body").css("padding-top", "300px");
                        },
                        failed : function(err) {
                            buttonDone();
                            var alertView = S$.create(views.AlertView, "Password Reset Invalid.", "warning");
            				S$.viewManager.addView(alertView, $("body"));
                        },
                    });
                }));
                S$.viewManager.addView(this.ForgetPasswordView, $("body"));
    		},
    	});	
    }
    
    return ForgetPasswordController;
})(), {"main" : true});
 


