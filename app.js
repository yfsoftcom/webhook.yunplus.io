const { Fpm } = require('yf-fpm-server');
const _ = require('lodash');
const Views = require('koa-views');
const Static = require('koa-static');
const path = require('path');
const os = require('os');
const util = require('util');
const fs = require('fs');


const readdirAsync = util.promisify(fs.readdir);
const readfileAsync = util.promisify(fs.readFile);
const chmodAsync = util.promisify(fs.chmod);
const unlinkAsync = util.promisify(fs.unlink);
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
  delete: async args => {
    const { script } = args;
    const scriptPath = path.join(CWD, 'scripts', script)
    try {
      await unlinkAsync(scriptPath);
      return 1;
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
// add webhook subscribe
// 
const generate = (script, type) =>{
  let scriptPath = path.join(__dirname, 'shell', script + (isWin? '.bat': '.sh'))
  switch(script){
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

fpm.subscribe('#webhook/run/scripts', generate('run', 'scripts'));

fpm.run().then( () => {
  const { app } = fpm;
  app.use(Static(path.join(CWD, 'public')))
  app.use(Views(path.join(CWD, 'views'), {
    extension: 'html',
    map: { html: 'nunjucks' },
  }))

  const router = fpm.createRouter();
  router.get('/console', async ctx => {
    await ctx.render('main.html')
  })
  fpm.bindRouter(router);
})
