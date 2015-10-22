StrictJs.ns("views");
views.AlertView = S$.registerView((function(){
    var alertView; //Singleton. 
    //style is warning, info, success, danger, default is warning
    function AlertView(text, style, timeout) {
        this.setText(text);

        this.setStyle(style);
        this.setTimeout(timeout);
    }

    AlertView.prototype.setStyle = function(style) {
        this.style = style;
        if(this.style !== undefined)
            switch(style) {
                case "warning":
                case "info":
                case "success":
                case "danger":
                this.style = style;
                break;
            }
        if(this.style === undefined)
            this.style = "warning";

        if(this.strongText === undefined) {
            switch(this.style) {
                case "warning":
                this.strongText = "Warning!";
                break;
                case "info":
                this.strongText = "Heads up!";
                break;
                case "success":
                this.strongText = "Well done!";
                break;
                case "danger":
                this.strongText = "Oh snap!";
                break;
            }
        }
        return this;
    }

    AlertView.prototype.setText = function(text, strongText) {
        if(strongText !== undefined) {
            this.strongText = strongText;
        }
        if(text !== undefined)
            this.text = text;
        return this;
    }

    AlertView.prototype.setTimeout = function(timeout) {
        this.timeout = timeout;
        if(this.timeout === undefined) 
            this.timeout = 5;
        return this;
    }

    AlertView.prototype.onAppend = function(html, inDom) {
        var width = window.innerWidth * 0.5;

    	html.find(".alert").css({
            'margin-left': '-' + (width / 2) + 'px',
            'position': 'absolute',
            'width': width + 'px',
            'top': '10px',
            'left': '50%',
            'text-align': 'center',
            'z-index' : 2000,
    	});
        if(alertView !== undefined) {
            S$.viewManager.removeView(alertView);
            alertView = undefined;
        }
        alertView = this;

        if(this.timeout !== undefined) {
            var timer = setInterval(S$.call(this, function(){
                S$.viewManager.removeView(this);

                var t = this.getParameterMap().get("timer");
                clearInterval(t);
                // alert("clear timer for " + this.getId());
            }), this.timeout * 1000);
            alertView.getParameterMap().put("timer", timer);
        }
    }
    
    AlertView.prototype.onRemove = function(html) {
        if(alertView === this) {
            var t = this.getParameterMap().get("timer");
            clearInterval(t);
            alertView = undefined;
        }
    }
    
    AlertView.prototype.toInnerHtml = function() {
        if(this.style !== undefined) {
            styleClass = "alert-" + this.style;
        }

    	var htmlArray = [
            '<nav class="navbar navbar-fixed-top">',
                '<div class="alert ' + styleClass + ' alert-dismissible" role="alert">',
                    '<button id="closebutton" type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>',
                    '<div id="texthtml">',
                        '<strong>' + this.strongText + '</strong> ' + this.text,
                    '</div>',
                '</div>',
            '</nav>',
		];
    	this.innerHtml = $(htmlArray.join(''));
        this.innerHtml.find("#closebutton").on('click', S$.call(this, function(){
            S$.viewManager.removeView(this);
        }));
    	return this.innerHtml;
    }
    
    return AlertView;
})());