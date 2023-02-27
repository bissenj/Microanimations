const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

const ordinal_suffix = (num) => {
  // 1st, 2nd, 3rd, 4th, etc.
  const j = num % 10;
  const k = num % 100;
  switch (true) {
    case j === 1 && k !== 11:
      return num + "st";
    case j === 2 && k !== 12:
      return num + "nd";
    case j === 3 && k !== 13:
      return num + "rd";
    default:
      return num + "th";
  }
};

const textCont = (n, fibNum, time) => {
  const nth = ordinal_suffix(n);
  const seconds = time / 1000;
  return `
  <p id='timer'>Time: <span class='bold'>${seconds}s</span></p>
  <p><span class="bold" id='nth'>${nth}</span> fibonnaci number: <span class="bold" id='sum'>${fibNum}</span></p>
  `;
};


// --------------------------------------------------------------------


const errPar = document.getElementById("error");
const btn = document.getElementById("submit-btn");
const input = document.getElementById("number-input");
const resultsContainer = document.getElementById("results-container");


btn.addEventListener("click", (e) => {
  errPar.textContent = "";
  const num = window.Number(input.value);
  if (num < 2) {
    errPar.textContent = "Please enter a number greater than 2";
    return;
  }
  if (num > 50) {
    errPar.textContent = "Choose a smaller number or this will take forever.";
    return;
  }

  // Create a new row for the current operation
  const newRow = createRow();

  // Fire up a web worker
  const worker = new window.Worker("src/fib-worker.js");
  worker.postMessage({ num });
  worker.onerror = (err) => err;
  worker.onmessage = (e) => {
    console.log('Got Message from Worker: ', e);

    // Update message - just display the new message
    if (e.data.type == 'update') {
        const { message } = e.data;
        newRow.innerHTML = `<p>${message}</p>`;
    }
    else {  // We're done - Clean up the web worker
        const { time, fibNum } = e.data;
        updateRow(newRow, num, fibNum, time);
        worker.terminate();
    }
  };
});


function createRow() {
    const resultDiv = document.createElement("div");
    resultDiv.innerHTML = "<p>Loading..</p>"
    resultDiv.className = "result-div loading";

    const result = resultsContainer.appendChild(resultDiv);
    return result;
}

function updateRow(targetEl, num, fibNum, time) {
    targetEl.innerHTML = textCont(num, fibNum, time);
    targetEl.classList.remove('loading');
}