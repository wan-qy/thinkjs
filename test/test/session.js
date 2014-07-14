var should = require('should');
var assert = require('assert');
var muk = require('muk');
process.argv[2] = '/'; //命中命令行模式
require('../www/index.js');


var Http = thinkRequire('Http');
var http = require('http');
var req = new http.IncomingMessage();
req.headers = { 
  'x-real-ip': '127.0.0.1',
  'x-forwarded-for': '127.0.0.1',
  'host': 'meinv.ueapp.com',
  'x-nginx-proxy': 'true',
  'connection': 'close',
  'cache-control': 'max-age=0',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
  'accept-encoding': 'gzip,deflate,sdch',
  'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,nl;q=0.2,zh-TW;q=0.2'
};
req.method = 'GET';
req.httpVersion = '1.1';
req.url = '/index/index?name=welefen&value=1111';
var res = new http.ServerResponse(req);
var instance = Http(req, res).run();
var Session = thinkRequire('Session');
var cookieName = C('session_name');

describe('Session', function(){
  it('Session start', function(done){
    instance.then(function(http){
      Session.start(http);
      assert.equal(http.cookie[cookieName].length, 32)
      done();
    })
  })
  it('Session start sign', function(done){
    instance.then(function(http){
      delete http.session;
      C('session_sign', 'welefen');
      Session.start(http);
      assert.equal(http.cookie[cookieName].length, 76)
      assert.equal(http.cookie[cookieName].indexOf('.'), 32)
      done();
    })
  })
  it('Session start sign', function(done){
    instance.then(function(http){
      C('session_sign', 'welefen');
      Session.start(http);
      assert.equal(http.cookie[cookieName].length, 76)
      assert.equal(http.cookie[cookieName].indexOf('.'), 32)
      done();
    })
  })
  it('Session unsign', function(done){
    instance.then(function(http){
      C('session_sign', 'welefen');
      delete http.session;
      http.cookie[cookieName] = 'H1Q9wHxJ9dk9LhZtdxIMsrXFbZ5Po9Fn.f3qWtsv3GuC5nVkyGa9RMGMmFOdDwTA3XTJ/Yzow/UA';
      Session.start(http);
      //console.log(http.cookie[cookieName])
      assert.equal(http.cookie[cookieName], 'H1Q9wHxJ9dk9LhZtdxIMsrXFbZ5Po9Fn')
      //assert.equal(http.cookie[cookieName].indexOf('.'), 32)
      done();
    })
  })
  it('Session type memory', function(done){
    instance.then(function(http){
      delete http.session;
      C('session_type', '');
      Session.start(http);
      assert.equal(http.session.key.length, 32)
      done();
    })
  })
})