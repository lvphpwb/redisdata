~function($){
    $.lvcookie = {};
    $.lvcookie.set = function(name, value, options){
        options = options || {};
        var expires ='';
        if (options.expires && (typeof options.expires =='number'|| options.expires.toUTCString)) {
            var date;
            if (typeof options.expires =='number') {
                date =new Date();                
                date.setTime(date.getTime()+(options.expires *24*60*60*1000));            
            } else {                
                date = options.expires;            
            }            
            expires ='; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    };
    $.lvcookie.get = function(name){
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    $.lvcookie.empty = function(name, options){
        var value ='';
        options = $.extend({}, options); 
        options.expires =-1; 
        var date = new Date();
        date.setTime(date.getTime()+(options.expires *24*60*60*1000));
        var expires ='; expires=' + date.toUTCString(); 
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    };
}(jQuery);
~function($){
    $.fn.placeholder=function(){
        return this.each(function(){
            if('placeholder'in document.createElement(this.tagName))return;
            var n=1,t=this,txt=t.getAttribute('placeholder');
            t.value&&t.value!=txt||(n=0,t.value=txt);
            $(t).bind({
                focus:function(){
                    n||(n=1,t.value='');
                },
                blur:function(){
                    t.value?n=1:(n=0,t.value=txt);
                }
            });
            t.form&&$(t.form).submit(function(){
                n||(t.value='');
            });
        });
    };
}(jQuery);
~function($) {
    $.lvmask = {};
    $.lvmask.config = {opacity: 0.6, bgcolor: '#333'};
    $.lvmask.show = function(p){
        var config = $.lvmask.config;
        config = $.extend({}, config, p || {});
        $("<div class='lvjs-window-mask' style='position:absolute;left:0;top:0;width:100%;height:100%; filter:alpha(opacity=" + config.opacity*100 + ");opacity:" + config.opacity + ";background:" + config.bgcolor + ";font-size:1px; *zoom:1;overflow:hidden; display:block;z-index: 9000;'></div>").height($(document).height()).appendTo('body');
        jQuery(window).bind("resize", $.lvmask.resize);
    };
    $.lvmask.resize = function(){
        $(".lvjs-window-mask").height($(document).height());
    };
    $.lvmask.hidden = function(){
        $(".lvjs-window-mask").remove();
        jQuery(window).unbind("resize", $.lvmask.resize);
    };
    $.lvmask.hide = $.lvmask.hidden;
}(jQuery);
~function($) {
    $.fn.lvdrag = function(header) {
        var p = {
            onStartDrag: false,
            onDrag: false,
            onStopDrag: false,
            handler: ''
        };
        p.handler = header || '';
        return this.each(function() {
            if (this.useDrag) return;
            var g = {
                start: function(e) {
                    $('body').css('cursor', 'move');
                    g.current = {
                        target: g.target,
                        left: g.target.offset().left,
                        top: g.target.offset().top,
                        startX: e.pageX || e.screenX,
                        startY: e.pageY || e.clientY
                    };
                    g.handler.bind('mouseup', function(){g.stop();});
                    $(document).bind('mousemove', g.drag);
                    if (p.onStartDrag) p.onStartDrag(g.current, e);
                },
                drag: function(e) {
                    if (!g.current) return;
                    var pageX = e.pageX || e.screenX;
                    var pageY = e.pageY || e.screenY;
                    g.current.diffX = pageX - g.current.startX;
                    g.current.diffY = pageY - g.current.startY;
                    if (p.onDrag) {
                        if (p.onDrag(g.current, e) != false) {
                            g.applyDrag();
                        }
                    }else{
                        g.applyDrag();
                    }
                },
                stop: function(e) {
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                    $("body").css("cursor", "");
                    g.handler.css("cursor", "move");
                    if (p.onStopDrag) p.onStopDrag(g.current, e);
                    g.current = null;
                },
                //更新当前坐标
                applyDrag: function() {
                    g.current.diffX && g.target.css("left", (g.current.left + g.current.diffX));
                    g.current.diffY && g.target.css("top", (g.current.top + g.current.diffY));
                }
            };
            g.target = $(this);
            g.handler = p.handler.length == 0 ? $(this) : $(p.handler, this);
            g.handler.hover(function() {
                $('body').css('cursor', 'move');
            }, function() {
                $("body").css("cursor", "default");
            }).mousedown(function(e) { 
                g.start(e);
                return false;
            });
            this.useDrag = true;
        });
    };
}(jQuery);
~function($) {
    $.lvalert = {};
    $.lvalert.config = {
        msg : "Message！",
        type : "warning",
        isclose : false,
        autohidd : true,
        timeout : 0,
        top : 0,
        mask : 1,
        alpha : 0.5,
        background : "#bbb",
        cb : function(){}
    };
    $.lvalert.show = function(p){
        var config = $.lvalert.config;
        config = $.extend({}, config, p || {});
        if(config.mask){
            $.lvmask.show({opacity:config.alpha,bgcolor:config.background});
            if(config.autohidd){
                $(".lvjs-window-mask").click(function(){$.lvalert.hide();});
            }
        }else{
            $.lvmask.hidden();
        }
        var _s = $.lvalert;
        var alertbox = $("#lv_alertbox").attr('id') ? $("#lv_alertbox") : $("<div id='lv_alertbox' class='lv_alert_layer_wrap'></div>");
        $('body').append(alertbox);
        alertbox.html('');
        alertbox.append('<span class="lv_alert_layer" style="display:none;z-index:10000;" id="mode_tips_v2"><span class="gtl_ico_clear"></span><span class="gtl_ico_' + config.type + '"></span><span id="lvalert_msg">' + config.msg + '</span><span class="gtl_end"></span><span class="gtl_close"></span></span>');
        config.top>0 && alertbox.css('top', config.top + "px");
        config.type == 'loading' && $(".gtl_ico_clear").css('left', '-5px');
        if(config.isclose){
            var alertclose = $(".lv_alert_layer").find('.gtl_close');
            alertclose.show();
            alertclose.click(function(){_s.hide();});
        }else{
            $(".lv_alert_layer").find('.gtl_close').hide();
        }
        clearTimeout(_s._timer);
        $('.lv_alert_layer', alertbox).show();
        config.timeout && (_s._timer = setTimeout(function(){_s.hide(config.cb)}, config.timeout));
    };
    $.lvalert.success = function(p){
        var conf = {
            msg : "操作成功！",
            type : "success",
            isclose : false,
            autohidd : false
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.error = function(p){
        var conf = {
            msg : "操作失败！",
            type : "fail",
            isclose : true,
            autohidd : true,
            timeout : 1500,
            mask : 0
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.warning = function(p){
        var conf = {
            msg : "操作失败！",
            type : "warning",
            isclose : true,
            autohidd : true,
            timeout : 1500,
            mask : 0
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.loading = function(p){
        var conf = {
            msg : "正在处理中，请稍等......",
            type : "loading",
            isclose : false,
            autohidd : false,
            mask : 1
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.hide = function(cb) {
        $.lvmask.hidden();
        clearTimeout($.lvalert._timer);
        $('.lv_alert_layer', $("#lv_alertbox")).hide();
        if(cb){
            cb();
        }
    };
}(jQuery);
~(function($) {
    $.lvpop = {};
    $.lvpop = {
        $ : function(id){return document.getElementById(id)},
        initstatus : false,
        add : function(){ //生成div和遮罩层
            this.createShade();
            this.createPrompt();
        },
        init :function(option){   
            if(!this.initstatus){
                this.add();
                this.initstatus = true;
            }
            var title = this.title = option.title || false,
                shade = this.shade = option.shade || false,  //是否显示遮罩
                opacity = this.opacity = option.opacity || 20, //遮罩透明度
                width = this.width = option.width || 500,
                height = this.height = option.height || 300,
                _temp = this._temp = option.html || "",
                ConfirmFun = this.ConfirmFun = option.ConfirmFun || false,
                CancelFun = this.CancelFun = option.CancelFun || false;
            this.editTitle();
            this.editHtml();
            if(ConfirmFun){ 
                this.showBottom();
            }else{
                this.hideBottom();
            }
            this.show();
        },
        editTitle : function(){   //title div生成
            var prompt_title = this.$("prompt_title");
            if(this.title){
                prompt_title.innerHTML = this.title;
                //添加拖拽方法
                this.drag();
                prompt_title.style.display = "block";
            }else{
                prompt_title.style.display = "none";
            }
        },
        editHtml : function(){
            var prompt_body = this.$("prompt_body");
            prompt_body.innerHTML = this._temp;
        },
        createPrompt : function(){    //创建弹出的div
            var doc = document,
                Div = doc.createElement("div");
            Div.id = "prompt";
            Div.innerHTML = "<span id='prompt_close'></span><div id='prompt_title'></div><div id='prompt_body'></div><div id='prompt_bottom'></div>";
            doc.body.appendChild(Div);

            var prompt_close = this.$("prompt_close");
            this.addHandler(prompt_close,"click",this.hide);
        },
        showBottom : function(){    //创建确定 取消按钮
            var that = this,
                prompt_bottom = that.$("prompt_bottom");

            if(that.CancelFun){
                prompt_bottom.innerHTML = "<a class='btn' id='ConfirmFun'>确定</a><a class='btn' id='CancelFun'>取消</a>";
                that.addHandler(that.$("ConfirmFun"),"click",function(){
                    that.hide();
                    that.ConfirmFun();
                });

                that.addHandler(that.$("CancelFun"),"click",function(){
                    that.hide();
                    that.CancelFun();
                });
            }else{
                prompt_bottom.innerHTML = "<a class='btn' id='ConfirmFun'>确定</a>";
                that.addHandler(that.$("ConfirmFun"),"click",function(){
                    that.hide();
                    that.ConfirmFun();
                });
            }

            prompt_bottom.style.display = "block";
        },
        hideBottom : function(){
            this.$("prompt_bottom").innerHTML = "";
            this.$("prompt_bottom").style.display = "none";
        },
        show : function(){
            var promptDiv = this.$("prompt"),
                shadeDiv = this.$("shadeDiv"),
                bodyHeight = document.documentElement.clientHeight  || document.body.clientHeight ;
            promptDiv.style.display = "block";
            promptDiv.style.width = this.width + "px";
            promptDiv.style.height = this.height + "px";
            promptDiv.style.left = (this.bodyWidth/2-this.width/2)+  "px";
            promptDiv.style.top = (bodyHeight/2-this.height/2) +  "px";
            if(this.shade){
                shadeDiv.style.display = "block";
                if (document.all) {
                     shadeDiv.filters.alpha.opacity = this.opacity;
                     shadeDiv.style.zoom = 1 ;
                }else {
                     shadeDiv.style.opacity = this.opacity / 100;
                }
            }
            if(this.IE6()) promptDiv.appendChild(this.createIframe());    //ie6添加iframe
        },
        hide : function(){
            $.lvpop.$("prompt").style.display = "none";
            $.lvpop.$("shadeDiv").style.display = "none";
        },
        createShade : function(){ //创建遮罩层
            var doc = document,
                bodyWidth = this.bodyWidth = doc.documentElement.clientWidth || doc.body.clientWidth,
                bodyHeight = this.bodyHeight = doc.documentElement.scrollHeight || doc.body.scrollHeight,
                Div = doc.createElement("div");
            Div.id = "shadeDiv";
            Div.style.height = bodyHeight + "px";
            Div.style.width = bodyWidth + "px";
            Div.style.opacity = 0.2;
            if(this.IE6()) Div.appendChild(this.createIframe("shadeDiv"));    //ie6添加iframe
            doc.body.appendChild(Div);
        },
        createIframe : function(div){
            var width,height;
            if(div == "shadeDiv"){
                width = this.bodyWidth;
                height = this.bodyHeight;
            }else{
                width = this.width;
                height = this.height;
            }
            var Iframe =  document.createElement('iframe');
            Iframe.style.position = 'absolute';
            Iframe.style.zIndex = '-1';
            Iframe.style.left = '-1px';
            Iframe.style.top = 0;
            Iframe.style.border = 0;
            Iframe.style.filter = 'alpha(opacity=0)';
            Iframe.style.width = width + 'px';
            Iframe.style.height = height + 'px';
            return Iframe;
        },
        isDown : false,
        drag : function(){    //添加拖拽事件
            var that = this,
                mouseX,mouseY,objY,objX,
                prompt_title = this.$("prompt_title"),
                prompt = this.$("prompt");

            that.addHandler(prompt_title,"mousedown",function(event){
                var event = window.event || event;
                if(event.button == 0 || event.button==1){  //鼠标左键chrome=0 ie=1
                    (!window.ActiveXObject) ? event.preventDefault() : event.returnValue = false; //取消默认行为
                    mouseX = event.clientX;
                    mouseY = event.clientY;
                    objY = parseInt(prompt.style.top);
                    objX = parseInt(prompt.style.left);
                    that.isDown = true;
                }
            });

            that.addHandler(document,"mousemove",function(event){
                if(that.isDown){
                    var event = window.event || event;
                    // (!window.ActiveXObject) ? event.preventDefault() : event.returnValue = false; //取消默认行为
                    prompt.style.top = event.clientY - mouseY + objY + "px";
                    prompt.style.left = event.clientX - mouseX + objX + "px";
                }
            });

            that.addHandler(document,"mouseup",function(){
               that.isDown = false;
            });
        },
        getPosition : function(obj) { //获取元素在页面里的位置和宽高
            var top = 0,
                left = 0,
                width = obj.offsetWidth,
                height = obj.offsetHeight;
      
            while(obj.offsetParent){
                top += obj.offsetTop;
                left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
      
            return {"top":top,"left":left,"width":width,"height":height};
        },
        addHandler:function(node, type, handler){
            node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on'+ type, handler);
        },
        IE6 : function(){
            return !!window.ActiveXObject && !window.XMLHttpRequest;
        }

    };
})(jQuery);
~(function($) {
  $.fn.imgHover = function(options) {
    var settings = {
      opacity: 0.6,
      bgcolor: '#333',
      duration: 500
    };
    if (options) $.extend(settings, options);
    return this.find('img').each(function() {
      var $a = $(this),
      $b = $a.parent(),
      $c = $('<span style="position: absolute;top: 0;left: 0;width: 100%;display:none;height: 100%;background-image:url(imghover.png);background-position:center;background-repeat:no-repeat;"></span>').appendTo($b);
      $b.hover(function() {
        $b.css({
          'margin-left': 'auto',
          'margin-right': 'auto',
          width: $a.width(),
          height: $a.height(),
          display: 'inline-block',
          position: 'relative',
          'background-color': settings.bgcolor
        });
        $c.fadeIn();
        $a.stop().animate({
          opacity: settings.opacity
        },
        settings.duration);
      },
      function() {
        $a.stop().animate({
          opacity: 1
        },
        settings.duration);
        $c.fadeOut();
      })
    });
  };
})(jQuery);
~function($) {
    $.lvcheck = {};
    $.lvcheck.checkempty = function(value){
        if (value.length == 0) {
            return true;
        }else {
            return false;
        }
    };
    $.lvcheck.checkstr = function(value){
        var Regx = /^[A-Za-z]+$/;
        if (Regx.test(value)) {
            return true;
        }else {
            return false;
        }
    };
    $.lvcheck.checknum = function(value){
        var Regx = /^[0-9]+$/;
        if (Regx.test(value)) {
            return true;
        }else {
            return false;
        }
    };
    $.lvcheck.checkname = function(value){
        var Regx = /^[A-Za-z0-9\_\-]+$/;
        if (Regx.test(value)) {
            return true;
        }else {
            return false;
        }
    };
    $.lvcheck.checklen = function(value, min, max){
        var len = value.length;
        if(len >= min && len <= max){
            return true;
        }else{
            return false;
        }
    };
    $.lvcheck.checkemail = function(value){
        var Regx = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        if(Regx.test(value)){
            return true;
        }else{
            return false;
        }
    };
    $.lvcheck.checkphone = function(value){
        var Regx = /^1[3-8]\d{9}$/;
        if(Regx.test(value)){
            return true;
        }else{
            return false;
        }
    };
    $.lvcheck.checketel = function(value){
        var telRegWithArea = /^[0][1-9]{2,3}-[0-9]{5,10}$/;
        var telRegNoArea = /^[1-9]{1}[0-9]{5,8}$/;
        if( value.length > 9 ) {
            if( telRegWithArea.test(value) ){
                return true;
            }else{
                return false;
            }
        }else{
            if( telRegNoArea.test( value ) ){
                return true;
            }else{
                return false;
            }
        }
    };
    $.lvcheck.checkip = function(value){
        var Regx = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
         if(value.match(Regx)){
            return true;
         } else {
            return false;
         }
    };
    $.lvcheck.checkreg = function(value, reg){
        if(value.match(reg)){
            return true;
         } else {
            return false;
         }
    };
}(jQuery);
~function($) {
    var ZeroClipboard = {
        clients: {}, // registered upload clients on page, indexed by id
        nextId: 1, // ID of next movie
        dispatch: function(id, eventName, args) {       
            var client = this.clients[id];
            client && client.receiveEvent(eventName, args);
        },
        register: function(id, client) {
            this.clients[id] = client;
        },
        Client: function( targetID, textID, callback) {
            this.id = ZeroClipboard.nextId++;
            this.movieId = 'ZeroClipboardMovie_' + this.id;
            this.targetID = targetID;
            this.textID = textID;
            this.callback = callback;
            ZeroClipboard.register(this.id, this);
            this.init();
        },
        success: function(args){
            alert("复制成功:" + args + "！");
        }
    };
    ZeroClipboard.Client.prototype = {
        id: 0, // unique ID for us
        movie: null, // reference to movie object
        targetID: null,
        textID: null, // text to copy to clipboard
        callback: null,
        handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
        
        init: function() {
            this.targetObj = $("#" + this.targetID);
            this.textObj = $("#" + this.textID);
            this.targetObj[0].innerHTML = this.getHTML( this.targetObj.width(), this.targetObj.height() );
        },
        getHTML: function(width, height) {
            var html = '';
            var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;
            if (navigator.userAgent.match(/MSIE/)) {
                var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
                html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
            }else {
                html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
            }
            return html;
        },
        setText: function(newText) {
            this.movie.setText(newText);
        },
        setHandCursor: function(enabled) {
            this.handCursorEnabled = enabled;
            this.movie.setHandCursor(enabled);
        },
        receiveEvent: function(eventName, args) {
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');
            if(eventName == 'complete'){
                if(this.callback){
                    this.callback(args);
                }else{
                    ZeroClipboard.success(args);
                }
            }else if(eventName == 'load'){
                this.movie = document.getElementById(this.movieId);
                if (!this.movie || this.movie == null) {
                    var self = this;
                    setTimeout( function() { self.receiveEvent('load', null); }, 1 );
                    return false;
                }else{
                    this.movie.setHandCursor( this.handCursorEnabled );
                }
            }else if(eventName == 'mousedown'){
                this.movie.setText( this.textObj.val() );
                this.targetObj.data("events")['mousedown'] && this.targetObj.trigger('mousedown');
            }else{
                this.targetObj.data("events")[eventName] && this.targetObj.trigger(eventName);
            }
        }
    };
    $.lvcopy = {};
    $.lvcopy.init = function(p){
        var config = {
            targetID : null,
            textID : null,
            moviePath : './images/ZeroClipboard.swf',
            callback : null
        };
        var config = $.extend(config, p || {});
        ZeroClipboard.moviePath = config.moviePath;
        new ZeroClipboard.Client(config.targetID, config.textID, config.callback);
    };
}(jQuery);
~function($) {
    $.lvscrolltop = {};
    $.lvscrolltop.controlHTML = '<div></div>';
    $.lvscrolltop.state = {isvisible:false, shouldvisible:false};
    $.lvscrolltop.setting = {
        startline: 100,
        scrollto: 0,
        offsetx: 10, 
        offsety: 10,
        background: "./images/gotop.png",
        width: 36,
        height: 36,
        anchorkeyword : '#top',
        scrollduration: 1000, 
        fadeduration: [500, 100]
    };
    $.lvscrolltop.scrollup = function(){
        if (!this.cssfixedsupport) //if control is positioned using JavaScript
            this.$control.css({opacity:0}) //hide control immediately after clicking it
        var dest=isNaN(this.setting.scrollto)? this.setting.scrollto : parseInt(this.setting.scrollto)
        if (typeof dest=="string" && jQuery('#'+dest).length==1) //check element set by string exists
            dest=jQuery('#'+dest).offset().top
        else
            dest=0
        this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
    };
    $.lvscrolltop.keepfixed = function(){
        var $window=jQuery(window)
        var controlx=$window.scrollLeft() + $window.width() - this.$control.width() - this.setting.offsetx
        var controly=$window.scrollTop() + $window.height() - this.$control.height() - this.setting.offsety
        this.$control.css({left:controlx+'px', top:controly+'px'})
    };
    $.lvscrolltop.togglecontrol = function(){
        var scrolltop=jQuery(window).scrollTop()
        if (!this.cssfixedsupport)
            this.keepfixed()
        this.state.shouldvisible=(scrolltop>=this.setting.startline)? true : false
        if (this.state.shouldvisible && !this.state.isvisible){
            this.$control.stop().animate({opacity:1}, this.setting.fadeduration[0])
            this.state.isvisible=true
        }
        else if (this.state.shouldvisible==false && this.state.isvisible){
            this.$control.stop().animate({opacity:0}, this.setting.fadeduration[1])
            this.state.isvisible=false
        }
    };
    $.lvscrolltop.init = function(p){
        $.lvscrolltop.setting = $.extend($.lvscrolltop.setting, p || {});
        jQuery(document).ready(function($){
            var mainobj=$.lvscrolltop;
            var iebrws=document.all;
            mainobj.cssfixedsupport=!iebrws || iebrws && document.compatMode=="CSS1Compat" && window.XMLHttpRequest //not IE or IE7+ browsers in standards mode
            mainobj.$body=(window.opera)? (document.compatMode=="CSS1Compat"? $('html') : $('body')) : $('html,body')
            mainobj.$control=$('<div id="topcontrol">'+mainobj.controlHTML+'</div>').css({position:mainobj.cssfixedsupport? 'fixed' : 'absolute', bottom:mainobj.setting.offsety, right:mainobj.setting.offsetx, opacity:0, cursor:'pointer'}).attr({title:'Scroll Back to Top'}).click(function(){mainobj.scrollup(); return false}).appendTo('body');
            $("#topcontrol").find('div').width($.lvscrolltop.setting.width).height($.lvscrolltop.setting.height).css('background', 'url(' + $.lvscrolltop.setting.background + ')');
            if (document.all && !window.XMLHttpRequest && mainobj.$control.text()!='') //loose check for IE6 and below, plus whether control contains any text
                mainobj.$control.css({width:mainobj.$control.width()}) //IE6- seems to require an explicit width on a DIV containing text
            mainobj.togglecontrol()
            $('a[href="' + mainobj.setting.anchorkeyword +'"]').click(function(){
                mainobj.scrollup()
                return false
            })
            $(window).bind('scroll resize', function(e){
                mainobj.togglecontrol()
            })
        })
    }
}(jQuery);
~function($){
    $.fn.jrumble = function(options){
        var defaults = {
            x: 2,
            y: 2,
            rotation: 1,
            speed: 15,
            opacity: false,
            opacityMin: .5
        },
        opt = $.extend(defaults, options);       
        return this.each(function(){
            var $this = $(this),                
                x = opt.x*2,
                y = opt.y*2,
                rot = opt.rotation*2,
                speed = (opt.speed === 0) ? 1 : opt.speed,          
                opac = opt.opacity,
                opacm = opt.opacityMin,
                inline,
                interval;      
            var rumbler = function(){               
                var rx = Math.floor(Math.random() * (x+1)) -x/2,
                    ry = Math.floor(Math.random() * (y+1)) -y/2,
                    rrot = Math.floor(Math.random() * (rot+1)) -rot/2,
                    ropac = opac ? Math.random() + opacm : 1;               
                rx = (rx === 0 && x !== 0) ? ((Math.random() < .5) ? 1 : -1) : rx;
                ry = (ry === 0 && y !== 0) ? ((Math.random() < .5) ? 1 : -1) : ry;  
                if($this.css('display') === 'inline'){
                    inline = true;
                    $this.css('display', 'inline-block');
                }           
                $this.css({
                    'position':'relative',
                    'left':rx+'px',
                    'top':ry+'px',
                    '-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity='+ropac*100+')',
                    'filter':'alpha(opacity='+ropac*100+')',                    
                    '-moz-opacity':ropac,                   
                    '-khtml-opacity':ropac,                 
                    'opacity':ropac,
                    '-webkit-transform':'rotate('+rrot+'deg)', 
                    '-moz-transform':'rotate('+rrot+'deg)', 
                    '-ms-transform':'rotate('+rrot+'deg)',
                    '-o-transform':'rotate('+rrot+'deg)', 
                    'transform':'rotate('+rrot+'deg)'
                });
            };
            var reset = {
                'left':0,
                'top':0,
                '-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)',
                'filter':'alpha(opacity=100)',                  
                '-moz-opacity':1,                   
                '-khtml-opacity':1,                 
                'opacity':1,
                '-webkit-transform':'rotate(0deg)',
                '-moz-transform':'rotate(0deg)',
                '-ms-transform':'rotate(0deg)',
                '-o-transform':'rotate(0deg)',
                'transform':'rotate(0deg)'
            };
            $this.bind({
                'startRumble': function(e){
                    e.stopPropagation();
                    clearInterval(interval);
                    interval = setInterval(rumbler, speed)
                },
                'stopRumble': function(e){
                    e.stopPropagation();
                    clearInterval(interval);
                    if(inline){
                        $this.css('display', 'inline');
                    }
                    $this.css(reset);
                }
            });
        });// End return this.each
    };// End $.fn.jrumble
}(jQuery);
~function($) {
    $.extend({
        progressBar: new function() {
            this.defaults = {
                increment   : 2,
                speed       : 15,
                speedFactor : 10,
                showText    : true,                                         // show text with percentage in next to the progressbar? - default : true
                textSize    : 14,
                textWeight  : 900,
                textFont    : 'Arial',
                width       : 220,                                          // Width of the progressbar - don't forget to adjust your image too!!!
                boxImage    : '/images/progressbox.gif',     // boxImage : image around the progress bar
                barImage    : '/images/progressbar.gif', // Image to use in the progressbar. Can be an array of images too.
                height      : 19,                                           // Height of the progressbar - don't forget to adjust your image too!!!
                maindiv     : 'xprogressbarmain',
                subdiv      : 'xprogressbarsub',
                subclass    : 'xprogressbarsubing',
                lock        : false
            };
            /* public methods */
            this.construct = function(arg1, arg2) {
                var argpercentage   = null;
                var argconfig       = null;
                if (arg1 != null) {
                    if (!isNaN(arg1)) {
                        argpercentage   = arg1;
                        if (arg2 != null) {
                            argconfig   = arg2; }
                    } else {
                        argconfig       = arg1; 
                    }
                }
                var config = $.extend({}, $.progressBar.defaults, argconfig);
                var barwidth = parseInt(argpercentage * (config.width / 100));
                if (($("#" + config.maindiv).html() == null) && ($("#" + config.subdiv).html() == null)){
                    this.html("<div id=\"" + config.maindiv + "\" ><div id=\"" + config.subdiv + "\" ></div></div>");
                    var $box = $("#" + config.maindiv);
                    var $bar = $("#" + config.subdiv);
                    var initwidth = 1;
                }else{
                    var $box = $("#" + config.maindiv);
                    var $bar = $("#" + config.subdiv);
                    var initwidth = $bar.width();
                    clearInterval(t);
                }
                $box.css({ "width":config.width + "px", "height":config.height + "px", "background-image": "url(" + config.boxImage + ")"}); 
                $bar.css({ "width":initwidth + "px", "height":config.height + "px", "background-image": "url(" + config.barImage + ")" , "text-align" : "center" , "line-height" : "21px", "font-size" : config.textSize + "px","font-weight" : config.textWeight,"font-family" : config.textFont });
                t = setInterval(function() {
                    if (barwidth != parseInt(parseInt($bar.width()) - 0.5)) {
                        var speed = parseInt(Math.abs(barwidth - parseInt($bar.width())) / config.speedFactor);
                        if (speed < 1) speed = 1;
                        if (barwidth < parseInt(parseInt($bar.width()) - 0.5)) {
                            $bar.width(parseInt($bar.width()) - speed);
                            $bar.html(parseInt(parseInt($bar.width())/config.width*100) + "%");
                        }else {
                            $bar.width(parseInt($bar.width()) + speed);
                            $bar.html(parseInt(parseInt($bar.width())/config.width*100) + "%");
                        }
                    }else {
                        clearInterval(t);
                    }
                },config.speed);
            };
        }
    });
    $.fn.extend({
        progressBar: $.progressBar.construct
    });
}(jQuery);
~function($) {
    $.noty = function(options, customContainer) {
        var base = {};
        var $noty = null;
        var isCustom = false;
        base.init = function(options) {
            base.options = $.extend({}, $.noty.defaultOptions, options);
            base.options.type = base.options.cssPrefix+base.options.type;
            base.options.id = base.options.type+'_'+new Date().getTime();
            base.options.layout = base.options.cssPrefix+'layout_'+base.options.layout;

            if (base.options.custom.container) customContainer = base.options.custom.container;
            isCustom = ($.type(customContainer) === 'object') ? true : false;

            return base.addQueue();
        };
        // Push notification to queue
        base.addQueue = function() {
            var isGrowl = ($.inArray(base.options.layout, $.noty.growls) == -1) ? false : true;
        if (!isGrowl) (base.options.force) ? $.noty.queue.unshift({options: base.options}) : $.noty.queue.push({options: base.options});
        return base.render(isGrowl);
        };
        // Render the noty
        base.render = function(isGrowl) {
        // Layout spesific container settings
        var container = (isCustom) ? customContainer.addClass(base.options.theme+' '+base.options.layout+' noty_custom_container') : $('body');
        if (isGrowl) {
            if ($('ul.noty_cont.' + base.options.layout).length == 0)
                container.prepend($('<ul/>').addClass('noty_cont ' + base.options.layout));
            container = $('ul.noty_cont.' + base.options.layout);
        } else {
            if ($.noty.available) {
                    var fromQueue = $.noty.queue.shift(); // Get noty from queue
                    if ($.type(fromQueue) === 'object') {
                        $.noty.available = false;
                        base.options = fromQueue.options;
                    } else {
                        $.noty.available = true; // Queue is over
                        return base.options.id;
                    }
            } else {
                return base.options.id;
            }
        }
        base.container = container;
        // Generating noty bar
        base.bar = $('<div class="noty_bar"/>').attr('id', base.options.id).addClass(base.options.theme+' '+base.options.layout+' '+base.options.type);
        $noty = base.bar;
        switch(base.options.type){
            case 'noty_success': base.options.text = '<img src="./images/noty_success.png" style="margin-right:10px;"/>' + base.options.text;break;
            case 'noty_notification': base.options.text = '<img src="./images/noty_noti.png" style="margin-right:10px;"/>' + base.options.text;break;
            case 'noty_warning': base.options.text = '<img src="./images/noty_warning.png" style="margin-right:10px;"/>' + base.options.text;break;
            case 'noty_error': base.options.text = '<img src="./images/noty_error.png" style="margin-right:10px;"/>' + base.options.text;break;
            case 'noty_information': base.options.text = '<img src="./images/noty_info.png" style="margin-right:10px;"/>' + base.options.text;break;
            defaults: base.options.text = '<img src="./images/noty_info.png" style="margin-right:10px;"/>' + base.options.text;break;
        }
        $noty.append(base.options.template).find('.noty_text').html(base.options.text);
        $noty.data('noty_options', base.options);
        // Close button display
        (base.options.closeButton) ? $noty.addClass('noty_closable').find('.noty_close').show() : $noty.find('.noty_close').remove();
        // Bind close event to button
        $noty.find('.noty_close').bind('click', function() { $noty.trigger('noty.close'); });
        // If we have a button we must disable closeOnSelfClick and closeOnSelfOver option
        if (base.options.buttons) base.options.closeOnSelfClick = base.options.closeOnSelfOver = false;
        // Close on self click
        if (base.options.closeOnSelfClick) $noty.bind('click', function() { $noty.trigger('noty.close'); }).css('cursor', 'pointer');
        // Close on self mouseover
        if (base.options.closeOnSelfOver) $noty.bind('mouseover', function() { $noty.trigger('noty.close'); }).css('cursor', 'pointer');
        // Set buttons if available
        if (base.options.buttons) {
                $buttons = $('<div/>').addClass('noty_buttons');
                $noty.find('.noty_message').append($buttons);
                $.each(base.options.buttons, function(i, button) {
                    bclass = (button.type) ? button.type : 'gray';
                    $button = $('<button/>').addClass(bclass).html(button.text).appendTo($noty.find('.noty_buttons'))
                    .bind('click', function() {
                        if ($.isFunction(button.click)) {
                            button.click.call($button, $noty);
                        }
                    });
                });
            }
        return base.show(isGrowl);
        };
        base.show = function(isGrowl) {
            // is Modal?
            if (base.options.modal) $('<div/>').addClass('noty_modal').addClass(base.options.theme).prependTo($('body')).fadeIn('fast');
            $noty.close = function() { return this.trigger('noty.close'); };
            // Prepend noty to container
            (isGrowl) ? base.container.prepend($('<li/>').append($noty)) : base.container.prepend($noty);
        // topCenter and center specific options
        if (base.options.layout == 'noty_layout_topCenter' || base.options.layout == 'noty_layout_center') {
                $.noty.reCenter($noty);
            }
        $noty.bind('noty.setText', function(event, text) {
            $noty.find('.noty_text').html(text); 
            if (base.options.layout == 'noty_layout_topCenter' || base.options.layout == 'noty_layout_center') {
                $.noty.reCenter($noty);
            }
        });
        $noty.bind('noty.setType', function(event, type) {
            $noty.removeClass($noty.data('noty_options').type); 
            type = $noty.data('noty_options').cssPrefix+type;
            $noty.data('noty_options').type = type;
            $noty.addClass(type);
            if (base.options.layout == 'noty_layout_topCenter' || base.options.layout == 'noty_layout_center') {
                $.noty.reCenter($noty);
            }
        });
        $noty.bind('noty.getId', function(event) {
            return $noty.data('noty_options').id;
        });
        // Bind close event
        $noty.one('noty.close', function(event) {
                var options = $noty.data('noty_options');
        if(options.onClose){options.onClose();}
                // Modal Cleaning
                if (options.modal) $('.noty_modal').fadeOut('fast', function() { $(this).remove(); });
                $noty.clearQueue().stop().animate(
                        $noty.data('noty_options').animateClose,
                        $noty.data('noty_options').speed,
                        $noty.data('noty_options').easing,
                        $noty.data('noty_options').onClosed)
                .promise().done(function() {
                    // Layout spesific cleaning
                    if ($.inArray($noty.data('noty_options').layout, $.noty.growls) > -1) {
                        $noty.parent().remove();
                    } else {
                        $noty.remove();
                        // queue render
                        $.noty.available = true;
                        base.render(false);
                    }
                });
            });
        // Start the show
      if(base.options.onShow){base.options.onShow();}
        $noty.animate(base.options.animateOpen, base.options.speed, base.options.easing, base.options.onShown);
        // If noty is have a timeout option
        if (base.options.timeout) $noty.delay(base.options.timeout).promise().done(function() { $noty.trigger('noty.close'); });
            return base.options.id;
        };
        // Run initializer
        return base.init(options);
    };
    // API
    $.noty.get = function(id) { return $('#'+id); };
    $.noty.close = function(id) {
        //remove from queue if not already visible
        for(var i=0;i<$.noty.queue.length;) {
            if($.noty.queue[i].options.id==id)
                $.noty.queue.splice(id,1);
            else
                i++;
        }
        //close if already visible
        $.noty.get(id).trigger('noty.close');
    };
    $.noty.setText = function(id, text) {
        $.noty.get(id).trigger('noty.setText', text);
    };
    $.noty.setType = function(id, type) {
        $.noty.get(id).trigger('noty.setType', type);
    };
    $.noty.closeAll = function() {
        $.noty.clearQueue();
        $('.noty_bar').trigger('noty.close');
    };
    $.noty.reCenter = function(noty) {
        noty.css({'left': ($(window).width() - noty.outerWidth()) / 2 + 'px'});
    };
    $.noty.clearQueue = function() {
        $.noty.queue = [];
    };
  var windowAlert = window.alert;
  $.noty.consumeAlert = function(options){
    window.alert = function(text){
      if(options){options.text = text;}
      else{options = {text:text};}
      $.noty(options);
    };
  }
  $.noty.stopConsumeAlert = function(){
    window.alert = windowAlert;
  }
    $.noty.queue = [];
    $.noty.growls = ['noty_layout_topLeft', 'noty_layout_topRight', 'noty_layout_bottomLeft', 'noty_layout_bottomRight'];
    $.noty.available = true;
    $.noty.defaultOptions = {
        layout: 'top',
        theme: 'noty_theme_default',
        animateOpen: {height: 'toggle'},
        animateClose: {height: 'toggle'},
        easing: 'swing',
        text: '',
        type: 'alert',
        speed: 500,
        timeout: 5000,
        closeButton: false,
        closeOnSelfClick: true,
        closeOnSelfOver: false,
        force: false,
        onShow: false,
        onShown: false,
        onClose: false,
        onClosed: false,
        buttons: false,
        modal: false,
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        cssPrefix: 'noty_',
        custom: {
            container: null
        }
    };
    $.fn.noty = function(options) {
        return this.each(function() {
             (new $.noty(options, $(this)));
        });
    };
}(jQuery);
~function($){
    $.fn.lvtip = function(settings){
        var defaultSettings = {
            color       : 'yellow',
            timeout     : 500
        }
        var supportedColors = ['red','green','blue','white','yellow','black'];
        settings = $.extend(defaultSettings,settings);
        return this.each(function(){
            var elem = $(this);
            if(!elem.attr('title')) return true;
            var scheduleEvent = new eventScheduler();
            var tip = new Tip(elem.attr('title'));
            elem.append(tip.generate()).addClass('colorTipContainer');
            var hasClass = false;
            for(var i=0;i<supportedColors.length;i++){
                if(elem.hasClass(supportedColors[i])){
                    hasClass = true;
                    break;
                }
            }
            if(!hasClass){
                elem.addClass(settings.color);
            }
            elem.hover(function(){
                tip.show();
                scheduleEvent.clear();

            },function(){
                scheduleEvent.set(function(){
                    tip.hide();
                },settings.timeout);

            });
            elem.removeAttr('title');
        });
        
    }
    function eventScheduler(){}
    eventScheduler.prototype = {
        set : function (func,timeout){
            this.timer = setTimeout(func,timeout);
        },
        clear: function(){
            clearTimeout(this.timer);
        }
    }
    function Tip(txt){
        this.content = txt;
        this.shown = false;
    }
    Tip.prototype = {
        generate: function(){
            return this.tip || (this.tip = $('<span class="colorTip">'+this.content+'<span class="pointyTipShadow"></span><span class="pointyTip"></span></span>'));
        },
        show: function(){
            if(this.shown) return;
            this.tip.css({'margin-left':-this.tip.outerWidth()/2, 'top':-25-this.tip.height()}).fadeIn('fast');
            this.shown = true;
        },
        hide: function(){
            this.tip.fadeOut();
            this.shown = false;
        }
    }
}(jQuery);
$.fn.extend({//添加滚轮事件//by jun
    mousewheel:function(Func){
        return this.each(function(){
            var _self = this;
            _self.D = 0;//滚动方向
            if($.browser.msie||$.browser.safari){
               _self.onmousewheel=function(){_self.D = event.wheelDelta;event.returnValue = false;Func && Func.call(_self);};
            }else{
               _self.addEventListener("DOMMouseScroll",function(e){
                    _self.D = e.detail>0?-1:1;
                    e.preventDefault();
                    Func && Func.call(_self);
               },false); 
            }
        });
    }
});
$.fn.extend({
    jscroll:function(j){
        return this.each(function(){
            j = j || {}
            var jun = { W:"15px"
                        ,BgUrl:""
                        ,Bg:"#efefef"
                        ,Fn:function(){}}
            j.W = j.W||jun.W;
            j.BgUrl = j.BgUrl||jun.BgUrl;
            j.Bg = j.Bg||jun.Bg;
            j.Fn = j.Fn||jun.Fn;
            var _self = this;
            var Stime,Sp=0,Isup=0;
            $(_self).css({overflow:"hidden",position:"relative",padding:"0px"});
            var dw = $(_self).width(), dh = $(_self).height()-1;
            var sw = j.W ? parseInt(j.W) : 21;
            var sl = dw - sw
            var bw = 0;
            if($(_self).children(".jscroll-c").height()==null){//存在性检测
                $(_self).wrapInner("<div class='jscroll-c' style='top:0px;z-index:9999;zoom:1;position:relative'></div>");
                $(_self).children(".jscroll-c").prepend("<div style='height:0px;overflow:hidden'></div>");
                $(_self).append("<div class='jscroll-e' unselectable='on' style='height:100%;top:0px;right:0;-moz-user-select:none;position:absolute;overflow:hidden;z-index:10000;'><div class='jscroll-h'  unselectable='on' style='width:10px;margin-left:2px;position:absolute;left:0;-moz-user-select:none;border-radius: 5px;background-image:url(./images/so.png);'></div></div>");
            }
            var jscrollc = $(_self).children(".jscroll-c");
            var jscrolle = $(_self).children(".jscroll-e");
            var jscrollh = jscrolle.children(".jscroll-h");
            var jscrollu = jscrolle.children(".jscroll-u");
            var jscrolld = jscrolle.children(".jscroll-d");
            if($.browser.msie){document.execCommand("BackgroundImageCache", false, true);}
            jscrollc.css({"padding-right":sw});
            jscrolle.css({width:sw});
            jscrollh.css({top:bw});
            var sch = jscrollc.height();
            var sh = (dh-2*bw)*dh / sch
            if(sh<10){sh=10}
            var wh = sh/6//滚动时候跳动幅度
            var curT = 0,allowS=false;
            if(sh>20){
                jscrollh.height(sh);
            }else{
                jscrollh.height(20);
            }
            if(sch<=dh){
                jscrollc.css({padding:0});
                jscrolle.css({display:"none"});
            }else{
                allowS=true;
                jscrolle.css({display:""});
            }

            jscrollh.bind("mousedown",function(e){
                j['Fn'] && j['Fn'].call(_self);
                Isup=1;
                var pageY = e.pageY ,t = parseInt($(this).css("top"));
                $(document).mousemove(function(e2){
                     curT =t+ e2.pageY - pageY;//pageY浏览器可视区域鼠标位置，screenY屏幕可视区域鼠标位置
                        setT();
                });
                $(document).mouseup(function(){
                    Isup=0;
                    $(document).unbind();
                });
                return false;
            });
            _self.timeSetT = function(d){
                var self=this;
                if(d=="u"){curT-=wh;}else{curT+=wh;}
                setT();
                Sp+=2;
                var t =500 - Sp*50;
                if(t<=0){t=0};
                Stime = setTimeout(function(){self.timeSetT(d);},t);
            }
            jscrolle.bind("mousedown",function(e){
                    j['Fn'] && j['Fn'].call(_self);
                            curT = curT + e.pageY - jscrollh.offset().top - sh/2;
                            asetT();
                            return false;
            });
            function asetT(){               
                        if(curT<bw){curT=bw;}
                        if(curT>dh-sh-bw){curT=dh-sh-bw;}
                        jscrollh.stop().animate({top:curT},100);
                        var scT = -((curT-bw)*sch/(dh-2*bw));
                        jscrollc.stop().animate({top:scT},1000);
            };
            function setT(){                
                        if(curT<bw){curT=bw;}
                        if(curT>dh-sh-bw){curT=dh-sh-bw;}
                        jscrollh.css({top:curT});
                        var scT = -((curT-bw)*sch/(dh-2*bw));
                        jscrollc.css({top:scT});
            };
            $(_self).mousewheel(function(){
                    if(allowS!=true) return;
                    j['Fn'] && j['Fn'].call(_self);
                        if(this.D>0){curT-=wh;}else{curT+=wh;};
                        setT();
            })
        });
    }
});