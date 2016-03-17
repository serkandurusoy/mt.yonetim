M.L.TCKimlikFormatCheck = function(tckimlikno) {
  var value = tckimlikno;
  var isEleven = /^[0-9]{11}$/.test(value);
  var totalX = 0;
  for (var i1 = 0; i1 < 10; i1++) {
    totalX += Number(value.substr(i1, 1));
  }
  var isRuleX = totalX % 10 === Number(value.substr(10,1));
  var totalY1 = 0;
  var totalY2 = 0;
  for (var i2 = 0; i2 < 10; i2+=2) {
    totalY1 += Number(value.substr(i2, 1));
  }
  for (var i3 = 1; i3 < 10; i3+=2) {
    totalY2 += Number(value.substr(i3, 1));
  }
  var isRuleY = ((totalY1 * 7) - totalY2) % 10 === Number(value.substr(9,0));
  return isEleven && isRuleX && isRuleY;
};
