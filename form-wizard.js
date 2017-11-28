
(function ( $ ) {
	$.fn.formWizard = function( options ) {
		// Store the super parent scope to underscore
		var _ = this;

		// Default settings
		var settings = $.extend({
			require: true,
			validate: true,
			requireSuccessAlertMessage: 'Required field(s) completed!',
			requireFailAlertMessage: 'Fill out required field(s)!',
		}, options);

		// Private settings not ready for configuration
		var _settings = {
			inputError: '.has-warning',
			input: '.fw-field',
			buttonSubmit: '.fw-button',
			buttonOverlayTarget: '.fw-button-overlay',
			buttonBlockTarget: '.fw-button-block',
			successAlert: '.alert-success',
			failAlert: '.alert-warning',
			requireAlert: '.fw-require-alert',
		};

		// Initialize everything here
		$(function () {
			(function () {

				if (settings.hasOwnProperty('require')) {
					if (settings.require === true) Require.start();
				}

			}());
		});


		function classTrim(attrValue) {
			return attrValue.replace('.', '');
		}

		/*
		 * Requiring selected fields to enable submit button
		 */
		var Require = (function () {
			// Useful to overpass scope restriction
			var self = this;

			// Limit validation/event watch to button submit first then do others
			var isFailSubmit = false;

			// Changes the submit button structure
			var _buildButton = function () {
				// Detach the button submit
				var button = _.find(_settings.buttonSubmit).detach();
				var overlay = `<div class="${ classTrim(_settings.buttonOverlayTarget) }"></div>`;

				// Checks if button block exists for this method reusability
				if (_.find('div').hasClass(classTrim(_settings.buttonBlockTarget))) {
					_.find(_settings.buttonBlockTarget).remove();
				}

				// Put the div button block
				_.append(`<div class="${ classTrim(_settings.buttonBlockTarget) }"></div>`);

				// Insert the button to div button block
				_.find(_settings.buttonBlockTarget).append(overlay).append(button);
				_.find(_settings.buttonSubmit).attr('disabled', 'disabled');

				// Call attach event after building button
				_attachEvent();
			};

			// Adds event listener to the submit button
			var _attachEvent = function () {
				// Button event
				_.find(_settings.buttonOverlayTarget).on('click', function () {
					self.isFailSubmit = true;
					// Fire watchEvent
					_watchEvent();
				});

				// Field event
				_.find(_settings.input).on('keyup', function () {
					// Fire watchEvent
					_watchEvent();
				});
			};

			// Updates the elements
			var _watchEvent = function () {
				var count = 0;

				_.find(_settings.input).each(function(index, el) {

					// Increment if element given is not empty
					if ($(this).val() !== '') {
						count++;
					}

				});

				// Count input, select and textarea required for the button limitation
				var fieldQty = _.find(_settings.input).length;

				// Check if given field qty is equal to field qty with value
				if (fieldQty == count) {
					_.find(_settings.buttonSubmit).removeAttr('disabled');

					// Remove overlay element for button submit
					_.find(_settings.buttonOverlayTarget).remove();
				} else {
					_.find(_settings.buttonSubmit).attr('disabled', 'disabled');

					// Rebuild button if button overlay is removed
					_buildButton();
				}

				// Checks if tried to submit
				if (self.isFailSubmit) {

					// flag variable for input error
					var isSomethingWrong = false;

					// Updates the fields
					_.find(_settings.input).each(function(index, el) {

						// Apply style for required fields
						if ($(this).val() === '') {
							$(this).parent().addClass(classTrim(_settings.inputError));
							isSomethingWrong = true;
						} else {
							$(this).parent().removeClass(classTrim(_settings.inputError));
						}
					});

					// Remove existing alert component inside of root if there's any
					_.find(_settings.requireAlert).remove();

					// If isSomethingwrong set to true during the each loop
					if (isSomethingWrong) {

						var fwAlert = `
							<div class="alert ${ classTrim(_settings.failAlert) } ${ classTrim(_settings.requireAlert) } alert-dismissible" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
								${ settings.requireFailAlertMessage }
							</div>
						`;

						// Insert as first child of root element
						_.prepend(fwAlert);

						// Reset the value to false to revalidate
						isSomethingWrong = false;

					} else {

						var fwAlert = `
							<div class="alert ${ classTrim(_settings.successAlert) } ${ classTrim(_settings.requireAlert) } alert-dismissible" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
								${ settings.requireSuccessAlertMessage }
							</div>
						`;

						// Insert as first child of root element
						_.prepend(fwAlert);

					}
				}
			};

			return {
				// Initiates the necessary methods
				start: function () {
					_buildButton();
				},
			};
		})();
	};
}(jQuery));
