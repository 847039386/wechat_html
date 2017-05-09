var wechatCM = function(){

}

wechatCM.prototype = {

    emptyBox : function(cla2s){
        var box = document.createElement("div");
        box.className = cla2s;
        return box;
    },
    append : function (dom,elements){
        elements.forEach(function(ele){
            dom.appendChild(ele)
        })
        return dom;
    },
    create_dom : function(tp,cla2s,obj){
        var _this = this;
        var dom = {
            input : function(){
                var box = document.createElement("div");
                box.className = cla2s;
                var box_title = document.createElement("div");
                box_title.className = "input-group-addon";
                box_title.innerHTML = obj.title;
                var input = document.createElement("input");
                input.className = "form-control input-sm"
                input.setAttribute("name",obj.name);
                if(obj.text){
                    input.setAttribute("value",obj.text);
                }
                input.setAttribute("type","text");
                box.appendChild(box_title);
                box.appendChild(input)
                return box;
            },
            select : function(){
                var selected = obj.selected ? obj.selected : null;
                var box = document.createElement("div");
                box.className = cla2s;
                var box_title = document.createElement("div");
                box_title.className = "input-group-addon"
                box_title.innerHTML = obj.title;
                var select = document.createElement("select");
                select.setAttribute("name",obj.name);
                select.setAttribute("value",obj.value);
                select.className = "form-control input-sm";
                var activitys = obj.activitys
                activitys.forEach(function(activity){
                    var option = document.createElement("option");
                    option.innerHTML = activity.title;
                    option.setAttribute("value",activity.value);
                    if(selected && selected == activity.value){
                        option.setAttribute("selected",selected);
                    }
                    select.appendChild(option);
                })
                box.appendChild(box_title)
                box.appendChild(select)
                return box;
            },
            button : function(){
                var key_button_box = _this.emptyBox(cla2s)
                var buts = [];
                obj.buttons.forEach(function(btn){
                    var key_button = document.createElement("button");
                    key_button.innerHTML = btn.title
                    key_button.setAttribute("type","button")
                    key_button.className = btn.cla2s;
                    $(key_button).bind("click",btn.func);
                    buts.push(key_button)
                })
                _this.append(key_button_box,buts)
                return key_button_box;
            }
        }
        switch (tp){
            case 'input' :
                return dom.input();
                break;
            case 'select' :
                return dom.select();
                break;
            case 'button' :
                return dom.button();
                break;
            default :
                break;
        }
    },
    click_wechat_key : function(ele,info){
        var infog = {};
        if(info == null || info == undefined){
            infog.value = "";
            infog.key_name = "";
            infog.mediaId = "";
            infog.title = "";
            infog.description = "";
            infog.picurl = "";
            infog.url = "";
        }else{
            infog = info;
        }
        var state = {
            text : function(){
                var ele = document.createElement("textarea");
                ele.className = "w_100 form-control";
                ele.setAttribute("name","key_text");
                ele.setAttribute("rows","3");
                ele.innerText = infog.value;
                return ele;
            },
            image : function(){
                return this.bootstrap_group1("素材ID","图片的素材ID，源于微信。","mediaId",infog.mediaId)
            },
            article : function(){
                var article_all = document.createDocumentFragment() ;
                var _this = this;
                article_all.appendChild(_this.bootstrap_group1("标题&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;","文章标题","title",infog.title))
                article_all.appendChild(_this.bootstrap_group1("文章简介&nbsp;&nbsp;&nbsp;","文章的内容简介。","description",infog.description))
                article_all.appendChild(_this.bootstrap_group1("缩略图地址","图片的缩略图地址。","picurl",infog.picurl))
                article_all.appendChild(_this.bootstrap_group1("文章地址&nbsp;&nbsp;&nbsp;","文章的地址","url",infog.url))
                return article_all;
            },
            bootstrap_group1 : function(title,placeholder,name,value){
                var ele_p = document.createElement("div");
                var ele_c1 = document.createElement("div");
                var ele_c2 = document.createElement("input");
                ele_p.className = "input-group"
                ele_c1.className = "input-group-addon"
                ele_c2.className = "form-control input-sm"
                ele_c1.innerHTML = title
                ele_c2.setAttribute("type","text")
                ele_c2.setAttribute("name",name)
                ele_c2.setAttribute("placeholder",placeholder)
                ele_c2.setAttribute("value",value)
                ele_p.appendChild(ele_c1)
                ele_p.appendChild(ele_c2)
                return ele_p;
            }
        }
        var parent = $(ele);
        var kou ;
        var key_activity = $(parent).find("[name='key_activity']")

        if(key_activity.val()){
            kou = key_activity.val()
        }else{
            kou = $(parent).find("[name='user_activity']").val()
        }
        var wechat_body = $(parent).find(".key_body_box")[0];
        wechat_body.innerHTML = null;
        var element_wc;
        switch (kou){
            case "text" :
                element_wc = state.text();
                break;
            case "image" :
                element_wc = state.image();
                break;
            case "article" :
                element_wc = state.article();
                break;
            default :
                break;
        }
        wechat_body.appendChild(element_wc)
    },
    create_wechat_key : function(setup,obj){
        var _this = this;
        // key活动DOM的盒子
        var key_item = this.emptyBox("key_item")
        //组合关键字盒子
        var key_name_box ;
        switch (setup.type){
            case 1 :
                key_name_box = this.create_dom("input","p1_left w_30 input-group",{ title : setup.title , name : setup.name , text : obj[setup.name] });
                break;
            case 2 :
                var selected = obj ? obj[setup.name] : "";
                key_name_box  = this.create_dom("select","p1_left w_30 l_1 input-group",{
                    name : setup.name ,
                    selected : selected,
                    title : "发送内容" ,
                    activitys : [{ title:"关注" ,value: "true" }]
                })
                break;
            case 3 :
            default :
                var text = obj ? obj.key_name : "";
                key_name_box = this.create_dom("input","p1_left w_30 input-group",{ title : "关键字" , name : "key_name" , text : text });
                break;
        }
        var key_activity_box = this.create_dom("select","p1_left w_30 l_1 input-group",{
            name : "key_activity" ,
            selected : obj ? obj.key_activity : "" ,
            title : "发送内容" ,
            activitys : [{ title:"文字" ,value:"text" }, { title:"图片" ,value:"image" }, { title:"文章" ,value:"article"  }]
        })

        var key_button_box = this.create_dom("button","p1_left w_30 l_1 c_qb",{
            buttons : [
                { title : "确定", cla2s : "btn btn-success btn-sm w_30" ,func : function(){ _this.click_wechat_key(key_item); }},
                { title : "删除", cla2s : "btn btn-success btn-sm w_30" ,func : function(){ $(key_item).remove(); }}
            ]
        })
        var key_body_box = this.emptyBox("key_body_box w_100 p1_left")
        this.append(key_item,[key_name_box,key_activity_box,key_button_box,key_body_box]);
        if($("#" + setup.mainDom).find(".key_item").length < (setup.mainDomNumber ? setup.mainDomNumber : 999)){
            $("#" + setup.mainDom).append(key_item)
        }else{
            alert("注意关注类别只能有" + setup.mainDomNumber ? setup.mainDomNumber : 999 + "个。")
        }

        return key_item;
    },




    create_wechat_nav : function(obj){
        var obj_f = {};
        if(obj == null || obj == undefined){
            obj_f.nvk = ""
            obj_f.nvk_title = ""
            obj_f.nvk_title_kv = ""
        }else{
            obj_f = obj;
        }
        //承载盒子。
        var box = this.emptyBox("wechat_parent_2")
        //承载导航的盒子。
        var box_nav = this.emptyBox("wechat_parent_1_nav")
        //承载状态的盒子。
        var bnb_zt = this.create_dom("select","p1_left w_20 input-group",{ name : "nvk" , selected : obj_f.nvk , title : "方法" , activitys :[{ title:"链接" ,value:"view" },{ title:"关键字" ,value:"click" }] })
        //导航标题
        var bnb_title_box = this.create_dom("input","p1_left w_30 l_1 input-group",{ title : "名称" , name : "nvk_title"  , text : obj_f.nvk_title })
        //值
        var bnb_title_k_box = this.create_dom("input","p1_left w_30 l_1 input-group",{ title : "值" , name : "nvk_title_kv" , text : obj_f.nvk_title_kv })
        //删除按钮
        var btn_box = this.create_dom("button","p1_left w_10 l_1 c_qb",{
            buttons : [{ title : "删除", cla2s : "btn btn-success btn-sm" ,func : function(){ $(box).remove(); }}]
        })
        //盒子合体
        this.append(box_nav,[bnb_zt,bnb_title_box,bnb_title_k_box,btn_box])
        box.appendChild(box_nav);
        return box;
    },
    create_parent : function(obj){
        var obj_f = {}
        if(obj == null){
            obj_f.parent_z_nav_title = ""
            obj_f.zt_oo_p = ""
        }else{
            obj_f = obj;
        }
        var _this = this;
        var parent_box = this.emptyBox("wechat_parent_1 nav_we_c")
        var parent_item = this.emptyBox("wechat_parent_1_nav")
        var parent_item_box = this.emptyBox("child_wechat")
        var parent_box_fun = this.create_dom("select","p1_left w_20 input-group",{ name : "zt_oo_p" , title : "方法" , selected : obj_f.zt_oo_p, activitys :[{ title:"菜单" ,value:"nav" },{ title:"功能" ,value:"fun" }] })
        var parent_bt = this.create_dom("input","p1_left w_30 l_1 input-group",{ title : "名称" , name : "parent_z_nav_title" ,text : obj_f.parent_z_nav_title  })
        var btn_box = this.create_dom("button","p1_left w_30 l_1 c_qb",{
            buttons : [
                { title : "增加子菜单", cla2s : "btn btn-success btn-sm" , func : function(){ _this.click_wechat(parent_box)  }},
                { title : "删除", cla2s : "btn btn-success btn-sm" ,func : function(){ $(parent_box).remove(); }}
            ]
        })
        _this.append(parent_item,[parent_box_fun,parent_bt,btn_box])
        _this.append(parent_box,[parent_item,parent_item_box])
        return parent_box;
    },
    create_parent_html : function(obj){
        var _this = this;
        var p_n = $("#wechat_reset .nav_we_c").length;
        if(p_n < 3){
            $("#wechat_reset").append(_this.create_parent(obj))
            return _this.create_parent(obj);
        }else{
            alert("父级菜单最多只能建立三个！")
        }
    },
    click_wechat : function(ele){
        var _this = this;
        var parent = $(ele);
        var child = $(parent).find(".child_wechat")[0];
        var c_n = $(child).find(".wechat_parent_2").length
        if(c_n < 5){
            $(child).append(_this.create_wechat_nav());
        }else{
            alert("子级菜单最多只能建立五个！")
        }
    },
    build_type : function(doc){
        var nvk = $(doc).find("[name='nvk']").val();
        var nvk_title = $(doc).find("[name='nvk_title']").val();
        var nvk_title_kv = $(doc).find("[name='nvk_title_kv']").val();
        var mko = {};
        mko.type = nvk;
        mko.name = nvk_title;
        if(nvk == "click"){
            mko.key = nvk_title_kv
        }else{
            mko.url = nvk_title_kv
        }
        if(nvk_title == "" || nvk_title ==  null || nvk_title_kv == "" || nvk_title_kv == null){
            return null;
        }
        return mko;

    },
    zuhe_subButton : function(name,btns){
        var box = {};
        box.name = name
        box.sub_button = btns;
        if( name && btns.length > 0 ){
            return box;
        }else{
            return null;
        }
    },
    build_menu : function(){
        var _this = this;
        var box_arr = [];
        $(".nav_we_c").each(function(idx1,ele1){
            var zt = $(ele1).find("[name='zt_oo']").val()
            var zt_p = $(ele1).find("[name='zt_oo_p']").val()
            if(zt_p != "nav"){   //主菜单是view或click的时候。
                $(ele1).find(".child_wechat").each(function(idx2,ele2){
                    var pto =  $(ele2).find(".wechat_parent_2").last();
                    box_arr.push(_this.build_type(pto))
                })
            }else{
                var nav_name = $(ele1).find("[name='parent_z_nav_title']").val()
                $(ele1).find(".child_wechat").each(function(idx2,ele2){
                    var btns = [];
                    $(ele2).find(".wechat_parent_2").each(function(idx3,ele3){
                        if(_this.build_type(ele3)){
                            btns.push( _this.build_type(ele3))
                        }
                    })
                    if(_this.zuhe_subButton(nav_name,btns)){
                        box_arr.push(_this.zuhe_subButton(nav_name,btns))
                    }
                })
            }
        })
        var menu = {};
        menu.button = box_arr;
        return menu;
    },
    build_keys : function(setup){
        var key_activity_obj = {
            text : function(ele){
                var key_name = $(ele).find("[name='key_name']").val();
                var value = $(ele).find("[name='key_text']").val();
                switch (setup.type) {
                    case 2 :
                        var user_follow = $(ele).find("[name='"+ setup.selectName +"']").val();
                        return {
                            type : 'text',
                            follow : user_follow,
                            value : value
                        }
                        break;
                    case 1 :
                    case 3 :
                    default :
                        return {
                            type : 'text',
                            key : key_name,
                            value : value
                        }
                        break;
                }
            },
            image : function(ele){
                var mediaId = $(ele).find("[name='mediaId']").val();
                var key_name = $(ele).find("[name='key_name']").val();
                switch (setup.type) {
                    case 2 :
                        var user_follow = $(ele).find("[name='"+ setup.selectName +"']").val();
                        return {
                            type : 'image',
                            follow : user_follow,
                            mediaId : mediaId
                        }
                        break;
                    case 1 :
                    case 3 :
                    default :
                        return {
                            type : 'image',
                            key : key_name,
                            mediaId : mediaId
                        }
                        break;
                }
            },
            article : function(ele){
                var key_name = $(ele).find("[name='key_name']").val();
                var title = $(ele).find("[name='title']").val();
                var description = $(ele).find("[name='description']").val();
                var picurl = $(ele).find("[name='picurl']").val();
                var url = $(ele).find("[name='url']").val();
                switch (setup.type) {
                    case 2 :
                        var user_follow = $(ele).find("[name='"+ setup.selectName +"']").val();
                        return {
                            type : 'article',
                            follow : user_follow,
                            body : [{
                                title : title,
                                description : description,
                                picurl : picurl,
                                url : url
                            }]
                        }
                        break;
                    case 1 :
                    case 3 :
                    default :
                        return {
                            type : 'article',
                            key : key_name,
                            body : [{
                                title : title,
                                description : description,
                                picurl : picurl,
                                url : url
                            }]
                        }
                        break;
                }
            },
            go : function(ele){
                var obj = {};
                var activity;
                activity = $(ele).find("[name='key_activity']").val()
                switch (activity) {
                    case 'text' :
                        obj =  this.text(ele);
                        break;
                    case 'image' :
                        obj =  this.image(ele);
                        break;
                    case 'article' :
                        obj =  this.article(ele);
                        break;
                    default :
                        obj = { text : "暂时没有此功能"}
                        break
                }
                return obj;
            }
        }
        var keys = [];
        var key_bkl = true;



        var select_ed =  "#" +  setup.mainDom + " .key_item" ;
        $(select_ed).each(function(idx,ele){
            var key_val;
            var key_bol = $(ele).find(".key_body_box ").html();
            if(key_bol == null || key_bol == ""){
                key_bkl = false;
            }else{
                key_val  = key_activity_obj.go(ele);
            }
            if(key_bkl){
                keys.push(key_val);
            }
        })
        return keys;
    },
    build_json : function(){
        var obj = { }
        var c_menu = [];
        this.build_menu().button.forEach(function(but){
            if(but){
                c_menu.push(but)
            }
        })
        obj.menu = { button : c_menu}
        obj.keys = this.build_keys({ type : 3 , mainDom : "build_key"});
        obj.user = this.build_keys({  type : 2 ,selectName :"user_follow" ,mainDom : "build_user"});
        obj.userKey = this.build_keys({ type : 3 , mainDom : "build_userKey"});
        obj.not = this.build_keys({ type : 3 , mainDom : "build_not"});

        return obj;
    },
    build_objJSON: function(json,domArray){
        var _this = this;
        domArray.forEach(function(setup){
            json[setup.key].forEach(function(data){
                if(setup.type == 2 ){
                    var key_item = _this.create_wechat_key(
                        { type : 2 ,mainDom : setup.mainDom , name : "user_follow" ,selected :"user_follow"},
                        { key_activity : data.type ,user_follow : data.follow })
                    switch (data.type){
                        case "text" :
                        case "image":
                            _this.click_wechat_key(key_item,data)
                            break;
                        case "article":
                            _this.click_wechat_key(key_item,data.body[0]);
                            break;
                    }
                }else{
                    var key_item = _this.create_wechat_key({ mainDom : setup.mainDom },{ key_activity : data.type ,key_name : data.key })
                    switch (data.type){
                        case "text" :
                        case "image":
                            _this.click_wechat_key(key_item,data)
                            break;
                        case "article":
                            _this.click_wechat_key(key_item,data.body[0]);
                            break;
                    }
                }
            })
        })
    },
    build : function(){
        $("#wechat_reset").html("")
        $("#build_key").html("")
        $("#build_user").html("")
        $("#build_userKey").html("")
        $("#build_not").html("")
        var json ;
        var _this = this;
        $.ajax({
            type: "get",
            url: "http://data.fitvdna.com/wechat/menu-update",
            success: function(data){
                json = JSON.parse(data);
                //解析菜单
                json.menu.button.forEach(function(obj){
                    var par ;
                    if(obj.sub_button){
                        par = _this.create_parent({ parent_z_nav_title :obj.name , zt_oo_p : 'nav' })
                        obj.sub_button.forEach(function(ele){

                            var box = _this.create_wechat_nav({ nvk : ele.type , nvk_title : ele.name , nvk_title_kv : ele.type == "click" ? ele.key : ele.url });
                            $(par).find(".child_wechat").append(box)
                        })
                        $("#wechat_reset").append(par)
                    }else{
                        par = _this.create_parent({ parent_z_nav_title : obj.name , zt_oo_p : 'fun' })
                        var box = _this.create_wechat_nav({ nvk : obj.type , nvk_title : obj.name , nvk_title_kv : obj.type == "click" ? obj.key : obj.url });
                        $(par).find(".child_wechat").append(box)
                        $("#wechat_reset").append(par)
                    }
                })
                //解析json表里的除菜单栏所有的关键字。
                _this.build_objJSON(json,[
                    { type : 3 , key : "keys" , mainDom : "build_key" },
                    { type : 2 , key : "user" , mainDom : "build_user" },
                    { type : 3 , key : "userKey" , mainDom : "build_userKey" },
                    { type : 3 , key : "not" , mainDom : "build_not" }
                ])
            },
            error:function(){
                console.log(data)
            }
        });
    },
    post : function(){
        var wechat_password = $("#wechat_post").find("[name='wechat_password']").val();
        var data = JSON.stringify(wcm.build_json())
        $.ajax({
            type: "post",
            url: "http://data.fitvdna.com/wechat/menu-update",
            data: { data: data , password: wechat_password},
            success: function(data){
                $('#exampleModal').modal('toggle')
                alert(data.message)
            },
            error:function(){
                alert("error")
            }
        });
    }

}