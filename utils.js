module.exports.printPos = function(pos, prefix) {
    var prefixText = prefix ? prefix + ' ' : '';
    var coordsText = '(' + pos.x + ',' + pos.y + ')';

    console.log(prefixText  + coordsText);
}