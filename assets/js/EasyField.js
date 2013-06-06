/**
 * EasyField: Easy Form Element styling.
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

function EasyField (container) {
    this.inputs = {
        button: [],
        textarea: [],
        select: [],
        input: []
    };

    if (container && typeof container != 'object') {
        throw 'Container must be an Object element.';
    }

    // if container is empty use body element
    this.container = container || document.body;

    var tags = ['input', 'textarea', 'select', 'button'];

    // !! Not sure if this is needed
    Node.prototype.getElementsByData = function(val) {
        var matches = [],
            elements = this.getElementsByTagName('*');

        for (var i = 0, len = elements.length; i < len; i++) {
            if (elements[i].getAttribute(val)) {
                matches.push(elements[i]);
            }
        }

        return matches;
    };

    // loop through DOM elements
    for (var i = tags.length; i--;) {
        var fields = this.container.getElementsByTagName(tags[i]);

        for (var x = fields.length; x--;) {
            var id = Math.floor(Math.random() * 1000000000);

            fields[x].setAttribute('data-id', id);

            // fields[x].style.display = 'none';

            var field = this.build(fields[x]);

            this.inputs[tags[i]].push(fields[x]);


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
    removeClass: function (element) {
        if (!element) {
            throw 'Atleast one elment must be provided.';
        }

        for (var i = 0, len = element.length; i < len; i++) {
            element[i].className = '';
        }
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
    if (input && typeof input != 'object') {
        throw 'Input must be an Object element.';
    }

    // input wrapper
    var efield = document.createElement('div');
        efield.className = 'easy-field '+input.type;
        efield.setAttribute('data-id', input.dataset.id);

    // text fields
    if (input.type === 'textarea' || input.type === 'text' || input.type === 'password') {
        efield.contentEditable = true;
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
                scope.utils.removeClass(li);

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

    return efield;
};