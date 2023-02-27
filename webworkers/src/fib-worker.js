const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

onmessage = (e) => {
  postMessage({
    type:'update',
    message:'...working on it'
  });
  
  console.log('running operation');
  const { num } = e.data;
  const startTime = new Date().getTime();
  const fibNum = fib(num);

  console.log('finished operation');

  postMessage({
    fibNum,
    time: new Date().getTime() - startTime,
  });
};