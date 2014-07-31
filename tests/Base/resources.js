// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />

var WinJSTests = WinJSTests || {};

WinJSTests.Resources = function () {
    "use strict";
    this.testGetUnknown = function () {
        var x = WinJS.Resources.getString("random");
        
        LiveUnit.Assert.areEqual("random", x.value);
        LiveUnit.Assert.isTrue(x.empty);
    };
    this.testCustomGet = function () {
        var old = WinJS.Resources.getString;
        try {
            WinJS.Resources.getString = function (resourceId) {
                return { value: "hello" };
            };
            
            LiveUnit.Assert.areEqual("hello", WinJS.Resources.getString("foo").value);
        }
        finally {
            WinJS.Resources.getString = old;
        }
    };
    this.testStringsString = function () {
        var old = window.strings;
        try {
            window.strings = { foo: "this is a test" };
            
            // in IE/web compartment this will return window.strings.foo, in WWA/local compartment, this will fail
            // to find "foo"
            //
            var res = WinJS.Resources.getString("foo");
            LiveUnit.Assert.isTrue("this is a test" === res.value || res.empty);
        }
        finally {
            if (old) {
                window.strings = old;
            }
            else {
                delete window.strings;
            }
        }
    };
    this.testStringsRecord = function () {
        var old = window.strings;
        var oldimpl = WinJS.Resources.getString;
        try {
            WinJS.Resources.getString = WinJS.Resources._getStringJS
            window.strings = { foo: { value: "this is a test", lang: "en-us" } };
            
            LiveUnit.Assert.areEqual("this is a test", WinJS.Resources.getString("foo").value);
            LiveUnit.Assert.areEqual("en-us", WinJS.Resources.getString("foo").lang);
        }
        finally {
            WinJS.Resources.getString = oldimpl;
            if (old) {
                window.strings = old;
            }
            else {
                delete window.strings;
            }
        }
    };
    this.testStringsFromStringsFile = function () {
        // @TODO, when we get rid of _getWinJSString it should be because we can go back to the expected way of doing this
        //
        //var str = WinJS.Resources.getString("ms-resource://$(TargetFramework)/ui/On").value;
        var str = WinJS.Resources._getWinJSString("ui/selectDay").value;
        LiveUnit.Assert.areEqual("Select Day", str);
    };
}

LiveUnit.registerTestClass("WinJSTests.Resources");