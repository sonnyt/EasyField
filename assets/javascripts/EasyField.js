/**
 * EasyField: Easy Form Element styling.
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

function EasyField (container) {
    this.fields = {
        button: [],
        textarea: [],
        select: [],
        input: []
    };

    if (container && typeof container !== 'object') {
        throw 'Container must be an Object element.';
    }

    // if container is empty use body element
    this.container = container || document.body;

    var tags = ['input', 'textarea', 'select', 'button'];

    // loop through DOM elements
    for (var i = tags.length; i--;) {
        var fields = this.container.getElementsByTagName(tags[i]);

        for (var x = fields.length; x--;) {
            var id = Math.floor(Math.random() * 1000000000);

            fields[x].setAttribute('data-id', id);

            fields[x].style.display = 'none';

            var field = this.build(fields[x]);

            this.fields[tags[i]].push(new Array(fields[x], field));


            fields[x].parentNode.insertBefore(field, fields[x]);
        }
    }
}

/**
 * Utility functions used accross
 * @type {Object}
 */
EasyField.prototype.utils = {
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
 * Refreshes all the dom elements by adding new ones
 */
EasyField.prototype.refresh = function() {

};

/**
 * Build DOM elements
 * @param  {Object} input Input object
 * @return {Object}       New built document object
 */
EasyField.prototype.build = function(input) {
    if (input && typeof input !== 'object') {
        throw 'Input must be an Object element.';
    }

    // input wrapper
    var efield = document.createElement('div');
        efield.className = 'easy-field '+input.type;
        efield.setAttribute('data-id', input.dataset.id);
        efield.setAttribute('data-name', input.name);

    // text fields
    if (input.type === 'textarea' || input.type === 'text' || input.type === 'password') {
        efield.contentEditable = true;
        efield.innerHTML = input.value || '<span class="placeholder">'+ input.placeholder +'</span>';
    }

    // !! There should be a better alternative
    if (input.type === 'password') {
        efield.style.webkitTextSecurity = 'disc';
        efield.style.mozTextSecurity = 'disc';
        efield.style.OTextSecurity = 'disc';
        efield.style.msTextSecurity = 'disc';
    }

    // select box
    if (input.type === 'select-one') {
        var ul = document.createElement('ul'),
            span = null;

        // loop through options
        for (var i = 0, len = input.options.length; i < len; i++) {
            var option = input.options[i],
                li = document.createElement('li');

                li.innerHTML = option.innerHTML;
                li.setAttribute('data-value', option.value);

            // if option selected
            if (option.selected) {
                span = document.createElement('span');
                span.innerHTML = option.innerHTML;

                li.className = 'selected';
            }

            ul.appendChild(li);
        }

        // Append to the wrapper
        efield.appendChild(span);
        efield.appendChild(ul);
    }

    // input is checked
    if (input.checked) {
        efield.className += ' selected';
    }

    efield = this.addEvent(input, efield);

    return efield;
};

/**
 * Add events
 * @param  {Object} input   Input object
 * @param  {Object} efield  Built input object
 * @return {Object}         Built input object with event handler
 */
EasyField.prototype.addEvent = function(input, efield) {
    var scope = this;

    // text field event
    if (input.type === 'textarea' || input.type === 'text') {
        efield.onkeyup = function () {
            input.value = this.innerText;
            this.value = this.innerText;
        };

        efield.onfocus = function () {
            for (var i = 0, len = this.children.length; i < len; i++) {
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

                scope.utils.removeClass(li, 'selected');

                if(scope.utils.hasClass(li, 'selected')) {
                    return;
                }

                e.target.className = 'selected';

                this.getElementsByTagName('span')[0].innerHTML = e.target.innerHTML;

                for (var i = 0, len = input.options.length; i < len; i++) {
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

            var sibling = scope.fields.input.filter(function (field) {
                return field[0].type === 'radio' && field[1].dataset.name === efield.dataset.name && field[0].form === input.form;
            });

            for (var i = 0, len = sibling.length; i < len; i++) {
                scope.utils.removeClass(sibling[i][1], 'selected');
            }

            this.className += ' selected';

            input.checked = true;
        };
    }

    // checkbox event
    if (input.type === 'checkbox') {
        efield.onclick = function () {
            if (input.checked) {
                scope.utils.removeClass(efield, 'selected');

                input.checked = false;
            } else {
                efield.className += ' selected';
                input.checked = true;
            }
        };
    }

    return efield;
};