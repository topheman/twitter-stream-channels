"use strict";
var grunt = require("grunt");
var exec = require("child_process").exec;

exports["mode_test"] = {
    "Verify beautification with unbeautified file": function(test) {
        test.expect(1);
        exec("grunt jsbeautifier:hasNotBeenBeautified", {
                cwd: __dirname + "/../"
            },
            function(err, stdout, stderr) {
                test.notEqual(err, null, "Grunt fails because file has not been beautified");
                test.done();
            });
    },

    "Verify beautification with unbeautified file and custom onVerifyFailed handler": function(test) {
        test.expect(2);
        exec("grunt jsbeautifier:onVerificationFailed", {
                cwd: __dirname + "/../"
            },
            function(err, stdout, stderr) {

                test.ok(stdout.indexOf('this message was added using onVerifyFailed handler') > -1, "onVerifyFailed was called");

                test.notEqual(err, null, "Grunt fails because file has not been beautified");
                test.done();
            });
    },

    "Verify using onBeautified handler to keep '!!' to be '!!' (sticking to the operator)": function(test) {
        test.expect(1);
        exec("grunt jsbeautifier:onBeautified", {
                cwd: __dirname + "/../"
            },
            function(err, stdout, stderr) {

                test.equal(err, null, "Grunt passes because file has been properly beautified");
                test.done();
            });
    },

    "Verify beautification with beautified file": function(test) {
        test.expect(1);
        exec("grunt jsbeautifier:hasBeenBeautified", {
                cwd: __dirname + "/../"
            },
            function(err, stdout, stderr) {
                test.equal(err, null, "Grunt passes because file has been beautified");
                test.done();
            });
    }
};
