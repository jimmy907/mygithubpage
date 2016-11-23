/* Copyright (c) 2013 - 2014, Hsiaoming Yang

All rights reserved.

    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    *
    * * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    *
    * * Neither the name of the creator nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
    *
    *
    * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
(function(d) {
  var base = "http://lab.lepture.com/github-cards/";

  var i, count = 0;

  var metas = d.getElementsByTagName('meta');
  var client_url, client_id, client_secret, client_theme;
  for (i = 0; i < metas.length; i++) {
    var n = metas[i].getAttribute('name');
    var c = metas[i].getAttribute('content');
    if (n === 'gc:url') {
      client_url = c;
    } else if (n === 'gc:base') {
      base = c;
    } else if (n === 'gc:client-id') {
      client_id = c;
    } else if (n === 'gc:client-secret') {
      client_secret = c;
    } else if (n === 'gc:theme') {
      client_theme = c;
    }
  }

  function queryclass(name) {
    if (d.querySelectorAll) {
      return d.querySelectorAll('.' + name);
    }
    var elements = d.getElementsByTagName('div');
    var ret = [];
    for (i = 0; i < elements.length; i++) {
      if (~elements[i].className.split(' ').indexOf(name)) {
        ret.push(elements[i]);
      }
    }
    return ret;
  }

  function querydata(element, name) {
    return element.getAttribute('data-' + name);
  }

  function heighty(iframe) {
    if (window.addEventListener) {
      window.addEventListener('message', function(e) {
        if (iframe.id === e.data.sender) {
          iframe.height = e.data.height;
        }
      }, false);
    }
  }

  function render(card, cardurl) {
    cardurl = cardurl || client_url;
    if (!cardurl) {
      var theme = querydata(card, 'theme') || client_theme || 'default';
      cardurl = base + 'cards/' + theme + '.html';
    }
    var user = querydata(card, 'user');
    var repo = querydata(card, 'repo');
    var github = querydata(card, 'github');
    if (github) {
      github = github.split('/');
      if (github.length && !user) {
        user = github[0];
        repo = repo || github[1];
      }
    }
    if (!user) {
      return;
    }

    count += 1;
    var width = querydata(card, 'width');
    var height = querydata(card, 'height');
    var target = querydata(card, 'target');

    var key = querydata(card, 'client-id') || client_id;
    var secret = querydata(card, 'client-secret') || client_secret;

    var identity = 'ghcard-' + user + '-' + count;

    var iframe = d.createElement('iframe');
    iframe.setAttribute('id', identity);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('scrolling', 0);
    iframe.setAttribute('allowtransparency', true);

    var url = cardurl + '?user=' + user + '&identity=' + identity;
    if (repo) {
      url += '&repo=' + repo;
    }
    if (target) {
      url += '&target=' + target;
    }
    if (key && secret) {
      url += '&client_id=' + key + '&client_secret=' + secret;
    }
    iframe.src = url;
    iframe.width = width || Math.min(card.parentNode.clientWidth || 400, 400);
    if (height) {
      iframe.height = height;
    }
    heighty(iframe);
    card.parentNode.replaceChild(iframe, card);
    return iframe;
  }

  var cards = queryclass('github-card');
  for (i = 0; i < cards.length; i++) {
    render(cards[i]);
  }

  if (window.githubCard) {
    window.githubCard.render = render;
  }

})(document);
