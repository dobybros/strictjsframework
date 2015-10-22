StrictJs.ns("views");
views.SideBarView = S$.registerView((function(){
    var currentContentView;

    function SideBarView() {
        var htmlArray = [
            '<div class="container-fluid">',
              '<div class="row">',
                '<div class="col-sm-3 col-md-2 sidebar">',
                  '<ul class="nav nav-sidebar">',
                  '</ul>',
                '</div>',
                '<div id="contentview"></div>',
              '</div>',
            '</div>',
        ];
        this.innerHtml = $(htmlArray.join(''));
    }
    
    SideBarView.prototype.addItem = function(name, id, selected, clickedCallback) {
        var $li = $('<li><a id="' + this.getId() + '_' + id + '" href="#">' + name + '</a></li>');
        this.innerHtml.find("ul").append($li);
        var list = this.innerHtml.find("#" + this.getId() + "_" + id);

        list.on('click', {'li' : $li, 'innerHtml' : this.innerHtml}, function (event) {
            event.data.innerHtml.find("li").removeClass("active");
            event.data.li.addClass("active");
            clickedCallback(id, name);
        });

        if(selected) {
            this.innerHtml.find("li").removeClass("active");
            $li.addClass("active");

            list.click();
        }
    }

    SideBarView.prototype.removeItem = function(id) {
        this.innerHtml.find("#" + this.getId() + "_" + id).remove();
    }

    SideBarView.prototype.onAppend = function(html, inDom) {
    	html.css({
    	});
    }
    
    SideBarView.prototype.onRemove = function(html) {
    	
    }
    
    SideBarView.prototype.toInnerHtml = function() {
    	return this.innerHtml;
    }
    
    SideBarView.prototype.setContentView = function(view) {
        if(this["html"] !== undefined) {
            var contentView = this["html"].find("#contentview");
            if(contentView !== undefined) {
                if(currentContentView !== undefined) 
                    currentContentView["html"].hide();
                    // S$.viewManager.removeView(currentContentView);
                currentContentView = view;
                if(currentContentView["html"] === undefined) {
                    S$.viewManager.addView(currentContentView, contentView);
                } else {
                    currentContentView["html"].show();
                }
            }
        }
    }

    return SideBarView;
})(), {
	css : [
        "css/SideBarView.css",
	       ],
});