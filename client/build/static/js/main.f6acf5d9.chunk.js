(this.webpackJsonpdashboard=this.webpackJsonpdashboard||[]).push([[0],{217:function(e,t,a){e.exports=a(378)},376:function(e,t,a){},378:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(24),l=a.n(c),o=a(16),i=a(41),s=a(42),u=a(60),m=a(68),d=new WebSocket("ws://".concat(window.location.host.split(":")[0],":3030")),f=new(function(){function e(t){var a=this;Object(i.a)(this,e),this.socket=t,this.listeners=[],this.of=[],this.socket.addEventListener("open",(function(e){console.info("Socket connected"),a.handleEvent("open")})),this.socket.addEventListener("message",(function(e){var t=JSON.parse(e.data),n=t.ev,r=t.data;a.handleEvent(n,r)})),this.socket.addEventListener("error",(function(e){console.error(e),a.handleEvent("error")})),this.socket.addEventListener("close",(function(){console.log("socket closed"),a.handleEvent("close")}))}return Object(s.a)(e,[{key:"emit",value:function(e,t){1===this.socket.readyState?this.socket.send(JSON.stringify({ev:e,msg:t})):console.log("not ready yet",e,t)}},{key:"handleEvent",value:function(e,t){var a=this,n=0;this.listeners.forEach((function(r){r.ev===e&&(n++,r.fn.call(a,t))})),0===n&&(console.warn("No handler registered for ev ".concat(e)),console.dir(t))}},{key:"on",value:function(e,t){this.listeners.push({ev:e,fn:t})}}]),e}())(d);f.on("open",(function(){f.emit("WIDGETS_LIST",{})}));var E=f,h=a(26),v=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"scan",value:function(){E.emit("DEVICES_SCAN",{})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"widget"},r.a.createElement("h2",null,"Administration"),r.a.createElement(h.a,{block:"true",variant:"outline-light",size:"lg",onClick:function(){return e.scan()}},"Scan for devices"),r.a.createElement("div",null,r.a.createElement("h3",null,"Cron tasks:")))}}]),a}(r.a.Component),y=a(138),p=a(202),k=a(210),g=a(136),b=a(394),O=a(395),S=a(396),j=a(397),w=a(398),C=a(402),D=a(403),x=a(404),M=a(405),T=a(209),z=a(412),L=a(406),_=a(407),N=a(201),A=a(109),W=a(200),I=a(183),F=a.n(I);a(224);function B(e){return r.a.createElement(h.a,{block:"true",variant:e.style?e.style:"outline-info",size:"lg",onClick:function(){e.update({data:null,payload:e.payload})}},e.label)}var R=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={value:0},n}return Object(s.a)(a,[{key:"clickHandler",value:function(e){e.preventDefault(),console.log(e.currentTarget.offsetLeft),console.log(e.clientX),console.log(e.currentTarget.offsetWidth);var t=(e.clientX-e.currentTarget.offsetLeft)/e.currentTarget.offsetWidth;this.setState({value:Math.floor(100*t)}),console.log(this.state),this.props.update({data:this.state.value,payload:this.props.payload})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"sliderContainer",onClick:function(t){return e.clickHandler(t)}},r.a.createElement("span",null,this.props.label),r.a.createElement(k.a,{striped:!0,variant:"dark",now:this.state.value}))}}]),a}(r.a.Component);function G(e){var t=Object(n.useState)(e.val||0),a=Object(o.a)(t,2),c=a[0],l=a[1];return r.a.createElement("div",null,r.a.createElement("div",null,e.label),r.a.createElement(F.a,{value:c,size:"lg",variant:"dark",onChange:function(e){return l(e.target.value)},onAfterChange:function(t){return e.update({data:t.target.value,payload:e.payload})}}))}function P(e){return r.a.createElement(b.a,{className:""},r.a.createElement(O.a,null,r.a.createElement(S.a,{style:{"font-size":"4em"}})," "),r.a.createElement(O.a,null,r.a.createElement(b.a,null,"23 c"),r.a.createElement(b.a,null,r.a.createElement(O.a,null," ",r.a.createElement(j.a,null)," 10 "),r.a.createElement(O.a,null," ",r.a.createElement(w.a,null)," 33 "))))}function Y(e){var t=Object(n.useState)(!1),a=Object(o.a)(t,2),c=a[0],l=a[1],i=Object(n.useState)("D"),s=Object(o.a)(i,2),u=s[0],m=s[1],d={maintainAspectRatio:!0,scales:{yAxes:e.plots.map((function(e){return{ticks:{callback:function(t,a,n){return"".concat(t," ").concat(e.unit)},maxTicksLimit:5,fontColor:e.color,suggestedMin:900,suggestedMax:1e3},type:"linear",display:c,id:"axis-".concat(e.key)}})),xAxes:[{type:"time",distribution:"linear",time:{unit:"minute"},drawTicks:!1}]}},f={datasets:e.plots.map((function(t){return{label:t.label,borderColor:t.color,fill:!1,data:e.data[u].data.map((function(e){return{t:e.t,y:e.v[t.key]}})),yAxisID:"axis-".concat(t.key)}}))};return r.a.createElement("div",null,r.a.createElement(T.a,{data:f,options:d}),r.a.createElement(b.a,null,r.a.createElement(O.a,null,r.a.createElement(h.a,{variant:c?"outline-success":"outline-secondary",onClick:function(){l(!c)},size:"sm"},"scale")),r.a.createElement(O.a,null,r.a.createElement(h.a,{variant:"Y"===u?"outline-success":"outline-secondary",onClick:function(){m("Y")},size:"sm"},"Year")),r.a.createElement(O.a,null,r.a.createElement(h.a,{variant:"M"===u?"outline-success":"outline-secondary",onClick:function(){m("M")},size:"sm"},"Month")),r.a.createElement(O.a,null,r.a.createElement(h.a,{variant:"W"===u?"outline-success":"outline-secondary",onClick:function(){m("W")},size:"sm"},"Week")),r.a.createElement(O.a,null,r.a.createElement(h.a,{variant:"D"===u?"outline-success":"outline-secondary",onClick:function(){m("D")},size:"sm"},"Day"))))}function H(e){var t=Object(n.useState)(!1),a=Object(o.a)(t,2),c=a[0],l=a[1],i=Object(n.useState)("D"),s=Object(o.a)(i,2),u=s[0],m=s[1];var d,f=r.a.createElement(O.a,null,r.a.createElement(p.a,{"aria-label":"timescales"},r.a.createElement(h.a,{variant:c?"outline-warning":"outline-secondary",onClick:function(){l(!c)}},"Plot"),r.a.createElement(h.a,{variant:"Y"===u?"outline-success":"outline-secondary",onClick:function(){m("Y")}},"last Year"),r.a.createElement(h.a,{variant:"M"===u?"outline-success":"outline-secondary",onClick:function(){m("M")}},"last 30d"),r.a.createElement(h.a,{variant:"W"===u?"outline-success":"outline-secondary",onClick:function(){m("W")}},"last 7d"),r.a.createElement(h.a,{variant:"D"===u?"outline-success":"outline-secondary",onClick:function(){m("D")}},"last 24h"))),E=e.channels.map((function(t){return r.a.createElement(b.a,{className:"sensor_row",key:"chann_".concat(t.key)},r.a.createElement(O.a,null,r.a.createElement(b.a,null,r.a.createElement(O.a,{xs:"auto",style:{alignSelf:"center"}},function(e){switch(e){case"TEMP":return r.a.createElement(C.a,{style:{fontSize:"5vh"}});case"HUMID":return r.a.createElement(D.a,{style:{fontSize:"5vh"}});case"PRES":return r.a.createElement(x.a,{style:{fontSize:"5vh"}});case"BAT":return r.a.createElement(S.a,{style:{fontSize:"5vh"}});default:return r.a.createElement(M.a,{style:{fontSize:"5vh"}})}}(t.icon)),r.a.createElement(O.a,{xs:"6",style:{alignSelf:"center",fontSize:"4vh"}},parseFloat(e.data[u].keys[t.key].last).toFixed(2),r.a.createElement("small",null,t.unit)),r.a.createElement(O.a,{xs:"2",style:{fontSize:"2.6vh"}},r.a.createElement(b.a,null,r.a.createElement(O.a,null,r.a.createElement(w.a,null)),r.a.createElement(O.a,null,parseFloat(e.data[u].keys[t.key].max).toFixed(2))),r.a.createElement(b.a,null,r.a.createElement(O.a,null,r.a.createElement(j.a,null)),r.a.createElement(O.a,null,parseFloat(e.data[u].keys[t.key].min).toFixed(2))))),c?r.a.createElement(b.a,null,r.a.createElement(O.a,{style:{color:t.color}},function(e){return r.a.createElement(z.a,{height:100},r.a.createElement(L.a,{width:600,height:100,data:e.data},r.a.createElement(T.a,{dot:!1,type:"monotone",dataKey:"v",stroke:e.color,strokeWidth:2,margin:{top:0,right:0,bottom:0,left:0}}),r.a.createElement(_.a,{stroke:"#333",strokeDasharray:"4",horizontal:!0}),r.a.createElement(N.a,{width:45,domain:[Math.floor(e.min),Math.ceil(e.max)],style:{fontSize:".8em"}}),r.a.createElement(A.a,{separator:"",labelFormatter:function(e){var t=new Date(e);return"".concat(t.toLocaleDateString("en-GB"),":").concat(t.toLocaleTimeString("en-GB"))},formatter:function(t,a,n){return["".concat(parseFloat(t).toFixed(2)).concat(e.unit),""]},contentStyle:{backgroundColor:"#222",border:"0"}}),r.a.createElement(W.a,{hide:!1,interval:Math.ceil(e.data.length/10),dataKey:"t",tick:!0,tickFormatter:function(e){var t=new Date(e);return"".concat(t.getDay(),".").concat(t.getMonth()," ").concat(t.getHours(),":").concat(t.getMinutes())},style:{fontSize:".8em"}})))}(Object(y.a)(Object(y.a)({},t),{},{min:e.data[u].keys[t.key].min,max:e.data[u].keys[t.key].max,data:e.data[u].data.map((function(e){return{t:e.t,v:e.v[t.key]}}))})))):""))})),v=Math.floor((Date.now()-e.data.I.data[e.data.I.data.length-1].t)/1e3);return r.a.createElement("div",null,r.a.createElement(b.a,null,r.a.createElement(O.a,null,E)),r.a.createElement(b.a,{style:{marginTop:".4em"}},f),r.a.createElement(b.a,{style:{marginTop:".4em",paddingRight:".4em"}},r.a.createElement(O.a,null,"OPERATIVE"!==e.state.status?r.a.createElement(g.a,{variant:"danger"},r.a.createElement(S.a,null)," Battery critical"):""),r.a.createElement(O.a,{style:{textAlign:"right"}},r.a.createElement(g.a,{variant:v<3600?"dark":"danger"},(d=v)<60?"".concat(d,"s"):d<3600?"".concat(Math.floor(d/60),"m"):d<86400?"".concat(Math.floor(d/3600),"h"):d<604800?"".concat(Math.floor(d/86400),"d"):"".concat(Math.floor(d/604800),"w")," ago"))))}var J=a(413),U=a(408),V=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"update",value:function(e){var t=e.data,a=e.payload;E.emit("WIDGETS_CMD",{id:this.props.id,data:t,payload:a})}},{key:"render",value:function(){var e=this,t=this.props.controls.map((function(t,a){return r.a.createElement(b.a,{key:"row_".concat(a)},t.map((function(t,a){if(!t.type)return null;switch(t.type.toUpperCase()){case"BUTTON":return r.a.createElement(O.a,{key:"btn_".concat(a)},r.a.createElement(B,Object.assign({update:function(t){return e.update(t)},key:"btn_".concat(a)},t)));case"SLIDER":return r.a.createElement(O.a,{key:"slider_".concat(a)},r.a.createElement(R,Object.assign({update:function(t){return e.update(t)},key:"slider_".concat(a)},t)));case"LABEL":return r.a.createElement(O.a,{key:"label_".concat(a)},r.a.createElement(P,t));case"RANGE":return r.a.createElement(O.a,{key:"range_".concat(a)},r.a.createElement(G,Object.assign({update:function(t){return e.update(t)},key:"rng_".concat(a)},t)));case"PLOT":return r.a.createElement(O.a,{key:"plot_".concat(a)},r.a.createElement(Y,t));case"SENSOR":return r.a.createElement(O.a,{key:"sensor_".concat(a)},r.a.createElement(H,t));default:return r.a.createElement(J.a,{key:"alert_".concat(a),variant:"warning"},"Control for ",t.type," not found!")}})))}));return r.a.createElement(U.a,{id:"DeviceControl"},t)}}]),a}(r.a.Component);function K(e){return r.a.createElement("div",{className:"widget"},function(e){return"admin"===e.type?r.a.createElement("div",{className:"title"},"Admin"):r.a.createElement("div",{className:"title"},r.a.createElement("span",null,e.name?e.name:e.human_name))}(e),"admin"===e.type?r.a.createElement(v,e):r.a.createElement(V,e))}function X(e){return e.widgets.map((function(t,a){return r.a.createElement(K,Object.assign({type:e.location,key:a},t))}))}var $=a(411),q=a(410),Q=a(204),Z=a.n(Q);function ee(e){var t=Object(n.useState)(window.location.hash||"#home"),a=Object(o.a)(t,2),c=(a[0],a[1]),l=Object(n.useCallback)((function(t){var a=t.slice(1);e.onChange(a),c(a)}),[e]);return Object(n.useEffect)((function(){l(window.location.hash||"#home")}),[l]),r.a.createElement($.a,{fixed:"top",bg:"dark",expand:"lg",collapseOnSelect:!0},r.a.createElement($.a.Brand,null,r.a.createElement(Z.a,{style:{fontSize:"3vh"}})),r.a.createElement($.a.Toggle,{"aria-controls":"basic-navbar-nav"}),r.a.createElement($.a.Collapse,{id:"basic-navbar-nav"},r.a.createElement(q.a,{className:"mr-auto"},r.a.createElement(q.a.Link,{onClick:function(){l("#home")},href:"#home"},"home"),r.a.createElement(q.a.Link,{onClick:function(){l("#devices")},href:"#devices"},"Devices"),r.a.createElement(q.a.Link,{onClick:function(){l("#sensors")},href:"#sensors"},"Sensors"),r.a.createElement(q.a.Link,{onClick:function(){l("#admin")},href:"#admin"},"Admin"))))}function te(){var e=Object(n.useState)([]),t=Object(o.a)(e,2),a=t[0],c=t[1],l=Object(n.useState)(""),i=Object(o.a)(l,2),s=i[0],u=i[1];Object(n.useEffect)((function(){E.on("WIDGETS_UPDATE",(function(e){c(e)}))}),[]);var m="admin"===s?r.a.createElement(v,null):r.a.createElement(X,{location:s,widgets:function(){switch(s){case"devices":return a.filter((function(e){return"aurora"===e.type}));case"sensors":return a.filter((function(e){return"sensor"===e.type}));case"home":return a.filter((function(e){return"group"===e.type}));default:return a}}()});return r.a.createElement("div",null,r.a.createElement(ee,{onChange:function(e){return u(e)}}),r.a.createElement("div",{id:"MainView"},m))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(375),a(376);function ae(){var e=Object(n.useState)(!0),t=Object(o.a)(e,2),a=t[0],c=t[1];return Object(n.useEffect)((function(){E.on("close",(function(){return c(!0)})),E.on("error",(function(){return c(!0)})),E.on("open",(function(){return c(!1)}))}),[]),r.a.createElement("div",{id:"ws-overlay",className:a?"":"hide"},r.a.createElement("div",null,r.a.createElement("h2",null,"WS not connected, please reload window")))}l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(ae,null),r.a.createElement(te,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[217,1,2]]]);
//# sourceMappingURL=main.f6acf5d9.chunk.js.map