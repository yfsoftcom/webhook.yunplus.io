const Fpm = require('yf-fpm-server').Fpm
const path = require('path')
const Process = require('child_process')

const fpm = new Fpm()

const biz = fpm.createBiz('0.0.1')

biz.addSubModules('foo', {
    bar: args => {
        return Promise.resolve(1)
    }
})
fpm.addBizModules(biz)

const scriptPath = path.join(__dirname, 'shell', 'codepull.sh')

const options = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM',
    setsid: false,
    cwd: null,
    env: null
};
/**
 * /webhook/:upstream/:type/:data
 * upstream: 来源, weixin,fir.im...
 * type: notify, message, hook
 * data: 数据
 * curl -H "Content-Type:application/json" -X POST --data '{"id":10}' http://localhost:9003/webhook/codepull/p/api.yunplus.io
 */

// add webhook subscribe
// 
const generate = (type) =>{
    return (topic, message) => {
        const project = message.url_data
        Process.execFile(scriptPath, ['pull', '-' + type, project], options, (e, stdout, stderr) => {
            if(e){
                fpm.logger.error(e)
                return
            }
            fpm.logger.info(stdout)
        })
        
            
    }
}
fpm.subscribe('#webhook/codepull/p', generate('p'))
fpm.subscribe('#webhook/codepull/w', generate('w'))

fpm.run().then( () => {
    fpm.logger.info('Ready To GO~')
})
