$(function () {
  // node
  var $doc = $(document);
  var $mask = $('.mask');
  var $modalAdd = $('.modal-nocar');
  var $modalHas = $('.modal-hascar');
  // domain
  var feDomain = 'https://store4.m.jd.com';
  var beDomain = 'https://bargain4.m.jd.com';
  // store
  var getLoginStatus = null;
  var params = {
    venueUrl: '',
  };

  bindEvent();
  getDefaultCar();
  getModal();

  function saveLoginFlag() {
    var status = false;
    getLoginStatus = function () {
      return status;
    };
  };

  function bindEvent() {
    $doc.on('click', '.close', function(){
      closeAllModal();
    });
    $doc.on('click', '.btn-group .left', function(){
      closeAllModal();
      push(params.venueUrl + '#carFlag');
    });
    $doc.on('click', '.add', function () {
      if (getLoginStatus && !getLoginStatus()) {
        goLogin();
        return;
      }
      window.location.href = feDomain + '/h5/list.html?source=campaignBak';
    });
    $doc.on('click', '.edit-car, .btn-group .right', function () {
      window.location.href = feDomain + '/h5/carManageForApp.html?source=campaignBak';
    });
    $doc.on('click', '.fuli', function () {
      window.location.href = 'https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html#/journey';
    });
  };

  function push (url) {
    window.location.href = url;
  };

  function getDefaultCar() {
    $.ajax({
      url: beDomain + '/mClient/userCar/v2/getDefaultCar?source=53',
      dataType: 'jsonp',
      success: function (res) {
        if (res && res.code === '107') {
          saveLoginFlag();
        }
        if (res && res.code === '0') {
          handleDefaultCar(res.data);
        }
      },
    });
  };

  function getModal() {
    $.ajax({
      url: beDomain + '/mClient/act/carAdding/guideTip?source=54',
      dataType: 'jsonp',
      success: function (res) {
        if (res && res.code === '107') {
          showAddCarModal();
        }
        if (res && res.code === '0' && res.data) {
          handleModal(res.data);
        }
      },
    });
  };

  function renderCarInfo(data) {
    var brand = data.brandName || '';
    var series = data.seriesName || '';
    var mileage = data.mileage || '-';
    var imgUrl = '//img13.360buyimg.com/charity/s100x100_' + data.logoUrl;
    $('.has-car').css('display', 'block');
    $('.no-car').css('display', 'none');
    $('.car-info .logo').attr('src', imgUrl);
    $('.car-info .info').text(brand + ' ' + series);
    $('.milege').text(mileage + 'km');
  };

  function handleDefaultCar(data) {
    if (!data) {
      return;
    };
    renderCarInfo(data);
  };

  function handleModal(data) {
    if (!data.show) {
      return;
    }
    if (data.hasCar) {
      params.venueUrl = data.venueUrl;
      showGetCouponModal();
    } else {
      showAddCarModal();
    }
  }

  function showAddCarModal() {
    $mask.removeClass('hidden');
    $modalAdd.removeClass('hidden');
  }

  function showGetCouponModal() {
    $mask.removeClass('hidden');
    $modalHas.removeClass('hidden');
  }

  function closeAllModal() {
    $mask.addClass('hidden');
    $modalAdd.addClass('hidden');
    $modalHas.addClass('hidden');
  }

  function goLogin() {
    var goUrl = location.href;
    var setting = getLoginCodeType();
    if (setting == 'wx' || setting == 'qq') {
      window.location.href = '//wq.jd.com/pinbind/pintokenredirect?biz=car' + '&url=' + encodeURIComponent(goUrl)
    } else {
      window.location.href = '//passport.m.jd.com/user/login.action?v=t' + '&returnurl=' + encodeURIComponent(goUrl)
    }
  };

  function getLoginCodeType() {
    var loginCodeType = '';
    var ua = navigator.userAgent.toLowerCase();
    var isWX = window.WeixinJSBridge;
    var isMQQ = false;
    var isApp = false;
    if (!isWX) {
      isWX = ua.match(/micromessenger/) ? true : false;
    }
    if (/qq\/([\d\.]+)*/.test(ua)) { // eslint-disable-line
      isMQQ = true;
    }
    isApp = ua.match(/jdapp/) ? true : false;
    if (!isApp) {
      isApp = ua.match(/jdcar_ios/) || ua.match(/jdcar_android/) ? true : false;
    }
    if (isWX) {
      loginCodeType = 'wx';
    } else if (isMQQ) {
      loginCodeType = 'qq';
    } else if (isApp) {
      loginCodeType = 'app';
    } else {
      loginCodeType = 'h5'
    }
    return loginCodeType;
  };

});
