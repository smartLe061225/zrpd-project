// 1. step bar progress
$.progress = function(step) {
    var stepBar = $('.js-step-bar'),
        stepBarOn = 'js-step-bar stepList step' + step;
    stepBar.attr('class',stepBarOn);

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
                        trade: $('[name=trade]').val(),
                        atext: {text:''}
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

    // 默认VI图
    var url = BaseUrl + '/openapi/logo/materialPreview?material_id=378&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text;
    $.post(defaultLogoTplUrl, {logourl: url}, function(html){
        $('.logoApplicationList').html(html.tpl);
    });

    // feature - 第二步：下一步
    $('.js-go-step3').off('click').on('click', function(){
        if ($.svgParams.material_id) {
            $.loadEditor();
        } else {
            alert('请选择一个图形');
            return;
        }
    });

    $('.js-refresh', _DOM).off('click').on('click', function(){
        $.loadMaterial();
    });

    // feature - 第二步：当筛选条件改变时，触发
    $('.Filter .Moption').off('click').on('click', function(){
        $.svgParams.trade = $('.Filter [name=trade]').val();
        $.svgParams.shape = $('.Filter [name=shape]').val();
        $.svgParams.alpha = $('.Filter [name=alpha]').val();
        $.svgParams.numeric = $('.Filter [name=numeric]').val();
        $.svgParams.element = $('.Filter [name=element]').val();
        $.loadMaterial();
    });
}

// 第三步：编辑Logo
$.loadEditor = function(){
    // if (!$.login()) {
    //     return;
    // }
    $.post(svgUrl, $.svgParams, function(ret){
        $('.js-svg-editor').html(ret.svg);
        $.svgEditor('svg-draw', $.svgParams);
    });

    $.progress(3);
}

$(function(){
    $.svgParams = new Object();
    $.loadForm();
})