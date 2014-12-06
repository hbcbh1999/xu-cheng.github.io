 $("script[type='math/tex']").replaceWith(
  function(){
    var tex = $(this).text();
    return "<spawn class=\"inline-equation\">" + 
           katex.renderToString(tex) +
           "</spawn>";
 });

$("script[type='math/tex; mode=display']").replaceWith(
  function(){
    var tex = $(this).text();
    return "<div class=\"equation\">" + 
           katex.renderToString("\\displaystyle "+tex) +
           "</div>";
 });
