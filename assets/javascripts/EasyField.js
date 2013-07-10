/**
 * EasyField: Easy Form Element styling.
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

function EasyField (container) {
    // All Fields
    var _allFields = {
        button: [],
        textarea: [],
        select: [],
        input: []
    };

    // make sure container is an object
    if (container && typeof container !== 'object') {
        throw 'Container must be an Object element.';
    }

    // if container is empty use body element
    container = container || document.body;

    /**
     * Utility functions used accross
     * @type {Object}
     */
    var _utils = {
        /**
         * Remove class of an element
         * @param  {Object} element One or more elements
         */
        removeClass: function (element, className) {
            if (!element) {
                throw 'Atleast one elment must be provided.';
            }

            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');

            if (element.length) {
                for (var i = 0, len = element.length; i < len; i++) {
                    if (element[i].className) {
                        element[i].className = element[i].className.replace(reg, '');
                    }
                }
            } else {
                element.className = element.className.replace(reg, '');
            }
        },

        /**
         * Check if element has class
         * @param  {Object} element One or more elements
         * @return {Boolean}        True if element does have class, false if it doesn't
         */
        hasClass: function (element, className) {
            return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
        }
    };

    /**
     * Add events
     * @param  {Object} input   Input object
     * @param  {Object} efield  Built input object
     * @return {Object}         Built input object with event handler
     */
    var _addEvent = function(input, efield) {
        // text field events
        if (input.type === 'textarea' || input.type === 'text') {
            efield.onkeyup = function () {
                input.value = this.innerText;
                this.value = this.innerText;
            };

            efield.onfocus = function () {
                for (var i = this.children.length; i--;) {
                    if (this.children[i].className === 'placeholder') {
                        this.removeChild(this.children[i]);
                    }
                }
            };

            efield.onblur = function () {
                if (!this.innerText || this.innerHTML === '<br>') {
                    this.innerHTML = '<span class="placeholder">'+ input.placeholder +'</span>';
                }
            };
        }

        // password field event
        if (input.type === 'password') {
            efield.onkeyup = function () {
                input.value = this.innerText;
            };
        }

        // selectbox event
        if (input.type === 'select-one') {
            efield.onclick = function (e) {
                if (e.target.tagName.toLowerCase() === 'li') {
                    var li = this.getElementsByTagName('li');

                    _utils.removeClass(li, 'selected');

                    if(_utils.hasClass(li, 'selected')) {
                        return;
                    }

                    e.target.className = 'selected';

                    this.getElementsByTagName('span')[0].innerHTML = e.target.innerHTML;

                    for (var i = input.options.length; i--;) {
                        if (input.options[i].value === e.target.dataset.value) {
                            input.selectedIndex = i;

                            break;
                        }
                    }
                }
            };
        }

        // readio button events
        if (input.type === 'radio') {
            efield.onclick = function () {
                if (input.checked) {
                    return;
                }

                var sibling = all_fields.input.filter(function (field) {
                    return field[0].type === 'radio' && field[1].dataset.name === efield.dataset.name && field[0].form === input.form;
                });

                for (var i = 0, len = sibling.length; i < len; i++) {
                    _utils.removeClass(sibling[i][1], 'selected');
                }

                this.className += ' selected';

                input.checked = true;
            };
        }

        // checkbox event
        if (input.type === 'checkbox') {
            efield.onclick = function () {
                if (input.checked) {
                    _utils.removeClass(efield, 'selected');

                    input.checked = false;
                } else {
                    efield.className += ' selected';
                    input.checked = true;
                }
            };
        }

        return efield;
    };


    /**
     * Build DOM elements
     * @param  {Object} input Input object
     * @return {Object}       New built document object
     */
    this.buildElement = function(input) {
        if (input && typeof input !== 'object') {
            throw 'Input must be an Object element.';
        }

        // input wrapper
        var _efield = document.createElement('div');
            _efield.className = 'easy-field '+ input.type +' '+ input.className;
            _efield.setAttribute('data-id', input.dataset.id);
            _efield.setAttribute('data-name', input.name);

        // text fields
        if (input.type === 'textarea' || input.type === 'text' || input.type === 'password') {
            _efield.contentEditable = true;
            _efield.innerHTML = input.value || '<span class="placeholder">'+ input.placeholder +'</span>';
        }

        // !! There should be a better alternative
        if (input.type === 'password') {
            _efield.style.webkitTextSecurity = 'disc';
            _efield.style.mozTextSecurity = 'disc';
            _efield.style.OTextSecurity = 'disc';
            _efield.style.msTextSecurity = 'disc';
        }

        // select box
        if (input.type === 'select-one') {
            var _ul = document.createElement('ul'),
                _span = null;

            // loop through options
            for (var i = 0, len = input.options.length; i < len; i++) {
                var _option = input.options[i],
                    _li = document.createElement('li');

                    _li.innerHTML = _option.innerHTML;
                    _li.setAttribute('data-value', _option.value);

                // if option selected
                if (_option.selected) {
                    span = document.createElement('span');
                    span.innerHTML = _option.innerHTML;

                    _li.className = 'selected';
                }

                _ul.appendChild(_li);
            }

            // Append to the wrapper
            _efield.appendChild(_span);
            _efield.appendChild(_ul);
        }

        // input is checked
        if (input.checked) {
            _efield.className += ' selected';
        }

        _efield = _addEvent(input, _efield);

        return _efield;
    };

    /**
     * Refreshes all the dom elements by adding new ones
     */
    this.refreshElements = function () {

    };

    // input tags
    var _tags = ['input', 'textarea', 'select', 'button'];

    // loop through DOM elements
    for (var i = _tags.length; i--;) {
        var _fields = container.getElementsByTagName(_tags[i]);

        for (var x = _fields.length; x--;) {
            var id = Math.floor(Math.random() * 1000000000);

            _fields[x].setAttribute('data-id', id);

            // hide
            _fields[x].style.position = 'absolute';
            _fields[x].style.visibility = 'hidden';

            var _field = this.buildElement(_fields[x]);

            _allFields[_tags[i]].push(new Array(_fields[x], _field));

            _fields[x].parentNode.insertBefore(_field, _fields[x]);
        }
    }
}