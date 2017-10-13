// 1. 操作状态
$.guide = function(step) {
	// $('.guide li').removeClass('active');
	$('.guide li:nth-child('+step+')').addClass('active');
	$('.guide li:lt('+(step-1)+')').addClass('active done');


	$('.step1,.step2,.step3,.step4').hide();
	$('.step'+step).show();
}

$.loading = function(){
	$('.svg-loading').remove();
	// $('.sep-page-content').append('<div class="svg-loading">'
	// 	+'<div class="svg-loading-box">'
	// 	+'<i class="fa fa-spinner fa-pulse"></i>'
	// 	+'<span class="text">logo设计中...<br> 首次使用，因需加载字体，请等待30秒。</span>'
	// 	+'</div></div>');
}

$.loadMaterial = function(){
	var _DOM = '.material';

	$.guide(2);
	// 2.发送请求
	$.post('/openapi/logo/material', $.svgParams, function(json){
		$('ul', _DOM).empty();
		if (json.length) {
			// 2.1 遍历循环结果
			$(json).each(function(){
				// $('ul', _DOM).append('<li><a href="javascript:;" data-id="'+this.id+'"><img src="'+this.svg+'" /></a></li>')
				$('ul', _DOM).append('<li><a href="javascript:;" data-id="'+this.id+'">'
					+'<img src="/openapi/logo/materialPreview?material_id='+this.id+'&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text+'" /></a></li>')
			});
		} else {
			$('ul', _DOM).html('<div class="notfound">暂无相关图形</div>');
		}

		// 2.2 logo点击，出发事件
		$('li>a', _DOM).on('click', function(){
			var id = $(this).data('id');

			$('li>a').removeClass('active');
			$(this).addClass('active');

			$.svgParams.material_id = id;
			var url = '/openapi/logo/materialPreview?material_id='+id+'&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text;
			$.post('/openapi/logo/application', {logourl: url}, function(html){
				$('.sep-logo-application').html(html);
			});
		});
	},'json');

	// 2.3 Logofree 物料示意
	var url = '/openapi/logo/materialPreview?material_id=373&name='+$.svgParams.name.text+'&slogan='+$.svgParams.slogan.text;
	$.post('/openapi/logo/application', {logourl: url}, function(html){
		$('.sep-logo-application').html(html);
	});

	// 筛选条件
	$('.toolbar [name=trade] option').each(function(){
		if ($(this).val()==$.svgParams.trade) {
			$(this).prop('selected', 1);
		}
	})

	// 点击下一步
	$('.btn-next', _DOM).off('click').on('click', function(){
		if ($.svgParams.material_id) {
			$.loadEditor();
		} else {
			alert('请选择一个图形');
			return;
		}
	});

	// 换一批
	$('.btn-reload', _DOM).off('click').on('click', function(){
		$.loadMaterial();
	});

	$('.toolbar .form-control').off('change').on('change', function(){
		$.svgParams.trade = $('.toolbar [name=trade]').val();
		$.svgParams.shape = $('.toolbar [name=shape]').val();
		$.svgParams.alpha = $('.toolbar [name=alpha]').val();
		$.svgParams.numeric = $('.toolbar [name=numeric]').val();
		$.svgParams.element = $('.toolbar [name=element]').val();
		$.loadMaterial();
	});
}

$.loadEditor = function(){
	if (!$.login()) {
		return;
	}
	$.loading();
	$.post('/openapi/logo/svg', $.svgParams, function(ret){
		$('.svg-editor').html(ret);
		$.svgEditor('svg-draw', $.svgParams); // 编辑svg

		$('.btn-checkout').off('click').on('click', function(){
			$('#svg-ghost').empty();
			var svg = $('.svg-editor').html();

			$.checkout(svg);
		});
	});

	$.guide(3);
}

$.loadForm = function(){
	$.guide(1);

	$('.js-logofree-form').off('submit').on('submit', function(){
		seajs.use(['/assets/js/kaka/libs/kaka.validator.js'], function(){
			var v1 = new kakaValidator($('.js-logofree-form'), {});
			v1.run();

			if (!v1.run()) {
				return false;
			}

			$.svgParams = {
				name: {text:$('[name=name]').val()},
				slogan: {text:$('[name=slogan]').val()},
				// trade_id: $('[name=trade_id]').val(),
				trade: $('[name=trade]').val(),
				atext: {text:''}
			}
			$.loadMaterial();
		});

		return false;
	});
}

$.checkout = function(svg){
	window.stop();
	$.guide(4);
	$.svgParams.svg = svg;
	$.post('/openapi/logo/checkout', $.svgParams, function(json){
		$('.logo-name').text(json.name);
		$('.price').text(json.price);
		$('.price-discount').text(json.discount_price);
		$('.svg-preview').html(json.svg);
		// if (json.is_free) {
		// 	$('.btn-free-order').show();
		// } else {
		// 	$('.btn-free-order').hide();
		// }
		$.svgParams.svg = json.svg;

		$('.btn-save').off('click').on('click', function(){
			$.save($.svgParams);
		});

		$('.btn-place-order').off('click').on('click', function(){
			$.placeOrder($.svgParams);
		});

		$('.btn-place-discount').off('click').on('click', function(){
			$.svgParams.is_discount = 1;
			$.placeOrder($.svgParams);
		});

		var src1 = json.svg;
		var src2 = src1.replace(/\#[0-9a-fA-F]{3,6}/g, '#cccccc');

		$('.vi-preview').empty();
		$('.vi-preview').append('<div class="sl-01">'+src2+'</div>');
		$('.vi-preview').append('<div class="sl-02">'+src1+'</div>');
		$('.vi-preview').append('<div class="sl-03">'+src1+'</div>');
		$('.vi-preview').append('<div class="sl-04">'+src2+'</div>');
		$('.vi-preview').append('<div class="sl-05">'+src1+'</div>');

	}, 'json');
}

$.save = function(data){
	if ($.login()) {
		$.post('/openapi/logo/place_order', $.svgParams, function(json){
			if (json.result) {
				window.location = '/user/collect';
			} else {
				alert(json.message);
			}
		}, 'json');
	}
}

$.placeOrder = function(data) {
	if ($.login()) {
		$.post('/openapi/logo/place_order', $.svgParams, function(json){
			if (json.result) {
				window.location = '/user/paynow?ids='+json.oid;
			} else {
				alert(json.message);
			}
		}, 'json');
	}
}

$.fn.ready(function(){
	$.svgParams = new Object();

	$('.guide li').off('click').on('click', function(){

		if ($(this).hasClass('active')) {
			switch ($(this).index()) {
				case 0:
					$.loadForm();
					break;
				case 1:
					$.loadMaterial();
					break;
				case 2:
					$.loadEditor();
					break;
			}
		}
	});

	// $.loadMaterial();
	$.loadForm();
	// $.guide(4);

	// $.svgParams = {
	// 	layout: 1,
	// 	material_id: 291,
	// 	name: {text: '贤成网络', font:'/assets/fonts/cn/fzhzgbjt.ttf'},
	// 	slogan: {text: 'www.suconet.com', font:'/assets/fonts/en/DIN Condensed Bold.ttf'},
	// 	atext: {text: '', font:'/assets/fonts/cn/fzhzgbjt.ttf'}
	// };
	// $.loadEditor();

	// $.checkout();
})