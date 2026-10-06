'use strict';

const h = document.querySelector('.h');
const m = document.querySelector('.m');
const s = document.querySelector('.s');

const skipButton = document.querySelector('.skip-timer');
const alertBox = document.querySelector('.alert-box');
let finished = false;

let timeS = Number(s.textContent);
let timeM = Number(m.textContent);
let timeH = Number(h.textContent);
const initialTime = { hours: timeH, minutes: timeM, seconds: timeS };

function renderTime() {
  s.textContent = timeS;
  m.textContent = timeM;
  h.textContent = timeH;
}

function advanceTime() {
  if (finished) return;
  timeS--;
  if (timeS < 0) {
    timeS = 59;
    timeM--;
  }
  if (timeM < 0) {
    timeM = 59;
    timeH--;
  }
  if (timeH < 0) {
    timeH = 0;
    timeM = 0;
    timeS = 0;
  }
  renderTime();
  if (timeH === 0 && timeM === 0 && timeS === 0) {
    finishTimer();
  }
}

async function finishTimer() {
  if (finished) return;
  finished = true;
  timeH = 0;
  timeM = 0;
  timeS = 0;

  renderTime();

  clearInterval(timer);
  skipButton.disabled = true;

  alertBox.hidden = false;
  const lastLine = alertBox.querySelector('.truth-line:last-child');
  // Wait for the final line's CSS animation, including its delay.
  await Promise.all(
    lastLine.getAnimations().map((animation) => animation.finished),
  );

  const crossAnimation = alertBox
    .querySelector('.alert-cross')
    .animate([{ opacity: 0 }, { opacity: 0.35 }], {
      duration: 3000,
      fill: 'forwards',
      easing: 'ease-in-out',
    });
  await crossAnimation.finished;

  // Reset underneath the overlay, then reveal the countdown.
  timeH = initialTime.hours;
  timeM = initialTime.minutes;
  timeS = initialTime.seconds;
  renderTime();
  const fadeOut = alertBox.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 3000,
    delay: 1500,
    fill: 'forwards',
    easing: 'ease-in-out',
  });
  await fadeOut.finished;
  alertBox.hidden = true;
  crossAnimation.cancel();
  fadeOut.cancel();
  finished = false;
  skipButton.disabled = false;
  timer = setInterval(advanceTime, 1000);
}

let timer = setInterval(advanceTime, 1000);
skipButton.addEventListener('click', finishTimer);
