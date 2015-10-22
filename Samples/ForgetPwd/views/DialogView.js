StrictJs.ns("views");
views.DialogView = S$.registerView((function(){
    //sizeLevel is 1 ~ 4, from small to big
    function DialogView(title) {
        this.title = title;
        
    }

    DialogView.prototype.onAppend = function(html, inDom) {
    	html.css({
    	});
    }
    
    DialogView.prototype.onRemove = function(html) {
    	
    }
    
    DialogView.prototype.toInnerHtml = function() {
    	var htmlArray = [
            '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
              '<div class="modal-dialog">',
                '<div class="modal-content">',
                  '<div class="modal-header">',
                    '<button id="closebutton" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                    '<h4 class="modal-title" id="myModalLabel">' + this.title + '</h4>',
                  '</div>',
                  '<div class="modal-body">',
                  '</div>',
                  '<div class="modal-footer">',
                    // '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
                    // '<button type="button" class="btn btn-primary">Save changes</button>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
		];
    	this.innerHtml = $(htmlArray.join(''));
        this.innerHtml.find("#closebutton").on('click', S$.call(this, function(){
            this.hide();
        }));
    	return this.innerHtml;
    }
    
    DialogView.prototype.addText = function(text, id) {
        var span;
        if(id === undefined) {
            span = "<p>";
        } else {
            span = "<p id='" + this.getId() + "_text_"  + id + "'>";
        }
        this.innerHtml.find(".modal-body").append(span + text + "</p>");
    }

    DialogView.prototype.removeText = function(id) {
        this.innerHtml.find("#" + this.getId() + "_text_"  + id).remove();
    }

    DialogView.prototype.addInput = function(title, id) {
        var theId = this.getId() + '_input_' + id;
        var theInputId = theId + "_input";
        var inputArray = [
            '<div id=' + theId + ' class="form-group">',
                '<label for="' + theInputId + '" class="control-label">' + title + '</label>',
                '<input type="text" class="form-control" id="' + theInputId + '">',
            '</div>'
            ];
        this.innerHtml.find(".modal-body").append(inputArray.join(''));
    }

    DialogView.prototype.getInputValue = function(id) {
        var theId = this.getId() + '_input_' + id;
        var theInputId = theId + "_input";
        return utils.getInputValue(this.innerHtml.find("#" + theInputId));
    }

    DialogView.prototype.removeInputValue = function(id) {
        this.innerHtml.find("#" + this.getId() + "_input_" + id).remove();
    }

    DialogView.prototype.removeText = function(id) {
        this.innerHtml.find("#" + this.getId() + "_text_"  + id).remove();
    }

    DialogView.prototype.addCloseButton = function(title) {
        this.innerHtml.find(".modal-footer").append('<button type="button" class="btn btn-default" data-dismiss="modal">' + title + '</button>');
    }

    DialogView.prototype.addButton = function(buttonView) {
        S$.viewManager.addView(buttonView, this.innerHtml.find(".modal-footer"));
    }

    DialogView.prototype.removeButton = function(buttonView) {
        S$.viewManager.removeView(buttonView);
    }

    DialogView.prototype.disableButtons = function() {
        this.innerHtml.find("button").addClass("disabled");
    }

    DialogView.prototype.enableButtons = function() {
        this.innerHtml.find("button").removeClass("disabled");
    }

    DialogView.prototype.show = function() {
        this.innerHtml.modal("show");
    }

    DialogView.prototype.hide = function() {
        this.innerHtml.on('hidden.bs.modal', S$.call(this, function (e) {
            S$.viewManager.removeView(this)
        }));
        this.innerHtml.modal("hide");
    }

    return DialogView;
})());