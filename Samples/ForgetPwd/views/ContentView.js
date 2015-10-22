StrictJs.ns("views");
views.ContentView = S$.registerView((function(){
    function ContentView(title) {
        this.title = title;
    }
    
    ContentView.prototype.onAppend = function(html, inDom) {
    	html.css({
    	});
    }
    
    ContentView.prototype.onRemove = function(html) {
    	
    }
    
    ContentView.prototype.toInnerHtml = function() {
    	var htmlArray = [
            '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">',
              '<h1 class="page-header">' + this.title + '</h1>',
              '<div id="sectionview"></div>',
            '</div>',
		];
    	this.innerHtml = $(htmlArray.join(''));
    	return this.innerHtml;
    }
    
    ContentView.prototype.setSectionView = function(view) {
        if(this["html"] !== undefined) {
            var sectionView = this["html"].find("#sectionview");
            if(sectionView !== undefined) {
                S$.viewManager.addView(view, sectionView);
            }
        }
    }

    return ContentView;
})(), {
	css : [
        "css/ContentView.css",
	       ],
});