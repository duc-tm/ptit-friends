function validator(formSelector, ajaxFormSubmit) {
    const formElement = document.querySelector(formSelector);

    let validateFunctions = {
        required: function (targetValue) {
            return targetValue.trim() ? undefined : 'Field is required';
        },
        email: function (targetValue) {
            const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(targetValue) ? undefined : 'Please type valid email';
        },
        min: function (min) {
            return function (targetValue) {
                min = Number(min);
                return targetValue.length >= min
                    ? undefined
                    : `At least ${min} characters`;
            };
        },
        password: function (targetValue) {
            const regex = /^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u;
            return regex.test(targetValue)
                ? undefined
                : 'Combine lowercase, uppercase letters and number';
        },
        match: function (field) {
            return function (targetValue) {
                const fieldValue = document.querySelector(`#${field}`).value;
                return targetValue === fieldValue
                    ? undefined
                    : `This field must match password field`;
            };
        },
    };

    // Contain validate function
    const formRuleCheckers = {};

    if (formElement) {
        const inputElements = formElement.querySelectorAll('[name][rules]');

        for (inputElement of inputElements) {
            // Seperate rules
            const rules = inputElement.getAttribute('rules').split('|');

            for (const rule of rules) {
                if (!Array.isArray(formRuleCheckers[inputElement.name])) {
                    formRuleCheckers[inputElement.name] = [];
                }

                let ruleChecker = validateFunctions[rule];

                // seperate rule and rule's value if present
                if (rule.includes(':')) {
                    const ruleInfo = rule.split(':');
                    ruleChecker = validateFunctions[ruleInfo[0]](ruleInfo[1]);
                }

                formRuleCheckers[inputElement.name].push(ruleChecker);
            }

            inputElement.onblur = handleValidate;
            inputElement.oninput = handleClearError;
        }

        function handleValidate(event) {
            const eventTarget = event.target;
            const ruleCheckers = formRuleCheckers[eventTarget.name];
            let message;

            for (const ruleChecker of ruleCheckers) {
                message = ruleChecker(eventTarget.value);
                if (message) {
                    addError(eventTarget, message);
                    break;
                }
            }

            return !message;
        }


        function handleClearError(event) {
            const eventTarget = event.target;
            const messageElement = document.querySelector(`.form-message[for=${eventTarget.name}]`);

            if (messageElement) {
                messageElement.classList.remove('error-msg');
                messageElement.innerText = '';
            }
        }

        function addError(target, message) {
            const messageElement = document.querySelector(`.form-message[for=${target.name}]`);

            if (messageElement) {
                messageElement.classList.add('error-msg');
                messageElement.innerText = message;
            }
        }

        // Handle default submit/ajax
        formElement.onsubmit = function (event) {
            event.preventDefault();

            let isValid = true;

            for (const inputElement of inputElements) {
                if (!handleValidate({ target: inputElement })) {
                    isValid = false;
                }
            }

            if (isValid) {
                register();
            }
        }
    }
}
