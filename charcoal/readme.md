# Developing with Yeoman & Grunt

*This file is automatically added to your project when you create it with `yo charcoal`. It is strongly encouraged to keep it here so that users unfamilar with the build process can easily get up and running with your project!*

This project was generated with [Charcoal](https://github.com/thomasboyt/charcoal), a [Yeoman](http://yeoman.io) generator which creates scaffolding for Ember.js projects. It uses [Bower](http://bower.io/) for managing browser dependencies and [Grunt](http://gruntjs.com/) to build. If you're unfamilar with any of these tools, read this document to get up and running with development on this repo.

## Getting Started

If you just cloned this repo, you'll need some dependencies. **(if you just created this project with `yo charcoal`, skip this section)**.

First, make sure you have installed [node.js](http://nodejs.org) and [npm](https://npmjs.org/). After that, you'll want to install the Grunt CLI client and Bower with:

```shell
npm install -g grunt-cli
npm install -g bower
```

Then install both Grunt dependencies and Bower dependencies by running the following commands in the root directory of this project:

```shell
npm install
bower install
```

Finally, if you'd like to use Charcoal's generators to speed up development, install Yeoman and Charcoal with:

```shell
npm install -g yeoman
npm install -g generator-charcoal
```

Your environment is now all set up!

## Using Grunt

Applications generated with Charcoal come with a variety of pre-configured tasks (as seen in `/charcoal/grunt.js`). Rather than edit these directly, it's recommended to edit tasks in the actual `Gruntfile.js` in the root of your project. 

Usually, you'll be running one of these multitasks:

### `grunt server`

This command builds unminified assets to the `tmp/` folder and hosts a static server. This server has `watch` and `livereload` enabled, so your assets will rebuild and your browser will refresh on every save.

### `grunt test`

This command runs your tests in PhantomJS. By default, it uses Mocha as the test-runner, but you can swap it out for Jasmine or QUnit fairly easily.

### `grunt test-server`

This command runs your tests in a web browser. Like `grunt server`, it will rebuild and refresh whenever you save your app's code or a test.

### `grunt build`

This command builds your application to the `dist/` folder for distribution.

## Preconfigured Tasks

These are tasks that are configured in Charcoal's default Grunt configuration, but will need to be added to your build tasks in your project's `Gruntfile` to use. The dependencies for them will also need be installed (with `npm install <dep> --save-dev`).

For example, to enable LESS support when you build:

* Install the dependency as listed in its section below
* Add `less:dev` to your `server`, `test`, and `test-server` multitasks
* Add `less:dist` to your `build` multitask
* Alternatively, to speed up build times, you could add `less:dev` and `less:dist` to their respective subtasks in the `concurrent` task. 

### LESS

Dependency: `npm install grunt-contrib-less --save-dev`

Default configuration: Will take `assets/styles/foo.less` and compile it to `tmp/assets/styles/foo.css` and `dist/assets/styles/foo.css`

### SASS

Dependency: `npm install grunt-contrib-sass --save-dev`

Default configuration: Will take `assets/styles/foo.scss` and compile it to `tmp/assets/styles/foo.css` and `dist/assets/styles/foo.css`

## Writing Applications

### Using grunt-neuter

[`grunt-neuter`](https://github.com/trek/grunt-neuter) is a plugin for managing "dependencies" between your application's various scripts. Unlike RequireJS or Browserify or any number of other dependency management systems, `grunt-neuter` is only interested in concatenating your files together in the proper order. It has only one function you need to worry about: a global `require()` processor. 

With the default configuration, files should be referenced relative to your `app/` folder. For example, if you wanted to require `/app/foo/bar.js`, you'd simply say `require(foo/bar)`.

### Generating modules

If you installed Yeoman and `generator-charcoal`, you can easily generate Ember "modules." These are simply folders grouping related functionality. An example module, generated with the command `yo charcoal:module my_module`, might be:

```
app/
 |--- modules/
       |--- my_module/
            |--- controller.js
            |--- model.js
            |--- route.js
            |--- view.js
            |--- my_module.handlebars
test/
 |--- specs/
       |--- my_module_spec.js
```

You can generate a module like this with `yo charcoal:module <module name>`. 

By default, `app.js` (your app's entry point) loads your modules in the following order:

```js
require("store");
require("modules/*/model");
require("modules/*/controller");
require("modules/*/view");
require("helpers/*");
require("router");
require("modules/*/route");
```

This is the same loading order that the [Ember Rails gem uses](https://raw.github.com/emberjs/ember-rails/master/lib/generators/templates/app.js).

If you need to specify further dependencies, simply add a new `require()` definition to any of your files. grunt-neuter is smart enough to only include a file once :)

### Using templates

Charcoal's default Gruntfile builds templates for you with the `ember_templates` task. This simply collects all `handlebars` or `hbs` files and compiles them to a second script that is added to your page. 

There's a few special rules for how templates are named in your application, based on their filepath:

* `app/modules/my_module/index.handlebars` => `my_module`
* `app/modules/my_module/foo.handlebars` => `my_module/foo`
* `app/modules/my_module/bar/foo.handlebars` => `my_module/bar/foo`
* `app/templates/foo.handlebars` => `foo`
* `app/templates/bar/foo.handlebars` => `bar/foo`
* `app/application.handlebars` => `application`

This allows you to both keep "namespaces" for your templates, as well as allowing you to have templates that respect Ember's [naming conventions](http://emberjs.com/guides/concepts/naming-conventions/). It also allows you to either place your templates in your module folders or use a separate templates folder, depending on your preferences.

## Using Bower

**todo**
