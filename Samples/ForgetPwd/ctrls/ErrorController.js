S$.ns("controllers");
controllers.ErrorController = S$.registerController((function(){
    function ErrorController() {
    }
    
    ErrorController.prototype.onCreate = function() {
        this.registerEvent("error", {
            callback : function(type, obj) {
                var parent = $("body");
                var alertView = S$.create(views.AlertView, obj["text"], obj["type"], obj["timeout"]);
                S$.viewManager.addView(alertView, parent);
            },
            scope : this,
        });
    }

    return ErrorController;
})(), {"main" : true});
		


