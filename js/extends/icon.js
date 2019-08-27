layui.define(['layer', 'laytpl'], function(exports){
  var layer = layui.layer
  var laytpl = layui.laytpl
  var MOD_NAME = 'icon'
  laytpl.config({
    open: '<%',
    close: '%>'
  })
  var Icon = {
    data: [
      {
        title: '',
        list: ['fa-automobile', 'fa-bank', 'fa-behance', 'fa-behance-square', 'fa-bomb', 'fa-building', 'fa-cab', 'fa-car', 'fa-child', 'fa-circle-o-notch', 'fa-circle-thin', 'fa-codepen', 'fa-cube', 'fa-cubes', 'fa-database', 'fa-delicious', 'fa-deviantart', 'fa-digg', 'fa-drupal', 'fa-empire', 'fa-envelope-square', 'fa-fax', 'fa-file-archive-o', 'fa-file-audio-o', 'fa-file-code-o', 'fa-file-excel-o', 'fa-file-image-o', 'fa-file-movie-o', 'fa-file-pdf-o', 'fa-file-photo-o', 'fa-file-picture-o', 'fa-file-powerpoint-o', 'fa-file-sound-o', 'fa-file-video-o', 'fa-file-word-o', 'fa-file-zip-o', 'fa-ge', 'fa-git', 'fa-git-square', 'fa-google', 'fa-graduation-cap', 'fa-hacker-news', 'fa-header', 'fa-history', 'fa-institution', 'fa-joomla', 'fa-jsfiddle', 'fa-language', 'fa-life-bouy', 'fa-life-ring', 'fa-life-saver', 'fa-mortar-board', 'fa-openid', 'fa-paper-plane', 'fa-paper-plane-o', 'fa-paragraph', 'fa-paw', 'fa-pied-piper', 'fa-pied-piper-alt', 'fa-pied-piper-square', 'fa-qq', 'fa-ra', 'fa-rebel', 'fa-recycle', 'fa-reddit', 'fa-reddit-square', 'fa-send', 'fa-send-o', 'fa-share-alt', 'fa-share-alt-square', 'fa-slack', 'fa-sliders', 'fa-soundcloud', 'fa-space-shuttle', 'fa-spoon', 'fa-spotify', 'fa-steam', 'fa-steam-square', 'fa-stumbleupon', 'fa-stumbleupon-circle', 'fa-support', 'fa-taxi', 'fa-tencent-weibo', 'fa-tree', 'fa-university', 'fa-vine', 'fa-wechat', 'fa-weixin', 'fa-wordpress', 'fa-yahoo']
      },
      {
        title: 'Web Application Icons',
        list: ['fa-adjust', 'fa-anchor', 'fa-archive', 'fa-asterisk', 'fa-ban', 'fa-bar-chart-o', 'fa-barcode', 'fa-beer', 'fa-bell', 'fa-bell-o', 'fa-bolt', 'fa-book', 'fa-bookmark', 'fa-bookmark-o', 'fa-briefcase', 'fa-bug', 'fa-building', 'fa-bullhorn', 'fa-bullseye', 'fa-calendar', 'fa-calendar-o', 'fa-camera', 'fa-camera-retro', 'fa-caret-square-o-down', 'fa-caret-square-o-left', 'fa-caret-square-o-right', 'fa-caret-square-o-up', 'fa-certificate', 'fa-check', 'fa-check-circle', 'fa-check-circle-o', 'fa-check-square', 'fa-check-square-o', 'fa-circle', 'fa-circle-o', 'fa-clock-o', 'fa-cloud', 'fa-cloud-download', 'fa-cloud-upload', 'fa-code', 'fa-code-fork', 'fa-coffee', 'fa-cog', 'fa-cogs', 'fa-plus-square-o', 'fa-comment', 'fa-comment-o', 'fa-comments', 'fa-comments-o', 'fa-compass', 'fa-credit-card', 'fa-crop', 'fa-crosshairs', 'fa-cutlery', 'fa-dashboard', 'fa-desktop', 'fa-dot-circle-o', 'fa-download', 'fa-edit', 'fa-ellipsis-horizontal', 'fa-ellipsis-vertical', 'fa-envelope', 'fa-envelope-o', 'fa-eraser', 'fa-exchange', 'fa-exclamation', 'fa-exclamation-circle', 'fa-exclamation-triangle', 'fa-minus-square-o', 'fa-external-link', 'fa-external-link-square', 'fa-eye', 'fa-eye-slash', 'fa-female', 'fa-fighter-jet', 'fa-film', 'fa-filter', 'fa-fire', 'fa-fire-extinguisher', 'fa-flag', 'fa-flag-checkered', 'fa-flag-o', 'fa-flash', 'fa-flask', 'fa-folder', 'fa-folder-o', 'fa-folder-open', 'fa-folder-open-o', 'fa-frown-o', 'fa-gamepad', 'fa-gavel', 'fa-gear', 'fa-gears', 'fa-gift', 'fa-glass', 'fa-globe', 'fa-group', 'fa-hdd-o', 'fa-headphones', 'fa-heart', 'fa-heart-o', 'fa-home', 'fa-inbox', 'fa-info', 'fa-info-circle', 'fa-key', 'fa-keyboard-o', 'fa-laptop', 'fa-leaf', 'fa-legal', 'fa-lemon-o', 'fa-level-down', 'fa-level-up', 'fa-lightbulb-o', 'fa-location-arrow', 'fa-lock', 'fa-magic', 'fa-magnet', 'fa-mail-forward', 'fa-mail-reply', 'fa-mail-reply-all', 'fa-male', 'fa-map-marker', 'fa-meh-o', 'fa-microphone', 'fa-microphone-slash', 'fa-minus', 'fa-minus-circle', 'fa-minus-square', 'fa-minus-square-o', 'fa-mobile', 'fa-mobile-phone', 'fa-money', 'fa-moon-o', 'fa-move', 'fa-music', 'fa-pencil', 'fa-pencil-square', 'fa-pencil-square-o', 'fa-phone', 'fa-phone-square', 'fa-picture-o', 'fa-plane', 'fa-plus', 'fa-plus-circle', 'fa-plus-square', 'fa-power-off', 'fa-print', 'fa-puzzle-piece', 'fa-qrcode', 'fa-question', 'fa-question-circle', 'fa-quote-left', 'fa-quote-right', 'fa-random', 'fa-refresh', 'fa-reorder', 'fa-reply', 'fa-reply-all', 'fa-resize-horizontal', 'fa-resize-vertical', 'fa-retweet', 'fa-road', 'fa-rocket', 'fa-rss', 'fa-rss-square', 'fa-search', 'fa-search-minus', 'fa-search-plus', 'fa-share', 'fa-share-square', 'fa-share-square-o', 'fa-shield', 'fa-shopping-cart', 'fa-sign-in', 'fa-sign-out', 'fa-signal', 'fa-sitemap', 'fa-smile-o', 'fa-sort', 'fa-sort-alpha-asc', 'fa-sort-alpha-desc', 'fa-sort-amount-asc', 'fa-sort-amount-desc', 'fa-sort-asc', 'fa-sort-desc', 'fa-sort-down', 'fa-sort-numeric-asc', 'fa-sort-numeric-desc', 'fa-sort-up', 'fa-spinner', 'fa-square', 'fa-square-o', 'fa-star', 'fa-star-half', 'fa-star-half-empty', 'fa-star-half-full', 'fa-star-half-o', 'fa-star-o', 'fa-subscript', 'fa-suitcase', 'fa-sun-o', 'fa-superscript', 'fa-tablet', 'fa-tachometer', 'fa-tag', 'fa-tags', 'fa-tasks', 'fa-terminal', 'fa-thumb-tack', 'fa-thumbs-down', 'fa-thumbs-o-down', 'fa-thumbs-o-up', 'fa-thumbs-up', 'fa-ticket', 'fa-times', 'fa-times-circle', 'fa-times-circle-o', 'fa-tint', 'fa-toggle-down', 'fa-toggle-left', 'fa-toggle-right', 'fa-toggle-up', 'fa-trash-o', 'fa-trophy', 'fa-truck', 'fa-umbrella', 'fa-unlock', 'fa-unlock-alt', 'fa-unsorted', 'fa-upload', 'fa-user', 'fa-video-camera', 'fa-volume-down', 'fa-volume-off', 'fa-volume-up', 'fa-warning', 'fa-wheelchair', 'fa-wrench']
      },
      {
        title: 'Form Control Icons',
        list: ['fa-check-square', 'fa-check-square-o', 'fa-circle', 'fa-circle-o', 'fa-dot-circle-o', 'fa-minus-square', 'fa-minus-square-o', 'fa-square', 'fa-square-o']
      },
      {
        title: 'Currency Icons',
        list: ['fa-bitcoin', 'fa-btc', 'fa-cny', 'fa-dollar', 'fa-eur', 'fa-euro', 'fa-gbp', 'fa-inr', 'fa-jpy', 'fa-krw', 'fa-money', 'fa-rmb', 'fa-rouble', 'fa-rub', 'fa-ruble', 'fa-rupee', 'fa-try', 'fa-turkish-lira', 'fa-usd', 'fa-won', 'fa-yen']
      },
      {
        title: 'Text Editor Icons',
        list: ['fa-align-center', 'fa-align-justify', 'fa-align-left', 'fa-align-right', 'fa-bold', 'fa-chain', 'fa-chain-broken', 'fa-clipboard', 'fa-columns', 'fa-copy', 'fa-cut', 'fa-dedent', 'fa-eraser', 'fa-file', 'fa-file-o', 'fa-file-text', 'fa-file-text-o', 'fa-files-o', 'fa-floppy-o', 'fa-font', 'fa-indent', 'fa-italic', 'fa-link', 'fa-list', 'fa-list-alt', 'fa-list-ol', 'fa-list-ul', 'fa-outdent', 'fa-paperclip', 'fa-paste', 'fa-repeat', 'fa-rotate-left', 'fa-rotate-right', 'fa-save', 'fa-scissors', 'fa-strikethrough', 'fa-table', 'fa-text-height', 'fa-text-width', 'fa-th', 'fa-th-large', 'fa-th-list', 'fa-underline', 'fa-undo', 'fa-unlink']
      },
      {
        title: 'Directional Icons',
        list: ['fa-angle-double-down', 'fa-angle-double-left', 'fa-angle-double-right', 'fa-angle-double-up', 'fa-angle-down', 'fa-angle-left', 'fa-angle-right', 'fa-angle-up', 'fa-arrow-circle-down', 'fa-arrow-circle-left', 'fa-arrow-circle-o-down', 'fa-arrow-circle-o-left', 'fa-arrow-circle-o-right', 'fa-arrow-circle-o-up', 'fa-arrow-circle-right', 'fa-arrow-circle-up', 'fa-arrow-down', 'fa-arrow-left', 'fa-arrow-right', 'fa-arrow-up', 'fa-caret-down', 'fa-caret-left', 'fa-caret-right', 'fa-caret-square-o-down', 'fa-caret-square-o-left', 'fa-caret-square-o-right', 'fa-caret-square-o-up', 'fa-caret-up', 'fa-chevron-circle-down', 'fa-chevron-circle-left', 'fa-chevron-circle-right', 'fa-chevron-circle-up', 'fa-chevron-down', 'fa-chevron-left', 'fa-chevron-right', 'fa-chevron-up', 'fa-hand-o-down', 'fa-hand-o-left', 'fa-hand-o-right', 'fa-hand-o-up', 'fa-long-arrow-down', 'fa-long-arrow-left', 'fa-long-arrow-right', 'fa-long-arrow-up', 'fa-toggle-down', 'fa-toggle-left', 'fa-toggle-right', 'fa-toggle-up']
      },
      {
        title: 'Video Player Icons',
        list: ['fa-backward', 'fa-eject', 'fa-fast-backward', 'fa-fast-forward', 'fa-forward', 'fa-arrows-alt', 'fa-pause', 'fa-play', 'fa-play-circle', 'fa-play-circle-o', 'fa-expand', 'fa-compress', 'fa-step-backward', 'fa-step-forward', 'fa-stop', 'fa-youtube-play']
      },
      {
        title: 'Brand Icons',
        list: ['fa-adn', 'fa-android', 'fa-apple', 'fa-bitbucket', 'fa-bitbucket-square', 'fa-bitcoin', 'fa-btc', 'fa-css3', 'fa-dribbble', 'fa-dropbox', 'fa-facebook', 'fa-facebook-square', 'fa-flickr', 'fa-foursquare', 'fa-github', 'fa-github-alt', 'fa-github-square', 'fa-gittip', 'fa-google-plus', 'fa-google-plus-square', 'fa-html5', 'fa-instagram', 'fa-linkedin', 'fa-linkedin-square', 'fa-linux', 'fa-maxcdn', 'fa-pagelines', 'fa-pinterest', 'fa-pinterest-square', 'fa-renren', 'fa-skype', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-trello', 'fa-tumblr', 'fa-tumblr-square', 'fa-twitter', 'fa-twitter-square', 'fa-vimeo-square', 'fa-vk', 'fa-weibo', 'fa-windows', 'fa-xing', 'fa-xing-square', 'fa-youtube', 'fa-youtube-play', 'fa-youtube-square']
      },
      {
        title: 'Medical Icons',
        list: ['fa-ambulance', 'fa-h-square', 'fa-hospital-o', 'fa-medkit', 'fa-plus-square', 'fa-stethoscope', 'fa-user-md', 'fa-wheelchair']
      }
    ],
    tpl: [
      '<div class="travel-icon">',
        '<%# layui.each(d, function(index, item){ %>',
          '<%# if(item.title){ %>',
          '<h2 class="title"><%item.title%></h2>',
          '<%# } %> ',
          '<ul class="layui-row">',
            '<%# layui.each(item.list, function(index1, item1){ %>',
              '<li class="layui-col-xs3" data-icon="<%item1%>"><i class="fa <%item1%>"></i> <%item1%></li>',
            '<%# }); %>',
          '</ul>',
        '<%# }); %>',
      '</div>'
    ].join(''),
    select: function(callback) { // 选择icon
      var layerIdx
      laytpl(this.tpl).render(this.data, function(html){
        layerIdx = layer.open({
          type: 1,
          title: "选择样式",
          area: ['800px', '600px'],
          maxmin: true,
          shadeClose: true,
          content: html
        })
      })

      $('.layui-layer-content').on('click', '.travel-icon li', function(e){
        var icon = $(e.currentTarget).data('icon')
        if (icon && callback) {
          callback(icon)
          layer.close(layerIdx)
        }
      })
    }
  }

  exports('icon', Icon)
})

