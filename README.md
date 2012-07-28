# dyn-loader.js - dynamic loader for js and css files
dyn-loader.js allows you to dynamically load js and css files onto the page.
Files are loaded sequentially.
JS files loaded as the last childs body node. 
JS files loaded as the last childs head node. 

## Examples

### Simple load js files

```js
var loader = new DynamicLoader();
loader.add(['/static/js/jquery-1.6.3.min.js', '/static/js/jquery.historyMover.js']);
loader.run();
```

### Load js and css

```js
var loader = new DynamicLoader();
loader.add({
    'css': ['static/css/style.css', 'static/css/style2.css'],
    'js': ['/static/js/jquery-1.6.3.min.js', '/static/js/jquery.historyMover.js']
});
loader.run();
```

### Load js and css with class mark

```js
var loader = new DynamicLoader();
loader.add({
    'css': {
        'list': ['static/css/style.css', 'static/css/style2.css'],
        'className': 'dynanicCSS'
    },
    'js': {
        'list': ['/static/js/jquery-1.6.3.min.js', '/static/js/jquery.historyMover.js'],
        'className': 'dynamicJS'
    }
});
loader.run();
```
If you do not specify the class name, the default will be used `dynJS` and `dynCSS`.

