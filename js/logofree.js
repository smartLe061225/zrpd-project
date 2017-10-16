// 1. step bar progress
$.progress = function(step) {
    $('.js-step-bar').addClass('step'+step);
    $('.Step1,.Step2,.Step3,.Step4').hide();
    $('.Step'+step).show();
}

// 第一步：表单验证
$.loadForm = function(){
	$.progress(1);

	var checkFormObj = $('.js-logo-form');
	checkFormObj.off('submit').on('submit', function(){
		seajs.use(['/js/plugin/validform/Validform_v5.3.2_min.js'], function(){
			$('.js-logo-form').Validform({
				callback: function(){
					$.svgParams = {
						name: {text:$('[name=name]').val()},
						slogan: {text:$('[name=slogan]').val()},
						trade: $('[name=trade]').val()
					}
				}
			})
		});
		return false;
	});
}

$(function(){
	$.svgParams = new Object();
	$.loadForm();
})