StrictJs.ns("views");
views.NavBarView = S$.registerView((function(){
    function NavBarView(projectName) {
      this.projectName = projectName;

    }
    
    NavBarView.prototype.onAppend = function(html, inDom) {
    	html.css({
    	});
    }
    
    NavBarView.prototype.onRemove = function(html) {
    	
    }
    
    NavBarView.prototype.toInnerHtml = function() {
    	var htmlArray = [
            '<nav class="navbar navbar-inverse navbar-fixed-top">',
              '<div class="container-fluid">',
                '<div class="navbar-header">',
                  '<a class="navbar-brand" href="#">' + this.projectName + '</a>',
                '</div>',
                '<div id="navbar" class="navbar-collapse collapse">',
                  '<ul class="nav navbar-nav navbar-right">',
                    '<li><a href="#">Help</a></li>',
                  '</ul>',
                  '<form class="navbar-form navbar-right">',
                    '<input type="text" class="form-control" placeholder="Search...">',
                  '</form>',
                '</div>',
              '</div>',
            '</nav>',
		];
    	this.innerHtml = $(htmlArray.join(''));
    	return this.innerHtml;
    }
    
    return NavBarView;
})(), {
	css : [
    "css/NavBarView.css",
	       ],
});