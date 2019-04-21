const fpmc = require("fpmc-jssdk");
const assert = require('assert');
const { Func, init } = fpmc;
init({ appkey:'123123', masterKey:'123123', endpoint: 'http://localhost:9999/api' });


describe('scripts Biz Test Unit', function(){

  it('List', function(done){
    const func = new Func('scripts.list');
    func.invoke({ })
      .then(function(data){
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Auth', function(done){
    const func = new Func('scripts.auth');
    func.invoke({ password: '123123123'})
      .then(function(data){
        done();
      }).catch(function(err){
        done(err);
      })
  })
});