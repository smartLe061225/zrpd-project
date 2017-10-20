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
    $('.selectLogoList', _DOM).empty()

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
        // feature - 第二步：当筛选条件改变时，触发
	    $('.Filter .Moption').off('click').on('click', function(){
            $.svgParams.trade = $('[name=trade]').val();
            $.svgParams.shape = $('.Filter [name=shape]').val();
            $.svgParams.alpha = $('.Filter [name=alpha]').val();
            $.svgParams.numeric = $('.Filter [name=numeric]').val();
            $.svgParams.element = $('.Filter [name=element]').val();
            $.loadMaterial();
        });
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
            //$('.selectLogoList li').eq(0).trigger('click');
        } else {
            $('.selectLogoList', _DOM).html('<div class="notfound">暂无相关图形</div>');
        }
        // 点击列表，显示VI图
        $('li', _DOM).on('click', function(){
            var id = $(this).data('id');
            $(this).addClass('active').siblings('li').removeClass('active');

            $.svgParams.material_id = id;

            var url = svgLogoUrl + '?material_id='+id+'&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text;
            $.post(svgViUrl, {logoUrl: url, logoId: id}, function(html){
            	var result = html.data;
            	var tpl = '';
            	if (result.length) {
            		$(result).each(function(){
            			tpl += this.img_path
            		})
            	}else{
            		tpl = "sorry..."
            	}
                $('.logoApplicationList').html(tpl);
            });
        });
    },'json');

    // 默认VI图
    var url = svgLogoUrl + '?material_id=888&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text;
    $.post(svgViUrl, {logourl: url, logoId: 888}, function(html){
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
}

// 第三步：编辑Logo
$.loadEditor = function(){
    // if (!$.login()) {
    //     return;
    // }
    $.post(svgUrl, $.svgParams, function(ret){
        $('.js-svg-editor').html(ret);
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
    $.ajax({
        type: 'POST',
        url: resultLogoUrl,
        headers:{"Content-Type":"application/json;charset=UTF-8"},
        data:JSON.stringify($.svgParams),
        success: function(json){

            var data = JSON.parse(json),
            	result = data.aiLogo,
            	svgResult = data.svg;
            	$.svgParams.svg = svgResult;
			
			$('.js-svg-preview').html(svgResult);
            $('.js-download-png').attr({'href':result.imgPath})
            $('.js-download-svg').attr({'href':result.svgPath})
            console.log('png:'+result.imgPath)

            // $('.js-free-download').off('click').on('click', function(){
            //     $.save($.svgParams);
            // });

            // $('.js-logo-order').off('click').on('click', function(){
            //     $.placeOrder($.svgParams);
            // });

            var src1 = svgResult;
            var src2 = src1.replace(/\#[0-9a-fA-F]{3,6}/g, '#000000');
            $('.js-vi-preview').empty();
            $('.js-vi-preview').append('<div class="logo-show1">'+src2+'</div>');
            $('.js-vi-preview').append('<div class="logo-show2">'+src1+'</div>');
            $('.js-vi-preview').append('<div class="logo-show3">'+src1+'</div>');
            $('.js-vi-preview').append('<div class="logo-show4">'+src2+'</div>');
            $('.js-vi-preview').append('<div class="logo-show5">'+src1+'</div>');
        }
    })

}

// login check
$.login = function() {
	var a
	$.post('http://192.168.1.112:8080/logo/checkLogin',function(res){
		a = res;
	})
}

$(function(){
    $.svgParams = new Object();
    $.loadForm();
})