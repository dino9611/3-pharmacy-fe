const ColorToHex = (color) => {
  var hexadecimal = color.toString(16);
  return hexadecimal.length === 1 ? '0' + hexadecimal : hexadecimal;
};

export const RGBToHex = (red, green, blue) => {
  return '#' + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
};

export const HexToRGB = (hex) => {
  let red = parseInt(hex[1] + hex[2], 16);
  let green = parseInt(hex[3] + hex[4], 16);
  let blue = parseInt(hex[5] + hex[6], 16);
  // return `rgb(${red}, ${green}, ${blue})`;
  return [red, green, blue];
};

export const GenColors = (hex, translate) => {
  const rgb = HexToRGB(hex);
  const colors = {};
  for (let i = 1; i <= 4; i++) {
    colors[i * 100] = RGBToHex(
      ...rgb.map((el) => Math.round(el - translate * i))
    );
  }
  colors[450] = hex; // root color
  for (let i = 5; i <= 9; i++) {
    colors[i * 100] = RGBToHex(
      ...rgb.map((el) => Math.round(el + translate * i))
    );
  }
  return colors;
};
