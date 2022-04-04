(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"9Yzh":function(t,r,e){"use strict";e.d(r,"a",(function(){return w})),e.d(r,"b",(function(){return C})),e.d(r,"c",(function(){return y})),e.d(r,"d",(function(){return v}));var n=e("fXoL"),i=e("ofXK"),o=e("3Pt+"),s=e("quSY");function a(t,r){1&t&&(n.Pb(0,"div"),n.dc(1),n.Ob())}const c=["*"];function u(t,r){if(1&t&&(n.Pb(0,"p"),n.Bc(1),n.Ob()),2&t){const t=r.$implicit;n.yb(1),n.Cc(t)}}function l(t,r){if(1&t&&(n.Pb(0,"div"),n.Pb(1,"div",1),n.zc(2,u,2,1,"p",2),n.Ob(),n.dc(3),n.Ob()),2&t){const t=n.Yb();n.yb(2),n.fc("ngForOf",t.getErrorMessages())}}function d(t,r){if(r){const e=r.control.controls[t];if(!e)throw new Error(`There is no control named '${t}'`+(h(r).length>0?` within '${h(r).join(".")}'`:"")+".");if(!(e instanceof o.f))throw new Error(`The control named '${t}' `+(h(r).length>0?`within '${h(r).join(".")}' `:"")+"is not a FormControl. Maybe you accidentally referenced a FormGroup or FormArray?");return e}throw new Error("You can't pass a string to arv-validation-messages's for attribute, when the arv-validation-messages element is not a child of an element with a formGroupName or formGroup declaration.")}function f(t){return!!(!t||t.form||t.formDirective&&t.formDirective.form)}function h(t){return t.path||[]}let m=(()=>{class t{constructor(t){this.controlContainer=t,this.initializeForOnInit=()=>{}}set for(t){f(this.controlContainer)?this._for="string"==typeof t?d(t,this.controlContainer):t:this.initializeForOnInit=()=>this.for=t}get for(){return this._for}get context(){return this._context}ngOnInit(){this.initializeForOnInit()}canHandle(t){return(!this.for||t.control===this.for)&&t.key===this.key}show(t){this._context=t.errorObject}reset(){this._context=void 0}}return t.\u0275fac=function(r){return new(r||t)(n.Jb(o.a,8))},t.\u0275cmp=n.Db({type:t,selectors:[["arv-validation-message"]],inputs:{for:"for",key:"key"},ngContentSelectors:c,decls:1,vars:1,consts:[[4,"ngIf"]],template:function(t,r){1&t&&(n.ec(),n.zc(0,a,2,0,"div",0)),2&t&&n.fc("ngIf",r.context)},directives:[i.j],encapsulation:2}),t})();class g{constructor(t,r,e){this.control=t,this.key=r,this.errorObject=e}static fromFirstError(t){if(t.errors)return new g(t,Object.keys(t.errors)[0],t.errors[Object.keys(t.errors)[0]])}hasMessage(){return!!this.getMessage()}getMessage(){return this.errorObject.message}}let p=(()=>{class t{constructor(t){this.submitted=t.ngSubmit.asObservable()}}return t.\u0275fac=function(r){return new(r||t)(n.Jb(o.i))},t.\u0275dir=n.Eb({type:t,selectors:[["form","formGroup",""]]}),t})();const b=new n.q("ReactiveValidationModuleConfiguration");let v=(()=>{class t{constructor(t,r,e){this.controlContainer=t,this.configuration=e,this._for=[],this.messageComponentsChangesSubscription=new s.a,this.controlStatusChangesSubscription=new s.a,this.formSubmitted=void 0,this.formSubmittedSubscription=new s.a,this.initializeForOnInit=()=>{},r&&(this.formSubmitted=!1,this.formSubmittedSubscription.add(r.submitted.subscribe(()=>{this.formSubmitted=!0})))}ngOnInit(){this.initializeForOnInit()}set for(t){if(f(this.controlContainer)){if(Array.isArray(t)||(t=void 0!==t?[t]:[]),0===t.length)throw new Error("arv-validation-messages doesn't allow declaring an empty array as input to the 'for' attribute.");this._for=t.map(t=>"string"==typeof t?d(t,this.controlContainer):t),this.validateChildren(),this.controlStatusChangesSubscription.unsubscribe(),this.controlStatusChangesSubscription=new s.a,this._for.forEach(t=>{this.controlStatusChangesSubscription.add(t.statusChanges.subscribe(()=>{this.handleControlStatusChange(t)}))})}else this.initializeForOnInit=()=>this.for=t}ngAfterContentInit(){this.messageComponentsChangesSubscription.add(this.messageComponents.changes.subscribe(this.validateChildren)),this.validateChildren(),this._for.forEach(t=>{this.handleControlStatusChange(t)})}ngOnDestroy(){this.messageComponentsChangesSubscription.unsubscribe(),this.formSubmittedSubscription.unsubscribe(),this.controlStatusChangesSubscription.unsubscribe()}isValid(){return 0===this.getFirstErrorPerControl().length}getErrorMessages(){return this.getFirstErrorPerControl().filter(t=>t.hasMessage()).map(t=>t.getMessage())}getFirstErrorPerControl(){return this._for.filter(t=>this.configuration&&this.configuration.displayValidationMessageWhen?this.configuration.displayValidationMessageWhen(t,this.formSubmitted):t.touched||this.formSubmitted).map(g.fromFirstError).filter(t=>void 0!==t)}validateChildren(){this.messageComponents&&this.messageComponents.forEach(t=>{if(this._for.length>1&&void 0===t.for)throw new Error(`Specify the FormControl for which the arv-validation-message element with key '${t.key}' should show messages.`);if(t.for&&-1===this._for.indexOf(t.for))throw new Error(`A arv-validation-messages element with key '${t.key}' attempts to show messages for a FormControl that is not declared in the parent arv-validation-messages element.`)})}handleControlStatusChange(t){if(!this.messageComponents)return;this.messageComponents.filter(r=>r.for===t||void 0===r.for).forEach(t=>t.reset());const r=g.fromFirstError(t);if(!r||r.hasMessage())return;const e=this.messageComponents.find(t=>t.canHandle(r));if(!e)throw new Error(`There is no suitable arv-validation-message element to show the '${r.key}' error of '${function t(r){const e=r.parent;if(e){let n=t(e);return n&&(n+="."),n+Object.keys(e.controls).find(t=>{const n=e.controls;return Array.isArray(n)?n[Number(t)]===r:n[t]===r})}return""}(r.control)}'`);e.show(r)}}return t.\u0275fac=function(r){return new(r||t)(n.Jb(o.a,8),n.Jb(p,8),n.Jb(b,8))},t.\u0275cmp=n.Db({type:t,selectors:[["arv-validation-messages"]],contentQueries:function(t,r,e){var i;1&t&&n.Cb(e,m,!1),2&t&&n.qc(i=n.Xb())&&(r.messageComponents=i)},inputs:{for:"for"},ngContentSelectors:c,decls:1,vars:1,consts:[[4,"ngIf"],[1,"invalid-feedback"],[4,"ngFor","ngForOf"]],template:function(t,r){1&t&&(n.ec(),n.zc(0,l,4,1,"div",0)),2&t&&n.fc("ngIf",!r.isValid())},directives:[i.j,i.i],encapsulation:2}),t})(),w=(()=>{class t{static forRoot(r){return{ngModule:t,providers:[{provide:b,useValue:r}]}}}return t.\u0275mod=n.Hb({type:t}),t.\u0275inj=n.Gb({factory:function(r){return new(r||t)},imports:[[i.b]]}),t})();class C{static wrapNoArgumentValidator(t,r){return function(e){return function(n){return C.validateAndSetMessageIfInvalid(n,()=>t,r,e)}}}static wrapSingleArgumentValidator(t,r){return function(e,n){return function(i){const o=C.unwrapArgument(e);return C.validateAndSetMessageIfInvalid(i,t,r,n,o)}}}static wrapTwoArgumentValidator(t,r){return function(e,n,i){return function(o){const s=C.unwrapArgument(e),a=C.unwrapArgument(n);return C.validateAndSetMessageIfInvalid(o,t,r,i,s,a)}}}static unwrapArgument(t){return t instanceof Function&&(t=t()),t}static validateAndSetMessageIfInvalid(t,r,e,n,...i){const o=C.validate(t,r,...i);return C.setMessageIfInvalid(t,e,o,n,...i),o}static validate(t,r,...e){return r(...e)(t)}static setMessageIfInvalid(t,r,e,n,...i){n&&e&&e[r]&&("function"==typeof n&&(n=n(...i)),C.isObject(e[r])||(e[r]={}),e[r].message=n)}static isObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}let y=(()=>{class t{static compose(t){return o.s.compose(t)}static min(r,e){return t.minValidator(r,e)}static max(r,e){return t.maxValidator(r,e)}static minLength(r,e){return t.minLengthValidator(r,e)}static maxLength(r,e){return t.maxLengthValidator(r,e)}static pattern(r,e){return t.patternValidator(r,e)}static required(r){return t.requiredValidator(r)}static requiredTrue(r){return t.requiredTrueValidator(r)}static email(r){return t.emailValidator(r)}}return t.minValidator=C.wrapSingleArgumentValidator(o.s.min,"min"),t.maxValidator=C.wrapSingleArgumentValidator(o.s.max,"max"),t.minLengthValidator=C.wrapSingleArgumentValidator(o.s.minLength,"minlength"),t.maxLengthValidator=C.wrapSingleArgumentValidator(o.s.maxLength,"maxlength"),t.patternValidator=C.wrapSingleArgumentValidator(o.s.pattern,"pattern"),t.requiredValidator=C.wrapNoArgumentValidator(o.s.required,"required"),t.requiredTrueValidator=C.wrapNoArgumentValidator(o.s.requiredTrue,"required"),t.emailValidator=C.wrapNoArgumentValidator(o.s.email,"email"),t.nullValidator=o.s.nullValidator,t.composeAsync=o.s.composeAsync,t})()},XCRo:function(t,r,e){"use strict";e.d(r,"a",(function(){return o})),e.d(r,"c",(function(){return s})),e.d(r,"b",(function(){return a}));var n=e("3Pt+"),i=e("9Yzh");const o=t=>{Object.keys(t.controls).forEach(r=>{const e=t.get(r);e instanceof n.f?(e.markAsTouched(),e.markAsDirty()):e instanceof n.h?o(e):e instanceof n.c&&e.getRawValue().forEach((t,r)=>{e.at(r)instanceof n.h&&o(e.at(r))})})},s=i.b.wrapTwoArgumentValidator((t,r)=>function(e){if(!e.value)return null;let n=new Date(e.value);return n>=t&&n<=r?null:{error:{message:"La hora debe de estar de acuerdo a la hora configurada en Ad4 y Ad8"}}},"error"),a=i.b.wrapTwoArgumentValidator((t,r)=>{const e=t.value;return function(t){if(!e)return null;if(!t.value)return null;let n=new Date(e),i=new Date(t.value),o=n.getHours(),s=i.getHours(),a=n.getMinutes(),c=i.getMinutes();return"f"==r&&n>i?{error:{message:"Fecha fin debe de ser mayor a decha inicio"}}:"h"==r&&(o==s&&a==c||s<o||o==s&&c<a)?{error:{message:"Hora Fin mayor a hora inicio"}}:null}},"error")},bel0:function(t,r,e){"use strict";e.d(r,"a",(function(){return o}));var n=e("fXoL"),i=e("9Yzh");let o=(()=>{class t{constructor(){this.nombreControlError=" "}ngOnInit(){}}return t.\u0275fac=function(r){return new(r||t)},t.\u0275cmp=n.Db({type:t,selectors:[["input-invalido"]],inputs:{nombreControlError:"nombreControlError"},decls:2,vars:1,consts:[[1,"p-invalid"],[3,"for"]],template:function(t,r){1&t&&(n.Pb(0,"div",0),n.Kb(1,"arv-validation-messages",1),n.Ob()),2&t&&(n.yb(1),n.gc("for",r.nombreControlError))},directives:[i.d],styles:[".p-invalid[_ngcontent-%COMP%]{height:.85rem;width:100%;font-size:.75em;color:red}[_nghost-%COMP%]     .invalid-feedback>p{margin:0!important}"]}),t})()},hGdz:function(t,r,e){"use strict";e.d(r,"a",(function(){return o}));var n=e("9Yzh"),i=e("fXoL");let o=(()=>{class t{}return t.\u0275mod=i.Hb({type:t}),t.\u0275inj=i.Gb({factory:function(r){return new(r||t)},providers:[],imports:[[n.a]]}),t})()}}]);