// Released into the public domain by tav <tav@espians.com>

var startup = function () {

  var shareBoxDisplayed = false;
  var displayShareBox = function () {
      $(document).unbind('scroll', displayShareBox);
      setTimeout(function () {
          if (shareBoxDisplayed) {
              return;
          }
          shareBoxDisplayed = true;
          $('#share-box').show();
      }, 1400);
  };

  $(document).bind('scroll', displayShareBox);
  setTimeout(displayShareBox, 5000);

  var query = '';
  $("a").each(function(idx, elm) {
	if (elm.rel && elm.rel.indexOf('disqus:') >= 0) {
      query += 'url' + idx + '=' + encodeURIComponent(elm.rel.split('disqus:')[1]) + '&';
    }
  });

  $.getScript('http://disqus.com/forums/' + DISQUS_FORUM + '/get_num_replies.js?' + query);

  $('.share-twitter').click(function () {
    window.open(this.href, 'twitter', 'width=600,height=429,scrollbars=yes');
    return false;
  });

  $('.share-fb').click(function () {
    window.open(this.href, 'fb', 'width=600,height=400,scrollbars=yes');
    return false;
  });

  if (!document.getElementById('table-of-contents'))
    return;

  document.getElementById('table-of-contents').style.display = 'none';
  var abstractob = document.getElementById('abstract');
  var toc_handler = document.createElement('span');
  toc_handler.id = "toc-handler";

  var toc_handler_a = document.createElement('a');
  toc_handler_a.href = "#";
  toc_handler_a.appendChild(document.createTextNode("Table of Contents"));

  var toc_status = 0;

  toc_handler_a.onclick = function () {
    if (toc_status == 0) {
      toc_status = 1;
      document.getElementById('table-of-contents').style.display = 'block';
      return false;
    } else {
      toc_status = 0;
      document.getElementById('table-of-contents').style.display = 'none';
      return false;
    }
  };

  toc_handler.appendChild(document.createTextNode(" [ "));
  toc_handler.appendChild(toc_handler_a);
  toc_handler.appendChild(document.createTextNode(" ]"));

  var p_elems = abstractob.getElementsByTagName("p");
  p_elems[p_elems.length - 1].appendChild(toc_handler);
  toc_handler.style.fontSize = '0.9em';

  var hrefs = document.getElementById('table-of-contents').getElementsByTagName('a');
  for (var i=0; i < hrefs.length; i++) {
    if (hrefs[i].href.indexOf('#ignore-this') != -1)
      hrefs[i].parentNode.style.display = 'none';
  }

};

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

var setupGoogleAnalytics = function () {
  var proto = document.location.protocol;
  if (proto === 'file:')
    return;
  window._gaq = [
    ['_setAccount', GOOGLE_ANALYTICS_CODE],
    ['_trackPageview']
    ];
  (function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    if (proto === 'https:') {
      ga.src = 'https://ssl.google-analytics.com/ga.js';
    } else {
      ga.src = 'http://www.google-analytics.com/ga.js';
    }
    var script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(ga, script);
  })();
};

var translate = function (elem) {
  var url = 'http://translate.google.com/translate?u=';
  if (elem.options[elem.selectedIndex].value !="") {
	parent.location= url + encodeURIComponent(PAGE_URI) + elem.options[elem.selectedIndex].value;
  }
};

// -----------------------------------------------------------------------------
// Load Metrics
// -----------------------------------------------------------------------------

var loadMetrics = function loadMetrics(data) {
    $('.twitter-followers').text(data['twitter'] + " followers");
    $('.github-followers').text(data['github'] + " followers");
    $('.rss-readers').text(data['rss'] + " readers");
};

// -----------------------------------------------------------------------------
// Init
// -----------------------------------------------------------------------------

setupGoogleAnalytics();

$(startup);

// -----------------------------------------------------------------------------
// Font Smoothing Detection
// -----------------------------------------------------------------------------

// Adapted from
// http://www.useragentman.com/blog/2009/11/29/how-to-detect-font-smoothing-using-javascript/

function detectFontSmoothing() {

  // IE can be surprisingly helpful sometimes.
  if (screen && typeof(screen.fontSmoothingEnabled) !== "undefined")
    return screen.fontSmoothingEnabled;

  var canvas = document.createElement('canvas'),
      ctx,
      script;

  // Assume that non-IE older browsers are not running on Windows.
  if (!canvas.getContext)
    return null;

  try {

    // Create a 35x35 Canvas block.
    canvas.width = "35";
    canvas.height = "35";

    // We must put this node into the body, otherwise
    // Safari Windows does not report correctly.
    canvas.style.display = 'none';
    script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(canvas, script);

    // Draw a black letter 'O', 32px Arial.
    ctx = canvas.getContext('2d');
    ctx.textBaseline = "top";
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillText("O", 0, 0);

    // Start at (8,1) and search the canvas from left to right,
    // top to bottom to see if we can find a non-black pixel. If
    // so we return true.
    for (var j=8; j <= 32; j++) {
      for (var i = 1; i <= 32; i++) {
        var imageData = ctx.getImageData(i, j, 1, 1).data,
            alpha = imageData[3];
        if (alpha != 255 && alpha != 0)
            return true;
      }
    }
  } catch (ex) {
    // Something went wrong (for example, Opera cannot use the
    // canvas fillText() method.  Return null (unknown).
    return null;
  }

  return false;

};

// -----------------------------------------------------------------------------
// Handle Fonts
// -----------------------------------------------------------------------------

function loadStylesheet(_rules) {
  var css = document.createElement('style'),
      rules = document.createTextNode(_rules),
      script = document.getElementsByTagName('script')[0];
  css.type = "text/css";
  if (css.styleSheet) {
    css.styleSheet.cssText = rules.nodeValue;
  } else {
    css.appendChild(rules);
  }
  script.parentNode.insertBefore(css, script);
};

if (!(detectFontSmoothing() === false)) {
  try {
    Typekit.load();
    if ($.browser.msie) {
      loadStylesheet('code, pre, .literal { font-size: 17px; line-height: 20px; }');
    }
  } catch(e) {}
} else {
  try {
    loadStylesheet('code, pre, .literal { font-family: Monaco, "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace; font-size: 14px; line-height: 16px; } body, #intro h1 { font-family: Verdana, Arial, sans-serif; font-size: 13px; line-height: 23px; } .content { line-height: 23px; } em { font-style: normal !important; font-weight: bold; } .article-info { font-size: 11px; } #site-title { font-size: 54px; line-height: 60px; padding-bottom: 8px; } intro { font-size: 15px; } #intro strong { font-size: 24px; } .content a, #intro a, .article-nav a, .additional-content-info a, #disqus-comments-section a { font-weight: bold; }}');
    Typekit.load();
  } catch(e) {}
}
