<template>
<div>
  <div id="mainshow">
    <div id="serverlist">
      <div id="serverbtn">
        <div class="btn-group">
          <a class="btn btn-info serveradd" @click="addserver" >新建</a>
        </div>
      </div>
      <div id="listdiv" class="alert alert-info" style="height:570px;">
        <a class="btn" v-for="server in serverlist" v-bind:id="'server_'+server.k"  v-bind:class="{'btn-success': server.selected}" title="双击查看" @dblclick="selectserver(server)">{{server.mark}}-{{server.ip}}:{{server.port}}&nbsp;&nbsp;<i v-bind:data-k="server.k" class="icon-remove keydel" title="删除" style="cursor:pointer; float:right;"  @click="removeserver"></i></a>
      </div>
    </div>

    <div id="serverdata" class="rightplace">
      <div class="navbar">
        <div class="navbar-inner">
          <a class="brand">按KEY搜索</a>
            <form class="navbar-form pull-left" onsubmit="return false;">
              <input type="text" id="searchkey" @keyup.enter="dealsearch(0)">
              <button type="button" @click="dealsearch(0)" class="btn btn-info">搜索</button>
              <button type="button" @click="dealsearch(1)" class="btn btn-info">搜索并保存为过滤器</button>
              <button type="button" @click="addkey()" class="btn btn-success">新建KEY</button>
            </form>
        </div>
      </div>

      <ul class="nav nav-tabs" id="myTab">
        <li class="active"><a href="#serverstatus" id="statustab" @click="showstatus">状态信息</a></li>
        <li><a href="#keydata" data-filter="*" id="allkeys" class="filtertab" @click="showfilterkey">所有KEY *</a></li>
        <li v-for="filter in filterlist"><a href="#keydata" v-bind:data-filter="filter" class="filtertab" @click="showfilterkey">{{filter}}&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon-remove filerdel" v-bind:data-filter="filter" title="删除过滤器" style="cursor:pointer;" @click="delfilter"></i></a></li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane active" id="serverstatus">
          <table class="table table-hover">
            <tbody>
            </tbody>
          </table>
        </div>
        <div class="tab-pane" id="keydata">
          <div style="float:left;">
              <select id="keyslist" multiple="multiple">
                <option v-for="key_item in keylist" v-bind:value="key_item.value" @click="selectkey(key_item)">{{key_item.value}}[{{key_item.type}}:{{key_item.len}}]</option>
              </select>
          </div>
          <div id="keydataright">
              <table id="keyinfotab" class="table table-bordered  table-striped">
                  <tbody>
                      <tr>
                          <td style="width:80px;">KEY&nbsp;&nbsp;<i class="icon-remove keydel" data-type="" data-key=""  title="删除KEY" style="cursor:pointer;"  @click="deleteKey"></i></td>
                          <td style="min-width:300px;max-width:300px;word-break: break-all;" class="keyname"></td>
                      </tr>
                      <tr>
                          <td style="width:80px;" title="key的类型">TYPE</td>
                          <td style="min-width:300px;" class="keytype"></td>
                      </tr>
                      <tr>
                          <td title="key的存活时间">TTL</td>
                          <td class="keytime"></td>
                      </tr>
                      <tr>
                          <td title="key的大小">SIZE</td>
                          <td class="keysize"></td>
                      </tr>
                  </tbody>
              </table>
              <table id="keydatatab" class="table table-bordered table-striped">
                  <tbody v-show="currentkeytype=='delete'">
                    <tr><td style='color:#ff0000;'>已删除</td></tr>
                  </tbody>
                  <tbody v-show="currentkeytype=='string'">
                    <tr><td>数据内容：<i class='icon-edit' title='编辑' @click="editstringkey" style='cursor:pointer;'></i></td></tr>
                    <tr><td v-text="currentkeyvalue"></td></tr>
                  </tbody>
                  <tbody v-show="currentkeytype=='hash'">
                    <tr><th style='min-width:50px;'>Key</th><th>Value</th><th style="text-align:center;width:50px;">操作</th></tr>
                    <tr v-for="hash_item in currentkey_hashitem">
                      <td>{{hash_item.hashkey}}</td>
                      <td>{{hash_item.value}}</td>
                      <td style="text-align:center;width:50px;"><i class='icon-edit' title='编辑' @click="edithashkey(hash_item)" style='cursor:pointer;'></i>&nbsp;&nbsp;<i class='icon-remove' title='删除' @click="deletehashkey(hash_item)" style='cursor:pointer;'></i></td>
                    </tr>
                  </tbody>
                  <tbody v-show="currentkeytype=='list'">
                    <tr><th style='min-width:50px;'>Index</th><th>Value</th></tr>
                    <tr v-for="list_item in currentkey_listitem">
                      <td>{{list_item.index}}</td>
                      <td>{{list_item.value}}</td>
                    </tr>
                  </tbody>
                  <tbody v-show="currentkeytype=='set'">
                    <tr><th>Value</th><th style="text-align:center;width:50px;">操作</th></tr>
                    <tr v-for="set_item in currentkey_setitem">
                      <td>{{set_item.value}}</td>
                      <td style="text-align:center;width:50px;"><i class='icon-remove' title='删除' @click="deletesetkey(set_item)" style='cursor:pointer;'></i></td>
                    </tr>
                  </tbody>
                  <tbody v-show="currentkeytype=='zset'">
                    <tr><th style='min-width:50px;'>Score</th><th>Value</th><th style="text-align:center;width:50px;">操作</th></tr>
                    <tr v-for="zset_item in currentkey_zsetitem">
                      <td>{{zset_item.score}}</td>
                      <td>{{zset_item.value}}</td>
                      <td style="text-align:center;width:50px;"><i class='icon-edit' title='编辑' @click="editzsetkey(zset_item)" style='cursor:pointer;'></i>&nbsp;&nbsp;<i class='icon-remove' title='删除' @click="deletezsetkey(zset_item)" style='cursor:pointer;'></i></td>
                    </tr>
                  </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>

    <div id="welcome" class="rightplace">
      <div class="alert alert-info">
        <h4>欢迎使用REDIS数据 查看工具!</h4>
        请先新建redis服务配置或双击已经建好的配置查看数据。
      </div>
    </div>

    <div id="connecterror" class="rightplace">
      <div class="alert alert-error">
        <h4>连接redis服务失败!</h4>
        请检查您选的redis服务是否运行正常或重新双击选择重试。
      </div>
    </div>
  </div>

  <div id="addserverfor" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>新建redis服务配置</h3>
    </div>
    <div class="modal-body">
        <form class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="mark">备注：</label>
                <div class="controls">
                    <input type="text" id="mark" placeholder="备注" v-model="serveritem.mark">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="ip">IP地址：</label>
                <div class="controls">
                    <input type="text" id="ip" placeholder="IP地址" v-model="serveritem.ip">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="port">PORT：</label>
                <div class="controls">
                    <input type="text" id="port" placeholder="端口" v-model="serveritem.port">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="auth">AUTH：</label>
                <div class="controls">
                    <input type="password" id="auth" placeholder="密码认证，可为空" v-model="serveritem.auth">
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a class="btn btn-info" @click="dealaddserver">保存</a>
    </div>
  </div>

  <div id="addkeymodal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>编辑KEY</h3>
    </div>
    <div class="modal-body">
        <form class="form-horizontal">
            <div :class="['control-group', {error: keyitem.keyerror}]" >
                <label class="control-label">KEY：</label>
                <div class="controls">
                    <input type="text" placeholder="key" v-model="keyitem.key">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">类型：</label>
                <div class="controls">
                  <select v-model="keyitem.type">
                    <option value="string">string</option>
                    <option value="hash">hash</option>
                    <option value="list">list</option>
                    <option value="set">set</option>
                    <option value="zset">zset</option>
                  </select>
                </div>
            </div>
            <div :class="['control-group', {error: keyitem.hashkeyerror}]" v-show="keyitem.type=='hash'">
                <label class="control-label">HASHKEY：</label>
                <div class="controls">
                    <input type="text" placeholder="HASHKEY" v-model="keyitem.hashkey">
                </div>
            </div>
            <div class="control-group" v-show="keyitem.type=='zset'">
                <label class="control-label">SCORE：</label>
                <div class="controls">
                    <input type="text" placeholder="SCORE" v-model="keyitem.score">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">VALUE：</label>
                <div class="controls">
                    <textarea style="height:150px; resize:none" placeholder="数据内容" v-model="keyitem.value"></textarea>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">TTL：</label>
                <div class="controls">
                    <input type="text" placeholder="TTL" v-model="keyitem.ttl">
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a class="btn btn-info" @click="dealaddkey">保存</a>
    </div>
  </div>

  <div class="modal hide fade" id="confirmmodal" style="z-index:99999">
      <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4>提示</h4>
      </div>
      <div class="modal-body">
          <p class="modalcontent"></p>
      </div>
      <div class="modal-footer">
          <a href="#" class="btn" data-dismiss="modal" aria-hidden="true">取消</a>
          <a href="#" class="btn btn-primary dealbtn">确定</a>
      </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      currentserver: "",
      currentclient: null,
      serverlistfile: "app/js/serverlist.js",
      serverlist: {},
      serveritem: {mark: "", ip: "", port: "", auth: ""},
      filterlist: [],
      keylist: [],
      keyitem: {key: "", type: "string", hashkey: "", score: 0, value: "", ttl: 0, keyerror: false, hashkeyerror: false},
      currentkey: "",
      currentkeytype: "",
      currentkey_hashkey: "",
      currentkey_score: 0,
      currentkey_ttl: 0,
      currentkeyvalue: "",
      currentkey_hashitem: [],
      currentkey_listitem: [],
      currentkey_setitem: [],
      currentkey_zsetitem: []
    };
  },
  mounted () {
    //note 获取本地存储数据
    this.serverlist = JSON.parse( window.fs.readFileSync( this.serverlistfile ) );
    this.showplace("welcome");
  },
  methods: {
    confirm (content, callback) {
        $("#confirmmodal").find(".modalcontent").text(content);
        $("#confirmmodal").find(".dealbtn").unbind('click');
        $("#confirmmodal").find(".dealbtn").bind('click', function(){
            callback();
        });
        $("#confirmmodal").modal("show");
    },
    showplace (id) {
      $(".rightplace").hide();
      $("#" + id).show();
    },
    saveserver () {
      var savedata = _.assign({}, this.serverlist);
      _.forIn(savedata, function(value, key){
        var tmp  =_.assign({}, value);
        tmp.selected = false;
        savedata[key] = tmp;
      });
      window.fs.writeFileSync(this.serverlistfile, JSON.stringify( savedata ) );
    },
    addserver () {
      this.serveritem = {mark: "", ip: "", port: "", auth: ""};
      $("#addserverfor").modal('show');
    },
    dealaddserver () {
      if(this.serveritem.ip && global.jQuery.lvcheck.checkip(this.serveritem.ip)){
        $("#ip").parent().parent().removeClass('error');
      }else{
        $("#ip").parent().parent().addClass('error');
        return false;
      }
      if(this.serveritem.port && global.jQuery.lvcheck.checknum(this.serveritem.port)){
          $("#port").parent().parent().removeClass('error');
      }else{
          $("#port").parent().parent().addClass('error');
          return false;
      }
      //note 判断是否已存在
      var ipstr = this.serveritem.ip.replace(/\./ig, '_');
      var key = this.serveritem.mark + "_" + ipstr + "_" + this.serveritem.port;
      if(this.serverlist[key]){
        jQuery.lvalert.error({msg : "此redis服务已存在！"});
      }else{
        this.$set(this.serverlist, key, {'k':key,'mark':this.serveritem.mark, 'ip':this.serveritem.ip, 'port':this.serveritem.port, 'auth':this.serveritem.auth, 'selected':false});
        $("#addserverfor").modal('hide');
        this.saveserver();
        jQuery.lvalert.success({msg : "添加成功！", timeout: 1500});
      }
    },
    removeserver (event) {
      var self = this;
      var k = $(event.target).data("k");
      if(this.serverlist && k){
          this.confirm("您确定要删除此redis配置吗？", function(){
              self.dealremove(k);
          });
      }
    },
    dealremove (key) {
      delete(this.serverlist[key]);
      jQuery("#server_" + key).empty().remove();
      this.saveserver();
      $("#confirmmodal").modal("hide");
      jQuery.lvalert.success({msg : "删除成功！", timeout : 1500, mask : 0});
      if(key == this.currentserver){
        this.showplace('welcome');
      }
    },
    selectserver (server) {
      var self = this;
      if(this.currentclient){
        this.currentclient.unref();
      }
      jQuery.lvalert.loading({msg : "正在初始化连接......"});
      self.filterlist = [];
      self.keylist = [];
      _.forIn(this.serverlist, function(value, key){
          value.selected = false;
      });
      server.selected = true;
      this.currentserver = server.k;
      //note 获取filter
      var filterlist = _.concat([], this.serverlist[this.currentserver].filter||[]);
      if(filterlist){
        self.filterlist = filterlist;
      }
      //note 连接redis
      var option = {
          'max_attempts':1
      };
      if(server.auth){
          option['auth_pass'] = server.auth;
      }
      var client = window.redis.createClient(server.port, server.ip, option);
      client.on('ready', function(error, data){
          self.currentclient = client;
          jQuery.lvalert.hide();
          self.initrightplace();
      });
      client.on('error', function(error, data){
          jQuery.lvalert.hide();
          self.showplace('connecterror');
      });
    },
    initrightplace () {
      this.showplace('serverdata');
      if(this.currentclient == null){
          this.showplace('welcome');
      }else{
        this.showstatus();
      }
    },
    typeofkey (key, callback) {
      var self = this;
      this.currentclient.type(key, function(err, data){
        if(err){
            self.showplace('connecterror');
        }else{
            callback(data);
        }
      });
    },
    ttlofkey (key, callback) {
      var self = this;
      this.currentclient.ttl(key, function(err, data){
        if(err){
          self.showplace('connecterror');
        }else{
          callback(data);
        }
      });
    },
    sizeofkey (type, key, callback) {
      var self = this;
      switch (type) {
        case 'string':
          self.currentclient.get(key, function(err, data){
              if(err){
                  self.showplace('connecterror');
              }else{
                  if(data != null){
                      callback(data.length + " characters", data.length);
                  }else{
                      callback(0 + " characters", 0);
                  }
              }
          });
          break;
        case 'hash':
          self.currentclient.hlen(key, function(err, data){
              if(err){
                  self.showplace('connecterror');
              }else{
                  callback(data + " items", data);
              }
          });
          break;
        case 'list':
          self.currentclient.llen(key, function(err, data){
              if(err){
                  self.showplace('connecterror');
              }else{
                  callback(data + " items", data);
              }
          });
          break;
        case 'set':
          self.currentclient.scard(key, function(err, data){
              if(err){
                  self.showplace('connecterror');
              }else{
                  callback(data + " items", data);
              }
          });
          break;
        case 'zset':
          self.currentclient.zcard(key, function(err, data){
              if(err){
                  self.showplace('connecterror');
              }else{
                  callback(data + " items", data);
              }
          });
          break;
      }
    },
    showstatus () {
      var self = this;
      $("#statustab").tab('show');
      this.currentclient.info(function(err, data){
        if(err){
          self.showplace('connecterror');
        }else{
          var status_data = data.split("\r\n");
          $("#serverstatus").find('tbody').html('');
          _.forIn(status_data, function(value, key){
            if(value && key){
              $("#serverstatus").find('tbody').append('<tr><td>' + value + '</td></tr>');
            }
          });
        }
      });
    },
    showfilterkey (event) {
      $(event.target).tab('show');
      jQuery.lvalert.loading({msg : "正在获取KEY......", mask : 0});
      var filter = $(event.target).attr('data-filter');
      this.keylist = [];
      $("#keydataright").hide();
      this.dealsearchkeys(filter);
    },
    dealsearchkeys (filter, cursor) {
      var self = this;
      cursor = cursor || 0;
      //note 判断是单独取还是搜索
      if(filter.indexOf("*") < 0){
          var key = filter;
          self.typeofkey(key, function(type){
            if(type == 'none'){
              jQuery.lvalert.error({msg : "没有找到对应的KEY！", mask : 0, timeout: 2000});
            }else{
              self.sizeofkey(type, key, function(data, len){
                  self.keylist = [{value: key, k: key, type: type, len: len}];
                  jQuery.lvalert.hide();
              });
            }
            
          });
      }else{
        self.currentclient.scan(cursor, "match", filter, "count", 2000, function(err, data){
          if(err && cursor == 0){
            self.showplace('connecterror');
          }else{
            var start = parseInt(data[0]);
            var keylen = data[1].length;
            var havelen = self.keylist.length;
            if(keylen > 0){
              var keydata = data[1];
              keydata.sort();
              _.forIn(keydata, function(key, index){
                self.typeofkey(key, function(type){
                  self.sizeofkey(type, key, function(data, len){
                    self.keylist.push({value: key, k: key, type: type, len: len});
                  });
                });
              });
            }
            //note 继续获取
            if(start && havelen+keylen<2000){
              self.dealsearchkeys(filter, parseInt(start));
            }else if(start == 0 && keylen == 0 && self.keylist.length == 0){
              jQuery.lvalert.error({msg : "没有找到对应的KEY！", mask : 0, timeout: 2000});
            }else{
              jQuery.lvalert.hide();
            }
          }
        });
      }
    },
    delfilter (event) {
      event.preventDefault();
      event.stopPropagation();
      var obj = event.target;
      var filter = $(obj).attr('data-filter');
      var index = $.inArray(filter, this.filterlist);
      this.filterlist.splice(index, 1);
      var index = $.inArray(filter, this.serverlist[this.currentserver].filter);
      this.serverlist[this.currentserver].filter.splice(index, 1);
      if($(obj).parent().parent().hasClass('active')){
          $("#myTab a:first").tab('show');
      }
      this.saveserver();
    },
    dealsearch (save) {
      var self = this;
      var searchkey = $.trim($("#searchkey").val());
      $("#keydataright").hide();
      if(searchkey.length>0){
        jQuery.lvalert.loading({msg : "正在获取KEY......", mask : 0});
        self.keylist = [];
        self.dealsearchkeys(searchkey);
        if(save){
          $("#searchkey").val("");
          if(!self.filterlist){
              self.filterlist = [];
          }
          if($.inArray(searchkey, self.filterlist) == -1){
              self.filterlist.push(searchkey);
              if(!self.serverlist[self.currentserver].filter){
                self.serverlist[self.currentserver].filter = [];
              }
              self.serverlist[self.currentserver].filter.push(searchkey);
              self.saveserver();
          }
          setTimeout(function(){
            $("#myTab a:last").tab('show');
          }, 500);
        }else{
          $("#allkeys").tab('show');
        }
      }
    },
    addkey () {
      this.keyitem = {key: "", type: "string", hashkey: "", score: 0, value: "", ttl: 0, keyerror: false, hashkeyerror: false};
      $("#addkeymodal").modal("show");
    },
    dealaddkey (add) {
      var self = this;
      var key = $.trim(this.keyitem.key);
      var type = this.keyitem.type;
      var hashkey = $.trim(this.keyitem.hashkey);
      var score = parseInt(this.keyitem.score);
      var value = $.trim(this.keyitem.value);
      var ttl = parseInt(this.keyitem.ttl);
      if(key.length<=0){
        this.keyitem.keyerror = true;
      }else{
        this.keyitem.keyerror = false;
      }
      if(type == "hash" && hashkey.length <= 0){
        this.keyitem.hashkeyerror = true;
      }else{
        this.keyitem.hashkeyerror = false;
      }
      var success_cb = function(){
        $("#addkeymodal").modal("hide");
        if(ttl > 0){
          self.currentclient.expire(key, ttl, function(err, data){});
        }
        if(self.currentkey == key){
          self.showkeyinfo(type, key);
        }
        jQuery.lvalert.success({msg : "处理成功！", mask : 0, timeout: 1500});
      };
      var fail_cb = function(){
        $("#addkeymodal").modal("hide");
        self.showplace('connecterror');
      };
      switch(type){
        case 'string':
          self.currentclient.set(key, value, function(err, data){
            err ? fail_cb() : success_cb();
          });
          break;
        case 'hash':
          self.currentclient.hset(key, hashkey, value, function(err, data){
            err ? fail_cb() : success_cb();
          });
          break;
        case 'list':
          self.currentclient.lpush(key, value, function(err, data){
            err ? fail_cb() : success_cb();
          });
          break;
        case 'set':
          self.currentclient.sadd(key, value, function(err, data){
            err ? fail_cb() : success_cb();
          });
          break;
        case "zset":
          self.currentclient.zadd(key, score, value, function(err, data){
            err ? fail_cb() : success_cb();
          });
          break;
      }
    },
    selectkey (keytemp) {
      this.currentkey = keytemp.value;
      this.currentkeytype = keytemp.type;
      this.showkeyinfo(keytemp.type, keytemp.value);
      $("#keydataright").show();
    },
    showkeyinfo (type, key) {
      var self = this;
      $("#keyinfotab").find('.keydel').attr("data-key", key);
      $("#keyinfotab").find('.keydel').attr("data-type", type);
      $("#keyinfotab").find('.keyname').text(key);
      $("#keyinfotab").find('.keytype').text(type);
      this.ttlofkey(key, function(data){
          if(data == -1){
              $("#keyinfotab").find('.keytime').text('does not expire');
          }else{
            self.currentkey_ttl = data;
            $("#keyinfotab").find('.keytime').text(data + ' s');
          }
      });
      this.sizeofkey(type, key, function(data, len){
          $("#keyinfotab").find('.keysize').text(data);
          self.showkeydata(type, key, len);
      });
    },
    showkeydata (type, key, len) {
      var self = this;
      jQuery.lvalert.loading({msg : "正在获取数据......", mask : 0});
      switch (type) {
        case 'string':
          self.currentclient.get(key, function(err, data){
            if(err){
              self.showplace('connecterror');
            }else{
              if(data === null){
                self.currentkeytype = "delete";
              }else{
                self.currentkeyvalue = data;
              }
              jQuery.lvalert.hide();
            }
          });
          break;
        case 'hash':
          self.currentkey_hashitem = [];
          self.currentclient.hscan(key, 0, "match", "*", "count", 2000, function(err, data){
            if(err){
              self.showplace('connecterror');
            }else{
              var hashdata = data[1];
              if(hashdata.length > 0){
                for(var i=0; i<hashdata.length; i+=2){
                  self.currentkey_hashitem.push({key: key, hashkey: hashdata[i], value: hashdata[i+1]});
                }
              }else{
                self.currentkeytype = "delete";
              }
              jQuery.lvalert.hide();
            }
          });
          break;
        case 'list':
          self.currentkey_listitem = [];
          self.currentclient.lrange(key, 0, 2000, function(err, data){
            if(err){
                $scope.showplace('connecterror');
            }else{
              if(data === null || data.length == 0){
                self.currentkeytype = "delete";
              }else{
                for(var i=0; i<data.length; i++){
                  self.currentkey_listitem.push({key: key, index: i, value: data[i]});
                }
              }
              if(len > 2000){
                jQuery.lvalert.warning({msg : "items数量超过2000个，只列出2000个！", timeout: 1500});
              }else{
                jQuery.lvalert.hide();
              }
            }
          });
          break;
        case 'set':
          self.currentkey_setitem = [];
          self.currentclient.sscan(key, 0, "match", "*", "count", 2000, function(err, data){
            if(err){
              self.showplace('connecterror');
            }else{
              var setdata = data[1];
              if(setdata.length > 0){
                for(var i=0; i<setdata.length; i++){
                  self.currentkey_setitem.push({key: key, value: setdata[i]});
                }
              }else{
                self.currentkeytype = "delete";
              }
              jQuery.lvalert.hide();
            }
          });
          break;
        case 'zset':
          self.currentkey_zsetitem = [];
          self.currentclient.zrevrange(key, 0, 2000, 'WITHSCORES', function(err, data){
            if(err){
              self.showplace('connecterror');
            }else{
              var zsetdata = data;
              if(zsetdata.length > 0){
                for(var i=0; i<zsetdata.length; i+=2){
                  self.currentkey_zsetitem.push({key: key, score: zsetdata[i+1], value: zsetdata[i]});
                }
              }else{
                self.currentkeytype = "delete";
              }
              if(len > 2000){
                jQuery.lvalert.warning({msg : "items数量超过2000个，只列出2000个！"});
              }else{
                jQuery.lvalert.hide();
              }
            }
          });
          break;
      }
    },
    deleteKey () {
      var self = this;
      var key = $("#keyinfotab").find('.keydel').attr("data-key");
      var type = $("#keyinfotab").find('.keydel').attr("data-type");
      if(key){
        self.confirm("您确定要删除此KEY吗？", function(){
          self.currentclient.del(key, function(err, data){
            jQuery.lvalert.success({msg : "删除成功！", mask : 0, timeout: 2000});
            $("#keydataright").hide();
            $("#confirmmodal").modal("hide");
            jQuery.each(self.keylist, function(index, ktemp){
              if(ktemp && key == ktemp.value){
                self.keylist.splice(index, 1);
              }
            });
          });
        });
      }
    },
    editstringkey () {
      var self = this;
      this.keyitem = {key: self.currentkey, type: "string", hashkey: "", score: 0, value: self.currentkeyvalue, ttl: self.currentkey_ttl, keyerror: false, hashkeyerror: false};
      $("#addkeymodal").modal("show");
    },
    edithashkey (hashitem) {
      var self = this;
      this.keyitem = {key: self.currentkey, type: "hash", hashkey: hashitem.hashkey, score: 0, value: hashitem.value, ttl: self.currentkey_ttl, keyerror: false, hashkeyerror: false};
      $("#addkeymodal").modal("show");
    },
    deletehashkey (hashitem) {
      var self = this;
      self.currentclient.hdel(hashitem.key, hashitem.hashkey, function(err, data){
        if(err){
          self.showplace('connecterror');
        }else{
          self.showkeyinfo('hash', hashitem.key);
        }
      });
    },
    deletesetkey (setitem) {
      var self = this;
      self.currentclient.srem(setitem.key, setitem.value, function(err, data){
        if(err){
          self.showplace('connecterror');
        }else{
          self.showkeyinfo('set', setitem.key);
        }
      });
    },
    editzsetkey (zsetitem) {
      var self = this;
      this.keyitem = {key: self.currentkey, type: "zset", hashkey: "", score: zsetitem.score, value: zsetitem.value, ttl: self.currentkey_ttl, keyerror: false, hashkeyerror: false};
      $("#addkeymodal").modal("show");
    },
    deletezsetkey (zsetitem) {
      var self = this;
      self.currentclient.zrem(zsetitem.key, zsetitem.value, function(err, data){
        if(err){
          self.showplace('connecterror');
        }else{
          self.showkeyinfo('zset', zsetitem.key);
        }
      });
    }
  }
}
</script>