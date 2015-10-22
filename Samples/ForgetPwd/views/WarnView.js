StrictJs.ns("views");
views.WarnView = S$.registerView((function(){
    function WarnView(message, title) {
        this.title = title;
        if(this.title === undefined) {
            this.title = 'Oh snap! You got an error!';
        }
        this.message = message;
        if(this.message === undefined) {
            this.message = 'Error occured';
        }
    }
    
    WarnView.prototype.onAppend = function(html, inDom) {
    	html.css({
            "width" : "50%",
            "margin" : "auto",
    	});
    }
    
    WarnView.prototype.onRemove = function(html) {
    	
    }
    
    WarnView.prototype.toInnerHtml = function() {
    	var htmlArray = [
            '<div class="alert alert-danger alert-dismissible fade in" role="alert">',
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>',
              '<h4 id="oh-snap!-you-got-an-error!">' + this.title + '<a class="anchorjs-link" href="#oh-snap!-you-got-an-error!"><span class="anchorjs-icon"></span></a></h4>',
              '<p>' + this.message + '</p>',
            '</div>',
		];
    	this.innerHtml = $(htmlArray.join(''));
    	return this.innerHtml;
    }
    
    return WarnView;
})(), {
	css : [
	       ],
});