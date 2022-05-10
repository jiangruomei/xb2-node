const nature = () => {
  console.log('1');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('2');
    }, 2000);
  });
};

nature().then(data => {
  console.log(data);
});

console.log('3');
