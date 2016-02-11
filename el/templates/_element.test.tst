
/// <reference path="../<%= pathToTypings %>/chai/chai.d.ts" />
/// <reference path="../<%= pathToTypings %>/mocha/mocha.d.ts" />

var expect: Chai.ExpectStatic = expect || undefined;
var fixture = fixture || undefined;

suite('<%=elementName%> tests', function() {
  var el: <%=className%>;
  var span: HTMLElement;

  setup(function() {
    el = fixture('basic');
  });

  test('Hello world as default', function() {
    span = el.$$('span');
    expect(span.textContent).to.equal('Hello world!');
  });

});
