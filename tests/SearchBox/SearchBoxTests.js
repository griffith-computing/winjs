// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// <!-- saved from url=(0014)about:internet -->
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>

var SearchBoxTests = SearchBoxTests || {};

SearchBoxTests.SearchBoxTests = function () {
    "use strict";

    var Key = WinJS.Utilities.Key;

    function waitForSuggestionFlyoutRender(searchBox) {
        return new WinJS.Promise(function (c) {
            function register() {
                searchBox._repeater.addEventListener("iteminserted", handle);
                searchBox._repeater.addEventListener("itemremoved", handle);
            }

            function unregister() {
                searchBox._repeater.removeEventListener("iteminserted", handle);
                searchBox._repeater.removeEventListener("itemremoved", handle);
            }

            function handle() {
                unregister();
                WinJS.Promise.timeout().then(c);
            }

            register();
        });
    }

    // This is the setup function that will be called at the beginning of each test function.
    this.setUp = function () {
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the SearchBox element");
        var searchBoxElement = document.createElement('div');
        searchBoxElement.id = "SearchBoxID";
        document.body.appendChild(searchBoxElement);
        var searchBox = new WinJS.UI.SearchBox(searchBoxElement, { searchHistoryDisabled: true });
        LiveUnit.LoggingCore.logComment("SearchBox has been instantiated.");
        LiveUnit.Assert.isNotNull(searchBox, "SearchBox element should not be null when instantiated.");
    };

    this.tearDown = function () {
        LiveUnit.LoggingCore.logComment("In tearDown");
        var element = document.getElementById("SearchBoxID");
        if (element) {
            WinJS.Utilities.disposeSubTree(element);
            document.body.removeChild(element);
        }
    };

    // Test functions
    this.testInitTest = function () {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");

        // verify searchbox element
        LiveUnit.Assert.isNotNull(searchBox.element);

        // verify input element
        LiveUnit.Assert.isNotNull(searchBox._inputElement);

        // verify search glyph
        LiveUnit.Assert.isNotNull(searchBox._buttonElement);

        // verify flyout
        LiveUnit.Assert.isNotNull(searchBox._flyoutDivElement);

        // verify button
        LiveUnit.Assert.isNotNull(searchBox._repeaterDivElement);
    };

    // Test searchbox Instantiation with null element
    this.testSearchBoxNullInstantiation = function () {
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the searchBox with null element");
        var searchBox = new WinJS.UI.SearchBox(null);
        LiveUnit.Assert.isNotNull(searchBox, "SearchBox instantiation was null when sent a null searchbox element.");
    }





    // Test multiple instantiation of the same searchbox DOM element
    this.testSearchBoxMultipleInstantiation = function () {
        // Get the searchbox element from the DOM
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the searchBox element");
        var searchBoxElement = document.createElement('div');
        document.body.appendChild(searchBoxElement);
        var searchBox = new WinJS.UI.SearchBox(searchBoxElement);
        LiveUnit.LoggingCore.logComment("searchBox has been instantiated.");
        LiveUnit.Assert.isNotNull(searchBox, "searchBox element should not be null when instantiated.");
        new WinJS.UI.SearchBox(searchBoxElement);
    }

    this.testSearchBoxMultipleInstantiation["LiveUnit.ExpectedException"] = { message: "Invalid argument: Controls may only be instantiated one time for each DOM element" }; // This is the exception that is expected




    this.testPublicApiSurfaceFunctions = function () {
        // This test only verifies the API surface. It does not test the functionality.
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Waiting for control...");
        LiveUnit.LoggingCore.logComment("Verifying...");
        function verifyFunction(functionName) {
            LiveUnit.LoggingCore.logComment("Verifying that function " + functionName + " exists");
            if (searchBox[functionName] === undefined) {
                LiveUnit.Assert.fail(functionName + " missing from SearchBox");
            }

            LiveUnit.Assert.isNotNull(searchBox[functionName]);
            LiveUnit.Assert.areEqual("function", typeof (searchBox[functionName]), functionName + " exists on SearchBox, but it isn't a function");
        }
        verifyFunction("setLocalContentSuggestionSettings");
        verifyFunction("addEventListener");
        verifyFunction("removeEventListener");
        verifyFunction("dispose");
    };

    this.testPublicApiSurfaceProperties = function () {
        // This test only verifies the API surface. It does not test the functionality.
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");
        function verifyProperty(propertyName, propertyType) {
            LiveUnit.LoggingCore.logComment("Verifying that property " + propertyName + " exists");
            if (searchBox[propertyName] === undefined) {
                LiveUnit.Assert.fail(propertyName + " missing from SearchBox");
            }

            LiveUnit.Assert.isNotNull(searchBox[propertyName]);
            LiveUnit.Assert.areEqual(propertyType, typeof (searchBox[propertyName]), propertyName + " exists on SearchBox, but it isn't the right property type");
        }
        verifyProperty("chooseSuggestionOnEnter", "boolean");
        verifyProperty("focusOnKeyboardInput", "boolean");
        verifyProperty("searchHistoryContext", "string");
        verifyProperty("searchHistoryDisabled", "boolean");
        verifyProperty("queryText", "string");
        verifyProperty("placeholderText", "string");
        verifyProperty("disabled", "boolean");
    };

    this.testSearchBoxDispose = function () {
        var searchBoxElement = document.createElement('div');
        var searchBox = new WinJS.UI.SearchBox();
        LiveUnit.Assert.isTrue(searchBox.dispose);
        LiveUnit.Assert.isFalse(searchBox._disposed);
        searchBox.dispose();
        LiveUnit.Assert.isTrue(searchBox._disposed);
        searchBox.dispose();
    }



    this.testSearchBoxDisposeSubTree = function () {
        var searchBoxParent = document.createElement('div');
        var searchBoxElement = document.createElement('div');
        var searchBox = new WinJS.UI.SearchBox(searchBoxElement);
        searchBoxParent.appendChild(searchBoxElement);
        document.body.appendChild(searchBoxParent);
        LiveUnit.Assert.isTrue(searchBox.dispose);
        LiveUnit.Assert.isFalse(searchBox._disposed);
        WinJS.Utilities.disposeSubTree(searchBoxParent);
        LiveUnit.Assert.isTrue(searchBox._disposed);
        searchBox.dispose();
    }



    this.testSimpleFunctions = function () {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");

        var testPlaceHolder = "Test placeholder";
        searchBox.placeholderText = testPlaceHolder;
        LiveUnit.Assert.areEqual(testPlaceHolder, searchBox.placeholderText, "Unable to set searchBox.placeholderText");

        var testQuery = "Test queryText";
        searchBox.queryText = testQuery;
        LiveUnit.Assert.areEqual(testQuery, searchBox.queryText, "Unable to set searchBox.queryText");

        LiveUnit.Assert.areEqual(false, searchBox.focusOnKeyboardInput, "Incorrect default value for focusOnKeyboardInput");
        var focusOnKeyboardInput = true;
        searchBox.focusOnKeyboardInput = focusOnKeyboardInput;
        LiveUnit.Assert.areEqual(focusOnKeyboardInput, searchBox.focusOnKeyboardInput, "Unable to set searchBox.queryText");

        LiveUnit.Assert.areEqual(false, searchBox.chooseSuggestionOnEnter, "Incorrect default value for chooseSuggestionOnEnterDisabled");
        var chooseSuggestionOnEnter = true;
        searchBox.chooseSuggestionOnEnter = chooseSuggestionOnEnter;
        LiveUnit.Assert.areEqual(chooseSuggestionOnEnter, searchBox.chooseSuggestionOnEnter, "Unable to set searchBox.chooseSuggestionOnEnter");

        LiveUnit.Assert.isFalse(searchBox.disabled, "Incorrect default value for disabled");
        LiveUnit.Assert.isFalse(searchBox._inputElement.disabled, "Incorrect default value for disabled for input element.");
        LiveUnit.Assert.isFalse(searchBox._buttonElement.disabled, "Incorrect default value for disabled for button element.");
        searchBox.disabled = true;
        LiveUnit.Assert.isTrue(searchBox.disabled, "Unable to set searchBox.disabled");
        LiveUnit.Assert.isTrue(searchBox._inputElement.disabled, "SearchBox did not disable input element.");
        LiveUnit.Assert.isTrue(searchBox._buttonElement.disabled, "SearchBox did not disable button element.");
    };

    this.testQueryChanged = function searchBoxTest_QueryChanged() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");

        var eventFired = false;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.areEqual("Test query", event.detail.queryText, "Query text not matching input");
            if (!window.Windows) {
                //in web context, we match based on event details
                LiveUnit.Assert.areEqual("ja", event.detail.language, "Query text language not matching input");
            } else {
                //in local context, we should match the WinRT API
                LiveUnit.Assert.areEqual(Windows.Globalization.Language.currentInputMethodLanguageTag, event.detail.language, "Query text language not matching input");
            }
            LiveUnit.Assert.isFalse(eventFired, "Querychanged fired multiple times");
            eventFired = true;
        });

        // This is to test the input language
        CommonUtilities.keydown(searchBox._inputElement, Key.rightArrow, "ja");

        LiveUnit.Assert.areEqual("ja", searchBox._lastKeyPressLanguage);
        searchBox._inputElement.value = "Test query";
        searchBox._inputOrImeChangeHandler(null);
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
    };

    this.testQuerySubmitted = function searchBoxTest_QuerySubmitted() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var that = this;
        var eventFired = false;
        LiveUnit.LoggingCore.logComment("Verifying...");
        searchBox.addEventListener("querysubmitted", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.areEqual("Test query", event.detail.queryText, "Query text not matching input");
            if (!window.Windows) {
                //in web context, we match based on event details
                LiveUnit.Assert.areEqual("ja", event.detail.language, "Query text language not matching input");
            } else {
                //in local context, we should match the WinRT API
                LiveUnit.Assert.areEqual(Windows.Globalization.Language.currentInputMethodLanguageTag, event.detail.language, "Query text language not matching input");
            }
            LiveUnit.Assert.isFalse(eventFired, "QuerySubmitted fired multiple times");
            eventFired = true;
        });

        // This is to test the input language
        CommonUtilities.keydown(searchBox._inputElement, Key.rightArrow, "ja");
        LiveUnit.Assert.areEqual("ja", searchBox._lastKeyPressLanguage);
        searchBox._inputElement.value = "Test query";
        searchBox._buttonElement.click();
        LiveUnit.Assert.isTrue(eventFired, "QuerySubmitted event was not fired");
    };

    this.testHitSortAndMerge = function searchBoxTest_HitSortAndMerge() {
        var result;
        var testSingleHit = [{ startPosition: 2, length: 3 }];
        result = WinJS.UI.SearchBox._sortAndMergeHits(testSingleHit);
        LiveUnit.Assert.areEqual(1, result.length, "testSingleHit: Did not receive correct number of results");
        LiveUnit.Assert.areEqual(2, result[0].startPosition, "testSingleHit: Did not receive correct startPosition");
        LiveUnit.Assert.areEqual(3, result[0].length, "testSingleHit: Did not receive correct length");

        var testSort = [{ startPosition: 20, length: 4 }, { startPosition: 10, length: 3 }];
        result = WinJS.UI.SearchBox._sortAndMergeHits(testSort);
        LiveUnit.Assert.areEqual(2, result.length, "testSort: Did not receive correct number of results");
        LiveUnit.Assert.areEqual(10, result[0].startPosition, "testSort: Did not receive correct startPosition");
        LiveUnit.Assert.areEqual(3, result[0].length, "testSort: Did not receive correct length");
        LiveUnit.Assert.areEqual(20, result[1].startPosition, "testSort: Did not receive correct startPosition");
        LiveUnit.Assert.areEqual(4, result[1].length, "testSort: Did not receive correct length");

        var testMergeInside = [{ startPosition: 20, length: 1 }, { startPosition: 19, length: 3 }];
        result = WinJS.UI.SearchBox._sortAndMergeHits(testMergeInside);
        LiveUnit.Assert.areEqual(1, result.length, "testMergeInside: Did not receive correct number of results");
        LiveUnit.Assert.areEqual(19, result[0].startPosition, "testMergeInside: Did not receive correct startPosition");
        LiveUnit.Assert.areEqual(3, result[0].length, "testMergeInside: Did not receive correct length");

        var testMergeOverlap = [{ startPosition: 20, length: 5 }, { startPosition: 18, length: 5 }];
        result = WinJS.UI.SearchBox._sortAndMergeHits(testMergeOverlap);
        LiveUnit.Assert.areEqual(1, result.length, "testMergeOverlap : Did not receive correct number of results");
        LiveUnit.Assert.areEqual(18, result[0].startPosition, "testMergeOverlap : Did not receive correct startPosition");
        LiveUnit.Assert.areEqual(7, result[0].length, "testMergeOverlap: Did not receive correct length");

        var testMergeAdjacent = [{ startPosition: 20, length: 2 }, { startPosition: 17, length: 3 }];
        result = WinJS.UI.SearchBox._sortAndMergeHits(testMergeAdjacent);
        LiveUnit.Assert.areEqual(1, result.length, "testMergeAdjacent : Did not receive correct number of results");
        LiveUnit.Assert.areEqual(17, result[0].startPosition, "testMergeAdjacent : Did not receive correct startPosition");
        LiveUnit.Assert.areEqual(5, result[0].length, "testMergeAdjacent: Did not receive correct length");
    };

    this.test428216 = function () {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var eventsCalled = [];
        searchBox.addEventListener(WinJS.UI.SearchBox._EventName.querychanged, function (ev) {
            eventsCalled.push(WinJS.UI.SearchBox._EventName.querychanged);
        });

        var inputElement = searchBox.element.querySelector("input");

        //mock msGetInputContext so we can have more control over the events
        var endOffset = 0;
        inputElement.msGetInputContext = function () {
            return {
                getCompositionAlternatives: function () {
                    return [];
                },
                getCandidateWindowClientRect: function () {
                    return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 };
                },
                compositionEndOffset: endOffset,
                compositionStartOffset: 0
            }
        };

        // When using IME: compositionstart -> compositionupdate -> input -> compositionupdate -> input -> compositionend
        inputElement.value = 'a';
        inputElement.dispatchEvent(createCustomEvent("compositionstart"));
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        inputElement.dispatchEvent(createCustomEvent("input"));

        endOffset++;
        inputElement.value += 'b';
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        inputElement.dispatchEvent(createCustomEvent("input"));

        inputElement.dispatchEvent(createCustomEvent("compositionend"));

        LiveUnit.Assert.areEqual(2, eventsCalled.length, "queryChanged was called more than twice");
    };

    // Korean keyboarding - IME will finalize on keydown for up/down/enter/tab so make sure we discard the composition end event
    this.testKoreanIMEKeyboarding = function searchBoxTest_KoreanIMEKeyboarding() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var inputElement = searchBox.element.querySelector("input");
        var that = this;

        var changedEventFired = false;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.isFalse(changedEventFired, "Querychanged fired multiple times");
            changedEventFired = true;
        });

        var submittedEventFired = false;
        searchBox.addEventListener("querysubmitted", function searchBoxTest_querySubmitted_listener(event) {
            LiveUnit.Assert.isFalse(submittedEventFired, "QuerySubmitted fired multiple times");
            submittedEventFired = true;
        });

        // Enter key
        LiveUnit.LoggingCore.logComment("Testing Enter key.");

        changedEventFired = false;
        inputElement.value = 'a';
        mockInputContext(inputElement, 1, 1, []);
        inputElement.dispatchEvent(createCustomEvent("compositionstart"));
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.isTrue(changedEventFired, "QueryChanged event was not fired");

        submittedEventFired = false;
        CommonUtilities.keydown(inputElement, Key.enter, "ko");
        LiveUnit.Assert.isTrue(submittedEventFired, "QuerySubmitted event was not fired");

        // make sure this event is filtered out (Korean IME finalized on key down event, but still passes key to app)
        changedEventFired = false;
        mockInputContext(inputElement, 0, 0, []);
        inputElement.dispatchEvent(createCustomEvent("compositionend"));
        LiveUnit.Assert.isFalse(changedEventFired, "QueryChanged event was fired");

        CommonUtilities.keyup(inputElement, Key.enter, "ko");

        // ensure query events are still fired after key is released
        changedEventFired = false;
        inputElement.value = 'ab';
        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.isTrue(changedEventFired, "QueryChanged event was not fired");

        // Up/Down/Tab keys
        var keys = [Key.upArrow, Key.downArrow, Key.tab];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            LiveUnit.LoggingCore.logComment("Testing " + key + " key.");

            changedEventFired = false;
            inputElement.value = 'a';
            mockInputContext(inputElement, 1, 1, []);
            inputElement.dispatchEvent(createCustomEvent("compositionstart"));
            inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
            inputElement.dispatchEvent(createCustomEvent("input"));
            LiveUnit.Assert.isTrue(changedEventFired, "QueryChanged event was not fired");

            CommonUtilities.keydown(inputElement, key, "ko");

            // make sure this event is filtered out (Korean IME finalized on key down event, but still passes key to app)
            changedEventFired = false;
            mockInputContext(inputElement, 0, 0, []);
            inputElement.dispatchEvent(createCustomEvent("compositionend"));
            LiveUnit.Assert.isFalse(changedEventFired, "QueryChanged event was fired");

            CommonUtilities.keyup(inputElement, key, "ko");

            // ensure query events are still fired after key is released
            changedEventFired = false;
            inputElement.value = 'ab';
            inputElement.dispatchEvent(createCustomEvent("input"));
            LiveUnit.Assert.isTrue(changedEventFired, "QueryChanged event was not fired");
        }
    };

    // Ensure after a focus loss on tab/enter that we still get query change events
    this.testQueryChangeAfterFocusLoss = function searchBoxTest_QueryChangeAfterFocusLoss(complete) {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var inputElement = searchBox.element.querySelector("input");
        var that = this;

        var otherInputElement = document.createElement("input");
        otherInputElement.type = "text";
        document.body.appendChild(otherInputElement);

        var changedEventFired = false;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.isFalse(changedEventFired, "Querychanged fired multiple times");
            changedEventFired = true;
        });

        // make sure the input actually has focus, otherwise we don't get the focusout event
        inputElement.focus();
        LiveUnit.Assert.areEqual(inputElement, document.activeElement);

        var keys = [Key.tab, Key.enter, Key.upArrow, Key.downArrow]; // only Tab (always moves focus) & Enter (if apps handles QuerySubmitted and moves focus) are actually expected to occur; include up/down for test completeness only

        function runTest(key) {
            return WinJS.Promise.wrap().then(function () {
                LiveUnit.LoggingCore.logComment("Testing " + key + " key.");

                CommonUtilities.keydown(inputElement, key, "en-US");
                otherInputElement.focus();

                return WinJS.Promise.timeout();
            }).then(function () {
                LiveUnit.Assert.areEqual(otherInputElement, document.activeElement);

                // key up event goes to another control & never reaches inputElement
                CommonUtilities.keyup(otherInputElement, key, "en-US");

                // now put focus back
                inputElement.focus();

                return WinJS.Promise.timeout();
            }).then(function () {
                LiveUnit.Assert.areEqual(inputElement, document.activeElement);

                // ensure query events are still fired
                changedEventFired = false;
                inputElement.value = 'a' + key;
                inputElement.dispatchEvent(createCustomEvent("input"));
                LiveUnit.Assert.isTrue(changedEventFired, "QueryChanged event was not fired");
            });
        }

        runTest(Key.tab).then(function () {
            return runTest(Key.enter);
        }).then(function () {
            return runTest(Key.upArrow);
        }).then(function () {
            return runTest(Key.downArrow);
        }).done(complete);
    };

    // Ensure after the IME ate the enter/tab keys that we still get query change events
    this.testQueryChangeAfterIMEEaten = function searchBoxTest_QueryChangeAfterFocusLoss() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var inputElement = searchBox.element.querySelector("input");
        var that = this;

        var changedEventFired = false;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.isFalse(changedEventFired, "Querychanged fired multiple times");
            changedEventFired = true;
        });

        // make sure the input actually has focus, otherwise we don't get the focusout event
        inputElement.focus();
        LiveUnit.Assert.areEqual(inputElement, document.activeElement);

        var key = Key.enter;
        LiveUnit.LoggingCore.logComment("Testing " + key + " key.");

        CommonUtilities.keydown(inputElement, key, "zh-Hans-CN");
        // key up event was eaten by the IME (actually due to Trident bug BLUE:394522)

        // ensure query events are still fired
        changedEventFired = false;
        inputElement.value = 'a' + key;
        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.isTrue(changedEventFired, "QueryChanged event was not fired");
    };

    this.testBasicLinguisticAlternatives = function searchBoxTest_BasicLinguisticAlternatives() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var inputElement = searchBox.element.querySelector("input");

        var eventFired = false;
        var eventQueryText = null;
        var eventLinguisticDetails = null;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.isNotNull(event);
            LiveUnit.Assert.isNotNull(event.detail);
            LiveUnit.Assert.isNotNull(event.detail.queryText);
            eventQueryText = event.detail.queryText;
            LiveUnit.Assert.isNotNull(event.detail.linguisticDetails);
            eventLinguisticDetails = event.detail.linguisticDetails;
            LiveUnit.Assert.isFalse(eventFired, "Querychanged fired multiple times");
            eventFired = true;
        });

        // no alternatives case (but has composition string)
        inputElement.value = 'ab';
        mockInputContext(inputElement, 1, 2, []);
        inputElement.dispatchEvent(createCustomEvent("compositionstart"));
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
        LiveUnit.Assert.areEqual("ab", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 1, 1, []);

        // simple alternative case
        inputElement.value = 'ab';
        mockInputContext(inputElement, 0, 2, ['c', 'df', 'ghi']);
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
        LiveUnit.Assert.areEqual("ab", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 2, ['c', 'df', 'ghi']);

        // alternatives with finalized text (substitution) case
        inputElement.value = 'precompsuffix';
        mockInputContext(inputElement, 3, 7, ['c', 'df', 'ghi', 'same', 'longer']);
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
        LiveUnit.Assert.areEqual("precompsuffix", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 3, 4, ['precsuffix', 'predfsuffix', 'preghisuffix', 'presamesuffix', 'prelongersuffix']);
    };

    // IME chooses a candidate, get a string change during finalize, alternatives go away
    this.testBasicIMEConversion = function searchBoxTest_BasicIMEConversion() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var inputElement = searchBox.element.querySelector("input");

        var eventFired = false;
        var eventQueryText = null;
        var eventLinguisticDetails = null;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.isNotNull(event);
            LiveUnit.Assert.isNotNull(event.detail);
            LiveUnit.Assert.isNotNull(event.detail.queryText);
            eventQueryText = event.detail.queryText;
            LiveUnit.Assert.isNotNull(event.detail.linguisticDetails);
            eventLinguisticDetails = event.detail.linguisticDetails;
            LiveUnit.Assert.isFalse(eventFired, "Querychanged fired multiple times");
            eventFired = true;
        });

        inputElement.value = '';
        mockInputContext(inputElement, 0, 0, []);
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionstart"));
        LiveUnit.Assert.isFalse(eventFired, "QueryChanged event was incorrectly fired");

        inputElement.value = 'b';
        mockInputContext(inputElement, 0, 1, ['c', 'd']);
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
        LiveUnit.Assert.areEqual("b", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 1, ['c', 'd']);

        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.areEqual("b", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 1, ['c', 'd']);

        inputElement.value = 'f'; // conversion
        mockInputContext(inputElement, 0, 1, []); // still composition at this step
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
        LiveUnit.Assert.areEqual("f", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 1, []);

        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.areEqual("f", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 1, []);

        inputElement.value = 'f';
        mockInputContext(inputElement, 0, 0, []); // composition ended
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionend"));
        LiveUnit.Assert.areEqual("f", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 0, []);
    };

    // IMEs that keep alternatives on enter to finalize if there is no string change, and keep on submit (JPN, CHS, CHT Bopomofo)
    this.testFinalizeAndSubmitWithAlternatives = function searchBoxTest_FinalizeAndSubmitWithAlternatives() {
        var that = this;
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var inputElement = searchBox.element.querySelector("input");

        var eventFired = false;
        var eventQueryText = null;
        var eventLinguisticDetails = null;
        searchBox.addEventListener("querychanged", function searchBoxTest_queryChanged_listener(event) {
            LiveUnit.Assert.isNotNull(event);
            LiveUnit.Assert.isNotNull(event.detail);
            LiveUnit.Assert.isNotNull(event.detail.queryText);
            eventQueryText = event.detail.queryText;
            LiveUnit.Assert.isNotNull(event.detail.linguisticDetails);
            eventLinguisticDetails = event.detail.linguisticDetails;
            LiveUnit.Assert.isFalse(eventFired, "Querychanged fired multiple times");
            eventFired = true;
        });

        var submitEventFired = false;
        var submitEventQueryText = null;
        var submitEventLinguisticDetails = null;
        searchBox.addEventListener("querysubmitted", function searchBoxTest_querySubmitted_listener(event) {
            LiveUnit.Assert.isNotNull(event);
            LiveUnit.Assert.isNotNull(event.detail);
            LiveUnit.Assert.isNotNull(event.detail.queryText);
            submitEventQueryText = event.detail.queryText;
            LiveUnit.Assert.isNotNull(event.detail.linguisticDetails);
            submitEventLinguisticDetails = event.detail.linguisticDetails;
            LiveUnit.Assert.isFalse(submitEventFired, "Querychanged fired multiple times");
            submitEventFired = true;
        });

        inputElement.value = '';
        mockInputContext(inputElement, 0, 0, []);
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionstart"));
        LiveUnit.Assert.isFalse(eventFired, "QueryChanged event was incorrectly fired");

        inputElement.value = 'bcompd';
        mockInputContext(inputElement, 1, 5, ['x', 'y', 'z']);
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionupdate"));
        LiveUnit.Assert.isTrue(eventFired, "QueryChanged event was not fired");
        LiveUnit.Assert.areEqual("bcompd", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 1, 4, ['bxd', 'byd', 'bzd']);

        inputElement.value = 'bcompd';
        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.areEqual("bcompd", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 1, 4, ['bxd', 'byd', 'bzd']);

        inputElement.value = 'bcompd';
        mockInputContext(inputElement, 0, 0, ['x', 'y', 'z']); // composition ended, but alternatives kept
        eventFired = false;
        inputElement.dispatchEvent(createCustomEvent("compositionend"));
        LiveUnit.Assert.areEqual("bcompd", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 0, ['bxd', 'byd', 'bzd']);

        inputElement.value = 'bcompd';
        inputElement.dispatchEvent(createCustomEvent("input"));
        LiveUnit.Assert.areEqual("bcompd", eventQueryText);
        verifyLinguisticDetails(eventLinguisticDetails, 0, 0, ['bxd', 'byd', 'bzd']);

        // user submits via enter key
        submitEventFired = false;
        CommonUtilities.keydown(searchBox._inputElement, Key.enter, "ja");
        LiveUnit.Assert.isTrue(submitEventFired, "QuerySubmitted event was not fired");
        LiveUnit.Assert.areEqual("bcompd", submitEventQueryText);
        verifyLinguisticDetails(submitEventLinguisticDetails, 0, 0, ['bxd', 'byd', 'bzd']);

        CommonUtilities.keyup(searchBox._inputElement, Key.enter, "ja");
    }

    this.testSearchHistoryContext = function searchBoxTest_testSearchHistoryContext() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        var testContext = "Test Context";
        searchBox.searchHistoryContext = testContext;
        LiveUnit.Assert.areEqual(testContext, searchBox.searchHistoryContext, "Unable to set searchBox.searchHistoryContext");
    };

    this.testSearchHistoryDisabled = function searchBoxTest_testSearchHistoryDisabled() {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Waiting for control...");
        var testContext = "Test Context";
        searchBox.searchHistoryDisabled = true;
        LiveUnit.Assert.areEqual(true, searchBox.searchHistoryDisabled, "Unable to set searchBox.searchHistoryDisabled");
        searchBox.searchHistoryDisabled = false;
        LiveUnit.Assert.areEqual(false, searchBox.searchHistoryDisabled, "Unable to set searchBox.searchHistoryDisabled");
    };


    this.testSuggestionsDisplayed = function searchBoxTest_testSuggestionsDisplayed(complete) {
        // Verify whether all suggestions are rendered.
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");
        searchBox.addEventListener("suggestionsrequested", function (e) {
            e.detail.searchSuggestionCollection.appendQuerySuggestions(["Test query Suggestion1 test", "Test query Suggestion2 test"]);
            e.detail.searchSuggestionCollection.appendSearchSeparator("Separator");
            e.detail.searchSuggestionCollection.appendResultSuggestion("Test result Suggestion3 test", "Query suggestion3 detailed text", "tag3", WinJS.UI.SearchBox.createResultSuggestionImage("http://fakeurl"), "");
            e.detail.searchSuggestionCollection.appendResultSuggestion("Test result Suggestion4 test", "Query suggestion4 detailed text", "tag4", WinJS.UI.SearchBox.createResultSuggestionImage("http://fakeurl"), "");

            waitForSuggestionFlyoutRender(searchBox).done(function () {
                var suggestion1 = searchBox._repeater.elementFromIndex(0);
                LiveUnit.Assert.isTrue((suggestion1.textContent.indexOf("Test query Suggestion1 test") >= 0), "Suggestion1 text is not displayed.");

                var suggestion2 = searchBox._repeater.elementFromIndex(1);
                LiveUnit.Assert.isTrue((suggestion2.textContent.indexOf("Test query Suggestion2 test") >= 0), "Suggestion2 text is not displayed.");

                var suggestion3 = searchBox._repeater.elementFromIndex(2);
                LiveUnit.Assert.isTrue((suggestion3.textContent.indexOf("Separator") >= 0), "Suggestion3 text is not displayed.");

                var suggestion4 = searchBox._repeater.elementFromIndex(3);
                LiveUnit.Assert.isTrue((suggestion4.textContent.indexOf("Test result Suggestion3 test") >= 0), "Suggestion3 text is not displayed.");
                LiveUnit.Assert.isTrue((suggestion4.textContent.indexOf("Query suggestion3 detailed text") >= 0), "Suggestion3 detailed text is not displayed.");

                var suggestion5 = searchBox._repeater.elementFromIndex(4);
                LiveUnit.Assert.isTrue((suggestion5.textContent.indexOf("Test result Suggestion4 test") >= 0), "Suggestion4 text is not displayed.");
                LiveUnit.Assert.isTrue((suggestion5.textContent.indexOf("Query suggestion4 detailed text") >= 0), "Suggestion4 detailed text is not displayed.");

                complete();
            });
        });
        searchBox._inputElement.value = "a";
        searchBox._inputElement.focus();
    };

    this.testQuerySuggestionSelected = function searchBoxTest_testQuerySuggestionSelected(complete) {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");
        searchBox.addEventListener("querysubmitted", function searchBoxTest_querySubmitted_listener(event) {
            LiveUnit.Assert.areEqual("Test query Suggestion1 test", event.detail.queryText, "Query text not matching suggestion text");
            complete();
        });
        searchBox.addEventListener("suggestionsrequested", function (e) {
            e.detail.searchSuggestionCollection.appendQuerySuggestion("Test query Suggestion1 test");

            waitForSuggestionFlyoutRender(searchBox).done(function () {
                // Click on the first suggestion.
                searchBox._repeater.elementFromIndex(0).click();
            });
        });
        searchBox._inputElement.value = "a";
        searchBox._inputElement.focus();
    };

    this.testResultSuggestionSelected = function searchBoxTest_testResultSuggestionSelected(complete) {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        LiveUnit.LoggingCore.logComment("Verifying...");
        searchBox.addEventListener("resultsuggestionchosen", function searchBoxTest_resultsuggestionchosen_listener(event) {
            LiveUnit.Assert.areEqual("tag3", event.detail.tag, "Query text not matching suggestion tag");
            complete();
        });
        searchBox.addEventListener("suggestionsrequested", function (e) {
            e.detail.searchSuggestionCollection.appendResultSuggestion("Test result Suggestion3 test", "Query suggestion3 detailed text", "tag3", WinJS.UI.SearchBox.createResultSuggestionImage("http://fakeurl"), "");

            waitForSuggestionFlyoutRender(searchBox).done(function () {
                // Click on the first suggestion.
                searchBox._repeater.elementFromIndex(0).click();
            });
        });
        searchBox._inputElement.value = "a";
        searchBox._inputElement.focus();
    };

    this.testChooseSuggestionOnEnterEnabled = function searchBoxTest_ChooseSuggestionOnEnterEnabled(complete) {
        var searchBox = document.getElementById("SearchBoxID").winControl;
        searchBox.chooseSuggestionOnEnter = true;
        LiveUnit.LoggingCore.logComment("Verifying...");

        searchBox.addEventListener("querysubmitted", function searchBoxTest_querysubmitted_listener(event) {
            LiveUnit.Assert.areEqual("Test query Suggestion1 test", event.detail.queryText, "Query text not matching input");
            if (!WinJS.Utilities.hasWinRT) {
                // CommonUtilities.keyDown won't trick WinRT's SSM in setting the query language, however, on the web it should work.
                LiveUnit.Assert.areEqual("ja-JP", event.detail.language, "Query text language not matching input");
            }
            complete();
        });
        searchBox.addEventListener("suggestionsrequested", function (e) {
            e.detail.searchSuggestionCollection.appendQuerySuggestion("Test query Suggestion1 test");

            WinJS.Utilities._setImmediate(function () {
                CommonUtilities.keydown(searchBox._inputElement, Key.enter, "ja-JP");
            });
        });
        searchBox._inputElement.value = "Test query";
        searchBox._inputElement.focus();
    };

    this.testFocusOnKeyboardInputBringsUpSuggestions = function testFocusOnKeyboardInputBringsUpSuggestions(complete) {
        if (WinJS.Utilities.hasWinRT) {
            LiveUnit.LoggingCore.logComment("This test tests web implementation of Type-To-Search and has no value when WinRT is available");
            complete();
            return;
        }

        var searchBox = document.getElementById("SearchBoxID").winControl;
        searchBox.focusOnKeyboardInput = true;
        searchBox.addEventListener("suggestionsrequested", function (e) {
            complete();
        });
        CommonUtilities.keydown(document, WinJS.Utilities.Key.t);
    };

    this.testFocusOnKeyboardInputDoesNotBringUpSuggestionsWhenDisabled = function testFocusOnKeyboardInputBringsUpSuggestions(complete) {
        if (WinJS.Utilities.hasWinRT) {
            LiveUnit.LoggingCore.logComment("This test tests web implementation of Type-To-Search and has no value when WinRT is available");
            complete();
            return;
        }

        var searchBox = document.getElementById("SearchBoxID").winControl;
        searchBox.addEventListener("suggestionsrequested", function (e) {
            LiveUnit.Assert.fail();
        });
        CommonUtilities.keydown(document, WinJS.Utilities.Key.t);
        WinJS.Promise.timeout().done(complete);
    };

    // Util functions
    function createCustomEvent(type, details) {
        var ev = document.createEvent("CustomEvent");
        ev.initCustomEvent(type, true, true, details);
        return ev;
    }

    function mockInputContext(inputElement, compositionStartOffset, compositionEndOffset, alternatives) {
        //mock msGetInputContext so we can have more control over the events
        inputElement.msGetInputContext = function () {
            return {
                getCompositionAlternatives: function () {
                    return alternatives;
                },
                getCandidateWindowClientRect: function () {
                    return {
                        bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0
                    };
                },
                compositionEndOffset: compositionEndOffset,
                compositionStartOffset: compositionStartOffset
            }
        };
    };

    function verifyLinguisticDetails(linguisticDetails, expectedCompStart, expectedCompLength, expectedAlternatives) {
        LiveUnit.Assert.isNotNull(linguisticDetails);
        LiveUnit.Assert.isNotNull(linguisticDetails.queryTextCompositionStart);
        LiveUnit.Assert.areEqual(expectedCompStart, linguisticDetails.queryTextCompositionStart, "Unexpected composition string start.");
        LiveUnit.Assert.isNotNull(linguisticDetails.queryTextCompositionLength);
        LiveUnit.Assert.areEqual(expectedCompLength, linguisticDetails.queryTextCompositionLength, "Unexpected composition string length.");
        LiveUnit.Assert.isNotNull(linguisticDetails.queryTextAlternatives);
        LiveUnit.Assert.isNotNull(expectedAlternatives.length, linguisticDetails.queryTextAlternatives.length, "Unexpected number of alternatives");
        for (var i = 0; i < expectedAlternatives.length; i++) {
            LiveUnit.Assert.areEqual(expectedAlternatives[i], linguisticDetails.queryTextAlternatives[i], "Unexpected alternative value");
        }
    };
};
LiveUnit.registerTestClass("SearchBoxTests.SearchBoxTests");
