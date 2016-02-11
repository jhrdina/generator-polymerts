"use strict";
var path = require('path');
var _s = require('underscore.string');
var yeoman = require('yeoman-generator');
var GeneratorPolymerTS;
(function (GeneratorPolymerTS) {
    var El = (function () {
        function El() {
            yeoman.generators.Base.apply(this, arguments);
            this.yo = this;
            this.dependencies = ['polymer', 'polymer-ts'];
            this.yo.argument('elementName', { required: true, type: 'string', desc: 'element name. Must contains dash symbol!' });
            this.yo.option('path', { desc: 'element output path', defaults: 'app' });
        }
        El.prototype.initializing = function () {
            if (this.elementName.indexOf('-') === -1) {
                this.yo.emit('error', new Error('Element name must contain a dash "-"\n' +
                    'ex: yo polymer:el my-element'));
            }
        };
        El.prototype.prompting = function () {
            if (!this._existsElementsFile())
                return;
            var done = this.yo.async();
            var prompts = [
                {
                    name: 'includeTests',
                    message: 'Would you like to include test files?',
                    type: 'confirm',
                    default: true
                }
            ];
            this.yo.prompt(prompts, function (answers) {
                this.yo.includeTests = answers.includeTests;
                done();
            }.bind(this.yo));
        };
        El.prototype.configuring = function () {
        };
        El.prototype.execute = function () {
            var el = path.join(this.elementName, this.elementName);
            var pathToEl = path.join(this.options.path, 'elements', el);
            console.log('Generating Element', el, 'pathToEl', pathToEl);
            this.pathToBower = path.relative(path.dirname(pathToEl), path.join(process.cwd(), this.options.path, 'bower_components'));
            this.pathToTypings = path.relative(path.dirname(pathToEl), path.join(process.cwd(), 'typings'));
            console.log(this.pathToTypings);
            this.className = _s.classify(this.elementName);
            this.yo.template(path.join(__dirname, 'templates/_element.html'), pathToEl.concat('.html'));
            this.yo.template(path.join(__dirname, 'templates/_demo.html'), path.join(this.options.path, 'elements', this.elementName, 'demo.html'));
            try {
                this.yo.template(path.join(__dirname, 'templates/_element.tst'), pathToEl.concat('.ts'));
                if (this.includeTests) {
                    var pathToTest = path.join(this.options.path, 'elements', this.elementName, 'test', this.elementName);
                    this.yo.template(path.join(__dirname, 'templates/_element.test.html'), pathToTest.concat('.html'));
                    this.yo.template(path.join(__dirname, 'templates/_element.test.tst'), pathToTest.concat('.ts'));
                    var relPathToTest = path.relative(path.join(this.options.path, 'test'), pathToTest.concat('.html'));
                    var testsIndexPath = path.join(this.options.path, 'test', 'index.html');
                    var file = this.fs.read(testsIndexPath).toString();
                    var pattern = 'WCT.loadSuites([';
                    file = file.replace(pattern, pattern + "\n        '" + relPathToTest + "',");
                    this.fs.write(testsIndexPath, file);
                }
            }
            catch (e) {
                this.yo.log('error: ' + e);
            }
        };
        El.prototype.end = function () {
        };
        El.prototype._existsElementsFile = function () {
            return this.fs.exists('app/elements/elements.html');
        };
        return El;
    }());
    GeneratorPolymerTS.El = El;
})(GeneratorPolymerTS || (GeneratorPolymerTS = {}));
var generator = yeoman.generators.Base.extend(GeneratorPolymerTS.El.prototype);
module.exports = generator;
//# sourceMappingURL=index.js.map