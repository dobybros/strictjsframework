var UIViewManager = (function() {
    var viewManager;
    function _uiViewManager() {
    	if(!viewManager)
    		viewManager = this;
    	else 
    		throw "UIViewManager can only be created once. "
    	$(document).on("ready", function() {
    		StrictJs.eventManager.sendEvent("ready");
    	})
    }

    _uiViewManager.prototype.addView = function(view, target, method) {
    	if(S$.verifyView(view)) {
    		var id = view.getId();
        	if(id) {
        		if(!method)
        			method = 'append';
        		if(this.hasView(id)) {
        			if(!target)
        				target = $("#" + id).parent();
        			method = 'append';
        			this.removeView(id);
        		}
        		var p = undefined;
        		if(S$.verifyView(target)) {
        			if(target["html"]) {
        				p = target["html"];
        			} else {
        				throw "Add view to the view failed, which the view has to be already appended into dom, but it is not.";
        			}
        		} else {
        			p = target;
        		}
        		
        		var content;
        		if(view.html) {
        			content = view.html;
        		} else {
        			try {
        				var innerHtml = view.toInnerHtml();
                        if(innerHtml.size() > 1) {
            				var content = $("<div id=" + id + "></div>");
                            content.append(innerHtml);
                        } else {
                            content = innerHtml;
                        }
                        content.attr("id", id);
        			} catch(err) {
        				if(console && typeof console.error === 'function')
                    		console.error("Add view " + id + " occured error: " + (err.stack === undefined ? err : err.stack));
            			StrictJs.eventManager.sendGlobalError("toInnerHtml view " + view.getId() + " failed " + err, undefined, err);
            			throw "toInnerHtml view " + view.getId() + " failed " + err;
            		}
        		}
        		if(p) {
        			if(method === 'append')
        				p.append(content);
        			else if(method === 'prepend') 
        				p.prepend(content);
        			else if(method === 'after') 
        				p.after(content);
        			else if(method === 'before')
        				p.before(content);
        			else
        				throw "Unknown method " + method + " while adding a view";
        		}
        		view["html"] = content;
        		if(typeof view.onAppend === 'function') {
        			try {
        				var inDom = (p === undefined ? false : p.parents().last().is(document.documentElement));
        				view.onAppend(content, inDom);	
        			} catch(err) {
        				if(console && typeof console.error === 'function')
                    		console.error("onAppend view " + id + " occured error: " + (err.stack === undefined ? err : err.stack));
            			StrictJs.eventManager.sendGlobalError("onAppend view " + view.getId() + " failed " + err, undefined, err);
            			this.removeView(id);
            			return undefined;
            		}
        		} 
        		return content;
        	}
    	} else {
    		throw "Add view failed, missing id..."
    	}
    }
    
    _uiViewManager.prototype.removeView = function(id, parent) {
    	var v = undefined;
    	var view = undefined;
    	var parentHtml = undefined;
    	if(S$.verifyView(parent)) {
    		parentHtml = parent.html;
    	} else {
    		parentHtml = parent;
    	}
    	if(typeof id === 'string') {
    		if(parentHtml) 
    			v = parentHtml.find("#" + id);
    		else 
    			v = $("#" + id);
    	} else if(S$.verifyView(id)){
    		view = id;
    		id = view.getId();
    		if(parentHtml) 
    			v = parentHtml.find("#" + id);
    		else
    			v = $("#" + id);
    	}
    	if(id && $.trim(id) !== "") {
        	while(v.length > 0 && v.remove() !== 0) {
        		if(parentHtml) 
        			v = parentHtml.find("#" + id);
        		else
        			v = $("#" + id);
        	};
        	if(view) {
        		try {
        			if(typeof view.onRemove === 'function')
        				view.onRemove(v, v.parents().last().is(document.documentElement));
        		} catch(err) {
        			if(console && typeof console.error === 'function')
                		console.error("Remove view " + id + " occured error: " + (err.stack === undefined ? err : err.stack));
        			StrictJs.eventManager.sendGlobalError("OnHide view " + id + " failed " + err, undefined, err);
        		}
        	}
    	}
    }
    
    _uiViewManager.prototype.hasView = function(id) {
    	return $("#" + id).length > 0;
    }
    
    return _uiViewManager;
})();

