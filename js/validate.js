$(function(){
    $('body').append('<div id="loader"></div>');
    $(document).on('submit','.validate-form',function(){
        var err, errMsg, showErr, arr = [];
        $(this).find(':input.validate-field').each(function(i, item){
            
            // validate types
            // типы валидации
            var type = $(item).data('vtype');

            switch (type) {
                case 'email': // временно недоступно
                    console.log( i + ' Адрес электронной почты' );
                    break;
                case 'length': // для проверки длины значения value устанавливаем елементу data-vtype="length" и data-length="20" где 20 минимальная длина значения
                    showErr = item.value.length >= $(item).data('length') ? 0 : 1;
                    errMsg = 'Минимальное количество символов ' + $(item).data('length');
                    break;
                case 'depend': // dependence - зависимый / data-vtype="depend" data-parent="parent_id"
                    var parent = $(item).data('parent'), // родитель от значения которого зависит валидация текущего элемента 
                        parentVal = $(item).data('parent-val'); // значение родителя
                    //console.log(parent + ' ' + parentVal)
                    if( parentVal === 'checked' ) { // для проверки checkbox'ов и radio устанавливаем елементу data-parent-val="checked"
                        showErr = $('#'+parent).prop('checked') === true && !$(item).val() ? 1 : 0;
                    } else { // остальные поля проверяем по значению value
                        showErr = $('#'+parent).val() === parentVal && !$(item).val() ? 1 : 0;
                    }
                    errMsg = $(item).data('vmsg');
                    //console.log( i + ' Зависимый от значения другого input' );
                    break;
                default:
                    showErr = !item.value ? 1 : 0;
                    errMsg = $(item).data('vmsg');
            }
            
            if( showErr ) {
                // show error message
                if( $('#jqv_err_'+i).length === 0 ) {
                    $(item).css({'border-color':'orange'});
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
        $(this).css({'border-color':'#ccc'});
        $(this).nextAll(".jqv-error:first").fadeOut('fast').remove();
    });
});
