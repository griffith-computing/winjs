// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/ItemsManager/TestDataSource.js" />
/// <reference path="../TestLib/ItemsManager/UnitTestsCommon.js" />

var CorsicaTests = CorsicaTests || {};

CorsicaTests.BindingDeclTests = function () {
    "use strict";

    function errorHandler(msg) {
        try {
            LiveUnit.Assert.fail('There was an unhandled error in your test: ' + msg);
        } catch (ex) { }
    }

    function post(v) {
        return WinJS.Utilities.Scheduler.schedulePromiseNormal().then(function () { return v; });
    }

    function assertIsUndefinedString(v) {
        // When setting undefined as the value of textContent:
        // Firefox coerces undefined to empty string  [Bug]
        // IE & Chrome coerce it to the string "undefined" [Expected]
        if(v !== "undefined" && v !== "") {
            LiveUnit.Assert.fail("Value should be empty or undefined, but instead is " + v);
        }
    }

    function findElement(root, id) {
        if (root.id === id) { return root; }
        else { return root.querySelector("#" + id); }
    }

    function parent(element) {
        document.body.appendChild(element);
        return function () { document.body.removeChild(element); };
    }

    this.testBadSource = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:badProp');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                assertIsUndefinedString(mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    }
    
    this.testNestedBadSourceOneTime = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:badProp.badder WinJS.Binding.oneTime');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                assertIsUndefinedString(mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBadDest = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'badProp:name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual("", mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBadDest2 = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'badProp.badder:name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual("", mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testAttribute = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);

        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'this["aria-label"]:name WinJS.Binding.setAttribute');

        var obj = { name: 'Franky', width: 100 };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("aria-label"));
                bindable.name = "Hollywood";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("aria-label"));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testAttributeOneTime = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'this["aria-label"]:name WinJS.Binding.setAttributeOneTime');
        var obj = { name: 'Franky', width: 100 };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("aria-label"));
                bindable.name = "Hollywood";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Franky", mydiv.getAttribute("aria-label"));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testToNonAriaAttribute = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'label:name WinJS.Binding.setAttribute');
        var obj = { name: 'Franky', width: 100 };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                bindable.name = "Hollywood";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(bindable.name, mydiv.getAttribute("label"));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testToNonAriaAttributeOneTime = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'label:name WinJS.Binding.setAttributeOneTime');
        var obj = { name: 'Franky', width: 100 };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                bindable.name = "Hollywood";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual('Franky', mydiv.getAttribute("label"));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSettingAttributesAndProperties = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'label:name WinJS.Binding.setAttribute; textContent:title');
        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(obj.title, mydiv.textContent);
                bindable.name = "Hollywood";
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(bindable.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(bindable.title, mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSettingAttributesAndOneTimeBindingToProperties = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'label:name WinJS.Binding.setAttribute; textContent:title WinJS.Binding.oneTime');
        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(obj.title, mydiv.textContent);
                bindable.name = "Hollywood";
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(bindable.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual('testing', mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSettingAttributesOneTimeAndBindingToProperties = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'label:name WinJS.Binding.setAttributeOneTime; textContent:title');
        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(obj.title, mydiv.textContent);
                bindable.name = "Hollywood";
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual('Franky', mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(bindable.title, mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBindingToMultiplePropertiesAndSettingAttribute = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:title; style.width:width; label:name WinJS.Binding.setAttributeOneTime');
        var obj = { name: 'Franky', title: 'testing', width: '100px' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(obj.title, mydiv.textContent);
                LiveUnit.Assert.areEqual(obj.width, mydiv.style.width);
                bindable.name = "Hollywood";
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual('Franky', mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(bindable.title, mydiv.textContent);
                LiveUnit.Assert.areEqual(obj.width, mydiv.style.width);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBindingToMultiplePropertiesWithBindingActionAndSettingAttribute = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:title testFunction; label:name WinJS.Binding.setAttribute');
        window.testFunction = WinJS.Binding.initializer(function (source, sourceProperties, dest, destProperties) {
            dest[destProperties] = source[sourceProperties];
        });


        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual(obj.title, mydiv.textContent);
                bindable.name = "Hollywood";
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(bindable.name, mydiv.getAttribute("label"));
                LiveUnit.Assert.areEqual('testing', mydiv.textContent);

            }).
            then(null, errorHandler).
            then(function () { delete window.testFunction }).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBindingToDeepDestinationProperty = function (complete) {

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'x.title: title WinJS.Binding.setAttribute');
        var hit = 0;
        var old = WinJS.log;
        WinJS.log = function () {
            hit++;
        }
        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);
        
        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(1, hit, "WinJS.log should be hit in that case");
            }).
            then(null, errorHandler).
            then(function () { WinJS.log = old; }).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBindingToThisInSetAttribute = function (complete) {

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'this : title WinJS.Binding.setAttribute');
        var hit = 0;

        var old = WinJS.log;
        WinJS.log = function () {
            hit++;
        }
        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);
        
        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(1, hit, "WinJS.log should be hit in that case");
                
            })
            .then(null, errorHandler).
            then(function () { WinJS.log = old;}).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBindingToMissingDestinationProperty = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', ' : title WinJS.Binding.setAttribute');

        var obj = { name: 'Franky', title: 'testing' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                
            }, function (e) {
                LiveUnit.Assert.isTrue(1, 0, "An error message should not have been thrown in that case");
            })
            .then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testBindingToInnerTextUsingSetAttribute = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:title WinJS.Binding.setAttribute');

        var obj = { title: 'testing', width: '100px' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.title, mydiv.getAttribute('textContent'));
                LiveUnit.Assert.areEqual('', mydiv.textContent);
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.title, mydiv.getAttribute('textContent'));
                LiveUnit.Assert.areEqual('', mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSetAttributeWithDeepObject = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:title.innerObj.innerTitle WinJS.Binding.setAttribute');

        var obj = { title: { innerObj: { innerTitle: 'testing' } }, width: '100px' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.title.innerObj.innerTitle, mydiv.getAttribute('textContent'));
                bindable.title.innerObj.innerTitle = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.title.innerObj.innerTitle, mydiv.getAttribute('textContent'));

            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSetAttributeBindingToSameObject = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'foo:title WinJS.Binding.setAttribute');

        var mydiv2 = document.createElement('div');
        var cleanup2 = parent(mydiv2);
        mydiv2.setAttribute('id', 'mydiv2');
        mydiv2.setAttribute('data-win-bind', 'bar:title WinJS.Binding.setAttribute');

        var obj = { title: 'testing', width: '100px' };
        var bindable = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(null, bindable);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.title, mydiv.getAttribute('foo'));
                LiveUnit.Assert.areEqual(obj.title, mydiv2.getAttribute('bar'));
                bindable.title = "new title";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.title, mydiv.getAttribute('foo'));
                LiveUnit.Assert.areEqual(obj.title, mydiv2.getAttribute('bar'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testSimple = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testNestedDOMAccessDenied = function (complete) {
        var mydiv = document.createElement('div');
        var mydiv2 = document.createElement('div');
        var cleanup = parent(mydiv);
        var cleanup2 = parent(mydiv2);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name; nextElementSibling.textContent:name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
                LiveUnit.Assert.areEqual("", mydiv2.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testDuplicateIDFail = function (complete) {
        var mydiv = document.createElement('div');
        var mydiv2 = document.createElement('div');
        var cleanup = parent(mydiv);
        var cleanup2 = parent(mydiv2);
        mydiv.setAttribute('id', 'mydiv');
        mydiv2.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name;');
        mydiv2.setAttribute('data-win-bind', 'textContent:width;');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
                LiveUnit.Assert.areEqual("", mydiv2.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testInvalidBindToId = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('data-win-bind', 'id:name');

        var obj = { name: 'Franky' };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.isTrue(obj.name !== mydiv.id);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };
    this.testSimpleIdFilter = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'id:name;textContent:name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
                LiveUnit.Assert.areEqual("mydiv", mydiv.id);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleIdFilterValidation = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'id:name;textContent:name');

        var obj = { name: 'Franky', width: 100 };
        var old = WinJS.validation;
        WinJS.validation = true;
        var sawException = false;
        try {
            var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj)).then(function () {
                LiveUnit.Assert.fail("Should have thrown");
            }, function (err) {
                sawException = true;
                WinJS.validation = old;
            });
        }
        catch (e) {
            sawException = true;
            WinJS.validation = old;
        }

        bindingDone.
            then(function () {
                LiveUnit.Assert.isTrue(sawException, "Should have thrown an exception");
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testNonExtensible = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'testNonExtensible');
        mydiv.setAttribute('data-win-bind', 'textContent:name');

        var obj = Object.freeze({ name: 'Franky', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.
            then(function () {
                LiveUnit.Assert.fail("should not successfully bind");
            },
            function () {
                complete();
            });
    };

    this.testNonExtensibleOneTime = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name WinJS.Binding.oneTime');

        var obj = Object.freeze({ name: 'Franky', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testThisRecord = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'test:this');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.test.name);
                LiveUnit.Assert.areEqual(obj.width, mydiv.test.width);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testThisRecordDot = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'test:this.name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.test);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testThisThisRecordDot = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'this:this.name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.isTrue(mydiv.test === undefined, "binding should be a no-op against 'this'");
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testThisDotThisRecordDot = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'this.test:this.name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.test);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testImplicitGlobalScope = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'testImplicitGlobalScope');
        mydiv.setAttribute('data-win-bind', 'textContent:fizzle.name');

        delete window.fizzle;
        window.fizzle = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(window.fizzle.name, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(function () { delete window.fizzle; }).
            then(complete);
    };


    this.testSimpleWithCSS = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name;style.width:width');

        var obj = { name: 'Franky', width: '100px' };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
                LiveUnit.Assert.areEqual(obj.width, mydiv.style.width);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithDottedSource = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name.first');

        var obj = { name: { first: 'Bob' }, width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithAction = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            if (destProperties[0] === 'flappy') { dest.innerHTML = source[sourceProperties]; }
        };
        WinJS.Binding.initializer(window.myaction);

        var obj = { name: 'Sally', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testInvalidBinding = function () {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'q q q');

        var obj = { name: 'Sally', width: 100 };
        WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj)).then(
            function () {
                LiveUnit.Assert.fail("should have thrown an exception");
            },
            function (e) {
                LiveUnit.Assert.isTrue(e.message.indexOf("q q q") != -1, "should contain the bad expression");
            }
        ).then(cleanup);

    };

    this.testSimpleWithMissingAction = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'innerHTML:name myaction');

        var old = WinJS.log;
        function cleanupLog() {
            WinJS.log = old;
        }
        var logs = [];
        WinJS.log = function (message, tags, type) {
            logs.push({ message: message, tags: tags, type: type });
        }

        var obj = { name: 'Sally', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
                LiveUnit.Assert.areEqual(1, logs.length, "should have logged 1 error");
                LiveUnit.Assert.areEqual("error", logs[0].type, "should be tagged an error");
                LiveUnit.Assert.isTrue(logs[0].message.indexOf("myaction") != -1, "should contain the offending action name");
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanupLog).
            then(complete, errorHandler);
    };

    this.testSimpleWithConverter = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name myaction');

        window.myaction = WinJS.Binding.converter(function (v) {
            return v.toUpperCase();
        });
        WinJS.Binding.initializer(window.myaction);

        var obj = { name: 'Sally', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(post).
            then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("SALLY", mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithConverterDefaultInitializer = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name');

        var myaction = WinJS.Binding.converter(function (v) {
            return v.toUpperCase();
        });

        var obj = { name: 'Sally', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj), false, null, myaction);

        bindingDone.
            then(post).
            then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("SALLY", mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithOneTime = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name WinJS.Binding.oneTime');

        var obj = WinJS.Binding.as({ name: 'Sally', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.textContent);
                obj.name = "Jane";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithoutOneTime = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name');

        var obj = WinJS.Binding.as({ name: 'Sally', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.textContent);
                obj.name = "Jane";
            }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Jane", mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithNamespacedAction = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name test.binding_decl.namespacedAction');

        WinJS.Namespace.define('test.binding_decl', {
            namespacedAction: function (source, sourceProperties, dest, destProperties) {
                if (destProperties[0] === 'flappy') { dest.innerHTML = source[sourceProperties]; }
            }
        });
        WinJS.Binding.initializer(test.binding_decl.namespacedAction);
        LiveUnit.Assert.isTrue(typeof window.test.binding_decl.namespacedAction === 'function');

        var obj = { name: 'Sparky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                delete window.test.binding_decl;
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testNestedElementBindingWithNull = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="outer">\
                <div id="name" data-win-bind="textContent:name test.binding_decl.displayName"></div>\
                <div id="height" data-win-bind="textContent:height"></div>\
                <div id="address">\
                    <div id="street" data-win-bind="textContent:address.street"></div>\
                    <div id="city" data-win-bind="textContent:address.city"></div>\
                    <div id="state" data-win-bind="textContent:address.state"></div>\
                    <div id="zip" data-win-bind="textContent:address.zip"></div>\
                </div>\
            </div>';

        WinJS.Namespace.define('test.binding_decl', {
            displayName: function (source, sourceProperty, dest, destProperty) {
                dest[destProperty] = source[sourceProperty].first + ' ' + source[sourceProperty].last;
            }
        });
        WinJS.Binding.initializer(window.test.binding_decl.displayName);

        var obj = WinJS.Binding.as({
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"'
        });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first + ' ' + obj.name.last, text('name'));
                LiveUnit.Assert.areEqual(obj.height, text('height'));
                assertIsUndefinedString(text('street'));
                assertIsUndefinedString(text('city'));
                assertIsUndefinedString(text('state'));
                assertIsUndefinedString(text('zip'));
                obj.addProperty("address", {
                    street: '1234 Microsoft Way',
                    city: 'Redmond',
                    state: 'WA',
                    zip: 98052
                });
            }).
            then(post).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.address.street, text('street'));
                LiveUnit.Assert.areEqual(obj.address.city, text('city'));
                LiveUnit.Assert.areEqual(obj.address.state, text('state'));
                LiveUnit.Assert.areEqual(obj.address.zip.toString(), text('zip'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

        function cleanup() {
            delete window.test;
        }
    };

    this.testNestedElementBinding = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="outer">\
                <div id="name" data-win-bind="textContent:name test.binding_decl.displayName"></div>\
                <div id="height" data-win-bind="textContent:height"></div>\
                <div id="address">\
                    <div id="street" data-win-bind="textContent:address.street"></div>\
                    <div id="city" data-win-bind="textContent:address.city"></div>\
                    <div id="state" data-win-bind="textContent:address.state"></div>\
                    <div id="zip" data-win-bind="textContent:address.zip"></div>\
                </div>\
            </div>';

        WinJS.Namespace.define('test.binding_decl', {
            displayName: function (source, sourceProperty, dest, destProperty) {
                dest[destProperty] = source[sourceProperty].first + ' ' + source[sourceProperty].last;
            }
        });
        WinJS.Binding.initializer(window.test.binding_decl.displayName);

        var obj = {
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"',
            address: {
                street: '1234 Microsoft Way',
                city: 'Redmond',
                state: 'WA',
                zip: 98052
            }
        };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first + ' ' + obj.name.last, text('name'));
                LiveUnit.Assert.areEqual(obj.height, text('height'));
                LiveUnit.Assert.areEqual(obj.address.street, text('street'));
                LiveUnit.Assert.areEqual(obj.address.city, text('city'));
                LiveUnit.Assert.areEqual(obj.address.state, text('state'));
                LiveUnit.Assert.areEqual(obj.address.zip.toString(), text('zip'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

        function cleanup() {
            delete window.test;
        }
    };

    this.testNestedElementBindingWithUpdatesNoBinding = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="name" data-win-bind="textContent:name test.binding_decl.displayName"></div>\
            <div id="height" data-win-bind="textContent:height"></div>\
            <div id="address">\
                <div id="street" data-win-bind="textContent:address.street"></div>\
                <div id="city" data-win-bind="textContent:address.city"></div>\
                <div id="state" data-win-bind="textContent:address.state"></div>\
                <div id="zip" data-win-bind="textContent:address.zip"></div>\
            </div>';

        WinJS.Namespace.define('test.binding_decl', {
            displayName: function (source, sourceProperty, dest, destProperty) {
                dest[destProperty] = source[sourceProperty].first + ' ' + source[sourceProperty].last;
            }
        });
        WinJS.Binding.initializer(window.test.binding_decl.displayName);

        var obj = {
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"',
            address: {
                street: 'One Microsoft Way',
                city: 'Redmond',
                state: 'WA',
                zip: 98052
            }
        };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        function verify() {
            LiveUnit.Assert.areEqual('Microsoft Bob', text('name'));
            LiveUnit.Assert.areEqual('5\'6"', text('height'));
            LiveUnit.Assert.areEqual('One Microsoft Way', text('street'));
            LiveUnit.Assert.areEqual('Redmond', text('city'));
            LiveUnit.Assert.areEqual('WA', text('state'));
            LiveUnit.Assert.areEqual('98052', text('zip'));
        }

        bindingDone.
            then(verify).
            then(function () { obj.height = '5\'2"'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.height, '5\'2"');
            }).
            then(verify).
            then(function () { obj.name.first = 'Mr.'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, 'Mr.');
            }).
            then(verify).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

        function cleanup() {
            delete window.test;
        }
    };

    this.testNestedElementBindingWithUpdatesWithNoBindObservable = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="name" data-win-bind="textContent:name test.binding_decl.displayName"></div>\
            <div id="height" data-win-bind="textContent:height"></div>\
            <div id="address">\
                <div id="street" data-win-bind="textContent:address.street"></div>\
                <div id="city" data-win-bind="textContent:address.city"></div>\
                <div id="state" data-win-bind="textContent:address.state"></div>\
                <div id="zip" data-win-bind="textContent:address.zip"></div>\
            </div>';

        WinJS.Namespace.define('test.binding_decl', {
            displayName: function (source, sourceProperties, dest, destProperties) {
                dest[destProperties] = source[sourceProperties].first + ' ' + source[sourceProperties].last;
            }
        });
        WinJS.Binding.initializer(test.binding_decl.displayName);

        var obj = {
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"',
            address: {
                street: 'One Microsoft Way',
                city: 'Redmond',
                state: 'WA',
                zip: 98052
            }
        };
        var ob = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, ob);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        function verify() {
            LiveUnit.Assert.areEqual('Microsoft Bob', text('name'));
            LiveUnit.Assert.areEqual('5\'6"', text('height'));
            LiveUnit.Assert.areEqual('One Microsoft Way', text('street'));
            LiveUnit.Assert.areEqual('Redmond', text('city'));
            LiveUnit.Assert.areEqual('WA', text('state'));
            LiveUnit.Assert.areEqual('98052', text('zip'));
        }

        bindingDone.
            then(verify).
            then(function () { ob.height = '5\'2"'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.height, '5\'2"');
                LiveUnit.Assert.areEqual('5\'2"', text('height'));
            }).
            then(function () { ob.name.first = 'Mr.'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, 'Mr.');
                LiveUnit.Assert.areEqual('Microsoft Bob', text('name'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

        function cleanup() {
            delete window.test;
        }
    };

    this.testNestedElementBindingWithUpdatesWithBind = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="name" data-win-bind="textContent:name test.binding_decl.displayName"></div>\
            <div id="height" data-win-bind="textContent:height"></div>\
            <div id="address">\
                <div id="street" data-win-bind="textContent:address.street"></div>\
                <div id="city" data-win-bind="textContent:address.city"></div>\
                <div id="state" data-win-bind="textContent:address.state"></div>\
                <div id="zip" data-win-bind="textContent:address.zip"></div>\
            </div>';

        WinJS.Namespace.define('test.binding_decl', {
            displayName: function (source, sourceProperties, dest, destProperties) {
                WinJS.Binding.bind(source, {
                    name: {
                        first: function (v) { dest[destProperties] = v + ' ' + source[sourceProperties].last; },
                        last: function (v) { dest[destProperties] = source[sourceProperties].first + ' ' + v; }
                    }
                }, true);
            }
        });
        WinJS.Binding.initializer(test.binding_decl.displayName);

        var obj = {
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"',
            address: {
                street: 'One Microsoft Way',
                city: 'Redmond',
                state: 'WA',
                zip: 98052
            }
        };
        var ob = WinJS.Binding.as(obj);
        var bindingDone = WinJS.Binding.processAll(mydiv, ob);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        function verify() {
            LiveUnit.Assert.areEqual('Microsoft Bob', text('name'));
            LiveUnit.Assert.areEqual('5\'6"', text('height'));
            LiveUnit.Assert.areEqual('One Microsoft Way', text('street'));
            LiveUnit.Assert.areEqual('Redmond', text('city'));
            LiveUnit.Assert.areEqual('WA', text('state'));
            LiveUnit.Assert.areEqual('98052', text('zip'));
        }

        bindingDone.
            then(verify).
            then(function () { ob.height = '5\'2"'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.height, '5\'2"');
                LiveUnit.Assert.areEqual('5\'2"', text('height'));
            }).
            then(function () { ob.height = 'foo'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.height, 'foo');
                LiveUnit.Assert.areEqual('foo', text('height'));
            }).
            then(function () { ob.name.first = 'Mr.'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, 'Mr.');
                LiveUnit.Assert.areEqual('Mr. Bob', text('name'));
            }).
            then(function () { ob.name = { first: 'lotta', last: 'code' }; }).
            then(post).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, 'lotta');
                LiveUnit.Assert.areEqual(obj.name.last, 'code');
                LiveUnit.Assert.areEqual('lotta code', text('name'));
            }).
            then(function () { ob.address.street = '1 Microsoft Way'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.address.street, '1 Microsoft Way');
                LiveUnit.Assert.areEqual('1 Microsoft Way', text('street'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

        function cleanup() {
            delete window.test;
        }
    };

    this.testSimpleDataSourceAsync_StrictProcessing = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        // should not work, data-win-bindsource not supported in strictProcessing mode
        mydiv.setAttribute('data-win-bindsource', 'simpleds');
        mydiv.innerHTML = '\
        <div id="name" data-win-bind="textContent:name.first"></div>\
        ';

        var obj = {
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"',
            address: {
                street: 'One Microsoft Way',
                city: 'Redmond',
                state: 'WA',
                zip: 98052
            }
        };

        window.simpleds = WinJS.Binding.as(obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        function verify() {
            assertIsUndefinedString(text('name'));
        }

        function cleanup() {
            delete window.simpleds;
        }

        WinJS.Promise.as().
            then(function () {
                return WinJS.Binding.processAll(mydiv);
            }).
            then(post).
            then(post).
            then(function () {
                assertIsUndefinedString(text('name'));
            }).
            then(function () { simpleds.name.first = 'Mr.'; }).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, 'Mr.');
                assertIsUndefinedString(text('name'));
            }).
            then(function () { simpleds.name = { first: 'lotta', last: 'code' }; }).
            then(post).
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, 'lotta');
                LiveUnit.Assert.areEqual(obj.name.last, 'code');
                assertIsUndefinedString(text('name'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testSimpleWithMultipleOneActionFunctions = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        var count = 0;
        var expected = 2;
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name foo1;style.width:width foo2');

        window.foo1 = function (source, sourceProperties, dest, destProperties) {
            count++;
        };
        WinJS.Binding.initializer(window.foo1);
        window.foo2 = function (source, sourceProperties, dest, destProperties) {
            count++;
        };
        WinJS.Binding.initializer(window.foo2);

        var obj = { name: 'Sally', width: '100px' };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                delete window.foo1;
                delete window.foo2;
                LiveUnit.Assert.areEqual(expected, count);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testWithMultipleParentIds = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="parent1" ><div id="name" data-win-bind="textContent:name"></div> </div>\
            <div id="parent2" ><div id="anotherName" data-win-bind="textContent:name"></div> </div>\
            </div>';

        var obj = WinJS.Binding.as({ name: 'Microsoft' });

        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        function verify() {
            LiveUnit.Assert.areEqual('Microsoft', text('name'));
            LiveUnit.Assert.areEqual('Microsoft', text('anotherName'));
        }

        bindingDone.
            then(post).
            then(verify).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);

    };

    this.testWithDifferentParents = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="name" data-win-bind="textContent:name"></div>\
            <div id="anotherName" data-win-bind="textContent:name"></div>\
            </div>';

        var obj = WinJS.Binding.as({ name: 'Microsoft' });

        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        function verify() {
            LiveUnit.Assert.areEqual('Microsoft', text('name'));
            LiveUnit.Assert.areEqual('Microsoft', text('anotherName'));
        }

        bindingDone.
            then(post).
            then(verify).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);

    };

    this.testWithBindingCache = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name');

        var bindable = [{
            destination: "textContent",
            source: "name",
            initializer: undefined
        }];

        var bindingCache = { expressions: [{ "textContent:name": bindable }] };

        var obj = WinJS.Binding.as({ name: 'Sally' });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj, false, bindingCache);

        bindingDone.
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.textContent);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testWithBindingCacheWithAction = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name foo1');
        var count = 0;
        var expected = 1;
        function foo1(source, sourceProperties, dest, destProperties) {
            count++;
            dest[destProperties] = source[sourceProperties];
        }
        var bindable = [{
            destination: "textContent",
            source: "name",
            initializer: foo1
        }];

        var bindingCache = { expressions: { "textContent:name foo1": bindable } };

        var obj = WinJS.Binding.as({ name: 'Sally' });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj, false, bindingCache);

        bindingDone.
            then(post).
            then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.textContent);
                LiveUnit.Assert.areEqual(expected, count);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithActionNotPresent = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name myaction');

        var obj = { name: 'Sally', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("", mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithActionThatGetsDeleted = function (complete) {
        var count = 0;
        var expected = 1;
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            WinJS.Binding.bind(source,
            {
                name: function () {
                    if (destProperties[0] === 'flappy') {
                        dest.innerHTML = source[sourceProperties];
                    }
                    count++;
                }
            }, true);

        };
        WinJS.Binding.initializer(window.myaction);

        var obj = WinJS.Binding.as({ name: 'Sally', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.then(post).then(post).
            then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("Sally", mydiv.innerHTML);
                obj.name = "Mary";
            }).then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.innerHTML);
                LiveUnit.Assert.areEqual(count, expected);
            })
            .then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testCheckCoalescing = function (complete) {

        var count = 0;
        var expected = 2;
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            WinJS.Binding.bind(source, {
                name: function () {
                    if (destProperties[0] === 'flappy') {
                        dest.innerHTML = source[sourceProperties];
                    }
                    count++;
                }
            });

        };
        WinJS.Binding.initializer(window.myaction);

        var obj = WinJS.Binding.as({ name: 'Sally', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        obj.name = "Diana";
        obj.name = "Mary";

        bindingDone.
           then(post).then(post).then(function () {
               delete window.myaction;
               LiveUnit.Assert.areEqual("Mary", mydiv.innerHTML);
               LiveUnit.Assert.areEqual(count, expected);
           })
           .then(null, errorHandler).
           then(cleanup).
           then(complete, errorHandler);
    };

    this.testCheckDeclarativeWithNoUpdate = function (complete) {

        var count = 0;
        var expected = 1;
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            WinJS.Binding.bind(source,
            {
                name: function () {
                    if (destProperties[0] === 'flappy') {
                        dest.innerHTML = source[sourceProperties];
                    }
                    count++;
                }
            });
        };
        WinJS.Binding.initializer(window.myaction);
        var obj = WinJS.Binding.as({ name: 'Sally', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        bindingDone.
            then(post).then(post).then(function () {
                obj.name = "Sally";
            }).then(post).then(post).then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("Sally", mydiv.innerHTML);
                LiveUnit.Assert.areEqual(count, expected);
            })
            .then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testCheckDeclarativeWithUpdate = function (complete) {

        var count = 0;
        var expected = 2;
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'flappy:name myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            WinJS.Binding.bind(source,
            {
                name: function () {
                    if (destProperties[0] === 'flappy') {
                        dest.innerHTML = source[sourceProperties];
                    }
                    count++;
                }
            });
        };
        WinJS.Binding.initializer(window.myaction);

        var obj = WinJS.Binding.as({ name: 'Sally', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.
            then(post).then(post).then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.innerHTML);
                obj.name = "Mary";
            }).then(post).then(post).then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("Mary", mydiv.innerHTML);
                LiveUnit.Assert.areEqual(count, expected);
            })
            .then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testProcessAllWithNonObservable = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name');

        var obj = { name: 'Bob', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testSimpleWithMultipleProcessAll = function (complete) {

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name myaction');
        var obj = { name: 'Sally', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        window.myaction = function (source, sourceProperties, dest, destProperties) {
            dest.innerHTML = source[sourceProperties];
        };
        WinJS.Binding.initializer(window.myaction);
        bindingDone.then(post).then(function () {
            LiveUnit.Assert.areEqual("Sally", mydiv.innerHTML);
            obj.name = 'Diana';
        }).
            then(post).then(function () {
                LiveUnit.Assert.areEqual("Sally", mydiv.innerHTML);
                obj.name = 'Mary';
                bindingDone = WinJS.Binding.processAll(mydiv, obj);
            }).then(post).then(function () {
                delete window.myaction;
                LiveUnit.Assert.areEqual("Mary", mydiv.innerHTML);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };

    this.testWithObjectSource = function (complete) {

        var count = 0;
        var expected = 1;

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:obj myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            dest.innerHTML = source.name.first;
            count++;
        };
        WinJS.Binding.initializer(window.myaction);

        var obj = WinJS.Binding.as({ name: { first: 'bob' }, width: 100 });

        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        function cleanup2() {
            delete window.myaction;
        }
        bindingDone.then(post).then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first, mydiv.innerHTML);
                LiveUnit.Assert.areEqual(expected, count);
            }, errorHandler, function (c) { }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testWithFunctionSource = function (complete) {

        var count = 0;
        var expected = 1;

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');

        mydiv.setAttribute('data-win-bind', 'textContent:obj myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            dest.innerHTML = source.name.first();
            count++;
        };
        WinJS.Binding.initializer(window.myaction);
        function cleanup2() {
            delete window.myaction;
        }
        var obj = WinJS.Binding.as({ name: { first: function () { return 'bob' } }, width: 100 });

        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.then(post).then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first(), mydiv.innerHTML);
                LiveUnit.Assert.areEqual(expected, count);
            }, errorHandler, function (c) { }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };


    this.testWithArrayAsSource = function (complete) {

        var count = 0;
        var expected = 2;

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:obj myaction');

        window.myaction = function (source, sourceProperties, dest, destProperties) {
            WinJS.Binding.bind(source, {
                name: {
                    first: function (v) {
                        dest.innerHTML = source.name.first[count % 3];
                        count++;
                    }
                }
            });
        };
        WinJS.Binding.initializer(window.myaction);
        function cleanup2() {
            delete window.myaction;
        }

        var obj = WinJS.Binding.as({ name: { first: ["Bob", "Mary", "Saly"] } });

        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        bindingDone.then(post).then(post).
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first[(count - 1) % 3], mydiv.innerHTML);
                obj.name = { first: ["Bob1", "Mary", "Saly"] };
            }, errorHandler, function (c) { }).
        then(post).then(post).then(function () {
            LiveUnit.Assert.areEqual(obj.name.first[(count - 1) % 3], mydiv.innerHTML);
            LiveUnit.Assert.areEqual(expected, count);
        }, errorHandler, function (c) { }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testNestedElementBinding2 = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="outer">\
                <div id="name" data-win-bind="textContent:name"></div>\
                <div id="name2" data-win-bind="textContent:name"></div>\
                <div id="height" data-win-bind="textContent:height"></div>\
                <div id="address">\
                    <div id="street" data-win-bind="textContent:address.street"></div>\
                </div>\
            </div>';

        var obj = {
            name: 'Microsoft',
            height: '5\'6"',
            address: {
                street: '1234 Microsoft Way',

            }
        };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, text('name'));
                LiveUnit.Assert.areEqual(obj.name, text('name2'));
                LiveUnit.Assert.areEqual(obj.height, text('height'));
                LiveUnit.Assert.areEqual(obj.address.street, text('street'));
            }).
            then(null, errorHandler).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testNestedElementBindingWithChild = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="outer">\
                <div id="name" data-win-bind="textContent:name"></div>\
                <div id="height" data-win-bind="textContent:height"></div>\
                <div id="address">\
                    <div id="street" data-win-bind="textContent:street"></div>\
                </div>\
            </div>';

        var obj = {

            height: '5\'6"',
            address: {
                name: 'Microsoft',
                street: '1234 Microsoft Way',

            }
        };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        bindingDone.
            then(function () {
                assertIsUndefinedString(text('name'));
                LiveUnit.Assert.areEqual(obj.height, text('height'));
                assertIsUndefinedString(text('street'));
            }).
            then(null, errorHandler).
            then(cleanup2).
            then(complete, errorHandler);
    };

    this.testNestedElementBindingWithoutWinDefine = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup2 = parent(mydiv);
        mydiv.innerHTML = '\
            <div id="outer">\
                <div id="name" data-win-bind="textContent:name test.binding_decl.displayName"></div>\
                <div id="height" data-win-bind="textContent:height"></div>\
                <div id="address">\
                    <div id="street" data-win-bind="textContent:address.street"></div>\
                    <div id="city" data-win-bind="textContent:address.city"></div>\
                    <div id="state" data-win-bind="textContent:address.state"></div>\
                    <div id="zip" data-win-bind="textContent:address.zip"></div>\
                </div>\
            </div>';

        WinJS.Namespace.define('test.binding_decl', {
            displayName: function (source, sourceProperty, dest, destProperty) {
                dest[destProperty] = source[sourceProperty].first + ' ' + source[sourceProperty].last;
            }
        });
        WinJS.Binding.initializer(window.test.binding_decl.displayName);
        var test = function () {
            this.binding_decl = new bindingdecl1();
        };
        var binding_decl1 = function () {
            this.displayName = function (source, sourceProperty, dest, destProperty) {
                dest[destProperty] = source[sourceProperty].first + ' ' + source[sourceProperty].last;
            }
            WinJS.Binding.initializer(this.displayName);
        };


        var obj = {
            name: {
                first: 'Microsoft',
                last: 'Bob'
            },
            height: '5\'6"',
            address: {
                street: '1234 Microsoft Way',
                city: 'Redmond',
                state: 'WA',
                zip: 98052
            }
        };
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);

        function text(id) {
            return findElement(mydiv, id).innerHTML;
        }

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name.first + ' ' + obj.name.last, text('name'));
                LiveUnit.Assert.areEqual(obj.height, text('height'));
                LiveUnit.Assert.areEqual(obj.address.street, text('street'));
                LiveUnit.Assert.areEqual(obj.address.city, text('city'));
                LiveUnit.Assert.areEqual(obj.address.state, text('state'));
                LiveUnit.Assert.areEqual(obj.address.zip.toString(), text('zip'));
            }).
            then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

        function cleanup() {
            test.binding_decl = null;
            test = null;
        }
    };

    function whenLoadingComplete(listview, func) {
        var complete;
        var p = new WinJS.Promise(function (c) {
            complete = c;
        });

        function checkAndExecute() {
            if (listview.loadingState === "complete") {
                complete();
                func && func();
            }
        }

        listview.addEventListener("loadingstatechanged", LiveUnit.GetWrappedCallback(checkAndExecute), false);
        checkAndExecute();
        return p;
    }

    if (WinJS.UI.ListView) {
        this.testTemplateWithListView = function (complete) {

            function id(elementId) {
                return document.getElementById(elementId);
            }

            var u = WinJS.Utilities;
            var listView, count = 0;
            var sampleDataSource = [];
            var holder = document.createElement("div");
            holder.id = "testTemplateWithListView";
            holder.innerHTML = "<div id='sampleTemplate' data-win-control='WinJS.Binding.Template' data-win-options='{enableRecycling:true}'>" +
                                   "<div class='sampleTitle item' data-win-bind='textContent:title'></div>" +
                                   "<div class='sampleDesc item' data-win-bind='textContent:description'></div>" +
                              " </div>";
            var cleanup1 = parent(holder);

            listView = document.createElement("div");
            listView.id = "listViewExample";
            listView.setAttribute("data-win-control", "WinJS.UI.ListView ");
            listView.setAttribute("data-win-options", "{itemDataSource : DataSource , layout:{type:WinJS.UI.ListLayout},itemTemplate:sampleTemplate, selectionMode:'single'} ");

            var cleanup2 = parent(listView);


            for (var i = 0; i < 5; i++) {
                var t = "Corsica_" + i;
                var d = "Javascript Toolkit_" + i;
                sampleDataSource.push({ title: t, description: d });
            }

            window.DataSource = TestComponents.simpleSynchronousArrayDataSource(sampleDataSource);

            WinJS.UI.processAll().
                then(function () {
                    return whenLoadingComplete(listView.winControl, function () {
                        count = 0;
                        u.query(".sampleTitle", listView).forEach(function (e) {
                            count++;
                        });
                        u.query(".sampleDesc", listView).forEach(function (e) {
                            count++;
                        });
                        LiveUnit.Assert.areEqual(10, count, "Should have found the right number of yes/no elements");
                    });
                }).
                then(null, errorHandler).
                then(post).
                then(cleanup1).
                then(cleanup2).
                then(complete);
        };

        this.testTemplateWithScrollingListView = function (complete) {

            function id(elementId) {
                return document.getElementById(elementId);
            }
            var u = WinJS.Utilities;
            var listView, count = 0;

            var sampleDataSource = [];
            var holder = document.createElement("div");
            holder.id = "testTemplateWithListView";
            holder.innerHTML = "<div id='sampleTemplate' data-win-control='WinJS.Binding.Template' data-win-options='{enableRecycling:true}'>" +
                                   "<div class='sampleTitle item' data-win-bind='textContent:title'></div>" +
                                   "<div class='sampleDesc item' data-win-bind='textContent:description'></div>" +
                              " </div>";
            var cleanup1 = parent(holder);

            listView = document.createElement("div");
            listView.id = "listViewExample";
            listView.setAttribute("data-win-control", "WinJS.UI.ListView ");
            listView.setAttribute("data-win-options", "{itemDataSource : DataSource , layout:{type:WinJS.UI.ListLayout},itemTemplate:sampleTemplate, selectionMode:'single'} ");

            var cleanup2 = parent(listView);


            for (var i = 0; i < 20; i++) {
                var t = "Corsica_" + i;
                var d = "Javascript Toolkit_" + i;
                sampleDataSource.push({ title: t, description: d });
            }

            window.DataSource = TestComponents.simpleSynchronousArrayDataSource(sampleDataSource);

            WinJS.UI.processAll().
                then(function () {
                    return whenLoadingComplete(listView.winControl, function () {
                        var elementHeight = 40; // we need to get the actual height of each element;
                        listView.scrollPosition = 11 * elementHeight;
                        listView.scrollPosition = 4 * elementHeight;
                        listView.scrollPosition = 14 * elementHeight;

                        count = 0;
                        u.query(".sampleTitle", listView).forEach(function (e) {
                            count++;
                        });
                        u.query(".sampleDesc", listView).forEach(function (e) {
                            count++;
                        });
                        listView.scrollPosition = 0;
                        LiveUnit.Assert.areEqual(40, count, "Should have found the right number of yes/no elements");
                    });
                }).
                then(null, errorHandler).
                then(post).
                then(cleanup1).
                then(cleanup2).
                then(complete);
        };
    }

    this.testBindingToGlobalObject = function (complete) {
        var t = 1;
        var result = 1;
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:parentNode.child.grandChild');

        WinJS.Namespace.define('parentNode', { child: { grandChild: "innerHTML content" } });

        var bindingDone = WinJS.Binding.processAll();
        function cleanup2() {
            delete window.parentNode;
        }
        bindingDone.then(post).then(function () {

            LiveUnit.Assert.areEqual("innerHTML content", mydiv.innerHTML);
        }).then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);

    };

    this.testBindingToGlobalNameSpace = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:value');

        window.value = 10;

        var bindingDone = WinJS.Binding.processAll();
        function cleanup2() {
            delete window.value;
        }
        bindingDone.then(post).then(function () {

            LiveUnit.Assert.areEqual(window.value.toString(), mydiv.innerHTML);
        }).then(null, errorHandler).
            then(cleanup).
            then(cleanup2).
            then(complete, errorHandler);
    }

    this.testBindingWithNonExistingProperty = function (complete) {
        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent1:name');

        var obj = { name: 'Franky', width: 100 };
        var bindingDone = WinJS.Binding.processAll(mydiv, WinJS.Binding.as(obj));

        bindingDone.
            then(function () {
                LiveUnit.Assert.areEqual(obj.name, mydiv.textContent1);
            }).
            then(null, errorHandler).
            then(cleanup).
            then(complete, errorHandler);
    };


    window.supportedForProcessingInitializer = WinJS.Binding.initializer(function (a, b, c, d) {
        return WinJS.Binding.defaultBind(a, b, c, d);
    });

    window.notSupportedForProcessingInitializer = function (a, b, c, d) {
        return WinJS.Binding.defaultBind(a, b, c, d);
    };

    this.testUsingNotSupportedForProcessingBindingRHS_StrictProcessing = function (complete) {
        var holder = document.createElement("div");
        holder.innerHTML = "<div data-win-bind='something:eval'></div>";
        WinJS.Binding.processAll(holder).then(
            function () {
                LiveUnit.Assert.fail("should not get here when strictProcessing");
            },
            function (e) {
                LiveUnit.Assert.areEqual("WinJS.Utilities.requireSupportedForProcessing", e.name);
            }
        ).
        then(null, errorHandler).
        then(complete);
    }

    this.testUsingNotSupportedForProcessingBindingLHS_StrictProcessing = function (complete) {
        var holder = document.createElement("div");
        holder.innerHTML = "<div data-win-bind='winjs:WinJS;winjs.Promise.supportedForProcessing:WinJS.Promise'></div>";
        WinJS.Binding.processAll(holder).then(
            function () {
                LiveUnit.Assert.fail("should not get here when strictProcessing");
            },
            function (e) {
                LiveUnit.Assert.areEqual("WinJS.Utilities.requireSupportedForProcessing", e.name);
            }
        ).
        then(null, errorHandler).
        then(complete);
    }

    this.testUsingNotSupportedForProcessingBindingInitializer_StrictProcessing = function (complete) {
        var holder = document.createElement("div");
        holder.innerHTML = "<div data-win-bind='a : WinJS notSupportedForProcessingInitializer'></div>";
        WinJS.Binding.processAll(holder).then(
            function () {
                LiveUnit.Assert.fail("should not get here when strictProcessing");
            },
            function (e) {
                LiveUnit.Assert.areEqual("WinJS.Utilities.requireSupportedForProcessing", e.name);
            }
        )
            .then(null, errorHandler)
            .then(complete);
    }
    this.testDefaultBind = function (complete) {

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name WinJS.Binding.defaultBind');

        var obj = WinJS.Binding.as({ name: 'Sally'});
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        
        bindingDone.
           then(post).then(function () {
               LiveUnit.Assert.areEqual("Sally", mydiv.textContent);
           }).
           then(null, errorHandler).
           then(cleanup).
           then(complete, errorHandler);
    };
    this.testCheckDefaultBindingWithCoalescing = function (complete) {

        var mydiv = document.createElement('div');
        var cleanup = parent(mydiv);
        mydiv.setAttribute('id', 'mydiv');
        mydiv.setAttribute('data-win-bind', 'textContent:name WinJS.Binding.defaultBind');

        var obj = WinJS.Binding.as({ name: 'First', width: 100 });
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        obj.name = "Second";
        obj.name = "Third";

        bindingDone.
           then(post).then(function () {
               LiveUnit.Assert.areEqual("Third", mydiv.innerHTML);
           }).
           then(null, errorHandler).
           then(cleanup).
           then(complete, errorHandler);
    };

    this.testAddClassOneTime = function (complete) {
    
        var mydiv = document.createElement("div");
        var cleanup = parent(mydiv);
        mydiv.classList.add("originalClass");
        mydiv.setAttribute("id", "mydiv");
        mydiv.setAttribute("data-win-bind", "textContent:name WinJS.Binding.addClassOneTime");

        var obj = WinJS.Binding.as({ name: "Sally"});
        var bindingDone = WinJS.Binding.processAll(mydiv, obj);
        
        bindingDone.
           then(post).then(function () {
               LiveUnit.Assert.areEqual("originalClass Sally", mydiv.className);
           }).
           then(null, errorHandler).
           then(cleanup).
           then(complete, errorHandler);
        
    };

    this.testAddClassOneTimeWithEmptyBinding = function (complete) {

      var mydiv = document.createElement("div");
      var cleanup = parent(mydiv);
      mydiv.classList.add("originalClass");
      mydiv.setAttribute("id", "mydiv");
      mydiv.setAttribute("data-win-bind", "textContent:name WinJS.Binding.addClassOneTime");

      var obj = WinJS.Binding.as({ name: "" });
      var bindingDone = WinJS.Binding.processAll(mydiv, obj);

      bindingDone.
         then(post).then(function () {
           LiveUnit.Assert.areEqual("originalClass", mydiv.className);
         }).
         then(null, errorHandler).
         then(cleanup).
         then(complete, errorHandler);

    };

    this.testAddClassOneTimeWithArray = function (complete) {

      var mydiv = document.createElement("div");
      var cleanup = parent(mydiv);
      mydiv.classList.add("originalClass");
      mydiv.setAttribute("id", "mydiv");
      mydiv.setAttribute("data-win-bind", "textContent:names WinJS.Binding.addClassOneTime");

      var obj = WinJS.Binding.as({ names: ["Sally", "Nelly"] });
      var bindingDone = WinJS.Binding.processAll(mydiv, obj);

      bindingDone.
         then(post).then(function () {
           LiveUnit.Assert.areEqual("originalClass Sally Nelly", mydiv.className);
         }).
         then(null, errorHandler).
         then(cleanup).
         then(complete, errorHandler);

    };
    
    this.testGetValue = function () {
      var obj = {
        title: "foo",
        pages: {
          page1: "bar"
        }
      }
      LiveUnit.Assert.areEqual(WinJS.Binding.getValue(obj, "title", "foo"));
      LiveUnit.Assert.areEqual(WinJS.Binding.getValue(obj, "pages.page1", "bar"));
      LiveUnit.Assert.areEqual(WinJS.Binding.getValue(obj, "nonExisting", undefined));
      LiveUnit.Assert.areEqual(WinJS.Binding.getValue(obj, "pages.page2", undefined));
    }

};

LiveUnit.registerTestClass('CorsicaTests.BindingDeclTests');
