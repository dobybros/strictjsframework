S$.ns("controllers");
controllers.UtilsController = S$.registerController((function(){
    function UtilsController() {
    }
    
    UtilsController.prototype.onCreate = function() {
        Date.prototype.format = function(fmt) { //author: meizz   
          var o = {   
            "M+" : this.getMonth()+1,                 //月份   
            "d+" : this.getDate(),                    //日   
            "h+" : this.getHours(),                   //小时   
            "m+" : this.getMinutes(),                 //分   
            "s+" : this.getSeconds(),                 //秒   
            "q+" : Math.floor((this.getMonth()+3)/3), //季度   
            "S"  : this.getMilliseconds()             //毫秒   
          };   
          if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
          for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
          return fmt;   
        }  

    	S$.ns("utils");
    	utils.getInputValue = function(selector, oldValue) {
            var $selector;
            if(selector instanceof jQuery) {
                $selector = selector;
            } else {
        		$selector = $(selector);
            }
    		if($selector.length > 0) {
    			value = $selector[0].value;
                if(oldValue !== undefined) {
        			if(value !== oldValue) {
        				return value;
        			} 
                } else {
                    if(value.length !== 0) {
                        return value;
                    }
                }
    		}
    	};
    	utils.getTime = function(time) {
    		if(typeof time === 'number') {
    			return new Date(time).format("yyyy-MM-dd hh:mm:ss");
    		}
    		return "";
    	};
        utils.getMillisecond = function(millisecond) {
            if(typeof millisecond === 'number') {
                return millisecond + "ms";
            }
            return "";
        };
        utils.getStatus = function(status) {
            switch(status) {
                case -1:
                return "Standby";
                case 1:
                return "Running";
                case 20:
                return "Busy";
                case 50:
                return "Suspended";
                case 100:
                return "Disconnected";
                case 200:
                return "Down";
                case 300:
                return "Paused";
                case 400:
                return "Stopped";
                case 500:
                return "Shutdown";
                case 1000:
                return "Working";
                default:
                return "Unknown";
            }
        };
        utils.getStatusOnChatServer = function(status) {
            return utils.getStatus(status) + "(Chat)";
        };
        utils.getStatusOnBalancer = function(status) {
            return utils.getStatus(status) + "(Balancer)";
        };
        utils.getChangingOnChatServer = function(changing) {
            return changing ? "Chinging(Chat)" : "Idle(Chat)";
        };
        utils.getChangingOnBalancer = function(changing) {
            return changing ? "Changing(Balancer)" : "Idle(Balancer)";
        };
    	utils.open = function(url) {
    		window.open(url);
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

    return UtilsController;
})(), {"main" : true});
		


