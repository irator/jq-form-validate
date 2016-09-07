$(function(){

  $(document).on('submit','.validate-form',function(){
    var err;
    $(this).find(':input.validate-field').each(function(i, item){
      //console.log( $(item).attr('data-vmsg') );
      if( !item.value ) {
        $(item).focus();
        if( $('#jqv_err_'+i).length === 0 ) {
          $(item).after('<span class="jqv-error" id="jqv_err_' + i + '">' + $(item).attr('data-vmsg') + '</span>');
        }
        err = 1;
      }
    });
    return ( err === 1 ) ? false : true;
  });

  $(document).on('change keyup','.validate-field',function(){
    $(this).nextAll(".jqv-error:first").fadeOut('fast').remove();
  });

});
