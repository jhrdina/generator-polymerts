/// <reference path="<%= pathToBower %>/polymer-ts/polymer-ts.d.ts"/>

@component('<%=elementName%>')
class <%=className%> extends polymer.Base {

  @property({ type: String, value: 'Hello World!' })
  greet: string;


}

<%=className%>.register();
