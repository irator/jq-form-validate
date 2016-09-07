$(function(){
    $(document).on('submit','.validate-form',function(){
        var err, arr = [];
        $(this).find(':input.validate-field').each(function(i, item){
            if( !item.value ) {
                if( $('#jqv_err_'+i).length === 0 ) {
                    $(item).css({'border-color':'red'});
                    $(item).after('<span class="jqv-error" id="jqv_err_' + i + '"><span class="arrow-up"></span>' + $(item).attr('data-vmsg') + '</span>');
                }
                err = 1;
                arr.push(item);
            }
        });
        arr[0].focus();
        return ( err === 1 ) ? false : true;
    });
    $(document).on('change keyup','.validate-field',function(){
        $(this).css({'border-color':'#c3c3c3'});
        $(this).nextAll(".jqv-error:first").fadeOut('fast').remove();
    });
});
