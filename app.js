const { Fpm } = require('yf-fpm-server');
const _ = require('lodash');
const Views = require('koa-views');
const path = require('path');
const os = require('os');
const util = require('util');
const fs = require('fs');


const readdirAsync = util.promisify(fs.readdir);
const readfileAsync = util.promisify(fs.readFile);
const chmodAsync = util.promisify(fs.chmod);
const writefileAsync = util.promisify(fs.writeFile);
const isWin = os.platform() == 'win32' // win32 if windows
const assert = require('assert');

const CWD = process.cwd();

const fpm = new Fpm()

const biz = fpm.createBiz('0.0.1')

biz.addSubModules('scripts', {
  list: async args => {
    try {
      const scriptsPath = path.join(CWD, 'scripts');
      let list = await readdirAsync(scriptsPath);
      list = _.remove(list, item => {
        return _.endsWith(item, '.sh') || _.endsWith(item, '.bat');
      })
      return list;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  get: async args => {
    const { script } = args;
    const scriptPath = path.join(CWD, 'scripts', script)
    try {
      return await readfileAsync(scriptPath, 'utf8');
    } catch (error) {
      return Promise.reject(error);
    }
  },
  save: async args => {
    const { isCreate, title, content } = args;
    const scriptPath = path.join(CWD, 'scripts', title)
    try {
      if(isCreate){
        await writefileAsync(scriptPath, content, 'utf8');
        await chmodAsync(scriptPath, 0o777);
        return 1;
      }
      await writefileAsync(scriptPath, content, 'utf8');
      return 2;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  run: async args => {
    const { script } = args;
    try{
      let result = await fpm.execShell(path.join(CWD, 'scripts', script));
      return result;
    }catch(e){
      return Promise.reject(e)
    }
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
  let scriptPath = path.join(__dirname, 'shell', script + (isWin? '.bat': '.sh'))
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
    case 'run':
      return async (topic, message) => {
        const script_file = message.url_data
        scriptPath = path.join(__dirname, type, script_file + (isWin? '.bat': '.sh'))
        try{
          let result = await fpm.execShell(scriptPath)
          fpm.logger.info(result)
        }catch(e){
          fpm.logger.error(e)
        }
      }

    }
    
}
fpm.subscribe('#webhook/codepull/p', generate('codepull', 'p'))
fpm.subscribe('#webhook/codepull/w', generate('codepull', 'w'))
fpm.subscribe('#webhook/docker/restart', generate('docker', 'restart'))
// fpm.subscribe('#webhook/docker/c', generate('docker', 'c'))

fpm.subscribe('#webhook/run/scripts', generate('run', 'scripts'));

fpm.run().then( () => {
  const { app } = fpm;

  app.use(Views(path.join(CWD, 'views'), {
    extension: 'html',
    map: { html: 'nunjucks' },
  }))

  const router = fpm.createRouter();
  router.get('/console', async ctx => {
    console.log(1)
    await ctx.render('main.html')
  })
  fpm.bindRouter(router);
})
