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

