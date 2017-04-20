/**
 * 配置文件的好处就是：让你的代码修改成本变到最小
 */

var path = require('path')

var upload_preview_rel = './public/uploads/'
var upload_img_rel = './test-view/'

module.exports = {
  view_path: path.join(__dirname, './views/'),
  template_delimiter: '$',
  upload_dir: {
    abs: path.join(__dirname, upload_img_rel),
    rel: upload_img_rel
  },
  upload_preview: {
    abs: path.join(__dirname, upload_preview_rel),
    rel: upload_preview_rel
  }
}
