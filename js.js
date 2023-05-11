const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./bg.png";

let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

let index = 0,
  bestScr = 0,
  flight,
  flyHeight,
  currentScore,
  pillars;

// Setting up pillars
const widthOfPillars = 78;
const gapBetweenPillars = 270;
const pipeLoc = () =>
  Math.random() *
    (canvas.height - (gapBetweenPillars + widthOfPillars) - widthOfPillars) +
  widthOfPillars;

const setup = () => {
  currentScore = 0;
  flight = jump;

  flyHeight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [
      canvas.width + i * (gapBetweenPillars + widthOfPillars),
      pipeLoc(),
    ]);
};

const render = () => {
  // make the pillars and bird moving
  index++;
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(index * (speed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  // pillars display
  if (gamePlaying) {
    pipes.map((pillars) => {
      // pillars moving
      pillars[0] -= speed;

      // pillars on top
      ctx.drawImage(
        img,
        432,
        588 - pillars[1],
        widthOfPillars,
        pillars[1],
        pillars[0],
        0,
        widthOfPillars,
        pillars[1]
      );
      // pillars on bottom
      ctx.drawImage(
        img,
        432 + widthOfPillars,
        108,
        widthOfPillars,
        canvas.height - pillars[1] + gapBetweenPillars,
        pillars[0],
        pillars[1] + gapBetweenPillars,
        widthOfPillars,
        canvas.height - pillars[1] + gapBetweenPillars
      );

      // give 1 point & create new pillars
      if (pillars[0] <= -widthOfPillars) {
        currentScore++;
        // check if it's the best score
        bestScr = Math.max(bestScr, currentScore);

        // remove & create new pillars
        pipes = [
          ...pipes.slice(1),
          [
            pipes[pipes.length - 1][0] + gapBetweenPillars + widthOfPillars,
            pipeLoc(),
          ],
        ];
        console.log(pipes);
      }

      // End if hit the pillars
      if (
        [
          pillars[0] <= cTenth + size[0],
          pillars[0] + widthOfPillars >= cTenth,
          pillars[1] > flyHeight ||
            pillars[1] + gapBetweenPillars < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }
  // draw bird
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;
    // text accueil
    ctx.fillText(`Best score : ${bestScr}`, 85, 245);
    ctx.fillText("Click to play", 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById("bestScr").innerHTML = `Best : ${bestScr}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Current : ${currentScore}`;

  window.requestAnimationFrame(render);
};

setup();
img.onload = render;

document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
