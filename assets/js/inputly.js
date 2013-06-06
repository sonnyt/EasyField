function Inputly () {
    this.inputs = {
        button: [],
        textarea: [],
        select: [],
        input: []
    };

    var body = document.body,
        tags = ['input', 'textarea', 'select', 'button'];

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
        var fields = body.getElementsByTagName(tags[i]);

        for (var x = fields.length; x--;) {
            var id = Math.floor(Math.random() * 1000000000);

            fields[x].setAttribute('data-id', id);

            var inputly = this.build(fields[x]);

            this.inputs[tags[i]].push(fields[x]);

            document.body.insertBefore(inputly, fields[x]);
        }
    }
}

Inputly.prototype.refresh = function() {
    console.log('test');
};

/**
 * Build DOM elements
 * @param  {Object} input Input object
 * @return {Object}       New built document object
 */
Inputly.prototype.build = function(input) {
    if (!input && typeof input != 'object') {
        return;
    }

    // input wrapper
    var inputly = document.createElement('div');
        inputly.className = 'inputly';
        inputly.setAttribute('data-id', input.dataset.id);
        inputly.className += ' '+input.type;

    // textarea and textbox
    if (input.type === 'textarea' || input.type === 'text' || input.type === 'password') {
        inputly.contentEditable = true;
    }

    if (input.type === 'password') {
        // var css = {
        //     '-webkit-text-security': 'disc',
        //        '-moz-text-security': 'disc',
        //          '-o-text-security': 'disc',
        //             'text-security': 'disc'
        // };

        inputly.style.webkitTextSecurity = 'disc';
        inputly.style.mozTextSecurity = 'disc';
        inputly.style.OTextSecurity = 'disc';
        inputly.style.msTextSecurity = 'disc';
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
        inputly.appendChild(span);
        inputly.appendChild(ul);
    }

    inputly = this.addEvent(input, inputly);

    return inputly;
};

/**
 * Add events
 * @param  {Object} input   Input object
 * @param  {Object} inputly Built input object
 * @return {Object}         Built input object with event handler
 */
Inputly.prototype.addEvent = function(input, inputly) {
    if (input.type === 'textarea' || input.type === 'text') {
        inputly.onkeyup = function () {
            input.value = inputly.innerText;
        };
    }

    if (input.type === 'password') {
        inputly.onkeyup = function () {
            input.value = inputly.innerText;
            inputly.value = input.value;
        };
    }

    return inputly;
};