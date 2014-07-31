// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>
/// <reference path="../TestLib/NavBar/NavBarUtils.js"/>
/// <reference path="../TestLib/util.js"/>
/// <reference path="../TestData/NavBar.css" />

var WinJSTests = WinJSTests || {};

WinJSTests.NavBarContainerTests = function () {
    "use strict";

    var Key = WinJS.Utilities.Key;

    // Item sized from TestData/NavBar.css
    var itemMargins = 5;
    var itemHeight = 100;
    var itemHeightWithMargins = itemHeight + itemMargins + itemMargins;
    var itemWidth = 250;
    var itemWidthWithMargins = itemWidth + itemMargins + itemMargins;
    var marginAboveBelowItems = 30;
    
    function nobodyHasFocus() {
        return document.activeElement === null || document.activeElement === document.body;
    }

    this.setUp = function () {
        LiveUnit.LoggingCore.logComment("In setup");
        var newNode = document.createElement("div");
        newNode.id = "host";
        document.body.appendChild(newNode);
        this._element = newNode;
    };

    this.tearDown = function () {
        LiveUnit.LoggingCore.logComment("In tearDown");
        if (this._element) {
            WinJS.Utilities.disposeSubTree(this._element);
            document.body.removeChild(this._element);
            this._element = null;
        }
    };

    var navUtils = NavBarUtils;

    this.testHiddenNavContainer = function () {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        navbarContainerEl.style.display = "none";

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true),
            currentIndex: 5
        });

        LiveUnit.Assert.isFalse(navbarContainer._measured, "Measured is false if no width/height");

        navbarContainerEl.style.display = "block";
        navbarContainer.forceLayout();
        LiveUnit.Assert.isTrue(navbarContainer._measured, "Measured after visible");
    };

    this.testInstantiationMarkup = function (complete) {
        var html = "<div id ='navcontainer' data-win-control='WinJS.UI.NavBarContainer'>" +
            navUtils.getNavBarCommandsMarkup(20, true, true, true, true, true, true) +
            "</div>";

        this._element.innerHTML = html;

        WinJS.UI.processAll().
        then(function () {
            var navcontainer = document.getElementById('navcontainer').winControl;
            LiveUnit.Assert.isTrue(WinJS.Utilities.hasClass(navcontainer.element, "win-navbarcontainer"),
                "win-navbarcontainer class is not present");
            LiveUnit.Assert.isTrue(WinJS.Utilities.hasClass(navcontainer.element, "win-navbarcontainer-horizontal"),
                "win-navbarcontainer-horizontal class is not present");
            // Verify pageIndicator box
            var pageIndicatorBoxEl = navcontainer.element.querySelector(".win-navbarcontainer-pageindicator-box");
            LiveUnit.Assert.isTrue(pageIndicatorBoxEl, "win-navbarcontainer-pageindicator-box class is not present");
            // Verify current pageIndicator
            var pageIndicatorCurrentEl = pageIndicatorBoxEl.querySelector(".win-navbarcontainer-pageindicator-current");
            LiveUnit.Assert.isTrue(pageIndicatorCurrentEl, "win-navbarcontainer-pageindicator-current class is not present");
            LiveUnit.Assert.isTrue(WinJS.Utilities.hasClass(pageIndicatorCurrentEl, "win-navbarcontainer-pageindicator"),
                "win-navbarcontainer-pageindicator class is not present");
            // Verify left navarrow
            var leftArrowEl = navcontainer.element.querySelector(".win-navbarcontainer-navleft");
            LiveUnit.Assert.isTrue(leftArrowEl, "win-navbarcontainer-navleft class is not present");
            LiveUnit.Assert.isTrue(WinJS.Utilities.hasClass(leftArrowEl, "win-navbarcontainer-navarrow"),
                "win-navbarcontainer-navarrow class is not present");
            // Verify right navarrow
            var rightArrowEl = navcontainer.element.querySelector(".win-navbarcontainer-navright");
            LiveUnit.Assert.isTrue(rightArrowEl, "win-navbarcontainer-navright class is not present");
            LiveUnit.Assert.isTrue(WinJS.Utilities.hasClass(rightArrowEl, "win-navbarcontainer-navarrow"),
                "win-navbarcontainer-navarrow class is not present");
            // Verify left and right navarrows are not the same
            LiveUnit.Assert.isFalse(leftArrowEl === rightArrowEl);
        }).
        done(complete);
    };

    this.testCurrentIndexConstructor = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true),
            currentIndex: 5
        });

        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.columnsPerPage);
        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.rowsPerPage);
        LiveUnit.Assert.areEqual(Math.ceil(10 / (1 * 1)), navbarContainer._sizes.pages);
        LiveUnit.Assert.areEqual(2500, navbarContainer._scrollPosition);

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var sixthNavItem = navbarContainer._surfaceEl.children[5].winControl;
            LiveUnit.Assert.areEqual(sixthNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(5, navbarContainer.currentIndex);
            complete();
        });
    };
    
    this.testCurrentIndexAndMaxRowsConstructor = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(20, true),
            currentIndex: 10,
            maxRows: 2
        });

        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.columnsPerPage);
        LiveUnit.Assert.areEqual(2, navbarContainer._sizes.rowsPerPage);
        LiveUnit.Assert.areEqual(Math.ceil(20 / (1 * 2)), navbarContainer._sizes.pages);
        LiveUnit.Assert.areEqual(2500, navbarContainer._scrollPosition);

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var navItem10 = navbarContainer._surfaceEl.children[10].winControl;
            LiveUnit.Assert.areEqual(navItem10._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(10, navbarContainer.currentIndex);
            complete();
        });
    };
    
    this.testCurrentIndexAndMaxRows = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(20, true)
        });

        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.columnsPerPage);
        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.rowsPerPage);
        LiveUnit.Assert.areEqual(Math.ceil(20 / (1 * 1)), navbarContainer._sizes.pages);
        LiveUnit.Assert.areEqual(0, navbarContainer._scrollPosition);
        
        // Wait for the control to no longer be in the construction phase
        WinJS.Utilities.Scheduler.schedulePromiseNormal().then(function () {
            navbarContainer.maxRows = 2;
            navbarContainer.currentIndex = 10;
            navbarContainer.element.focus();
            
            // Wait for focus to move
            return WinJS.Promise.timeout();
        }).then(function () {
            var navItem10 = navbarContainer._surfaceEl.children[10].winControl;
            LiveUnit.Assert.areEqual(navItem10._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(10, navbarContainer.currentIndex);
            LiveUnit.Assert.areEqual(1, navbarContainer._sizes.columnsPerPage);
            LiveUnit.Assert.areEqual(2, navbarContainer._sizes.rowsPerPage);
            LiveUnit.Assert.areEqual(Math.ceil(20 / (1 * 2)), navbarContainer._sizes.pages);
            LiveUnit.Assert.areEqual(2500, navbarContainer._scrollPosition);
            complete();
        });
    };

    this.testSizes = function () {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true)
        });

        LiveUnit.Assert.areEqual(itemHeight, navbarContainer._sizes.itemOffsetHeight);
        LiveUnit.Assert.areEqual(itemWidth, navbarContainer._sizes.itemOffsetWidth);
        LiveUnit.Assert.areEqual(itemHeightWithMargins, navbarContainer._sizes.itemHeight);
        LiveUnit.Assert.areEqual(itemWidthWithMargins, navbarContainer._sizes.itemWidth);
    };

    this.testMaxRows = function () {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {});
        var dataSize;

        for (var rows = 1; rows < 5; rows++) {
            dataSize = 1;
            navbarContainer.maxRows = rows;
            while (dataSize <= rows) {
                navbarContainer.data = navUtils.getNavBarCommandsData(dataSize, true);
                LiveUnit.Assert.areEqual(1, navbarContainer._sizes.columnsPerPage);
                LiveUnit.Assert.areEqual(dataSize, navbarContainer._sizes.rowsPerPage);
                LiveUnit.Assert.areEqual(marginAboveBelowItems + dataSize * itemHeightWithMargins,
                    navbarContainerEl.offsetHeight);
                dataSize++;
            }
            navbarContainer.data = navUtils.getNavBarCommandsData(dataSize, true);
            LiveUnit.Assert.areEqual(2, navbarContainer._sizes.pages);
        }
    };

    this.testConsumeMarkup = function () {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        navbarContainerEl.innerHTML = navUtils.getNavBarCommandsMarkup(10, true);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl);

        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.columnsPerPage);
        LiveUnit.Assert.areEqual(1, navbarContainer._sizes.rowsPerPage);
        LiveUnit.Assert.areEqual(10, navbarContainer._sizes.pages);
    };

    this.testConstructTwice = function () {
        var navbarContainerEl = document.createElement('div');
        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl);

        try {
            navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl);
            LiveUnit.Assert.fail("Should throw");
        } catch (e) {
            LiveUnit.Assert.areEqual("Invalid argument: Controls may only be instantiated one time for each DOM element", e.message);
            LiveUnit.Assert.areEqual("WinJS.UI.NavBarContainer.DuplicateConstruction", e.name);
        }
    };

    this.testArrowKeysPressed = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);
        this._element.style.width = "800px";

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            maxRows: 1,
            data: navUtils.getNavBarCommandsData(100, true, false, false, false, false, false)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            var lastNavItem = navbarContainer._surfaceEl.children[99].winControl;

            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            for (var i = 0; i < 100; i++) {
                CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);
            }
            LiveUnit.Assert.areEqual(lastNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(99, navbarContainer.currentIndex);

            WinJS.Utilities._setImmediate(function () {
                for (var i = 0; i < 100; i++) {
                    CommonUtilities.keydown(lastNavItem._buttonEl, Key.leftArrow);
                }
                LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
                LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
                complete();
            });
        });
    };

    this.testKeyboardingHorizontal = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            maxRows: 2,
            data: navUtils.getNavBarCommandsData(100, true, false, false, false, false, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            var thirdNavItem = navbarContainer._surfaceEl.children[2].winControl;
            var fourthNavItem = navbarContainer._surfaceEl.children[3].winControl;
            var lastNavItem = navbarContainer._surfaceEl.children[99].winControl;

            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);
            LiveUnit.Assert.areEqual(firstNavItem._splitButtonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            CommonUtilities.keydown(firstNavItem._splitButtonEl, Key.rightArrow);
            LiveUnit.Assert.areEqual(thirdNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(2, navbarContainer.currentIndex);

            CommonUtilities.keydown(thirdNavItem._buttonEl, Key.downArrow);
            LiveUnit.Assert.areEqual(fourthNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(3, navbarContainer.currentIndex);

            CommonUtilities.keydown(fourthNavItem._buttonEl, Key.upArrow);
            LiveUnit.Assert.areEqual(thirdNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(2, navbarContainer.currentIndex);

            CommonUtilities.keydown(thirdNavItem._buttonEl, Key.leftArrow);
            LiveUnit.Assert.areEqual(firstNavItem._splitButtonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            CommonUtilities.keydown(firstNavItem._splitButtonEl, Key.end);
            LiveUnit.Assert.areEqual(lastNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(99, navbarContainer.currentIndex);

            CommonUtilities.keydown(lastNavItem._buttonEl, Key.home);
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            var columns = navbarContainer._sizes.columnsPerPage;
            var rows = navbarContainer._sizes.rowsPerPage;
            var firstItemOnFirstPageNavItem = navbarContainer._surfaceEl.children[0].winControl;
            var lastItemOnFirstPageNavItem = navbarContainer._surfaceEl.children[columns * rows - 1].winControl;
            var firstItemOnSecondPageNavItem = navbarContainer._surfaceEl.children[columns * rows].winControl;
            var lastItemOnSecondPageNavItem = navbarContainer._surfaceEl.children[2 * columns * rows - 1].winControl;
            var firstItemOnThirdPageNavItem = navbarContainer._surfaceEl.children[2 * columns * rows].winControl;
            var lastItemOnThirdPageNavItem = navbarContainer._surfaceEl.children[3 * columns * rows - 1].winControl;

            CommonUtilities.keydown(firstNavItem._buttonEl, Key.pageDown);
            LiveUnit.Assert.areEqual(lastItemOnFirstPageNavItem._buttonEl, document.activeElement);

            CommonUtilities.keydown(lastItemOnFirstPageNavItem._buttonEl, Key.pageDown);
            LiveUnit.Assert.areEqual(lastItemOnSecondPageNavItem._buttonEl, document.activeElement);

            CommonUtilities.keydown(lastItemOnSecondPageNavItem._buttonEl, Key.pageDown);
            LiveUnit.Assert.areEqual(lastItemOnThirdPageNavItem._buttonEl, document.activeElement);

            CommonUtilities.keydown(lastItemOnThirdPageNavItem._buttonEl, Key.pageUp);
            LiveUnit.Assert.areEqual(firstItemOnThirdPageNavItem._buttonEl, document.activeElement);

            CommonUtilities.keydown(firstItemOnThirdPageNavItem._buttonEl, Key.pageUp);
            LiveUnit.Assert.areEqual(firstItemOnSecondPageNavItem._buttonEl, document.activeElement);

            CommonUtilities.keydown(firstItemOnSecondPageNavItem._buttonEl, Key.pageUp);
            LiveUnit.Assert.areEqual(firstItemOnFirstPageNavItem._buttonEl, document.activeElement);

            complete();
        });
    };

    this.testKeyboardingVertical = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);
        navbarContainerEl.className = "verticalTest";

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            maxRows: 2,
            layout: WinJS.UI.Orientation.vertical,
            data: navUtils.getNavBarCommandsData(100, true, false, false, false, false, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            var thirdNavItem = navbarContainer._surfaceEl.children[2].winControl;
            var fourthNavItem = navbarContainer._surfaceEl.children[3].winControl;
            var fifthNavItem = navbarContainer._surfaceEl.children[4].winControl;
            var seventhNavItem = navbarContainer._surfaceEl.children[6].winControl;
            var lastNavItem = navbarContainer._surfaceEl.children[99].winControl;

            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);
            LiveUnit.Assert.areEqual(firstNavItem._splitButtonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            CommonUtilities.keydown(firstNavItem._splitButtonEl, Key.downArrow);
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            CommonUtilities.keydown(secondNavItem._buttonEl, Key.downArrow);
            LiveUnit.Assert.areEqual(thirdNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(2, navbarContainer.currentIndex);

            CommonUtilities.keydown(thirdNavItem._buttonEl, Key.upArrow);
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            CommonUtilities.keydown(secondNavItem._buttonEl, Key.end);
            LiveUnit.Assert.areEqual(lastNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(99, navbarContainer.currentIndex);

            CommonUtilities.keydown(lastNavItem._buttonEl, Key.home);
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            CommonUtilities.keydown(firstNavItem._buttonEl, Key.pageDown);
            LiveUnit.Assert.areEqual(fourthNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(3, navbarContainer.currentIndex);

            CommonUtilities.keydown(fourthNavItem._buttonEl, Key.pageDown);
            LiveUnit.Assert.areEqual(seventhNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(6, navbarContainer.currentIndex);

            CommonUtilities.keydown(seventhNavItem._buttonEl, Key.pageUp);
            LiveUnit.Assert.areEqual(fourthNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(3, navbarContainer.currentIndex);

            CommonUtilities.keydown(fourthNavItem._buttonEl, Key.pageUp);
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            complete();
        });
    };

    this.testFocusUpdateOnDataRemove = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(3, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            // Remove the item with focus and make sure the next one gets focus.
            navbarContainer.data.splice(1, 1);

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            // Remove the item with focus when there is no next item and make sure the previous one gets focus.
            navbarContainer.data.splice(1, 1);

            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            // Remove the last item.
            navbarContainer.data.splice(0, 1);
            LiveUnit.Assert.isTrue(nobodyHasFocus(), "No element should have focus");
            LiveUnit.Assert.areEqual(-1, navbarContainer.currentIndex);

            complete();
        });
    };

    this.testFocusUpdateOnDataChange = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(3, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            // Replace the item
            navbarContainer.data.setAt(1, navUtils.getNavBarCommandData(3, true));

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            complete();
        });
    };

    this.testFocusUpdateOnDataInserts = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(3, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            // Insert before the item
            navbarContainer.data.splice(0, 0, navUtils.getNavBarCommandData(3, true));
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(2, navbarContainer.currentIndex);

            // Insert after the item
            navbarContainer.data.splice(3, 0, navUtils.getNavBarCommandData(3, true));
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(2, navbarContainer.currentIndex);

            complete();
        });
    };

    this.testFocusUpdateOnDataReload = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(3, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            // Reverse to cause a reload event.
            navbarContainer.data.reverse();

            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);

            complete();
        });
    };

    this.testFocusUpdateOnDataMove = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(3, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);

            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);

            // Move the item
            navbarContainer.data.move(1, 2);

            var secondNavItem = navbarContainer._surfaceEl.children[2].winControl;
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(2, navbarContainer.currentIndex);

            complete();
        });
    };

    this.testSplitToggle = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true, false, false, false, false, true)
        });

        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            var secondNavItem = navbarContainer._surfaceEl.children[1].winControl;

            LiveUnit.Assert.isFalse(secondNavItem.splitOpened);
            LiveUnit.Assert.isFalse(firstNavItem.splitOpened);

            // Open the first split button.
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.rightArrow);
            LiveUnit.Assert.areEqual(firstNavItem._splitButtonEl, document.activeElement);
            LiveUnit.Assert.areEqual(0, navbarContainer.currentIndex);
            CommonUtilities.keydown(firstNavItem._splitButtonEl, Key.enter);

            LiveUnit.Assert.isTrue(firstNavItem.splitOpened);
            LiveUnit.Assert.isFalse(secondNavItem.splitOpened);

            // When we open the second split button the first one closes.
            CommonUtilities.keydown(firstNavItem._splitButtonEl, Key.rightArrow);
            LiveUnit.Assert.areEqual(secondNavItem._buttonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);
            CommonUtilities.keydown(secondNavItem._buttonEl, Key.rightArrow);
            LiveUnit.Assert.areEqual(secondNavItem._splitButtonEl, document.activeElement);
            LiveUnit.Assert.areEqual(1, navbarContainer.currentIndex);
            CommonUtilities.keydown(secondNavItem._splitButtonEl, Key.enter);

            LiveUnit.Assert.isTrue(secondNavItem.splitOpened);
            LiveUnit.Assert.isFalse(firstNavItem.splitOpened);

            complete();
        });
    };

    this.testSplitOpenedAndSplitToggleOnPropertyUpdates = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true, false, false, false, false, true)
        });

        var eventName = "splittoggle",
            splitToggleFired = false,
            firstNavItem;

        function loop(action) {
            firstNavItem = navbarContainer._surfaceEl.children[0].winControl;

            navbarContainerEl.addEventListener(eventName, function handler(e) {
                LiveUnit.Assert.areEqual(firstNavItem, e.detail.navbarCommand);
                splitToggleFired = true;
            });

            firstNavItem._splitButtonEl.click();
            LiveUnit.Assert.isTrue(splitToggleFired);
            splitToggleFired = false;
            LiveUnit.Assert.isTrue(firstNavItem.splitOpened);

            action();

            LiveUnit.Assert.isTrue(splitToggleFired);
            splitToggleFired = false;
            LiveUnit.Assert.isFalse(firstNavItem.splitOpened);
        }

        var actions = [];

        // Update template
        actions.push(function () {
            function template(item) {
                var root = document.createElement("div");
                root.textContent = "New Template";
                return root;
            }

            navbarContainer.template = template;
        });

        // Update data
        actions.push(function () {
            navbarContainer.data = navUtils.getNavBarCommandsData(8, true, true, true, true, true, true);
        });

        // Update fixedSize
        actions.push(function () {
            navbarContainer.fixedSize = true;
        });

        // Update maxrows
        actions.push(function () {
            navbarContainer.maxRows = 2;
        });

        // Update layout
        actions.push(function () {
            navbarContainer.layout = WinJS.UI.Orientation.vertical;
        });

        // Update currentIndex
        actions.push(function () {
            navbarContainer.currentIndex = 3;
        });

        actions.forEach(function (action) {
            loop(action);
        });

        complete();
    };

    this.testInvokedEvent = function () {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true, false, false, false, false, true)
        });

        var clickedIndex,
            navbarCmd,
            dataItem;

        navbarContainer.addEventListener(WinJS.UI.NavBarContainer._EventName.invoked, function (ev) {
            clickedIndex = ev.detail.index;
            navbarCmd = ev.detail.navbarCommand;
            dataItem = ev.detail.data;
        });

        var expectedIndex = 1,
            expectedNavBarCmd = navbarContainerEl.querySelectorAll(".win-navbarcommand")[expectedIndex].winControl,
            expectedDataItem = navbarContainer.data.getAt(expectedIndex);

        navbarContainer._surfaceEl.children[expectedIndex].winControl._buttonEl.click();
        LiveUnit.Assert.areEqual(expectedIndex, clickedIndex);
        LiveUnit.Assert.areEqual(expectedNavBarCmd, navbarCmd);
        LiveUnit.Assert.areEqual(expectedDataItem, dataItem);
    };

    this.testSplitToggleFiresWhenSplitOpenedUpdated = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(6, true, false, false, false, false, true)
        });

        var splitToggleFired = false;
        navbarContainer.addEventListener("splittoggle", function (e) {
            splitToggleFired = true;
        });

        var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
        LiveUnit.Assert.isFalse(firstNavItem.splitOpened);

        firstNavItem.splitOpened = true;
        LiveUnit.Assert.isTrue(splitToggleFired);
        splitToggleFired = false;

        firstNavItem.splitOpened = false;
        LiveUnit.Assert.isTrue(splitToggleFired);

        complete();
    };

    this.testSplitToggleEvent = function () {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true, false, false, false, false, true)
        });

        var clickedIndex,
            opened,
            navbarCmd,
            dataItem;

        navbarContainer.addEventListener(WinJS.UI.NavBarContainer._EventName.splitToggle, function (ev) {
            clickedIndex = ev.detail.index;
            opened = ev.detail.opened;
            navbarCmd = ev.detail.navbarCommand;
            dataItem = ev.detail.data;
        });

        var expectedIndex = 1,
            expectedNavBarCmd = navbarContainerEl.querySelectorAll(".win-navbarcommand")[expectedIndex].winControl,
            expectedDataItem = navbarContainer.data.getAt(expectedIndex);

        var navItem1 = navbarContainer._surfaceEl.children[expectedIndex].winControl;
        navItem1._splitButtonEl.click();
        LiveUnit.Assert.areEqual(expectedIndex, clickedIndex);
        LiveUnit.Assert.isTrue(opened);
        LiveUnit.Assert.areEqual(expectedNavBarCmd, navbarCmd);
        LiveUnit.Assert.areEqual(expectedDataItem, dataItem);

        expectedIndex = 2;
        expectedNavBarCmd = navbarContainerEl.querySelectorAll(".win-navbarcommand")[expectedIndex].winControl;
        expectedDataItem = navbarContainer.data.getAt(expectedIndex);

        var navItem2 = navbarContainer._surfaceEl.children[expectedIndex].winControl;
        navItem2._splitButtonEl.click();
        LiveUnit.Assert.areEqual(expectedIndex, clickedIndex);
        LiveUnit.Assert.isTrue(opened);
        LiveUnit.Assert.isFalse(navItem1.splitOpened); // Verify the previous split button is closed
        LiveUnit.Assert.areEqual(expectedNavBarCmd, navbarCmd);
        LiveUnit.Assert.areEqual(expectedDataItem, dataItem);
    };

    this.testDataEdits = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var dataList = navUtils.getNavBarCommandsData(20, true, false, false, false, false, true);
        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, { data: dataList });

        var editsCount = 500;

        function performRandomEdit(i) {
            var editTypes = ["push", "unshift", "pop", "shift", "reverse", "setAt", "move", "sort", "length"];
            var item = navUtils.getNavBarCommandData(i, true, true, true, true, true, true);

            // Perform data edits
            switch (Helper.getRandomItem(editTypes)) {
                case "push":
                    LiveUnit.LoggingCore.logComment("Performing push");
                    dataList.push(item);
                    break;

                case "unshift":
                    LiveUnit.LoggingCore.logComment("Performing unshift");
                    dataList.unshift(item);
                    break;

                case "pop":
                    LiveUnit.LoggingCore.logComment("Performing pop");
                    if (dataList.length > 0) {
                        dataList.pop();
                    }
                    break;

                case "shift":
                    LiveUnit.LoggingCore.logComment("Performing shift");
                    if (dataList.length > 0) {
                        dataList.shift();
                    };
                    break;

                case "setAt":
                    LiveUnit.LoggingCore.logComment("Performing setAt");
                    dataList.setAt(Helper.getRandomNumberUpto(dataList.length), item);
                    break;

                case "move":
                    LiveUnit.LoggingCore.logComment("Performing move");
                    dataList.move(0, dataList.length - 1);
                    break;

                case "reverse":
                    LiveUnit.LoggingCore.logComment("Performing reverse");
                    dataList.reverse();
                    break;

                case "sort":
                    LiveUnit.LoggingCore.logComment("Performing sort");
                    dataList.sort();
                    break;

                case "length":
                    LiveUnit.LoggingCore.logComment("Setting the length of the list to less than actual member");
                    if (dataList.length > 2) {
                        dataList.length = 2;
                    };
                    break;

                default:
                    LiveUnit.Assert.fail("Unrecognized edit type");
            }
        }

        function verify() {
            var cmds = navbarContainerEl.querySelectorAll(".win-navbarcommand");
            LiveUnit.Assert.areEqual(dataList.length, cmds.length, "Unexpected number of items");

            dataList.forEach(function (item, index) {
                LiveUnit.Assert.areEqual(item.label, cmds[index].winControl.label,
                    "Incorrect label on the navbarcommand");
            });
        }

        for (var i = 0; i < editsCount; i++) {
            // Edit
            performRandomEdit(i);
            // Verify
            verify();
        }

        complete();
    };

    this.testDispose = function () {
        var navbarContainer = new WinJS.UI.NavBarContainer();
        LiveUnit.Assert.isFalse(navbarContainer._disposed);
        navbarContainer.dispose();
        LiveUnit.Assert.isTrue(navbarContainer._disposed);
        navbarContainer.dispose();
        LiveUnit.Assert.isTrue(navbarContainer._disposed);
    };

    this.testForceLayoutUpdatesUI = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true, false, true, false, false, false)
        });

        var origPageIndicatorCount = navbarContainerEl.querySelectorAll(".win-navbarcontainer-pageindicator").length;
        // Flip to 3rd page
        navbarContainer.currentIndex = 4;
        // Hide
        navbarContainerEl.style.display = "none";
        // Resize
        this._element.style.width = "700px";
        WinJS.Utilities._setImmediate(function () {
            // Show
            navbarContainerEl.style.display = "block";
            var currentPageIndicatorCount = navbarContainerEl.querySelectorAll(".win-navbarcontainer-pageindicator").length;
            // Verify
            LiveUnit.Assert.areEqual(origPageIndicatorCount, currentPageIndicatorCount, "Unexpected page indicator count");
            // Remeasure
            navbarContainer.forceLayout();
            // Verify
            currentPageIndicatorCount = navbarContainerEl.querySelectorAll(".win-navbarcontainer-pageindicator").length;
            origPageIndicatorCount = 5;
            LiveUnit.Assert.areEqual(origPageIndicatorCount, currentPageIndicatorCount, "Unexpected page indicator count");
            complete();
        });

    }

    this.testChangeLayoutProperty = function (complete) {
        var navbarContainerEl = document.createElement('div');
        this._element.appendChild(navbarContainerEl);

        var navbarContainer = new WinJS.UI.NavBarContainer(navbarContainerEl, {
            data: navUtils.getNavBarCommandsData(10, true, false, true, false, false, false)
        });

        // Verify pageindicators are visible
        var style = getComputedStyle(navbarContainerEl.querySelector(".win-navbarcontainer-pageindicator-box"));
        LiveUnit.Assert.areEqual("visible", style.visibility, "Page indicator are hidden");

        var pageIndicatorCount = navbarContainerEl.querySelectorAll(".win-navbarcontainer-pageindicator").length;

        // Switch to vertical layout
        navbarContainer.layout = "vertical";

        // Verify pageindicators are hidden
        var style = getComputedStyle(navbarContainerEl.querySelector(".win-navbarcontainer-pageindicator-box"));
        LiveUnit.Assert.areEqual("hidden", style.visibility, "Page indicator are visible");

        // Press end, then home
        navbarContainer.element.focus();
        WinJS.Utilities._setImmediate(function () {
            var firstNavItem = navbarContainer._surfaceEl.children[0].winControl;
            var lastNavItem = navbarContainer._surfaceEl.children[9].winControl;

            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.end);
            LiveUnit.Assert.areEqual(lastNavItem._buttonEl, document.activeElement);
            CommonUtilities.keydown(lastNavItem._buttonEl, Key.home);
            LiveUnit.Assert.areEqual(firstNavItem._buttonEl, document.activeElement);

            // Switch to horizontal layout
            navbarContainer.layout = "horizontal";
            CommonUtilities.keydown(firstNavItem._buttonEl, Key.end);

            // Verify pageindicators are visible
            var style = getComputedStyle(navbarContainerEl.querySelector(".win-navbarcontainer-pageindicator-box"));
            LiveUnit.Assert.areEqual("visible", style.visibility, "Page indicator are hidden");

            // Verify pageindicator count is same as before
            var newPageIndicatorCount = navbarContainerEl.querySelectorAll(".win-navbarcontainer-pageindicator").length;
            LiveUnit.Assert.areEqual(pageIndicatorCount, newPageIndicatorCount,
                "Unexpected number of page indicators");

            complete();
        });
    }
};

LiveUnit.registerTestClass("WinJSTests.NavBarContainerTests");
