const assert = require('assert');
const { encodePassword } = require('../source/kit');

describe('Function', function(){

  it('encodePassword ok', function(done){
    const encoded = encodePassword('123123123', 'fpm');
    console.log(encoded);
    done();
  })

})