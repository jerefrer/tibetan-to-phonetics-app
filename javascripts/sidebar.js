$('.sidebar').sidebar('setting', 'transition', 'overlay');

$('.sidebar .item').click(() => $('.sidebar').sidebar('hide'));

$(document).on('click', '#menu-button', () => $('.sidebar').sidebar('toggle'));