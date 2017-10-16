// 1. step bar progress
$.progress = function(step) {
    $('.js-step-bar').addClass('step'+step);
    $('.Step1,.Step2,.Step3,.Step4').hide();
    $('.Step'+step).show();
}

// 第一步：表单验证
$.loadForm = function(){
	$.progress(1);
}



$.fn.ready(function(){
	$.loadForm();
})