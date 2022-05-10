const nature = () => {
  console.log('1');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('2');
    }, 2000);
  });
};

const demo = async () => {
  const data = await nature();
  console.log(data);
};

demo();

console.log('3');
