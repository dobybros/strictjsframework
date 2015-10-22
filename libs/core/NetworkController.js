StrictJs.ns("network");
network.NetworkController = S$.registerController((function(){
    function NetworkController() {
    }
    
    NetworkController.prototype.onCreate = function() {
    	S$.eventManager.registerEvent("network", {
  			callback : function(type, obj) {
  				if(!obj.timeout)
  					obj.timeout = 0;
          var doneFunc = undefined;
          if(typeof obj["done"] === 'function') {
            doneFunc = obj["done"];
          }
          if(typeof obj["failed"] === 'function') {
            var failedFunc = obj["failed"];
            obj["failed"] = function(jsonData, observer) {
              S$.eventManager.sendEvent("error", {
                type : "warning",
                text : jsonData["description"] + " code: " + jsonData["code"],
                timeout : 6,
              });
              if(doneFunc !== undefined) {
                if(obj["scope"]) {
                  doneFunc.call(obj["scope"]);
                } else {
                  doneFunc();
                }
              }
              if(obj["scope"]) {
                failedFunc.call(obj["scope"], jsonData, observer);
              } else {
                failedFunc(jsonData, observer);
              }
            }
          }
          if(typeof obj["success"] === 'function') {
            var successFunc = obj["success"];
            obj["success"] = function(jsonData, observer) {
              if(doneFunc !== undefined) {
                if(obj["scope"]) {
                  doneFunc.call(obj["scope"]);
                } else {
                  doneFunc();
                }
              }
              if(obj["scope"]) {
                successFunc.call(obj["scope"], jsonData, observer);
              } else {
                successFunc(jsonData, observer);
              }
            }
          }
  				$.ajax({
              type : obj.type,
              url : obj.url,
              data : obj.data,
              xhr : obj.xhr,
              //设置请求超时时间（毫秒）。此设置将覆盖全局设置。
              timeout : obj.timeout,
              headers : obj.headers,
              contentType: obj.contentType,
              processData: obj.processData,
              //success(data, textStatus, jqXHR)
              success : this.handleSuccess(obj, this),
              //function (XMLHttpRequest, textStatus, errorThrown)
              error : this.handleError(obj, this),
          });
  			},
  			async : true,
  			scope : this,
  		})
    }
    
    NetworkController.prototype.handleSuccess = function(obj, observer) {
    	return function(data, textStatus, jqXHR) {
    		if(jqXHR.status !== 200) {
    			console.log("Server error");
    			if(obj && typeof obj["failed"] === 'function')
            obj["failed"]({"description" : "Http code " + jqXHR.status, "code" : -1}, observer);
        		return;
    		}
    		if(jqXHR.getResponseHeader("Content-Type").indexOf("json") < 0) {
    			console.log("Data format error " + jqXHR.getResponseHeader("Content-Type"));
    			if(obj && typeof obj["failed"] === 'function') {
            obj["failed"]({"description" : "Content-Type " + jqXHR.getResponseHeader("Content-Type"), "code" : -1}, observer);
    			}
        		return;
    		}
    		
      // var jsonData = JSON.insure(data);
			var jsonData = data;
			var code = jsonData["code"];
			if(typeof code === 'number') {
				if(code === 1) {
					if(obj && typeof obj["success"] === 'function') {
        		obj["success"](jsonData, observer);
					}
				} else {
					var description = jsonData["description"];
					if(!description)
						description = "Unknown error";
					console.log(description);
					if(obj && typeof obj["failed"] === 'function') {
        		obj["failed"](jsonData, observer);
					}
				}
				return;
			} else {
				console.log("Server error, no code");
				if(obj && typeof obj["failed"] === 'function') {
          obj["failed"]({"description" : "No server code...", "code" : -1}, observer);
				}
			}
    	}
    }
    NetworkController.prototype.handleError = function(obj, observer) {
    	return function (XMLHttpRequest, textStatus, errorThrown) {
    		console.log("Network error");
    		if(obj && typeof obj["failed"] === 'function')
				  obj["failed"]({"description" : "Network error textStatus " + textStatus + " errorThrown " + errorThrown, "code" : -1}, observer);
    	}
    }
    
    return NetworkController;
})(), {"main" : true});
		


