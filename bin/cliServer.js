const { execSync, exec } = require('child_process')
const { resolve } = require('path')
const packJson = require('../package.json')

if (process.platform.includes('win32') && !packJson.devToolPath) {
  throw new Error('请在package.json中配置开发者工具地址')
}
const argv = process.argv[2] === 'build' ? 'production' : process.argv[2]
const projectPath = resolve(__dirname, argv === 'production' ? '../dist/build/mp-weixin' : '../dist/dev/mp-weixin')
const cliPath = resolve(__dirname, process.platform.includes('win32') ? packJson.devToolPath : '/Applications/wechatwebdevtools.app/Contents/MacOS/cli')
execSync(`${cliPath} islogin`, {
  encoding: 'utf-8',
  stdio: 'inherit'
})

/**
 * 直接打开项目
 */
exec(`${cliPath} open --project ${projectPath}`, (err, stdout, stderr) => {
  if (err) {
    throw err
  } else {
    if (stdout) {
      console.log(stdout)
      /**
       * 未登录打开直接打开工具
       */
      exec(`${cliPath} open`, (err, stdout, stderr) => {
        if (err) {
          throw err
        } else {
          console.log(stderr)
        }
      })
    } else {
      console.log(stderr)
      /**
       * 打开项目成功后重置监听
       */
      exec(`${cliPath} reset-fileutils --project ${projectPath}`, (error, stdout1, stderr1) => {
        if (error) {
          throw error
        } else {
          console.log(stderr1)
        }
      })
    }
  }
})
