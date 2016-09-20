$(function(){
    $('body').append('<div id="loader"></div>');
    $(document).on('submit','.validate-form',function(){
        var err, errMsg, showErr, arr = [], funcname = '', funcparam = '', minVal, maxVal;
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
                case 'num': // numeric
                    minVal = $(item).data('min') === 'undefined' || !$(item).data('min') ? '' : $(item).data('min'),
                    maxVal = $(item).data('max') === 'undefined' || !$(item).data('max') ? '' : $(item).data('max'),
                    ival = item.value.replace( /[^\d.]/g, '' ); //replace(/ /g, '');
                    if( minVal && minVal > ival ) {
                        //console.log( 'Значение меньше разрешенного' );
                        showErr = 1;
                        minVal = minVal.toString().split('').reverse().join('').match(/.{1,3}/g).join(' ').split('').reverse().join('');
                        errMsg = 'Значение не должно быть меньше ' + minVal;
                    }
                    if( maxVal && maxVal < ival ) {
                        //console.log( 'Значение больше разрешенного' );
                        showErr = 1;
                        maxVal = maxVal.toString().split('').reverse().join('').match(/.{1,3}/g).join(' ').split('').reverse().join('');
                        errMsg = 'Значение не должно превышать ' + maxVal;
                    }
                    //console.log( i + ' Число minVal=' + minVal + ' maxVal=' + maxVal + ' item.val=' + item.value + ' ival=' + ival);
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
                case 'func':
                    var equally = $(item).data('equally'), // 
                        valType = $(item).data('valtype'), // input checked type: checked or val
                        funcRes = $(item).data('funcres') === 'undefined' ? 1 : $(item).data('funcres'); // if function result true return 1 and change item data-funcres else return 0
                    if ( !funcRes ) {
                        funcname = $(item).data('func');
                        funcparam = $(item).data('funcparam');
                        if( valType === 'checked' ) {
                            funcname = $(item).prop('checked') === true && $(item).val() === equally ? funcname : 0;
                        } else {
                            funcname = $(item).val() === equally ? funcname : 0;
                        }
                    }
                    showErr = false;
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
            $('html, body').animate({ scrollTop: scrollTop }, 1000);
            setTimeout(function(){ arr[0].focus(); }, 1000);
            return false;
        } else {
            $(this).css({'opacity':'0.4'});
            $(this).find('input[type=submit]').prop('disabled', true);
            $('#loader').fadeIn('fast');
            if( funcname ) {
                window[funcname](funcparam);
                return false;
            } else {
                console.log('func empty');
                return true;
            }
        }
    });
    $(document).on('change keyup','.validate-field',function(){
        $(this).css({'border-color':'#ccc'});
        $(this).nextAll(".jqv-error:first").fadeOut('fast').remove();
    });
});
