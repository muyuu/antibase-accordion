(function(definition){
    "use strict";

    var moduleName = "Accordion";

    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object"){
        module.exports = definition(root, require("jquery"), require("underscore"));
    } else {
        root[moduleName] = definition(root, $, _);
    }

})(function(root, $, _){
    "use strict";

    var Module;

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------
    /**
     * judge exist function
     * @param  {any} x anything
     * @return {boolean}
     */
    function existy(x){
        return x != null;
    }


    /**
     * judge true
     * @param  {any} x anything
     * @return {boolean}
     */
    function truthy(x){
        return (x !== false) && existy(x);
    }


    /**
     * do callback function when if exist function
     * @param {function} func callback function
     * @returns {boolean} false
     */
    function doCallBack(func){
        if (_.isFunction(func)){
            func();
        }
        return false;
    }


    // -------------------------------------------------------
    // module
    // -------------------------------------------------------

    /**
     * module factory
     * this module is dependent on jQuery
     * @prop {string} rootElement default root element class or id
     * @prop {array} instance
     * @namespace
     */
    function Factory(param){

        var rootElement = ".js-acd";

        // param is option object
        var opt = existy(param) ? param : {};

        // set root element
        var $self = existy(opt.root) ? $(opt.root) : $(rootElement);

        // make instances and push array
        this.instance = $self.map(function(key, val){
            return new Module(opt, val);
        });
    }


    /**
     * constructor
     * @type {Function}
     */
    Module = function(param, moduleRoot){

        var self = this;

        // DOM element
        this.$root = $(moduleRoot);
        this.$head = null;
        this.$body = null;

        this.currentIndex = 0;

        // option
        this.opt = {
            root        : moduleRoot,
            head        : existy(param.head) ? param.head : ".js-acd__head",
            body        : existy(param.body) ? param.body : ".js-acd__body",
            openedClass : existy(param.openedClass) ? param.openedClass : "js-isOpen",

            duration    : _.isUndefined(param.duration) ? 400 : param.duration,

            startCurrent: _.isUndefined(param.startCurrent) ? null : param.startCurrent,
            interlocking: param.interlocking || false,

            // callback
            onOpen      : param.onOpen || null,
            onClose     : param.onClose || null,
            onClick     : param.onClick || null,
            onAnimateEnd: param.onAnimateEnd || null
        };


        this.$root = $(moduleRoot);
        this.$head = this.$root.find(this.opt.head);
        this.$body = this.$root.find(this.opt.body);

        this.currentIndex = _.isNull(this.opt.startCurrent) ? 0 : this.opt.startCurrent;

        this.$body.hide();

        if (this.opt.startCurrent !== null){
            this.$head.eq(this.opt.startCurrent)
                .addClass(this.opt.openedClass);

            this.$body.eq(this.opt.startCurrent)
                .addClass(this.opt.openedClass)
                .show();
        }

        // set event
        this.$head.on("click", function(){
            self.toggle(this);
            return false;
        });
    };


    /**
     * open body panel
     */
    Module.prototype.open = function(){
        this.$head.eq(this.currentIndex)
            .addClass(this.opt.openedClass);

        this.$body.eq(this.currentIndex)
            .addClass(this.opt.openedClass)
            .slideDown(this.opt.duration);

        doCallBack(this.opt.onOpen);
        return false;
    };


    /**
     * close body panel
     * @returns {boolean}
     */
    Module.prototype.close = function(){
        this.$head.eq(this.currentIndex)
            .removeClass(this.opt.openedClass);

        this.$body.eq(this.currentIndex)
            .removeClass(this.opt.openedClass)
            .slideUp(this.opt.duration);

        doCallBack(this.opt.onClose);

        return false;
    };

    Module.prototype.closeAll = function(){
        this.$head.removeClass(this.opt.openedClass);
        this.$body.removeClass(this.opt.openedClass).slideUp(this.opt.duration);
        doCallBack(this.opt.onClose);

        return false;
    };


    /**
     * toggle accordion
     * @returns {boolean}
     */
    Module.prototype.toggle = function(clickElement){

        if (clickElement == null){
            clickElement = null;
        }

        this.setCurrent(clickElement);

        doCallBack(this.opt.onClick);

        if (this.opt.interlocking){
            this.closeAll();
        }

        if ($(clickElement).hasClass(this.opt.openedClass)){
            this.close();
        } else {
            this.open();
        }

        return false;
    };


    /**
     * get current element index
     * @return {boolean} false
     */
    Module.prototype.setCurrent = function(clickElement){
        this.currentIndex = this.$head.index(clickElement);
        return false;
    };


    return Factory;
});