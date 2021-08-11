"use strict";

$('.sidebar').sidebar('setting', 'transition', 'overlay');
$('.sidebar .item').click(function () {
  return $('.sidebar').sidebar('hide');
});
$(document).on('click', '#menu-button', function () {
  return $('.sidebar').sidebar('toggle');
});