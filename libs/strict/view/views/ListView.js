StrictJs.ns("im.common");
im.common.ListView = S$.registerView((function(){
	var defaultListConfig = {
    		"height" : "100%", 
    		"margin" : "0 auto",
    		"box-sizing" : "border-box"
    		};
	var defaultContainerConfig = {
    		"height" : "100%", 
    		"margin" : "0 auto",
    		"overflow" : "auto",
    		};
	/*
	 * data.divider 类型是number， 行间距
	 * 
	 */
    function ListView(data, containerConfig, listConfig) {
        if(typeof data["divider"] === 'number') {
        	this.divider = data["divider"];
        } else {
        	this.divider = 5;
        }
        if(S$.verifyView(data["more"])) {
        	this.moreView = data["more"];
        	if(this.moreView["listView"])
        		throw "listView is already registered in moreView " + this.moreView;
        	else {
        		this.moreView["listView"] = this;
        	}
        } else if(data["more"] === 'auto') {
        	this.moreAuto = true;
        }
        if(S$.verifyView(data["earlier"])) {
        	this.earlierView = data["earlier"];
        	throw "don't support earlier view yet...";
        } else if(data["earlier"] === 'auto') {
        	this.earlierAuto = true;
        	throw "don't support auto load earlier yet...";
        }
        
        if(S$.verifyView(data["loading"])) {
        	this.loadingView = data["loading"];
        } 
        
        this.hasMore = data["hasMore"];
        this.eventController = data["eventController"];
        
        if(containerConfig) 
        	this.containerConfig = containerConfig;
        if(listConfig)
        	this.listConfig = listConfig;
    }
    
    ListView.prototype.addView = function(view, target, method) {
    	if(this.html) {
    		var container = this.html.find("#" + this.getId() + "_inner");
        	if(container) {
        		if(!target)
        			target = container;
        		var content = StrictJs.viewManager.addView(view, target, method);
        		if(content) {
        			content.css({
        				"margin-bottom" : this.divider / 2 + "px",
        				"margin-top" : this.divider / 2 + "px",
        			});
        		}
        	}
    	}
    }
    ListView.prototype.removeView = function(view) {
    	if(this.html) {
    		var container = this.html.find("#" + this.getId() + "_inner");
    		if(container) {
    			S$.viewManager.removeView(view, this);
    		}
    	}
    }
    
    ListView.prototype.onAppend = function(html) {
    	html.css(defaultContainerConfig);
    	if(this.containerConfig)
    		html.css(this.containerConfig);
    	
    	var listView = html.find("#" + this.getId() + "_inner");
    	if(listView) {
    		listView.css(defaultListConfig);
    		if(this.listConfig) 
    			listView.css(this.listConfig);
    	}
    	
    	if(this.moreAuto) {
    		html.scroll({
    			listView : this,
    		}, function(event){
    			var $this = $(this),
    			viewH = $(this).height(),//可见高度
    			contentH = $(this).get(0).scrollHeight,//内容高度
    			scrollTop = $(this).scrollTop();//滚动高度
    			if(contentH - viewH - scrollTop <= 20) { //到达底部20px时,加载新内容
    				event.data.listView.loadMore(event.data.listView.getId());
    			}
    		});
    	}
    	if(this.hasMore) {
    		if(S$.verifyView(this.moreView)) 
				this.addView(this.moreView);
    	}
    	if(typeof this.eventController["registerEvent"] === 'function') {
    		this.eventController["registerEvent"].call(this.eventController, this.id + "_more_end", {
    			scope : this,
    			callback : function(type, returnObj) {
    				this.loading = false;
    				if(S$.verifyView(this.loadingView)) 
    					this.removeView(this.loadingView);
    				if(returnObj["hasMore"]) {
    					this.hasMore = true;
    					if(S$.verifyView(this.moreView)) 
    						this.addView(this.moreView);
    				} else {
    					this.hasMore = false;
    				}
    			}
    		});
    	}
    }
    
    ListView.prototype.loadMore = function() {
    	if(this.hasMore && !this.loading) {
			this.loading = true;
			if(S$.verifyView(this.moreView)) 
				this.removeView(this.moreView);
			if(S$.verifyView(this.loadingView))
				this.addView(this.loadingView);
			S$.eventManager.sendEvent(this.getId() + "_more", {});
		}
    }
    ListView.prototype.onRemove = function(html) {
    	
    }
    
    ListView.prototype.toInnerHtml = function() {
    	return $('<div id="' + this.getId() + '_inner"></div>');
    }
    
    return ListView;
})(), {
	css : [
//"../stricts/im/note/NoteContainer.css",
	],
});