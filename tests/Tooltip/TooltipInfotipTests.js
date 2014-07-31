// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
//-----------------------------------------------------------------------------
//
//  Abstract:
//
//  Infotip tests for the tooltip.
//
//  Author: evanwi
//
//-----------------------------------------------------------------------------
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>
/// <reference path="TooltipUtils.js"/>
/// <reference path="Tooltip.css"/>

TooltipInfotipTests = function () {
    var tooltipUtils = new TooltipUtils();
    var commonUtils = new CommonUtils();

    this.setUp = function (complete) {
        tooltipUtils.setUp().then(complete);
    };

    this.tearDown = function () {
        tooltipUtils.cleanUp();
    };

    //-----------------------------------------------------------------------------------

    testTooltip_Infotip = function (signalTestCaseCompleted, showInfotip, useTouch, toleranceDisplayTime, toleranceInvokeTime) {
        LiveUnit.LoggingCore.logComment("Window size: " + window.innerWidth + " " + window.innerHeight);

        // Set up the anchor/trigger element.
        var element = document.getElementById(tooltipUtils.defaultElementID);
        tooltipUtils.positionElement(element, "center");

        // set up the tooltip
        var tooltip = tooltipUtils.instantiate(tooltipUtils.defaultElementID, { infotip: showInfotip, innerHTML: "tooltip" });

        var triggerTime;
        var beforeopenTime;
        var openedTime;
        var beforecloseTime;
        var closedTime;

        function tooltipEventListener(event) {
            LiveUnit.Assert.isNotNull(event);
            LiveUnit.LoggingCore.logComment(event.type);
            tooltipUtils.logTooltipInformation(tooltip);

            // We don't want to make these perf tests, since there's other delay times due to logging, etc.,
            // so use "tolerance" to make sure the events are fired within a reasonable amount of time.
            switch (event.type) {
                case "trigger":
                    tooltipUtils.displayTooltip((useTouch ? "touch" : "mouse"), element);
                    triggerTime = (new Date()).getTime();
                    break;
                case "beforeopen":
                    beforeopenTime = (new Date()).getTime();
                    break;
                case "opened":
                    openedTime = (new Date()).getTime();
                    if (useTouch) {
                        // Touch will display the tooltip forever, so let's just immediately dismiss it.
                        if (tooltipUtils.pointerOverSupported) {
                            commonUtils.touchOver(element, null);
                        } else {
                            commonUtils.touchUp(element);
                        }
                    }
                    break;
                case "beforeclose":
                    beforecloseTime = (new Date()).getTime();
                    break;
                case "closed":
                    closedTime = (new Date()).getTime();
                    LiveUnit.LoggingCore.logComment("triggerTime " + triggerTime);
                    LiveUnit.LoggingCore.logComment("beforeopenTime " + beforeopenTime);
                    LiveUnit.LoggingCore.logComment("openedTime " + openedTime);
                    LiveUnit.LoggingCore.logComment("beforecloseTime " + beforecloseTime);
                    LiveUnit.LoggingCore.logComment("closedTime " + closedTime);

                    // Tooltip timings:
                    // Infotip = false
                    // Type of input    Show                        Re-show     Hide
                    // Touch            400 ms after finger down    0           Finger-up
                    // Mouse            2*SPI_GETMOUSEHOVERTIME     600ms       SPI_GETMESSAGEDURATION (5s default)
                    // KB               2*SPI_GETMOUSEHOVERTIME     800ms       SPI_GETMESSAGEDURATION
                    //
                    // Infotip = true
                    // Touch            1.2 s after finger down     400ms       Finger-up
                    // Mouse            2.5*SPI_GETMOUSEHOVERTIME   800ms       3 * SPI_GETMESSAGEDURATION
                    // Keyboard         2.5*SPI_GETMOUSEHOVERTIME   1s          3 * SPI_GETMESSAGEDURATION

                    var invokeTime = (beforeopenTime - triggerTime);
                    LiveUnit.LoggingCore.logComment("Invoke time: " + invokeTime);

                    var expectedInvokeTime;
                    if (showInfotip) {
                        expectedInvokeTime = useTouch ? tooltipUtils.DELAY_INITIAL_TOUCH_LONG : (2.5 * tooltipUtils.DEFAULT_MOUSE_HOVER_TIME);
                    }
                    else {
                        expectedInvokeTime = useTouch ? tooltipUtils.DELAY_INITIAL_TOUCH_SHORT : (2.0 * tooltipUtils.DEFAULT_MOUSE_HOVER_TIME);
                    }
                    LiveUnit.LoggingCore.logComment("Expected invoke time: " + expectedInvokeTime);

                    LiveUnit.Assert.isTrue(invokeTime > (expectedInvokeTime - toleranceInvokeTime));
                    LiveUnit.Assert.isTrue(invokeTime < (expectedInvokeTime + toleranceInvokeTime));

                    if (!useTouch) {
                        // We don't care about this time for touch, since the tooltip displays as long as we touch down.
                        // So there's no special duration to measure.
                        var displayTime = (beforecloseTime - openedTime);
                        LiveUnit.LoggingCore.logComment("Display time: " + displayTime);

                        var expectedDisplayTime = showInfotip ? (tooltipUtils.DEFAULT_MESSAGE_DURATION * 3) : tooltipUtils.DEFAULT_MESSAGE_DURATION;
                        LiveUnit.LoggingCore.logComment("Expected display time: " + expectedDisplayTime);

                        LiveUnit.Assert.isTrue(displayTime > (expectedDisplayTime - toleranceDisplayTime));
                        LiveUnit.Assert.isTrue(displayTime < (expectedDisplayTime + toleranceDisplayTime));
                    }

                    signalTestCaseCompleted();
                    break;
            }
        }
        tooltipUtils.setupTooltipListener(tooltip, tooltipEventListener);
    }

    this.testTooltip_InfotipTrue = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, true, false, 5000, 500);
    };
    
    
    
    
    
    this.testTooltip_InfotipTrue.timeout = 30000;

    this.testTooltip_InfotipFalse = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, false, false, 5000, 500);
    };
    
    
    
    
    
    this.testTooltip_InfotipFalse.timeout = 30000;

    this.testTooltip_InfotipTrueUsingTouch = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, true, true, 5000, 500);
    };
    
    
    
    
    
    this.testTooltip_InfotipTrueUsingTouch.timeout = 30000;

    this.testTooltip_InfotipFalseUsingTouch = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, false, true, 5000, 500);
    };
    
    
    
    
    
    this.testTooltip_InfotipFalseUsingTouch.timeout = 30000;

    this.testTooltip_InfotipTrueIDX = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, true, false, 1000, 150);
    };
    
    
    
    
    
    this.testTooltip_InfotipTrueIDX.timeout = 30000;

    this.testTooltip_InfotipFalseIDX = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, false, false, 1000, 150);
    };
    
    
    
    
    
    this.testTooltip_InfotipFalseIDX.timeout = 30000;

    this.testTooltip_InfotipTrueUsingTouchIDX = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, true, true, 1000, 150);
    };
    
    
    
    
    
    this.testTooltip_InfotipTrueUsingTouchIDX.timeout = 30000;

    this.testTooltip_InfotipFalseUsingTouchIDX = function (signalTestCaseCompleted) {
        testTooltip_Infotip(signalTestCaseCompleted, false, true, 1000, 150);
    };
    
    
    
    
    
    this.testTooltip_InfotipFalseUsingTouchIDX.timeout = 30000;
};

// Register the object as a test class by passing in the name
LiveUnit.registerTestClass("TooltipInfotipTests");
