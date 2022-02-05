(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~components-private-private-module~components-public-public-module"],{

/***/ "9Yzh":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/angular-reactive-validation/__ivy_ngcc__/fesm2015/angular-reactive-validation.js ***!
  \*******************************************************************************************************/
/*! exports provided: ReactiveValidationModule, ValidatorDeclaration, Validators, ɵa, ɵb, ɵc, ɵd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReactiveValidationModule", function() { return ReactiveValidationModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValidatorDeclaration", function() { return ValidatorDeclaration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Validators", function() { return Validators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵa", function() { return ValidationMessagesComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵb", function() { return ValidationMessageComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵc", function() { return ReactiveValidationModuleConfigurationToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵd", function() { return FormDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "qCKp");









function ValidationMessageComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
const _c0 = ["*"];
function ValidationMessagesComponent_div_0_p_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](message_r2);
} }
function ValidationMessagesComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ValidationMessagesComponent_div_0_p_2_Template, 2, 1, "p", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.getErrorMessages());
} }
function getFormControlFromContainer(name, controlContainer) {
    if (controlContainer) {
        const control = controlContainer.control.controls[name];
        if (!control) {
            throw new Error(`There is no control named '${name}'` +
                (getPath(controlContainer).length > 0 ? ` within '${getPath(controlContainer).join('.')}'` : '') + '.');
        }
        if (!(control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"])) {
            throw new Error(`The control named '${name}' ` +
                (getPath(controlContainer).length > 0 ? `within '${getPath(controlContainer).join('.')}' ` : '') +
                `is not a FormControl. Maybe you accidentally referenced a FormGroup or FormArray?`);
        }
        return control;
    }
    else {
        throw new Error(`You can't pass a string to arv-validation-messages's for attribute, when the ` +
            `arv-validation-messages element is not a child of an element with a formGroupName or formGroup declaration.`);
    }
}
function isControlContainerVoidOrInitialized(controlContainer) {
    return !!(!controlContainer || controlContainer.form ||
        (controlContainer.formDirective && controlContainer.formDirective.form));
}
function getPath(controlContainer) {
    return controlContainer.path || [];
}

/**
 * The ValidationMessageComponent lets the developer specify a custom visual style and custom error message
 * for edge-cases where the standard style or message capabilities do not suffice.
 *
 * TODO: Trigger revalidation by parent whenever [for] changes.
 */
class ValidationMessageComponent {
    constructor(controlContainer) {
        this.controlContainer = controlContainer;
        this.initializeForOnInit = () => { };
    }
    set for(control) {
        if (!isControlContainerVoidOrInitialized(this.controlContainer)) {
            this.initializeForOnInit = () => this.for = control;
            return;
        }
        this._for = typeof control === 'string' ? getFormControlFromContainer(control, this.controlContainer) : control;
    }
    get for() {
        return this._for;
    }
    /**
     * The ValidationErrors object that contains contextual information about the error, which can be used for
     * displaying, e.g. the minimum length within the error message.
     */
    get context() {
        return this._context;
    }
    ngOnInit() {
        this.initializeForOnInit();
    }
    canHandle(error) {
        return (!this.for || error.control === this.for) && error.key === this.key;
    }
    show(error) {
        this._context = error.errorObject;
    }
    reset() {
        this._context = undefined;
    }
}
ValidationMessageComponent.ɵfac = function ValidationMessageComponent_Factory(t) { return new (t || ValidationMessageComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], 8)); };
ValidationMessageComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ValidationMessageComponent, selectors: [["arv-validation-message"]], inputs: { for: "for", key: "key" }, ngContentSelectors: _c0, decls: 1, vars: 1, consts: [[4, "ngIf"]], template: function ValidationMessageComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, ValidationMessageComponent_div_0_Template, 2, 0, "div", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.context);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]], encapsulation: 2 });
ValidationMessageComponent.ctorParameters = () => [
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] }] }
];
ValidationMessageComponent.propDecorators = {
    for: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    key: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }]
};
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ValidationMessageComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'arv-validation-message',
                template: "<div *ngIf=\"context\">\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"]
            }] }]; }, { for: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], key: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();

class ValidationError {
    constructor(control, key, errorObject) {
        this.control = control;
        this.key = key;
        this.errorObject = errorObject;
    }
    static fromFirstError(control) {
        if (!control.errors) {
            return undefined;
        }
        return new ValidationError(control, Object.keys(control.errors)[0], control.errors[Object.keys(control.errors)[0]]);
    }
    hasMessage() {
        return !!this.getMessage();
    }
    getMessage() {
        return this.errorObject.message;
    }
}

/**
 * Encapsulates properties and events of the form and makes them available for child components.
 */
class FormDirective {
    constructor(formGroupDirective) {
        this.submitted = formGroupDirective.ngSubmit.asObservable();
    }
}
FormDirective.ɵfac = function FormDirective_Factory(t) { return new (t || FormDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroupDirective"])); };
FormDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: FormDirective, selectors: [["form", "formGroup", ""]] });
FormDirective.ctorParameters = () => [
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroupDirective"] }
];
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
                // tslint:disable-next-line:directive-selector
                selector: 'form[formGroup]'
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroupDirective"] }]; }, null); })();

const ReactiveValidationModuleConfigurationToken = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('ReactiveValidationModuleConfiguration');

/**
 * Given a control, returns a string representation of the property path to
 * this control. Thus, for a FormControl 'firstName', that is part of a
 * FormGroup named 'name', this function will return: 'name.firstName'.
 *
 * Note that FormArray indexes are also put in the path, e.g.: 'person.0.name.firstName'.
 */
function getControlPath(control) {
    const parentControl = control.parent;
    if (parentControl) {
        let path = getControlPath(parentControl);
        if (path) {
            path += '.';
        }
        return path + Object.keys(parentControl.controls).find(key => {
            const controls = parentControl.controls;
            if (Array.isArray(controls)) {
                return controls[Number(key)] === control;
            }
            else {
                return controls[key] === control;
            }
        });
    }
    return '';
}

/**
 * The ValidationMessagesComponent shows validation messages for one to many FormControls. It either shows
 * messages specified within the reactive form model, or shows custom messages declared using the
 * ValidationMessageComponent.
 */
class ValidationMessagesComponent {
    constructor(controlContainer, formSubmitDirective, configuration) {
        this.controlContainer = controlContainer;
        this.configuration = configuration;
        this._for = [];
        this.messageComponentsChangesSubscription = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subscription"]();
        this.controlStatusChangesSubscription = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subscription"]();
        this.formSubmitted = undefined;
        this.formSubmittedSubscription = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subscription"]();
        this.initializeForOnInit = () => { };
        if (formSubmitDirective) {
            this.formSubmitted = false;
            this.formSubmittedSubscription.add(formSubmitDirective.submitted.subscribe(() => {
                this.formSubmitted = true;
            }));
        }
    }
    ngOnInit() {
        this.initializeForOnInit();
    }
    set for(controls) {
        if (!isControlContainerVoidOrInitialized(this.controlContainer)) {
            this.initializeForOnInit = () => this.for = controls;
            return;
        }
        if (!Array.isArray(controls)) {
            controls = controls !== undefined ? [controls] : [];
        }
        if (controls.length === 0) {
            throw new Error(`arv-validation-messages doesn't allow declaring an empty array as input to the 'for' attribute.`);
        }
        this._for = controls.map(control => typeof control === 'string' ?
            getFormControlFromContainer(control, this.controlContainer) : control);
        this.validateChildren();
        this.controlStatusChangesSubscription.unsubscribe();
        this.controlStatusChangesSubscription = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subscription"]();
        this._for.forEach(control => {
            this.controlStatusChangesSubscription.add(control.statusChanges.subscribe(() => {
                this.handleControlStatusChange(control);
            }));
        });
    }
    ngAfterContentInit() {
        this.messageComponentsChangesSubscription.add(this.messageComponents.changes.subscribe(this.validateChildren));
        this.validateChildren();
        this._for.forEach(control => {
            this.handleControlStatusChange(control);
        });
    }
    ngOnDestroy() {
        this.messageComponentsChangesSubscription.unsubscribe();
        this.formSubmittedSubscription.unsubscribe();
        this.controlStatusChangesSubscription.unsubscribe();
    }
    isValid() {
        return this.getFirstErrorPerControl().length === 0;
    }
    getErrorMessages() {
        return this.getFirstErrorPerControl().filter(error => error.hasMessage())
            .map(error => error.getMessage());
    }
    getFirstErrorPerControl() {
        return this._for.filter(control => this.configuration && this.configuration.displayValidationMessageWhen ?
            this.configuration.displayValidationMessageWhen(control, this.formSubmitted) : control.touched || this.formSubmitted).map(ValidationError.fromFirstError).filter(value => value !== undefined);
    }
    /**
     * Validates that the child ValidationMessageComponents declare what FormControl they specify a message for (when needed); and
     * that the declared FormControl is actually part of the parent ValidationMessagesComponent 'for' collection (when specified).
     */
    validateChildren() {
        if (!this.messageComponents) {
            return;
        }
        this.messageComponents.forEach(component => {
            if (this._for.length > 1 && component.for === undefined) {
                throw new Error(`Specify the FormControl for which the arv-validation-message element with key '${component.key}' ` +
                    `should show messages.`);
            }
            if (component.for && this._for.indexOf(component.for) === -1) {
                throw new Error(`A arv-validation-messages element with key '${component.key}' attempts to show messages ` +
                    `for a FormControl that is not declared in the parent arv-validation-messages element.`);
            }
        });
    }
    handleControlStatusChange(control) {
        if (!this.messageComponents) {
            return;
        }
        this.messageComponents.filter(component => component.for === control || component.for === undefined)
            .forEach(component => component.reset());
        const error = ValidationError.fromFirstError(control);
        if (!error || error.hasMessage()) {
            return;
        }
        const messageComponent = this.messageComponents.find(component => {
            return component.canHandle(error);
        });
        if (messageComponent) {
            messageComponent.show(error);
        }
        else {
            throw new Error(`There is no suitable arv-validation-message element to show the '${error.key}' ` +
                `error of '${getControlPath(error.control)}'`);
        }
    }
}
ValidationMessagesComponent.ɵfac = function ValidationMessagesComponent_Factory(t) { return new (t || ValidationMessagesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](FormDirective, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](ReactiveValidationModuleConfigurationToken, 8)); };
ValidationMessagesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ValidationMessagesComponent, selectors: [["arv-validation-messages"]], contentQueries: function ValidationMessagesComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, ValidationMessageComponent, false);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.messageComponents = _t);
    } }, inputs: { for: "for" }, ngContentSelectors: _c0, decls: 1, vars: 1, consts: [[4, "ngIf"], [1, "invalid-feedback"], [4, "ngFor", "ngForOf"]], template: function ValidationMessagesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, ValidationMessagesComponent_div_0_Template, 4, 1, "div", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.isValid());
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"]], encapsulation: 2 });
ValidationMessagesComponent.ctorParameters = () => [
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] }] },
    { type: FormDirective, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] }] },
    { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [ReactiveValidationModuleConfigurationToken,] }] }
];
ValidationMessagesComponent.propDecorators = {
    messageComponents: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"], args: [ValidationMessageComponent,] }],
    for: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }]
};
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ValidationMessagesComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'arv-validation-messages',
                template: "<div *ngIf=\"!isValid()\">\r\n  <div class=\"invalid-feedback\">\r\n    <p *ngFor=\"let message of getErrorMessages()\">{{message}}</p>\r\n  </div>\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ControlContainer"], decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"]
            }] }, { type: FormDirective, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"]
            }] }, { type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"]
            }, {
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [ReactiveValidationModuleConfigurationToken]
            }] }]; }, { for: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], messageComponents: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"],
            args: [ValidationMessageComponent]
        }] }); })();

class ReactiveValidationModule {
    static forRoot(configuration) {
        return {
            ngModule: ReactiveValidationModule,
            providers: [{
                    provide: ReactiveValidationModuleConfigurationToken, useValue: configuration
                }]
        };
    }
}
ReactiveValidationModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: ReactiveValidationModule });
ReactiveValidationModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function ReactiveValidationModule_Factory(t) { return new (t || ReactiveValidationModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](ReactiveValidationModule, { declarations: function () { return [ValidationMessagesComponent, ValidationMessageComponent, FormDirective]; }, imports: function () { return [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]]; }, exports: function () { return [ValidationMessagesComponent, ValidationMessageComponent, FormDirective]; } }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ReactiveValidationModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
                ],
                declarations: [
                    ValidationMessagesComponent,
                    ValidationMessageComponent,
                    FormDirective
                ],
                exports: [
                    ValidationMessagesComponent,
                    ValidationMessageComponent,
                    FormDirective
                ]
            }]
    }], null, null); })();

/**
 * @dynamic
 */
class ValidatorDeclaration {
    /**
     * Wraps your own validator functions for use with the angular-reactive-validation library.
     * @param validatorFn A function you want to wrap which can validate a control.
     * @param resultKey The error key used for indicating an error result as returned from the ValidatorFn.
     * @param message The message to display when a validation error occurs. A function can also be passed to determine
     * the message at a later time.
     */
    static wrapNoArgumentValidator(validatorFn, resultKey) {
        return function (message) {
            return function (control) {
                return ValidatorDeclaration.validateAndSetMessageIfInvalid(control, () => validatorFn, resultKey, message);
            };
        };
    }
    /**
     * Wraps your own validator functions for use with the angular-reactive-validation library.
     * @param validatorFactoryFn A function which accepts a single argument and returns a ValidatorFn.
     * @param resultKey The error key used for indicating an error result as returned from the ValidatorFn.
     */
    static wrapSingleArgumentValidator(validatorFactoryFn, resultKey) {
        return function (arg1, message) {
            return function (control) {
                const unwrappedArg1 = ValidatorDeclaration.unwrapArgument(arg1);
                return ValidatorDeclaration.validateAndSetMessageIfInvalid(control, validatorFactoryFn, resultKey, message, unwrappedArg1);
            };
        };
    }
    /**
     * Wraps your own validator functions for use with the angular-reactive-validation library.
     * @param validatorFactoryFn A function which accepts two arguments and returns a ValidatorFn.
     * @param resultKey The error key used for indicating an error result as returned from the ValidatorFn.
     */
    static wrapTwoArgumentValidator(validatorFactoryFn, resultKey) {
        return function (arg1, arg2, message) {
            return function (control) {
                const unwrappedArg1 = ValidatorDeclaration.unwrapArgument(arg1);
                const unwrappedArg2 = ValidatorDeclaration.unwrapArgument(arg2);
                return ValidatorDeclaration.validateAndSetMessageIfInvalid(control, validatorFactoryFn, resultKey, message, unwrappedArg1, unwrappedArg2);
            };
        };
    }
    static unwrapArgument(arg) {
        if (arg instanceof Function) {
            arg = arg();
        }
        return arg;
    }
    static validateAndSetMessageIfInvalid(control, validatorFactoryFn, resultKey, message, ...args) {
        const validationResult = ValidatorDeclaration.validate(control, validatorFactoryFn, ...args);
        ValidatorDeclaration.setMessageIfInvalid(control, resultKey, validationResult, message, ...args);
        return validationResult;
    }
    static validate(control, validatorFactoryFn, ...args) {
        const wrappedValidatorFn = validatorFactoryFn(...args);
        return wrappedValidatorFn(control);
    }
    static setMessageIfInvalid(control, resultKey, validationResult, message, ...args) {
        if (message) {
            if (validationResult && validationResult[resultKey]) {
                if (typeof message === 'function') {
                    message = message(...args);
                }
                // Not all validators set an object. Often they'll simply set a property to true.
                // Here, we replace any non-object (or array) to be an object on which we can set a message.
                if (!ValidatorDeclaration.isObject(validationResult[resultKey])) {
                    validationResult[resultKey] = {};
                }
                validationResult[resultKey]['message'] = message;
            }
        }
    }
    static isObject(arg) {
        return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
    }
}

/**
 * Provides a set of validators used by form controls.
 *
 * Code comments have been copied from the Angular source code.
 */
class Validators {
    static compose(validators) {
        return validators === null ? _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose(validators) : _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose(validators);
    }
    static min(min, message) {
        return Validators.minValidator(min, message);
    }
    static max(max, message) {
        return Validators.maxValidator(max, message);
    }
    static minLength(minLength, message) {
        return Validators.minLengthValidator(minLength, message);
    }
    static maxLength(maxLength, message) {
        return Validators.maxLengthValidator(maxLength, message);
    }
    static pattern(pattern, message) {
        return Validators.patternValidator(pattern, message);
    }
    static required(message) {
        return Validators.requiredValidator(message);
    }
    static requiredTrue(message) {
        return Validators.requiredTrueValidator(message);
    }
    static email(message) {
        return Validators.emailValidator(message);
    }
}
Validators.minValidator = ValidatorDeclaration.wrapSingleArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].min, 'min');
Validators.maxValidator = ValidatorDeclaration.wrapSingleArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].max, 'max');
Validators.minLengthValidator = ValidatorDeclaration.wrapSingleArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength, 'minlength');
Validators.maxLengthValidator = ValidatorDeclaration.wrapSingleArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength, 'maxlength');
Validators.patternValidator = ValidatorDeclaration.wrapSingleArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern, 'pattern');
Validators.requiredValidator = ValidatorDeclaration.wrapNoArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, 'required');
Validators.requiredTrueValidator = ValidatorDeclaration.wrapNoArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].requiredTrue, 'required');
Validators.emailValidator = ValidatorDeclaration.wrapNoArgumentValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email, 'email');
/**
 * No-op validator.
 */
Validators.nullValidator = _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].nullValidator;
Validators.composeAsync = _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].composeAsync;

/**
 * Generated bundle index. Do not edit.
 */



//# sourceMappingURL=angular-reactive-validation.js.map

/***/ }),

/***/ "FezY":
/*!**************************************************************!*\
  !*** ./src/app/components/shared/footer/footer.component.ts ***!
  \**************************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class FooterComponent {
    constructor() { }
    ngOnInit() {
    }
}
FooterComponent.ɵfac = function FooterComponent_Factory(t) { return new (t || FooterComponent)(); };
FooterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FooterComponent, selectors: [["app-footer"]], decls: 16, vars: 0, consts: [[1, "pie", "p-d-flex", "p-flex-column", "p-flex-md-row"], [1, "p-mb-2", "p-mr-2"], ["src", "assets/images/sistemasUNL_blanco.svg", 2, "width", "100%", "height", "100%"], [1, "p-mb-2", "p-grid"], [1, "p-mt-3", "p-col-12"], [1, "pi", "pi-map-marker"], [1, "p-col-12"], [1, "p-mb-1", "p-col-12"], [1, "pi", "pi-phone"], [1, "p-mb-3", "p-mt-3", "p-col-12", "p-text-center"], [1, "pi", "pi-globe"]], template: function FooterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "i", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Ciudad Universitaria 'Ing. Guillermo Falconi Espinosa ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " CARRERA DE INGENIER\u00CDA EN SISTEMAS (UNL) ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "i", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " Telefono: 07-2546384 / 07-2547252(ext. 154-155) ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "i", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " 2021 todos los derechos reservados ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".pie[_ngcontent-%COMP%] {\n  background-color: #1d3557f7 !important;\n  color: aliceblue;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9zaGFyZWQvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHNDQUFBO0VBQ0EsZ0JBQUE7QUFDRiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvc2hhcmVkL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucGlle1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZDM1NTdmNyAhaW1wb3J0YW50O1xyXG4gIGNvbG9yOiBhbGljZWJsdWU7XHJcblxyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FooterComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-footer',
                templateUrl: './footer.component.html',
                styleUrls: ['./footer.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "XCRo":
/*!***********************************************!*\
  !*** ./src/app/core/validator/validadores.ts ***!
  \***********************************************/
/*! exports provided: marcarCamposVacios, validarCampoMayor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "marcarCamposVacios", function() { return marcarCamposVacios; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validarCampoMayor", function() { return validarCampoMayor; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-reactive-validation */ "9Yzh");


const marcarCamposVacios = (formulario) => {
    Object.keys(formulario.controls).forEach(field => {
        const control = formulario.get(field);
        if (control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]) {
            control.markAsTouched();
            control.markAsDirty();
        }
        else if (control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]) {
            marcarCamposVacios(control);
        }
        else if (control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormArray"]) {
            control.getRawValue().forEach((value, i) => {
                control.at(i) instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"] && marcarCamposVacios(control.at(i));
            });
        }
    });
};
const validarCampoMayor = angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__["ValidatorDeclaration"].wrapTwoArgumentValidator((inicio, tipo) => {
    const valorInicio = inicio.value;
    return function (control) {
        if (!valorInicio) {
            // inicio.markAsTouched();
            // inicio.markAsDirty();
            return null;
        }
        if (!control.value) {
            return null;
        }
        let fechaInicio = new Date(valorInicio);
        let fechaFin = new Date(control.value);
        let horaInicio = fechaInicio.getHours();
        let horaFin = fechaFin.getHours();
        let minInicio = fechaInicio.getMinutes();
        let minFin = fechaFin.getMinutes();
        if (tipo == 'f') {
            if (fechaInicio > fechaFin) {
                return { 'error': { 'message': 'Fecha fin debe de ser mayor a decha inicio' } };
            }
        }
        if (tipo == 'h') {
            if ((horaInicio == horaFin && minInicio == minFin) ||
                (horaFin < horaInicio) ||
                (horaInicio == horaFin && minFin < minInicio)) {
                return { 'error': { 'message': 'Hora Fin mayor a hora inicio' } };
            }
        }
        return null;
    };
}, 'error');


/***/ }),

/***/ "bel0":
/*!******************************************************************************!*\
  !*** ./src/app/components/shared/input-invalido/input-invalido.component.ts ***!
  \******************************************************************************/
/*! exports provided: InputInvalidoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputInvalidoComponent", function() { return InputInvalidoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-reactive-validation */ "9Yzh");



class InputInvalidoComponent {
    constructor() {
        this.nombreControlError = " ";
    }
    ngOnInit() {
    }
}
InputInvalidoComponent.ɵfac = function InputInvalidoComponent_Factory(t) { return new (t || InputInvalidoComponent)(); };
InputInvalidoComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: InputInvalidoComponent, selectors: [["input-invalido"]], inputs: { nombreControlError: "nombreControlError" }, decls: 2, vars: 1, consts: [[1, "p-invalid"], [3, "for"]], template: function InputInvalidoComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "arv-validation-messages", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("for", ctx.nombreControlError);
    } }, directives: [angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__["ɵa"]], styles: [".p-invalid[_ngcontent-%COMP%] {\n  height: 0.85rem;\n  width: 100%;\n  font-size: 0.75em;\n  color: red;\n}\n\n[_nghost-%COMP%]     .invalid-feedback > p {\n  margin: 0px !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9zaGFyZWQvaW5wdXQtaW52YWxpZG8vaW5wdXQtaW52YWxpZG8uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxlQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsVUFBQTtBQUNGOztBQUVFO0VBQ0Usc0JBQUE7QUFDSiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvc2hhcmVkL2lucHV0LWludmFsaWRvL2lucHV0LWludmFsaWRvLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnAtaW52YWxpZHtcclxuICBoZWlnaHQ6IC44NXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBmb250LXNpemU6IC43NWVtO1xyXG4gIGNvbG9yOiByZWQ7XHJcbn1cclxuOmhvc3QgOjpuZy1kZWVwe1xyXG4gIC5pbnZhbGlkLWZlZWRiYWNrPnB7XHJcbiAgICBtYXJnaW46IDBweCAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](InputInvalidoComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'input-invalido',
                templateUrl: './input-invalido.component.html',
                styleUrls: ['./input-invalido.component.scss'],
            }]
    }], function () { return []; }, { nombreControlError: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "hGdz":
/*!****************************************************!*\
  !*** ./src/app/components/shared/shared.module.ts ***!
  \****************************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-reactive-validation */ "9Yzh");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./footer/footer.component */ "FezY");
/* harmony import */ var _input_invalido_input_invalido_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./input-invalido/input-invalido.component */ "bel0");





class SharedModule {
}
SharedModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: SharedModule });
SharedModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function SharedModule_Factory(t) { return new (t || SharedModule)(); }, providers: [], imports: [[
            angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__["ReactiveValidationModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](SharedModule, { declarations: [_input_invalido_input_invalido_component__WEBPACK_IMPORTED_MODULE_3__["InputInvalidoComponent"],
        _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__["FooterComponent"]], imports: [angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__["ReactiveValidationModule"]], exports: [_input_invalido_input_invalido_component__WEBPACK_IMPORTED_MODULE_3__["InputInvalidoComponent"],
        _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__["FooterComponent"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SharedModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _input_invalido_input_invalido_component__WEBPACK_IMPORTED_MODULE_3__["InputInvalidoComponent"],
                    _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__["FooterComponent"]
                ],
                exports: [
                    _input_invalido_input_invalido_component__WEBPACK_IMPORTED_MODULE_3__["InputInvalidoComponent"],
                    _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__["FooterComponent"]
                ],
                imports: [
                    angular_reactive_validation__WEBPACK_IMPORTED_MODULE_1__["ReactiveValidationModule"]
                ],
                providers: []
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=default~components-private-private-module~components-public-public-module.js.map