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

    // load trade
    $.post(ajaxTradeUrl, function(json){
    	var result = JSON.parse(json).data;
    	var html = '';
    	if (result.length) {
    		$(result).each(function(){
                html += '<span class="Moption" value="'+ this.id +'">'+ this.tradeCategory +'</span>';
            });
    	}else{
    		html = '暂无数据'
    	}
    	$('.js-ajax-trade').find('.mCSB_container').html(html)
    })

    var checkFormObj = $('.js-logo-form');
    checkFormObj.off('submit').on('submit', function(){
    	var inputName = $('.js-input-name')
        if (inputName.val()) {
            $.svgParams = {
                name: {text:$('[name=name]').val()},
                slogan: {text:$('[name=slogan]').val()},
                trade: $('[name=trade]').val(),
                atext: {text:''}
            }
            $.loadMaterial();
            inputName.removeClass('Validform_error')
        }else{
            inputName.focus().addClass('Validform_error')
    	}
        // seajs.use(['/js/plugin/validform/Validform_v5.3.2_min.js'], function(){
        //     $('.js-logo-form').Validform({
        //         callback: function(){
        //             $.svgParams = {
        //                 name: {text:$('[name=name]').val()},
        //                 slogan: {text:$('[name=slogan]').val()},
        //                 trade: $('[name=trade]').val(),
        //                 atext: {text:''}
        //             }
        //             $.loadMaterial();
        //         }
        //     })
        // });
        return false;
    });
    $('.js-input-name').off('blur').on('blur',function(){
    	var $this = $(this);
    	if ($this.val()) {
    		$this.removeClass('Validform_error')
        }else{
            $this.addClass('Validform_error')
        }
    })
}

// 第二步：展示模板
$.loadMaterial = function(){
    var _DOM = '.js-filter-logo';
    $.progress(2);

    // 筛选条件
    $.post(ajaxFilterUrl, function(json){
        var result = JSON.parse(json);
        var shapeDOM = '',
        	alphaDOM = '',
        	numericDOM = '',
        	elementDOM = '';
        // 形状
        if (result.shape.length) {
        	$(result.shape).each(function(){
                shapeDOM += '<span class="Moption" value="'+ this.id +'">'+this.name+'</span>'
            });
        }else{
        	shapeDOM = '暂无形状';
        }
        // 字母
        if (result.alpha.length) {
            $(result.alpha).each(function(){
                alphaDOM += '<span class="Moption" value="'+ this.id +'">'+this.name+'</span>'
            });
        }else{
            alphaDOM = '暂无字母';
        }
        // 数字
        if (result.numeric.length) {
            $(result.numeric).each(function(){
                numericDOM += '<span class="Moption" value="'+ this.id +'">'+this.name+'</span>'
            });
        }else{
            numericDOM = '暂无数字';
        }
        // 元素
        if (result.element.length) {
            $(result.element).each(function(){
                elementDOM += '<span class="Moption" value="'+ this.id +'">'+this.name+'</span>'
            });
        }else{
            elementDOM = '暂无元素';
        }
        $('.js-ajax-shape').find('.mCSB_container').html(shapeDOM)        
        $('.js-ajax-alpha').find('.mCSB_container').html(alphaDOM)
        $('.js-ajax-numeric').find('.mCSB_container').html(numericDOM)
        $('.js-ajax-element').find('.mCSB_container').html(elementDOM)
    })

    // logo列表
    $.svgParams.pageSize = 5;
    $.post(listUrl, $.svgParams, function(json){
        // 生成模板列表
        $('.selectLogoList', _DOM).empty();
        var result = JSON.parse(json).data;
        if (result.length) {
            $(result).each(function(){
                $('.selectLogoList', _DOM).append('<li data-id="'+this.id+'"><i class="icon-select"></i><img src="'+ svgLogoUrl + '?material_id=' + this.id +'&name='+ $.svgParams.name.text +'&slogan='+ $.svgParams.slogan.text +'" alt=""></li>')
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
        $.svgParams.trade = $('[name=trade]').val();
        $.svgParams.shape = $('.Filter [name=shape]').val();
        $.svgParams.alpha = $('.Filter [name=alpha]').val();
        $.svgParams.numeric = $('.Filter [name=numeric]').val();
        $.svgParams.element = $('.Filter [name=element]').val();
        $.loadMaterial();
    });
}

// 第三步：编辑Logo
$.loadEditor = function(){
    if (!$.login()) {
        return;
    }
    $.post(svgUrl, $.svgParams, function(ret){
    	console.log('a:'+ret)
        $('.js-svg-editor').html(ret.svg);
        $.svgEditor('svg-draw', $.svgParams);

        $('.js-checkout-logo').off('click').on('click', function(){
            $('#svg-ghost').empty();
            var svg = $('.js-svg-editor').html();
            $.checkout(svg);
        });
    });

    $.progress(3);
}

// checkout log

$.checkout = function(svg){
    window.stop();
    $.progress(4);
    $.svgParams.svg = svg;
    $.post(checkoutUrl, $.svgParams, function(json){
        $('.js-svg-preview').html(json.svg);
        $.svgParams.svg = json.svg;

        $('.js-free-download').off('click').on('click', function(){
            $.save($.svgParams);
        });

        $('.js-logo-order').off('click').on('click', function(){
            $.placeOrder($.svgParams);
        });

    }, 'json');
}

// login check
$.login = function() {
	var a
	$.post('http://192.168.1.112:8080/logo/checkLogin',function(res){
		a = res;
	})
    // return a ? !0 : ($.get("/openapi/passport/fast_login", function(a) {
    //     $("body").append(a),
    //     $(".nav-line li").on("click", function() {
    //         switch ($(this).siblings().removeClass("active"), $(this).addClass("active"), $(this).index()) {
    //         case 0:
    //             $(".form-register").hide(),
    //             $(".form-login").show();
    //             break;
    //         case 1:
    //             $(".form-register").show(),
    //             $(".form-login").hide()
    //         }
    //     }),
    //     $.bindLoginForm(".sep-fast-passport .form-login"),
    //     $.bindRegisterForm(".sep-fast-passport .form-register"),
    //     $(".sep-fast-passport-close").on("click", function() {
    //         $(".sep-fast-passport").remove()
    //     })
    // }), !1)
}

$(function(){
    $.svgParams = new Object();
    $.loadForm();
})