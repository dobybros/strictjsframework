StrictJs.ns("views");
views.ForgetPasswordView = S$.registerView((function(){
    function ForgetPasswordView(callback) {
        this.callback = callback;
    }
    
    ForgetPasswordView.prototype.onAppend = function(html, inDom) {
    	$("body").css({
            "padding-top": "40px",
            "padding-bottom": "40px",
            "background-color": "#eee",
    	});
        var loginCallback = this.callback;
        $('#reset').on('click', function () {
            var $btn = $(this).button('loading')

            var password = $("#inputpassword").val();
            var confirmation = $("#inputConfirmation").val();

            var buttonDone = function () {
                $btn.button('reset');
            }

            if(typeof loginCallback === 'function') {
                loginCallback(password, confirmation, buttonDone);
            }   
            // business logic...
            // $btn.button('reset')
          })
    }
    
    ForgetPasswordView.prototype.setEmail = function(email) {
    	
    }
    
    ForgetPasswordView.prototype.setPassword = function(password) {
    	
    }
    
    ForgetPasswordView.prototype.onRemove = function(html) {
    	$("body").css({
            // "padding-top": "",
            // "padding-bottom": "",
            "background-color": "",
        });
    }
    
    ForgetPasswordView.prototype.toInnerHtml = function() {
    	var htmlArray = [
            '<div class="container">',
              '<div id="loginForm" class="form-signin">',
                '<h2 class="form-signin-heading" id="title">Reset Miss Password</h2><br><br>',
                '<div id="passworddiv">',
                '<label for="inputpassword" class="sr-only">New Password</label>',
                '<input type="password" id="inputpassword" class="form-control" placeholder="password" required autofocus></input>',
                '</div>',
                '<div id="confirmdiv">',
                '<label for="inputConfirmation" class="sr-only">Confirmation</label>',
                '<input type="password" id="inputConfirmation" class="form-control" placeholder="confirmation" required></input><br><br>',
                '</div>',
                // '<button id="reset" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>',
                '<button type="button" id="reset" data-loading-text="Loading..." class="btn btn-lg btn-primary btn-block" autocomplete="off">',
                    'Reset Password',
                '</button>',
              '</div>',
            '</div>',
		];
    	this.innerHtml = $(htmlArray.join(''));
    	return this.innerHtml;
    }
    
    return ForgetPasswordView;
})(), {
	css : [
            "css/signin.css",
	       ],
});