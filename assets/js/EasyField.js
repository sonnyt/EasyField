/**
 * EasyField: Sexify input fields
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

function EasyField (container) {
    this.inputs = {
        button: [],
        textarea: [],
        select: [],
        input: []
    };

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

    for (var i = tags.length; i--;) {
        var fields = this.container.getElementsByTagName(tags[i]);

        for (var x = fields.length; x--;) {
            var id = Math.floor(Math.random() * 1000000000);

            fields[x].setAttribute('data-id', id);

            fields[x].style.display = 'none';

            var field = this.build(fields[x]);

            this.inputs[tags[i]].push(fields[x]);


            fields[x].parentNode.insertBefore(field, fields[x]);
        }
    }
}

/**
 * Refreshes all the dom elements by adding new ones
 */
EasyField.prototype.refresh = function() {
    console.log('test');
};

/**
 * Build DOM elements
 * @param  {Object} input Input object
 * @return {Object}       New built document object
 */
EasyField.prototype.build = function(input) {
    if (!input && typeof input != 'object') {
        return;
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
    if (input.type === 'textarea' || input.type === 'text') {
        efield.onkeyup = function () {
            input.value = efield.innerText;
        };
    }

    if (input.type === 'password') {
        efield.onkeyup = function () {
            input.value = efield.innerText;
            efield.value = input.value;
        };
    }

    return efield;
};