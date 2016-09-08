$(function(){
    $('body').append('<div id="loader"></div>');
    $(document).on('submit','.validate-form',function(){
        var err, errMsg, showErr, arr = [];
        $(this).find(':input.validate-field').each(function(i, item){
            
            // validate types
            var type = $(item).data('vtype');

            switch (type) {
                case 'email':
                    console.log( i + ' Адрес электронной почты' );
                    break;
                case 'length':
                    showErr = item.value.length >= $(item).data('length') ? 0 : 1;
                    errMsg = 'Минимальное количество символов ' + $(item).data('length');
                    break;
                case 'depend': // dependence
                    console.log( i + ' Зависимый от значения другого input' );
                    break;
                default:
                    showErr = !item.value ? 1 : 0;
                    errMsg = $(item).data('vmsg');
            }
            
            if( showErr ) {
                // show error message
                if( $('#jqv_err_'+i).length === 0 ) {
                    $(item).css({'border-color':'red'});
                    $(item).after('<span class="jqv-error" id="jqv_err_' + i + '"><span class="arrow-up"></span>' + errMsg + '</span>');
                }
                err = 1;
                arr.push(item);
            }
        });
        
        if ( err === 1 )  {
            var scrollTop = $(arr[0]).offset().top - 100;
            console.log(scrollTop);
            $('html, body').animate({ scrollTop: scrollTop }, 1000);
            setTimeout(function(){ arr[0].focus(); }, 1000);
            return false;
        } else {
            $(this).css({'opacity':'0.4'});
            $(this).find('input[type=submit]').prop('disabled', true);
            $('#loader').fadeIn('fast');
            return true;
        }
    });
    $(document).on('change keyup','.validate-field',function(){
        $(this).css({'border-color':'#c3c3c3'});
        $(this).nextAll(".jqv-error:first").fadeOut('fast').remove();
    });
});
