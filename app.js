const Fpm = require('yf-fpm-server').Fpm
const path = require('path')
const Process = require('child_process')
const os = require('os')
const isWin = os.platform() == 'win32' // win32 if windows

const fpm = new Fpm()

const biz = fpm.createBiz('0.0.1')

biz.addSubModules('foo', {
    bar: args => {
        return Promise.resolve(1)
    }
})
fpm.addBizModules(biz)

/**
 * /webhook/:upstream/:type/:data
 * upstream: 来源, weixin,fir.im...
 * type: notify, message, hook
 * data: 数据
 * curl -H "Content-Type:application/json" -X POST --data '{"id":10}' http://localhost:9003/webhook/codepull/p/api.yunplus.io
 */

// add webhook subscribe
// 
const generate = (script, type) =>{
  const scriptPath = path.join(__dirname, 'shell', script + (isWin? '.bat': '.sh'))
  switch(script){
    case 'codepull':
      return async (topic, message) => {
        const project = message.url_data
        try{
          let result = await fpm.execShell(scriptPath, ['pull', '-' + type, project])
          fpm.logger.info(result)
        }catch(e){
          fpm.logger.error(e)
        }
      }
    case 'docker':
      return async (topic, message) => {
        const project = message.url_data
        try{
          let result = await fpm.execShell(scriptPath, [type, project])
          fpm.logger.info(result)
        }catch(e){
          fpm.logger.error(e)
        }
      }

    }
    
}
fpm.subscribe('#webhook/codepull/p', generate('codepull', 'p'))
fpm.subscribe('#webhook/codepull/w', generate('codepull', 'w'))
fpm.subscribe('#webhook/docker/p', generate('docker', 'p'))
fpm.subscribe('#webhook/docker/c', generate('docker', 'c'))

fpm.run().then( () => {
    fpm.logger.info('Ready To GO~')
})
