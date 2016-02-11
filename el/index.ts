/// <reference path='../typings/yeoman-generator/yeoman-generator.d.ts'/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
/// <reference path='../typings/cheerio/cheerio.d.ts' />

//import $ = require('cheerio');

import path = require('path');

import _s = require('underscore.string');

import yeoman = require('yeoman-generator');

module GeneratorPolymerTS {

  type yo = yo.YeomanGeneratorBase;

  export interface IMemFsEditor {

    exists(path: string): boolean;

    read(path: string, options?: any): string|Buffer;
    write(path: string, contents: string|Buffer);
  }

  export interface IOptions {
    path: string;
  }

  export class El {
    fs: IMemFsEditor;

    includeTests: boolean;
    elementName: string;
    className: string;
    pathToBower: string;
    pathToTypings: string;
    options: IOptions;

    dependencies: Array<String>;

    yo: yo;

    constructor() {
      yeoman.generators.Base.apply(this, arguments);

      this.yo = <any>this;

      this.dependencies = ['polymer', 'polymer-ts'];

      this.yo.argument('elementName',
        { required: true, type: 'string', desc: 'element name. Must contains dash symbol!' });

      this.yo.option('path', { desc: 'element output path', defaults: 'app' });
    }

    initializing() {

      if (this.elementName.indexOf('-') === -1) {
        this.yo.emit('error', new Error(
          'Element name must contain a dash "-"\n' +
          'ex: yo polymer:el my-element'
        ));
      }
    }

    prompting() {
      if (!this._existsElementsFile()) return;

      var done = this.yo.async();

      var prompts = [
        {
          name: 'includeTests',
          message: 'Would you like to include test files?',
          type: 'confirm',
          default: true
        }
      ];

      this.yo.prompt(prompts, function(answers: any) {
        this.yo.includeTests = answers.includeTests;
        done();
      }.bind(this.yo));
    }

    configuring() {
    }

    // MAIN TASK
    execute() {
      //console.log( 'El.execute' );

      // el = 'x-foo/x-foo'
      var el = path.join(this.elementName, this.elementName);

      // pathToEl = 'app/elements/foo/bar/x-foo'
      var pathToEl = path.join(this.options.path, 'elements', el);

      console.log('Generating Element', el, 'pathToEl', pathToEl);

      // Used by element template
      this.pathToBower = path.relative(
        path.dirname(pathToEl),
        path.join(process.cwd(), this.options.path, 'bower_components')
      );

      this.pathToTypings = path.relative(
        path.dirname(pathToEl),
        path.join(process.cwd(), 'typings')
      );

      console.log(this.pathToTypings);

      this.className = _s.classify(this.elementName)


      this.yo.template(path.join(__dirname, 'templates/_element.html'), pathToEl.concat('.html'));
      this.yo.template(path.join(__dirname, 'templates/_demo.html'),
        path.join(this.options.path, 'elements', this.elementName, 'demo.html'));


      try {

        this.yo.template(path.join(__dirname, 'templates/_element.tst'), pathToEl.concat('.ts'));

        if (this.includeTests) {
          var pathToTest = path.join(this.options.path, 'elements',
            this.elementName, 'test', this.elementName);

          this.yo.template(path.join(__dirname, 'templates/_element.test.html'), pathToTest.concat('.html'));
          this.yo.template(path.join(__dirname, 'templates/_element.test.tst'), pathToTest.concat('.ts'));

          // Add Test to index.html

          var relPathToTest = path.relative(
            path.join(this.options.path, 'test'),
            pathToTest.concat('.html')
          );

          var testsIndexPath = path.join(this.options.path, 'test', 'index.html');

          var file = this.fs.read(testsIndexPath).toString();
          var pattern = 'WCT.loadSuites([';
          file = file.replace(
            pattern,
            pattern + "\n        '" + relPathToTest + "',"
          );
          this.fs.write(testsIndexPath, file);
        }
      }
      catch (e) {
        this.yo.log('error: ' + e);
      }
    }

    end() {
    }

    // custom
    private _existsElementsFile() {
      return this.fs.exists('app/elements/elements.html');
    }
  }
} // end generator module

var generator = yeoman.generators.Base.extend(GeneratorPolymerTS.El.prototype);

module.exports = generator;
