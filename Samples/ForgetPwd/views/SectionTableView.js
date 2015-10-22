StrictJs.ns("views");
views.SectionTableView = S$.registerView((function(){
  function SectionTableView(title) {
    this.title = title;
    var htmlArray = [
      '<div>',
        '<h2 class="sub-header">' + this.title + '</h2>',
        '<div class="table-responsive">',
          '<table class="table table-striped">',
            '<thead>',
              // '<tr>',
              //   '<th>#</th>',
              //   '<th>Header</th>',
              //   '<th>Header</th>',
              // '</tr>',
            '</thead>',
            '<tbody>',
              // '<tr>',
              //   '<td>1,001</td>',
              //   '<td>dolor</td>',
              //   '<td>sit</td>',
              // '</tr>',
            '</tbody>',
          '</table>',
        '</div>',
      '</div>',
    ];
    this.innerHtml = $(htmlArray.join(''));
  }
  
  SectionTableView.prototype.addTitleBarButton = function(name, callback) {
    var button = S$.create(views.ButtonView, name);
    S$.viewManager.addView(button, this.innerHtml.find("h2"));
    button.innerHtml.css({
      "float": "right",
      "margin-left": "2px",
    })
    button.click(callback);
    return button;

    // var buttonHtml = [
    //   '<button type="button" id="' + this.getId() + "_" + id + '" data-loading-text="Loading..." class="btn btn-primary" autocomplete="off" style="float: right;margin-left: 2px;">',
    //     name,
    //   '</button>',
    // ];
    // var $btn = $(buttonHtml.join(''));
    // this.innerHtml.find("h2").append($btn);
    // var buttonDone = function () {
    //     $btn.button('reset');
    // }

    // var buttonCallback = callback;
    
    // // $("#" + this.getId() + "_" + id)
    // $btn.on('click', function () {
    //   if(typeof buttonCallback === 'function') {
    //       buttonCallback(id, name, buttonDone);
    //   } 
    // });
  }

  SectionTableView.prototype.removeTitleBarButton = function(id) {
    this.innerHtml.find("#" + this.getId() + "_" + id).remove();
  }

  SectionTableView.prototype.setHeaders = function(headers) {
    var headbar = this.innerHtml.find("thead");
    headbar.find("tr").remove();
    var array = ["<tr>"];
    for(var i = 0; i < headers.length; i++) {
      array.push("<th>" + headers[i] + "</th>");
    }
    array.push("</tr>");
    headbar.append(array.join(''));
  }

  SectionTableView.prototype.addRow = function(id, values) {
    var bodyTable = this.innerHtml.find("tbody");
    var array = ["<tr id='" + this.getId() + "_" + id + "'>"];

    var map = undefined;
    for(var i = 0; i < values.length; i++) {
      if(values[i] instanceof Array) {
        if(map === undefined)
          map = new HashMap();
        var theId = id + "_" + i;
        map.put(theId, values[i]);
        array.push("<td id='" + theId + "'></td>");
      } else {
        array.push("<td>" + values[i] + "</td>");
      }
    }
    array.push("</tr>");
    bodyTable.append(array.join(''));

    if(map !== undefined) {
      map.forEach(function(value, key) {
        var td = bodyTable.find("#" + key);
        for(var i = 0; i < value.length; i++) {
          if(S$.verifyView(value[i])) {
            S$.viewManager.addView(value[i], td);
            value[i].innerHtml.css({
              "margin": "1px",
            })
          }
        }
      });
    }
  }

  SectionTableView.prototype.removeRow = function(id) {
    var row = this.innerHtml.find("tbody").find("#" + getId() + "_" + id);
    row.remove();
  }

  SectionTableView.prototype.removeAllRows = function() {
    var rows = this.innerHtml.find("tbody").find("td");
    rows.remove();
  }


  SectionTableView.prototype.onAppend = function(html, inDom) {
  	html.css({
  	});
  }
  
  SectionTableView.prototype.onRemove = function(html) {
  	
  }
  
  SectionTableView.prototype.toInnerHtml = function() {
    	
  	return this.innerHtml;
  }
  
  return SectionTableView;
})(), {
	css : [
	       ],
});