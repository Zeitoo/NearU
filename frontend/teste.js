const regex = /^\+[1-9]\d{1,14}$/;

const str = "+258 87 131 5904".replaceAll(" ", "")

console.log(regex.test(str))