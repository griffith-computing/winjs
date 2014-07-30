// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
//-----------------------------------------------------------------------------
//
//  Abstract:
//
//  Position Tests for the "anchor" element of the tooltip (absolute, fixed, relative, relative).
//  Make sure the tooltip still appears at the correct spot when the "anchor" element is positioned
//  using this CSS property. This also tests when the html/body/parent element are scrolled.
//  To verify this, let's just measure the distance from the tooltip to the anchor.
//
//  Author: evanwi
//
//-----------------------------------------------------------------------------
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/base.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>
/// <reference path="../TestLib/util.js" />
/// <reference path="TooltipUtils.js"/>
/// <reference path="Tooltip.css"/>

TooltipPositionTests = function () {
    var tooltipUtils = new TooltipUtils();
    var commonUtils = new CommonUtils();

    // Since distances can be off due to rounding errors, use this tolerance for our comparisons.
    var DISTANCE_TOLERANCE = 1;

    this.setUp = function (complete) {
        // Add a sibling element before our element.  This helps us test static positioning.
        commonUtils.addTag("div", "siblingBeforeElement");
        var siblingBeforeElement = document.getElementById("siblingBeforeElement");
        siblingBeforeElement.innerHTML = "siblingBeforeElement";
        // Add a parent element.  This helps us with scrolling the anchor element when inside a <span>
        commonUtils.addTag("span", "parentElement");
        var parentElement = document.getElementById("parentElement");
        var cssReady = tooltipUtils.setUp();
        // Move the anchor element beneath a <span> so we can test scrolling the <span>
        var span1 = document.createElement("span");
        span1.innerHTML = "AAAAAAA BBBBBBB CCCCCCC DDDDDD";
        parentElement.appendChild(span1);

        var element = commonUtils.removeElementById(tooltipUtils.defaultElementID);
        parentElement.appendChild(element);

        var span2 = document.createElement("span");
        span2.innerHTML = "EEEEE FFFFFF GGGGGG HHHHHHH";
        parentElement.appendChild(span2);

        // Add a sibling element after our element.  This helps us make our <body> scrollable if needed.
        commonUtils.addTag("div", "siblingAfterElement");
        var siblingAfterElement = document.getElementById("siblingAfterElement");
        siblingAfterElement.innerHTML = "siblingAfterElement";
        
        cssReady.then(complete);
    };

    this.tearDown = function () {
        commonUtils.removeElementById("siblingBeforeElement");
        tooltipUtils.cleanUp();
        commonUtils.removeElementById("parentElement");
        commonUtils.removeElementById("siblingAfterElement");
    };

    //-----------------------------------------------------------------------------------

    // Verify the tooltip appears at the specified distance from the element.
    function testTooltip_VerifyPosition(signalTestCaseCompleted, elementPosition, parentPosition, scrollThe, inputMethod) {
        LiveUnit.LoggingCore.logComment("When the anchor element is positioned:  " + elementPosition);
        LiveUnit.LoggingCore.logComment("And we scroll the: " + scrollThe);
        LiveUnit.LoggingCore.logComment("And we use: " + inputMethod);
        LiveUnit.LoggingCore.logComment("Window size: " + window.innerWidth + " " + window.innerHeight);

        // Set up the anchor/trigger element.
        var element = document.getElementById(tooltipUtils.defaultElementID);
        element.innerHTML = "e";

        // Colorize some of the elements so they're easier to see.
        var siblingElement = commonUtils.getElementById("siblingAfterElement");
        var parentElement = document.getElementById("parentElement");
        parentElement.style.backgroundColor = "Blue";
        siblingElement.style.backgroundColor = "Gray";

        // Make each child element progressively larger, to ensure they can scroll.
        document.documentElement.style.overflow = "scroll";
        document.documentElement.style.width = (window.innerWidth + 200) + "px";
        document.documentElement.style.height = (window.innerHeight + 200) + "px";
        document.body.style.overflow = "scroll";
        document.body.style.width = (window.innerWidth + 400) + "px";
        document.body.style.height = (window.innerHeight + 400) + "px";
        siblingElement.style.width = (window.innerWidth + 600) + "px";
        siblingElement.style.height = (window.innerHeight + 600) + "px";

        if (scrollThe.indexOf("html") != -1) {
            window.scrollTo(25, 25);
        }
        else {
            window.scrollTo(0, 0);
        }

        if (scrollThe.indexOf("body") != -1) {
            WinJS.Utilities.setScrollPosition(document.body, { scrollLeft: 25, scrollTop: 25 });
        }
        else {
            WinJS.Utilities.setScrollPosition(document.body, { scrollLeft: 0, scrollTop: 0 });
        }

        if (scrollThe.indexOf("parent") != -1) {
            parentElement.style.width = "100px";
            parentElement.style.height = "100px";
            parentElement.style.top = "100px";
            parentElement.style.left = "100px";
            parentElement.style.overflow = "scroll";
            WinJS.Utilities.setScrollPosition(parentElement, { scrollLeft: 25, scrollTop: 25 });
        }
        else {
            parentElement.style.width = "";
            parentElement.style.height = "";
            parentElement.style.top = "";
            parentElement.style.left = "";
            parentElement.style.overflow = "auto";
            WinJS.Utilities.setScrollPosition(parentElement, { scrollLeft: 0, scrollTop: 0 });
        }

        // Position the element
        parentElement.style.position = parentPosition;
        element.style.position = elementPosition;
        element.style.left = "100px";
        element.style.top = "100px";

        // set up the tooltip
        var tooltip = tooltipUtils.instantiate(tooltipUtils.defaultElementID, { innerHTML: "t" });

        var testComplete = false;
        function tooltipEventListener(event) {
            if (testComplete) {
                return;
            }

            LiveUnit.Assert.isNotNull(event);
            LiveUnit.LoggingCore.logComment(event.type);
            tooltipUtils.logTooltipInformation(tooltip);

            switch (event.type) {
                case "trigger":
                    tooltipUtils.displayTooltip(inputMethod, element, tooltip);
                    break;
                case "opened":
                    LiveUnit.Assert.isTrue(tooltipUtils.getTooltipDistanceFromWindow(tooltip) >= 0);
                    var distance;
                    // Let's just use these inputMethods (and not touch, keyboardProgrammatic, etc.)
                    // They should cover all the main scenarios for positioning:  basically the tooltip
                    // is either positioned based on the touch/mouse point, or based on the element position.
                    switch (inputMethod) {
                        case "keyboard":
                            distance = tooltipUtils.OFFSET_KEYBOARD;
                            break;
                        case "mouse":
                            distance = tooltipUtils.OFFSET_MOUSE;
                            break;
                        case "mouseoverProgrammatic":
                            distance = tooltipUtils.OFFSET_PROGRAMMATIC_NONTOUCH;
                            break;
                        default:
                            LiveUnit.Assert.Fail("Unknown inputMethod " + inputMethod);
                            break;
                    }
                    var actualDistance = tooltipUtils.getTooltipDistanceFromElement(tooltip,
                        (((inputMethod == "touch") || (inputMethod == "mouse")) ? "center" : "edge"));

                    // On some browsers, the actual distance will be reported as 21.00000123 which will fail asserts which don't really matter
                    actualDistance = Math.round(actualDistance);

                    LiveUnit.Assert.isTrue((actualDistance <= (distance + DISTANCE_TOLERANCE)), "Expected distance: " + distance);
                    LiveUnit.Assert.isTrue((actualDistance >= (distance - DISTANCE_TOLERANCE)), "Expected distance: " + distance);

                    signalTestCaseCompleted();
                    testComplete = true;
                    break;
            }
        }
        tooltipUtils.setupTooltipListener(tooltip, tooltipEventListener);
    };


    var that = this;
    Helper.pairwise({
        elementPosition: ['absolute', 'fixed', 'relative', 'static'],
        parentPosition: ['static', 'absolute'],
        scrollThe: ['none', 'body', 'html' ,'parent', 'none'],
        inputMethod: ['mouse', 'mouseoverProgrammatic', 'keyboard']
    }).forEach(function(testCase) {

        var testNameParts = ["testTooltip_Position"];
        testNameParts.push(testCase.elementPosition);
        testNameParts.push(testCase.parentPosition);
        if(testCase.scrollThe !== 'none') {
            testNameParts.push(testCase.scrollThe, "Scrolled");
        }
        testNameParts.push(testCase.inputMethod);
        var testName = testNameParts.join('');
        that[testName] = function(signalTestCaseCompleted) {
            testTooltip_VerifyPosition(signalTestCaseCompleted, testCase.elementPosition, testCase.parentPosition, testCase.scrollThe, testCase.inputMethod);
        }

    });
    
};

// Register the object as a test class by passing in the name
LiveUnit.registerTestClass("TooltipPositionTests");
