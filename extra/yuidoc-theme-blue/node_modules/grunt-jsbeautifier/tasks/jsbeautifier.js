module.exports = function(grunt) {
    "use strict";

    var path = require('path'),
        jsBeautifier = require('js-beautify'),
        lodash = require('lodash'),
        stringUtils = require('underscore.string'),
        jsbeautifier = jsBeautifier.js,
        cssbeautifier = jsBeautifier.css,
        htmlbeautifier = jsBeautifier.html,
        formatter = require('stringformat');



    var fixFormatErrors = function(content, args) {
        var replacements = [{
            replace: /!!\s/g, // double bang with one space after
            using: '!!' // removes the extra space at the end leaving only the double bang.
        }, {
            replace: /\(\sfunction/g, // extra space in anonymous functions passed as arguments
            using: '(function' // removes the extra space
        }, {
            replace: /\)\s\)/g, // closing parenthesis with an space in the middle
            using: '))' // remove the middle space
        }, {
            replace: /\.\s+continue\s\(/g,
            using: '.continue('
        }, {
            replace: /\.\s+catch\s\(/g,
            using: '.catch('
        }];

        var counts = {};
        replacements.forEach(function(entry) {
            var token = entry.using,
                regex = entry.replace;

            counts[token] = {
                count: 0,
                regex: regex
            };
            content = content.replace(regex, function() {
                counts[token].count++;
                return token;
            });
        });

        Object.keys(counts).forEach(function(key) {
            //grunt.log.writeln('Replacing ' + counts[key].regex + ' with: ' + key  + ' ' + )
            var entry = counts[key],
                count = entry.count,
                regex = entry.regex;
            if (count > 0) {
                var msg = formatter('Replacing {0} with {1}, {2} time(s) on file {3}', regex, key, count, args.file);
                //console.log(msg);
                grunt.verbose.writeln(msg);
            }
        });

        return content;
    };


    // Please see the grunt documentation for more information regarding task and
    // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md
    // ==========================================================================
    // TASKS
    // ==========================================================================
    grunt.task.registerMultiTask('jsbeautifier', 'jsbeautifier.org for grunt', function() {

        var params = this.options({
            mode: "VERIFY_AND_WRITE",
            js: {},
            css: {},
            html: {}
        });

        var fileCount = 0;
        var changedFileCount = 0;

        function verifyActionHandler(src, result, params, config) {
            var onVerificationFailed = params.onVerificationFailed;
            if (onVerificationFailed) {
                onVerificationFailed(result, {
                    file: src,
                    params: params,
                    config: config
                });
            }
            grunt.fail.warn(src.cyan + ' was not beautified');
        }

        function verifyAndWriteActionHandler(src, result, params, config) {
            grunt.log.writeln('file ' + src.cyan + ' needed beautification... updating it with beautified content');
            grunt.file.write(src, result);
            changedFileCount++;
        }

        function convertCamelCaseToUnderScore(config) {
            var underscoreKey;
            lodash.forEach([config.js, config.css, config.html], function(conf) {
                lodash.forEach(conf, function(value, key) {
                    underscoreKey = stringUtils.underscored(key);
                    if ("fileTypes" !== key && key !== underscoreKey) {
                        conf[underscoreKey] = value;
                        delete conf[key];
                    }
                });
            });
        }

        if (this.filesSrc && this.filesSrc.length > 0) {
            grunt.verbose.writeln('Beautifing using filesSrc with ' + this.filesSrc.length.toString().cyan + ' files...');

            grunt.verbose.writeln('Using mode="' + params.mode + '"...');
            var actionHandler = "VERIFY_ONLY" === params.mode ? verifyActionHandler : verifyAndWriteActionHandler;

            var config;
            if (params.config) {
                var baseConfig = grunt.file.readJSON(path.resolve(params.config));
                config = {
                    js: {},
                    css: {},
                    html: {}
                };
                lodash.extend(config.js, baseConfig);
                lodash.extend(config.css, baseConfig);
                lodash.extend(config.html, baseConfig);
                lodash.extend(config.js, baseConfig.js);
                lodash.extend(config.css, baseConfig.css);
                lodash.extend(config.html, baseConfig.html);
                lodash.extend(config.js, params.js);
                lodash.extend(config.css, params.css);
                lodash.extend(config.html, params.html);
            } else {
                config = params;
            }
            config.js.fileTypes = lodash.union(config.js.fileTypes, ['.js', '.json']);
            config.css.fileTypes = lodash.union(config.css.fileTypes, ['.css']);
            config.html.fileTypes = lodash.union(config.html.fileTypes, ['.html']);

            grunt.verbose.writeln('Beautify config before converting camelcase to underscore: ' + JSON.stringify(config));

            convertCamelCaseToUnderScore(config);

            grunt.verbose.writeln('Using beautify config: ' + JSON.stringify(config));

            var done = this.async();
            var q = grunt.util.async.queue(function(src, callback) {
                if (grunt.file.isDir(src)) {
                    callback();
                    return;
                }

                beautify(src, config, actionHandler, params);
                fileCount++;
                callback();
            }, 10);
            q.drain = function() {
                grunt.log.write('Beautified ' + fileCount.toString().cyan + ' files, changed ' + changedFileCount.toString().cyan + ' files...');
                grunt.log.ok();
                done();
            };
            q.push(this.filesSrc);
        }
    });

    function beautify(file, config, actionHandler, params) {
        var setup = getBeautifierSetup(file, config);
        if (!setup) {
            return;
        }

        var beautifier = setup[0],
            beautifyConfig = setup[1],
            addNewLine = setup[2];

        var original = grunt.file.read(file);
        grunt.verbose.write('Beautifing ' + file.cyan + '...');
        var result = beautifier(original, beautifyConfig);
        // jsbeautifier would skip the line terminator for js files
        if (addNewLine) {
            result += '\n';
        }

        result = fixFormatErrors(result, {
            config: config,
            file: file,
            params: params
        });

        var onBeautified = params.onBeautified;
        if (onBeautified) {
            var res = onBeautified(result, {
                config: config,
                file: file,
                params: params
            });
            if (typeof res !== "string" || res === "") {
                grunt.log.warn('onBeautified returned no valid string content'.cyan + '. Using the original beautified result');
            } else {
                result = res;
            }
        }

        grunt.verbose.ok();
        /*jshint eqeqeq: false */
        if (original != result) {
            actionHandler(file, result, params, config);
        }
    }

    function getFileType(file, config) {
        var fileType = null,
            fileMapping = {
                'js': config.js.fileTypes,
                'css': config.css.fileTypes,
                'html': config.html.fileTypes
            };
        lodash.forEach(fileMapping, function(extensions, type) {
            fileType = type;
            return -1 === lodash.findIndex(extensions, function(ext) {
                return stringUtils.endsWith(file, ext);
            });
        });
        return fileType;
    }

    function getBeautifierSetup(file, config) {
        var fileType = getFileType(file, config);
        switch (fileType) {
            case 'js':
                return [jsbeautifier, config.js, true];
            case 'css':
                return [cssbeautifier, config.css];
            case 'html':
                return [htmlbeautifier, config.html];
            default:
                grunt.fail.warn('Cannot beautify ' + file.cyan + ' (only js, css and html files can be beautified)');
                return null;
        }
    }
};
