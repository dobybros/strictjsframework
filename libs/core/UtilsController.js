S$.ns("network");
network.UtilsEventController = S$.registerEventController((function(){
    function UtilsEventController() {
    }
    
    UtilsEventController.prototype.handle = function() {
    	StrictJs.ns("utils");

    	utils.getTime = function(time) {
    		if(typeof time === 'number') {
    			return new Date(time).format("yyyy-MM-dd hh:mm:ss");
    		}
    		return "";
    	};
    	utils.getUserIcon = function(icon) {
    		if(!icon)
    			icon = "/ujs/images/im/user/user-256.png?w=200";
    		return icon;
    	};
    	utils.open = function(url) {
    		if(pc.deamon) {
    			if(url && !url.startsWith("http") && location) {
    				url = location.protocol + "//" + location.host + url;
				}
    			pc.deamon.openSubPage(url);
    		} else {
    			window.open(url);
    		}
    	};
    	utils.toString = function(array, config) {
    		var str = '';
    		if((typeof array === 'object') && array.length > 0) {
    			var seperator = ", ";
    			var field = undefined;
    			if(typeof config === 'object') {
    				if(config["seperator"]) {
    					seperator = config["seperator"];
    				}
    				if(config["field"]) {
    					field = config["field"];
    				}
    			}
    			
    			for(var i = 0; i < array.length; i++) {
    				var value;
    				if(field) {
    					value = array[i][field];
    				} else {
    					value = array[i];
    				}
    				if(value) {
    					str = str.concat(value);
    					if(i < array.length - 1) {
    						str = str.concat(seperator);
    					} 
    				}
    			}
    		} 
    		return str;
    	};
    	utils.getShortString = function(string, size) {
    		if(typeof string !== 'string') 
    			return "";
    		if(typeof size !== 'number')
    			return string;
    		if(string.length > size) {
    			return string.substring(0, size);
    		} else {
    			return string;
    		}
    	}
    }

    return UtilsEventController;
})(), {"main" : true});
		


