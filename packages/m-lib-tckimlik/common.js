M.L.TCKimlikFormatCheck = tckimlikno =>{
  const value = tckimlikno;
  const isEleven = /^[0-9]{11}$/.test(value);
  let totalX = 0;
  for (let i1 = 0; i1 < 10; i1++) {
    totalX += Number(value.substr(i1, 1));
  }
  const isRuleX = totalX % 10 === Number(value.substr(10,1));
  let totalY1 = 0;
  let totalY2 = 0;
  for (let i2 = 0; i2 < 10; i2+=2) {
    totalY1 += Number(value.substr(i2, 1));
  }
  for (let i3 = 1; i3 < 10; i3+=2) {
    totalY2 += Number(value.substr(i3, 1));
  }
  const isRuleY = ((totalY1 * 7) - totalY2) % 10 === Number(value.substr(9,0));
  return isEleven && isRuleX && isRuleY;
};
