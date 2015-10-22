var StrictJs = (function(){
	var uiViewManager = new UIViewManager();
	var eventManager = new EventManager();
	var StrictJs = {
			viewManager : uiViewManager,
			eventManager : eventManager,
			views : [], //纯UI布局的可复用控件， 每个View都需要提供config， 以做到简单修改样式。
			controllers : [], //UI组装， 事件处理及网络相关操作。
			
			ns : function(namespaceStr) {
                var namespaceList = namespaceStr.split('.'), 
                    itemTemp = window, 
                    i, 
                    len;
                for ( i = 0, len = namespaceList.length; i < len; i++) {
                    itemTemp = itemTemp[namespaceList[i]] = itemTemp[namespaceList[i]] || {};
                }
                return itemTemp;
            },

            /**
             * 修改传递方法的调用作用域
             */
            call : function(scope, callback) {
                var cb = function() {
                    callback.apply(scope, arguments);
                }
                return cb;
            },
			
            /**
             * 写入CSS地址.
             * @param cssPaths {String|Array} CSS地址.
             * @param cssRelPath {String} CSS相对地址.
             * @param cssVersion {Number|String} CSS文件版本号.
             */
            writeCSS : function(cssPaths, cssRelPath, cssVersion) {
                if(cssPaths){
                    cssRelPath = cssRelPath || '';
                    cssVersion = cssVersion || Date.now();  //若未指定版本号，则使用时间戳，不允许Client使用缓存。
                    if(typeof (cssPaths) === 'string'){
                        cssPaths = [cssPaths];
                    }
                    for(var i = 0, len = cssPaths.length; i < len; i++) {
                        var cssPath = cssRelPath + cssPaths[i] + "?v=" + cssVersion, 
                            css = document.createElement('link');
                        css.href = cssPath;                    
                        this.writeCSSText('@import url(' + cssPath + ');');
                    }
                }
            },
            /**
             * 写入CSS代码.
             * @param cssText {String} CSS代码.
             */
            writeCSSText : function(cssText){
                if(Object.prototype.toString.call(cssText) == "[object Array]"){
                    cssText = cssText.join('\r\n');
                }
                document.writeln('<style>' + cssText + '</style>');
            },
            
            loadStyle : function(url) {
                if(document.createStyleSheet){
                    document.createStyleSheet(url);
                } else {                
                    var cssLink = document.createElement('link');
                    cssLink.rel = 'stylesheet';
                    cssLink.type = 'text/css';
                    cssLink.href = url;            
                    head.appendChild(cssLink)
                }
            },

			/**
	         * 加载JavaScript.
	         * @method loadScript
	         * @param jsPath {String} 脚本地址.
	         * @param cb {Function} 脚本加载完成时回调函数.
	         * @param onerror {Function} 脚本加载失败时回调函数.
	         * @return this.
	         */
			loadScript : function(jsPath, cb, onerror) {
	            var script = document.createElement('script');
	            script.onload = function(){
	                if(Object.prototype.toString.call(cb) === '[object Function]'){
	                    cb();
	                }
	            };
	            script.onerror = function(){               
	                if(Object.prototype.toString.call(onerror) === '[object Function]'){
	                    onerror();
	                }
	            };
	            script.type = 'text/javascript';
	            script.src = jsPath;
	            document.head.appendChild(script);
	            return this;
	        },
            
	        writeScriptText : function(scriptText){
	            if(Object.prototype.toString.call(scriptText) == "[object Array]"){
	                scriptText = scriptText.join('\r\n');
	            }
	            document.writeln('<script>' + scriptText + '</script>');
	        },
	        
	        writeScript : function(jsPaths, jsRelPath, jsVersion) {
	            if (jsPaths) {
	                jsRelPath = jsRelPath || '';
	                jsVersion = jsVersion || Date.now();    //若未指定版本号，则使用时间戳，不允许Client使用缓存。
	                if ( typeof (jsPaths) === 'string') {
	                    jsPaths = [jsPaths];
	                }
	                for (var i = 0, len = jsPaths.length; i < len; i++) {
	                    var jsPath = jsPaths[i]; 
	                    if(jsPath.indexOf('http') != 0){                        
	                        jsPath = jsRelPath + jsPaths[i] + "?v=" + jsVersion;
	                    }
	                    document.writeln("<script src='" + jsPath + "'></script>");
	                }
	            }
	            return this;
	        },
	        
	        extend : function(target, obj){
                if(typeof obj == 'undefined'){
                    obj = target;
                    target = this;
                }
                if(obj){
                    for(var key in obj){
                        if(obj.hasOwnProperty(key)){
                            target[key] = obj[key];
                        }
                    }
                }
            }, 
            
            verifyView : function(view) {
            	return view && typeof view.id === 'string' && typeof view.toInnerHtml === 'function';
            },
            
            /**
             * 生成唯一ID.
             */
            generateId : (function() {        
                var prevGenTime = null,
                    prevGuidIndex = 0;
                /**
                 * @prefix : {String} : 生成的Guid的前缀，如：pre_1379914908358_0。
                 * @radius : {Number} : 为了缩短guid的长度，将guid转换成数字后，再转换成指定进制(2-36)的数值。
                 * 
                 * @return : {String} : GUID。
                 */
                return function(prefix/* or radius */) {
                    var currentGenTime = (new Date()).getTime();
                    if( prevGenTime !== currentGenTime ){
                        prevGenTime = currentGenTime;
                        currentGuid = 0;
                    }    
                    if(typeof prefix === 'number'){
                        var radius = prefix.constraintRegion(2, 36).toInt();            
                        return parseInt(prevGenTime + '' + ( currentGuid++ )).toString(radius);
                    } else {
                        return (prefix || '' ) + prevGenTime + '_' + ( currentGuid++ );
                    }
                };
            })(),
            
            create : function(target) {
            	var constructor, prefix, id;
            	if(typeof target === 'function') {
            		constructor = target;
            	} else if(typeof target === 'object') {
            		constructor = target["constructor"];
            		prefix = target["prefix"];
            		id = target["id"];
            	}
            	if(!constructor)
            		throw "Contructor is undefined while create, " + target;
            	
                //Add reserved methods
                if(typeof constructor.prototype.getParameterMap !== 'function') {
                    constructor.prototype.getParameterMap = function() {
                        if(!this.parameterMap)
                            this.parameterMap = new HashMap();
                        return this.parameterMap;
                    }
                }

            	var args = Array.prototype.slice.call(arguments, 1);
            	var obj = Object.create(constructor.prototype)
            	constructor.apply(obj, args);
//           	 	var obj = new constructor(args);
           	 	if(obj) {
           	 		if(!id) 
           	 			id = S$.generateId(constructor.name);
           	 		if(!prefix) 
           	 			prefix = '';
           	 		obj["id"] = prefix + id;
           	 	}

				return obj;
            },
            
            registerView : function(view, config) {
        		if(!config) {
        			config = {};
        		}
        		config["view"] = view;
        		if(typeof view.prototype.getId !== 'function') {
        			view.prototype.getId = function() {
        				if(!this.id)
        					this.id = S$.generateId("unknown");
        				return this.id;
        			}
        		}
        		// if(typeof view.prototype.createSubView !== 'function') {
        		// 	view.prototype.createSubView = function(target) {
        		// 		var subView = S$.create(target);
        		// 		return this.id;
        		// 	}
        		// }
        		this.views.push(config);

                //write css to head
                var cssArray = config["css"];
                if(typeof cssArray === 'object') {
                    for(var i = 0; i < cssArray.length; i++){
                        this.writeCSS(cssArray[i]);
                    }
                }
        		return view;
            },
            
            verifyController : function(controller) {
            	return controller && typeof controller.id === 'string' && typeof controller.onCreate === 'function';
            },
            
            registerController : function(controller, config) {
        		if(!config) {
        			config = {};
        		}
        		config["controller"] = controller;
        		this.controllers.push(config);
        		if(typeof controller.prototype.getId !== 'function') {
        			controller.prototype.getId = function() {
        				if(!this.id)
        					this.id = S$.generateId("unknown");
        				return this.id;
        			}
        		}
        		if(typeof controller.prototype.registerEvent !== 'function') {
        			controller.prototype.registerEvent = function(type, observer) {
        				if(!this.eventMap)
        					this.eventMap = new HashMap();
        				var key = observer["key"];
        				if(!key)
        					key = observer;
        				this.eventMap.put(key, type);
        				S$.eventManager.registerEvent(type, observer);
        			}
        		}
        		if(typeof controller.prototype.unregisterEvent !== 'function') {	
        			controller.prototype.unregisterEvent = function(type, key) {
        				if(!this.eventMap)
        					this.eventMap = new HashMap();
        				this.eventMap.remove(key);
        				S$.eventManager.unregisterEvent(type, key);
        			}
        		}
        		if(config["main"]) {
        			try {
        				var e = S$.create(controller);
//        				var e = new controller("main");
        				e.onCreate();
        			} catch(err) {
        				StrictJs.eventManager.sendGlobalError("start main " + controller + " failed " + err, undefined, err);
        			}
        		}
        		return controller;
            },
            
            handleController : function(controller) {
        		try {
        			if(typeof controller["onCreate"] === 'function') 
        				controller.onCreate();
        		} catch(err) {
        			StrictJs.eventManager.sendGlobalError("Execute controller " + controller + " failed " + err, undefined, err);
        		}
            },
            
            destroyController : function(controller) {
            	try {
            		if(typeof controller["onDestroy"] === 'function') {
            			controller.onDestroy();
            		}
        		} catch(err) {
        			StrictJs.eventManager.sendGlobalError("Execute controller " + controller + " failed " + err, undefined, err);
        		}	
        		if(controller.eventMap) {
    				controller.eventMap.forEach(function(type, key) {
    					S$.eventManager.unregisterEvent(type, key);
    				});
    				controller.eventMap.clear();
    			}
            },
            
            load : function(loadConfig){
                loadConfig = loadConfig || {}; 
                var ujsPath = this.config['path'];                       
                //load lan
                this.loadLan(loadConfig['language']);
                //load css            
                if(loadConfig['debug']){
                    this.writeScript(ujsPath + 'grunt/resource_path/css_res.js', '', this.version);
                    this.writeScriptText([
                        'var allCSSes = ujs.getResPath(' + JSON.stringify(loadConfig) + '),',
                        '    cssesImport = [];',
                        'for(var i=0; i<allCSSes.length; i++){',
                        '    cssesImport.push("@import url(' + this.config['rootPath'] + ujsPath + 'css/" + allCSSes[i] + ");");',
                        '};',
                        'ujs.writeCSSText(cssesImport);'
                    ]);             
                } else {
                    this.writeCSS('build/ujs.min.css', ujsPath, this.version);
                }            
                //load javascript            
                if(loadConfig['debug']){                
                    this.writeScript(ujsPath + 'grunt/resource_path/js_res.js', '', this.version);
                    this.writeScriptText("ujs.writeScript(ujs.getResPath(" + JSON.stringify(loadConfig) + "), '" + ujsPath + "js/', ujs.version);");                                
                } else {
                    this.writeScript('build/ujs.min.js', ujsPath, this.version);
                }            
            }
	};
	
	return StrictJs;
})();

if(window) {
	//Alias
	window.StrictJs = window.S$ = StrictJs;
}

