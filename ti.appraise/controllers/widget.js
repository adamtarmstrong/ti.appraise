/*
 * ratingRequired: 				BOOL
 * feedbackRequired:			BOOL
 * minRateRequiringFeedback:	INT 0-4.    0=feedback required for all ratings.  -1 disables the conditional feedback based on rating
 * allowCancel:					BOOL		(defaults to true)
 */

var args = arguments[0] || {};		Ti.API.info("Args: " + JSON.stringify(args));
if (typeof args.image !== 'undefined') {
	$.appicon.image = args.image;
} else {
	$.appicon.image = WPATH("transparent.png");
}

var submitCallback, cancelCallback, ratingRequired, feedbackRequired, minRateRequiringFeedback, allowCancel;
ratingRequired = ((typeof args.ratingRequired !== 'undefined') && (typeof args.ratingRequired === 'boolean')) ? args.ratingRequired : true;
feedbackRequired = ((typeof args.feedbackRequired !== 'undefined') && (typeof args.feedbackRequired === 'boolean')) ? args.feedbackRequired : true;
allowCancel = ((typeof args.allowCancel !== 'undefined') && (args.allowCancel === false)) ? false : true;
if ((typeof args.minRateRequiringFeedback !== 'undefined') && (typeof args.minRateRequiringFeedback === 'number') && (args.minRateRequiringFeedback >= 0) && (args.minRateRequiringFeedback <= 5)) {
	minRateRequiringFeedback = parseInt(args.minRateRequiringFeedback);
} else {
	minRateRequiringFeedback = -1;
}
submitCallback = args.submit || {};
cancelCallback = args.cancel || {};


var animation = require('/alloy/animation');
var starRating = 0;
var additionalFeedbackRequired = false;
var starRated = false;
var allRequirementsMet = false;
var feedbackTextEntered = false;
$.title.text = "Enjoying " + Ti.App.name + "?";

function setRequiredViews(){	Ti.API.info("Rate: " + ratingRequired + ", Feedback: " + feedbackRequired);
	if (feedbackRequired) {
		$.resetClass($.appicon, 'appiconHidden');
		$.resetClass($.feedbackView, 'feedbackViewVisible');
		$.feedbackText.focus(); 
	} else {
		$.resetClass($.appicon, 'appiconVisible');
		$.appicon.height = 60;	$.appicon.width = 60;
		$.resetClass($.feedbackView, 'feedbackViewHidden');
	}
	if (ratingRequired) {
		$.resetClass($.starView, 'starViewVisible');
		$.resetClass($.subtitle, 'subtitleRating');
	} else {
		$.resetClass($.starView, 'starViewHidden');
		$.resetClass($.subtitle, 'subtitleFeedback');
	}
	if (!allowCancel) {
		$.cancelButton.width = 0;
		$.buttonsDivider.width = 0;
	}
}

function show(){
	setRequiredViews();
	animation.fadeIn($.rateView,400);
	if (typeof args.image !== 'undefined') {
		$.appicon.image = args.image;
	} else {
		$.appicon.image = WPATH("transparent.png");
	}
}

function cancel(){
	cancelCallback();
	hide();
}
function submit(){
	if (allRequirementsMet) {
		var results = {};
		if (starRating > 0) {
			results.rating = starRating;
		}
		if ($.feedbackText.value.length > 0) {
			results.feedback = $.feedbackText.value;
		}
		//RATE Only & additional feedback NOT needed
		if (ratingRequired && starRated && !feedbackRequired && !additionalFeedbackRequired) {
			results.type = 'rate';
		//FEEDBACK Only
		} else if (feedbackRequired && !ratingRequired) {
			results.type = 'feedback';
		//BOTH
		} else {
			results.type = 'both';
		}
		submitCallback(results);
		hide();
	}
}

function hide(){
	$.feedbackText.blur();
	animation.fadeOut($.rateView,400);
	$.win.close();
}

function ratingOnlyDidNotMeetMinimumRequiredSetting(){		Ti.API.info("Rating ONLY - Does NOT Meet Min Req!");
	additionalFeedbackRequired = true;
	$.resetClass($.appicon, 'appiconHidden');
	$.resetClass($.feedbackView, 'feedbackViewVisible');
	checkRequirementsAndSetSubmitButton();
}

function ratingOnlyDidMeetMinimumRequiredSetting(){		Ti.API.info("Rating ONLY - Meets Min Req!");
	additionalFeedbackRequired = false;
	$.resetClass($.appicon, 'appiconVisible');
	$.resetClass($.feedbackView, 'feedbackViewHidden');
	$.feedbackText.blur();
	checkRequirementsAndSetSubmitButton();
}

function clickedOneStar(){
	starRating = 1;
	$.resetClass($.starFive, 'unStar');
	$.resetClass($.starFour, 'unStar');
	$.resetClass($.starThree, 'unStar');
	$.resetClass($.starTwo, 'unStar');
	$.resetClass($.starOne, 'selectedStar');
	starRated = true;
	if (ratingRequired && !feedbackRequired && minRateRequiringFeedback >= 1) {
		ratingOnlyDidNotMeetMinimumRequiredSetting();
	} else if (ratingRequired && !feedbackRequired && minRateRequiringFeedback < 1) {
		ratingOnlyDidMeetMinimumRequiredSetting();
	} else if (ratingRequired && feedbackRequired) {
		checkRequirementsAndSetSubmitButton();
	}
}
function clickedTwoStars(){
	starRating = 2;
	$.resetClass($.starFive, 'unStar');
	$.resetClass($.starFour, 'unStar');
	$.resetClass($.starThree, 'unStar');
	$.resetClass($.starOne, 'selectedStar');
	$.resetClass($.starTwo, 'selectedStar');
	starRated = true;
	if (ratingRequired && !feedbackRequired && minRateRequiringFeedback >= 2) {
		ratingOnlyDidNotMeetMinimumRequiredSetting();
	} else if (ratingRequired && !feedbackRequired && minRateRequiringFeedback < 2) {
		ratingOnlyDidMeetMinimumRequiredSetting();
	} else if (ratingRequired && feedbackRequired) {
		checkRequirementsAndSetSubmitButton();
	}
}
function clickedThreeStars(){
	starRating = 3;
	$.resetClass($.starFive, 'unStar');
	$.resetClass($.starFour, 'unStar');
	$.resetClass($.starOne, 'selectedStar');
	$.resetClass($.starTwo, 'selectedStar');
	$.resetClass($.starThree, 'selectedStar');
	starRated = true;
	if (ratingRequired && !feedbackRequired && minRateRequiringFeedback >= 3) {
		ratingOnlyDidNotMeetMinimumRequiredSetting();
	} else if (ratingRequired && !feedbackRequired && minRateRequiringFeedback < 3) {
		ratingOnlyDidMeetMinimumRequiredSetting();
	} else if (ratingRequired && feedbackRequired) {
		checkRequirementsAndSetSubmitButton();
	}
}
function clickedFourStars(){
	starRating = 4;
	$.resetClass($.starFive, 'unStar');
	$.resetClass($.starOne, 'selectedStar');
	$.resetClass($.starTwo, 'selectedStar');
	$.resetClass($.starThree, 'selectedStar');
	$.resetClass($.starFour, 'selectedStar');
	starRated = true;
	if (ratingRequired && !feedbackRequired && minRateRequiringFeedback >= 4) {
		ratingOnlyDidNotMeetMinimumRequiredSetting();
	} else if (ratingRequired && !feedbackRequired && minRateRequiringFeedback < 4) {
		ratingOnlyDidMeetMinimumRequiredSetting();
	} else if (ratingRequired && feedbackRequired) {
		checkRequirementsAndSetSubmitButton();
	}
}
function clickedFiveStars(){
	starRating = 5;
	$.resetClass($.starOne, 'selectedStar');
	$.resetClass($.starTwo, 'selectedStar');
	$.resetClass($.starThree, 'selectedStar');
	$.resetClass($.starFour, 'selectedStar');
	$.resetClass($.starFive, 'selectedStar');
	starRated = true;
	if (ratingRequired && !feedbackRequired && minRateRequiringFeedback >= 5) {
		ratingOnlyDidNotMeetMinimumRequiredSetting();
	} else if (ratingRequired && !feedbackRequired && minRateRequiringFeedback < 5) {
		ratingOnlyDidMeetMinimumRequiredSetting();
	} else if (ratingRequired && feedbackRequired) {
		checkRequirementsAndSetSubmitButton();
	}
}

function checkRequirementsAndSetSubmitButton(){		
	//RATE Only & additioanl feedback NEEDED
	if (ratingRequired && starRated && !feedbackRequired && additionalFeedbackRequired && $.feedbackText.value.length > 0) {
		enableSubmitButton(true);
	//RATE Only & additional feedback NOT needed
	} else if (ratingRequired && starRated && !feedbackRequired && !additionalFeedbackRequired) {
		enableSubmitButton(true);
	//FEEDBACK Only
	} else if (feedbackRequired && !ratingRequired && feedbackTextEntered) {
		enableSubmitButton(true);
	//BOTH
	} else if (ratingRequired && feedbackRequired && starRated && feedbackTextEntered) {
		enableSubmitButton(true);
	} else {
		enableSubmitButton(false);
	}
}

function enableSubmitButton(show){		Ti.API.info("Set SubmitButton to: " + show);
	if (show){
		allRequirementsMet = true;
		$.resetClass($.submitButton, 'submitButtonEnabled');
	} else {
		allRequirementsMet = false;
		$.resetClass($.submitButton, 'submitButtonDisabled');
	}
}

$.feedbackText.addEventListener('change', function(e){		Ti.API.info("ChangeEvent: " + JSON.stringify(e) + "\nValueLength: " + e.value.length);
	if (e.value.length < 1) {
		$.feedbackHelpText.visible = true;
		feedbackTextEntered = false;
	} else {
		$.feedbackHelpText.visible = false;
		feedbackTextEntered = true;
	}
	checkRequirementsAndSetSubmitButton();
});

$.feedbackText.addEventListener('return', function(e){
	submit();
});