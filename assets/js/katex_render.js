 $("script[type='math/tex']").replaceWith(
  function(){
    var tex = $(this).text();
    return katex.renderToString(tex);
 });

$("script[type='math/tex; mode=display']").replaceWith(
  function(){
    var tex = $(this).text();
    return katex.renderToString("\\displaystyle"+tex);
 });
