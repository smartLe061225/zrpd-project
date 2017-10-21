    $(function(){

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
    	
    	// 企业logo上传
        var picPath = '',
            picType = '',
            picSvg = '';

        function getVITpl(url){
        var viTpl = '';
            viTpl += '<li>'
            viTpl += '<svg width="100%" height="100%" viewBox="0 0 520 360">'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/application/app1.jpg" x="0" y="0" width="100%" height="100%"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(0.788,0.615,-0.615,0.788,280,70)"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(.5,0,0,.5,150,170)"></image>'
            viTpl += '</svg>'
            viTpl += '</li>'
            viTpl += '<li>'
            viTpl += '<svg width="100%" height="100%" viewBox="0 0 520 360">'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/application/app2.jpg" x="0" y="0" width="100%" height="100%"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(1,0,0,1,120,130)"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(.8,0,0,.8,335,110)"></image>'
            viTpl += '</svg>'
            viTpl += '</li>'
            viTpl += '<li>'
            viTpl += '<svg width="100%" height="100%" viewBox="0 0 520 360">'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/application/app3.jpg" x="0" y="0" width="100%" height="100%"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(.6,0,0,.6,200,0)"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(.5,0,0,.5,85,155)"></image>'
            viTpl += '</svg>'
            viTpl += '</li>'
            viTpl += '<li>'
            viTpl += '<svg width="100%" height="100%" viewBox="0 0 520 360">'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/application/app4.jpg" x="0" y="0" width="100%" height="100%"></image>'
            viTpl += '<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ url +'" x="0" y="0" width="100" height="100" transform="matrix(1.1,0,0,1.1,222,135)"></image>'
            viTpl += '</svg>'
            viTpl += '</li>';
            return viTpl;
        }

        $('.js-upload-logo').on('change',function(){
	        var options = {
	            dataType: "json",
	            url: uploadPicUrl,
	            type: "post",
	            async:false,
	            success: function(data){
	            	   if(data['error'] == 'error_type'){
                        $('.js-logo-show').hide()
                        $('.js-upload-tips').addClass('error').text("请上传*.svg格式Logo文件，或透明底的*.png格式Logo文件")
                        return false;
                    }
                    if(data['error'] == 'error_size'){
                        $('.js-logo-show').hide()
                        $('.js-upload-tips').addClass('error').text("上传图片不能大于2M")
                        return false;
                    }
                    if(data['path']){
                        picPath = data['path'],
                        picType = data['picType'],
                        picSvg = data['svg'];
                        $('.js-upload-form').hide()
                        $('.js-upload-tips').removeClass('error')
                        $('.js-logo-show').show().attr({'src': picPath})
                        $('.js-upload-pic').val(data['path']).data('type', picType)

                        $('.logoApplicationList').html(getVITpl(picPath))
                        $('.js-vi-preview').append('<div class="logo-show1">'+picSvg+'</div>');
                        $('.js-vi-preview').append('<div class="logo-show2">'+picSvg+'</div>');
                        $('.js-vi-preview').append('<div class="logo-show3">'+picSvg+'</div>');
                        $('.js-vi-preview').append('<div class="logo-show4">'+picSvg+'</div>');
                        $('.js-vi-preview').append('<div class="logo-show5">'+picSvg+'</div>');

                    }
                }
            };
            $(".js-upload-form").ajaxSubmit(options);
	        return false;
	    })

        //
        var checkFormObj = $('.js-company-form');
        $('.js-form-save').on('click',function(){
            checkFormObj.trigger('submit')
        })

        checkFormObj.off('submit').on('submit', function(){

        var picUrl = $('.js-upload-pic')
        if (picUrl.val()) {
            $('.js-upload-tips').removeClass('error')
        }else{
            $('.js-upload-logo').focus()
            $('.js-upload-tips').addClass('error')
            return false;
        }

        var inputName = $('.js-company-name')
        if (inputName.val()) {
            inputName.removeClass('Validform_error')
        }else{
            inputName.focus().addClass('Validform_error')
            return false;
        }
        
        // 
        var formData = {
            companyName: $('.js-company-name').val(),
            tradeInfoId: $('[name=tradeInfoId]').val(),
            svgPath: picType == 'svg'? picPath: '',
            imgPath: picType == 'png'? picPath: ''

        }
        console.log('aa')
        $.post(saveUploadLogo, formData, function(res){
            if (res.status == '1') {
                window.hre = '/goods'
            }else{
                alert('保存失败！')
            }
        })
        return false;
    });
        


    })