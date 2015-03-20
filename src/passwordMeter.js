/**
 * passwordMeter add-on
 *
 * @link        http://formvalidation.io/addons/passwordMeter/
 * @author      https://twitter.com/nghuuphuoc
 * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
(function($) {
    FormValidation.Validator.passwordMeter = {
        validate: function(validator, $field, options) {
            var score = 0,
                value = validator.getFieldValue($field, 'passwordMeter');

            if (value === '') {
                return {
                    valid: true,
                    score: null
                };
            }

            // Check the password strength
            score += ((value.length >= 8) ? 1 : -1);

            // The password contains uppercase character
            if (/[A-Z]/.test(value)) {
                score += 1;
            }

            // The password contains uppercase character
            if (/[a-z]/.test(value)) {
                score += 1;
            }

            // The password contains number
            if (/[0-9]/.test(value)) {
                score += 1;
            }

            // The password contains special characters
            if (/[!#$%&^~*_]/.test(value)) {
                score += 1;
            }

            return {
                valid: true,
                score: score    // We will get the score later
            };
        }
    };

    FormValidation.AddOn.passwordMeter = {
        html5Attributes: {
        },

        BAR_CLASS: {
            bootstrap: {
                'default': 'progress-bar',
                veryWeak: 'progress-bar progress-bar-danger',
                weak: 'progress-bar progress-bar-warning',
                medium: 'progress-bar progress-bar-info',
                strong: 'progress-bar progress-bar-success'
            },
            uikit: {
                'default': 'uk-progress',
                veryWeak: 'uk-progress uk-progress-danger',
                weak: 'uk-progress uk-progress-warning',
                medium: 'uk-progress uk-progress-success',
                strong: 'uk-progress uk-progress-success'
            }
        },

        _createMeterElement: function(validator, options) {
            var framework = validator.getOptions().framework || validator.getForm().attr('data-fv-framework'),
                template;
            switch (framework) {
                // http://foundation.zurb.com/docs/components/progress_bars.html
                case 'foundation':
                    template = '<div class="progress fv-addon-passwordmeter"><span class="meter fv-addon-passwordmeter-bar"></span></div>';
                    break;

                // http://semantic-ui.com/modules/progress.html
                case 'semantic':
                    template = '<div class="ui progress fv-addon-passwordmeter"><div class="bar"><div class="progress fv-addon-passwordmeter-bar"></div></div></div>';
                    break;

                // http://getuikit.com/docs/progress.html
                case 'uikit':
                    template = '<div class="uk-progress fv-addon-passwordmeter"><div class="uk-progress-bar fv-addon-passwordmeter-bar"></div></div>';
                    break;

                case 'bootstrap':
                default:
                    template = '<div class="progress fv-addon-passwordmeter"><div class="progress-bar fv-addon-passwordmeter-bar"></div></div>';
                    break;
            }

            var $element = $(template);
            options.container
                ? $element.appendTo($(options.container))
                : $element.insertAfter(validator.getFieldElements(options.field));

            $element.data('bar', $element.find('.fv-addon-passwordmeter-bar'));
            return $element;
        },

        /**
         * @param {FormValidation.Base} validator The validator instance
         * @param {Object} options The add-on options
         */
        init: function(validator, options) {
            var $element  = this._createMeterElement(validator, options),
                $bar      = $element.data('bar'),
                opts      = validator.getOptions(),
                framework = opts.framework || validator.getForm().attr('data-fv-framework');

            validator.addField(options.field, {
                validators: {
                    passwordMeter: {
                    }
                }
            });

            var that = this;
            validator
                .getForm()
                .on(opts.events.validatorSuccess, function(e, data) {
                    if (data.field === options.field && data.validator === 'passwordMeter') {
                        // Get the score
                        var score = data.result.score;

                        $bar.removeClass().addClass('fv-addon-passwordmeter-bar');
                        switch (true) {
                            case (score === null):
                                $bar.html('').css('width', '0%').addClass(that.BAR_CLASS[framework]['default']);
                                break;

                            case (score <= 0):
                                $bar.html('Very weak').css('width', '25%').addClass(that.BAR_CLASS[framework]['veryWeak']);
                                break;

                            case (score > 0 && score <= 2):
                                $bar.html('Weak').css('width', '50%').addClass(that.BAR_CLASS[framework]['weak']);
                                break;

                            case (score > 2 && score <= 4):
                                $bar.html('Medium').css('width', '75%').addClass(that.BAR_CLASS[framework]['medium']);
                                break;

                            case (score > 4):
                                $bar.html('Strong').css('width', '100%').addClass(that.BAR_CLASS[framework]['strong']);
                                break;

                            default:
                                break;
                        }
                    }
                });
        }
    };
}(jQuery));
