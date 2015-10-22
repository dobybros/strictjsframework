S$.ns("views");
views.LoginView = S$.registerView((function(){
    function LoginView(callback) {
        this.callback = callback;
    }
    
    LoginView.prototype.onAppend = function(html, inDom) {
    	$("body").css({
            "padding-top": "40px",
            "padding-bottom": "40px",
            "background-color": "#eee",
    	});
        var loginCallback = this.callback;
        $('#loginId').on('click', function () {
            var $btn = $(this).button('loading')

            var email = $("#inputEmail").val();
            var password = $("#inputPassword").val();
            var rememberMe = $("#selectRememberMe");
            var checked = false;
            if(rememberMe.length == 1) {
                checked = rememberMe[0].checked;
            }

            var buttonDone = function () {
                $btn.button('reset');
            }

            if(typeof loginCallback === 'function') {
                loginCallback(email, password, rememberMe, buttonDone);
            }   
            // business logic...
            // $btn.button('reset')
          })
    }
    
    LoginView.prototype.setEmail = function(email) {
    	
    }
    
    LoginView.prototype.setPassword = function(password) {
    	
    }
    
    LoginView.prototype.onRemove = function(html) {
    	$("body").css({
            // "padding-top": "",
            // "padding-bottom": "",
            "background-color": "",
        });
    }
    
    LoginView.prototype.toInnerHtml = function() {
    	var htmlArray = [
            '<div class="container">',
              '<div id="loginForm" class="form-signin">',
                '<h2 class="form-signin-heading">Please sign in</h2>',
                '<label for="inputEmail" class="sr-only">Email address</label>',
                '<input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus></input>',
                '<label for="inputPassword" class="sr-only">Password</label>',
                '<input type="password" id="inputPassword" class="form-control" placeholder="Password" required></input>',
                '<div class="checkbox">',
                  '<label>',
                    '<input id="selectRememberMe" type="checkbox" value="remember-me"> Remember me </input>',
                  '</label>',
                '</div>',
                // '<button id="loginId" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>',
                '<button type="button" id="loginId" data-loading-text="Loading..." class="btn btn-lg btn-primary btn-block" autocomplete="off">',
                    'Sign in',
                '</button>',
              '</div>',
            '</div>',
		];
    	this.innerHtml = $(htmlArray.join(''));
    	return this.innerHtml;
    }
    
    return LoginView;
})(), {
	css : [
            "css/signin.css",
	       ],
});