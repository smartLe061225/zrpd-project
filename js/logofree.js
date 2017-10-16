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
					$.loadMaterial();
				}
			})
		});
		return false;
	});
}

// 第二步：展示模板
$.loadMaterial = function(){
    var _DOM = '.js-filter-logo';
    $.progress(2);

    $.post(listUrl, $.svgParams, function(json){
        // 生成模板列表
        $('.selectLogoList', _DOM).empty();
        if (json.length) {
            $(json).each(function(){
                $('.selectLogoList', _DOM).append('<li data-id="'+this.id+'"><i class="icon-select"></i><img src="'+ BaseUrl + '/openapi/logo/materialPreview?material_id='+this.id+'&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text +'" alt=""></li>')
            });
        } else {
            $('.selectLogoList', _DOM).html('<div class="notfound">暂无相关图形</div>');
        }
        // 点击列表，显示VI图
        $('li', _DOM).on('click', function(){
            var id = $(this).data('id');
            $(this).addClass('active').siblings('li').removeClass('active');

            $.svgParams.material_id = id;
            var url = BaseUrl + '/openapi/logo/materialPreview?material_id='+id+'&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text;
            $.post(logoTplUrl, {logourl: url}, function(html){
                $('.logoApplicationList').html(html.tpl);
            });
        });
    },'json');
}

$(function(){
	$.svgParams = new Object();
	$.loadForm();
})