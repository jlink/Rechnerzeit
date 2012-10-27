define(['jquery'], function($) {

        var testModeKey = 'mobile-test-mode';

        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            TestMode: function() {
                return localStorage.getItem(testModeKey) === 'on';
            },
            setTestMode: function() {
                localStorage.setItem(testModeKey, 'on');
            },
            clearTestMode: function() {
                localStorage.removeItem(testModeKey);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || isMobile.TestMode());
            }
        };

        return (function() {
            return isMobile;
        })();
    }
);