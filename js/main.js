import { Accord } from './accord.js';

const accord = new Accord({
    // activeAccord: 2

});

const $btn = $(".accordeon__button-btn")

$btn.on('click', event => accord.setActiveAccord($(event.currentTarget).attr("data-id")))

$('#prev').on('click', event => accord.prev());
$('#next').on('click', event => accord.next());