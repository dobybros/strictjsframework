StrictJs.ns("views");
views.ButtonView = S$.registerView((function(){
    //sizeLevel is 1 ~ 4, from small to big
    //style is primary, default, success, info, warning, danger, default is default
    function ButtonView(title, sizeLevel, style, glyphicon) {
        this.title = title;
        this.glyphicon = glyphicon;
        if(style !== undefined) {
            switch(style) {
                case "primary":
                case "default":
                case "success":
                case "info":
                case "warning":
                case "danger":
                this.style = "btn-" + style;
                break;
            }
        }
        if(style === undefined)
            this.style = "btn-default";

        if(typeof sizeLevel === "number") {
            if(sizeLevel > 0 && sizeLevel <= 4) {
                this.sizeLevel = sizeLevel;
            } 
        }
        if(this.sizeLevel === undefined) 
            this.sizeLevel = 3;
        this.loading = "Loading...";
    }
    
    ButtonView.prototype.setLoading = function(loading) {
        if(loading === undefined) 
            loading = "Loading...";
        this.loading = loading;
    }

    ButtonView.prototype.click = function(clickedCallback) {
        this.clickedCallback = clickedCallback;
        if(this.innerHtml !== undefined) {
            this.innerHtml.click(S$.call(this, function() {
                if(typeof this.clickedCallback === 'function') {
                    this.clickedCallback(this);
                }
            }));
        }
    }

    ButtonView.prototype.startLoading = function() {
        this.innerHtml.find(".text").text(this.loading);
        this.innerHtml.addClass("disabled");
    }

    ButtonView.prototype.stopLoading = function() {
        this.innerHtml.find(".text").text(this.title);
        this.innerHtml.removeClass("disabled");
    }

    ButtonView.prototype.onAppend = function(html, inDom) {
    	html.css({
    	});
    }
    
    ButtonView.prototype.onRemove = function(html) {
    	
    }
    
    ButtonView.prototype.toInnerHtml = function() {
        var sizeClass = ""
        switch(this.sizeLevel) {
            case 1:
                sizeClass = "btn-xs";
                break;
            case 2:
                sizeClass = "btn-sm";
                break;
            case 3:
                break;
            case 4:
                sizeClass = "btn-lg";
                break;
        }
        var glyphiconClass = "";
        if(this.glyphicon !== undefined) {
            if(this.glyphicon.indexOf("glyphicon") > -1) {
                glyphiconClass = this.glyphicon;
            } else {
                glyphiconClass = "glyphicon glyphicon-" + this.glyphicon;
            }
        }

    	var htmlArray = [
            '<button type="button" class="btn ' + this.style + ' ' + sizeClass +'">',
              '<span class="' + glyphiconClass + '" aria-hidden="true"></span>',
              '<span class="text">' + this.title + '</span>',
            '</button>',
		];
    	this.innerHtml = $(htmlArray.join(''));
    	return this.innerHtml;
    }
    
    return ButtonView;
})());