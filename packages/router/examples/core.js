
const Router = require('../src/router');
const router = new Router();

router.route('/user/:name/post/:id', function(match) {
  const { name, id } = match.params;
  console.log('name: ' + name + ' id: ' + id);
});

router.route('/download/:file+', function(match) {
  const { file } = match.params;
  console.log('download: ' + file);
});

router.update('/user/bob/post/123');
router.update('/download/your/file/path');