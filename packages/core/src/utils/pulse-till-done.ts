import { log } from '@lerna-lite/npmlog';

let pulsers = 0;
let pulse: any;

function pulseStart(prefix: string | Promise<unknown>) {
  pulsers += 1;

  if (pulsers > 1) {
    return;
  }

  pulse = setInterval(() => log.gauge.pulse(prefix), 150);
}

function pulseStop() {
  pulsers -= 1;

  if (pulsers > 0) {
    return;
  }

  clearInterval(pulse);
}

export function pulseTillDone(prefix: string | Promise<unknown>, promise?: Promise<any> | string) {
  if (!promise) {
    promise = prefix;
    prefix = '';
  }

  pulseStart(prefix);

  return Promise.resolve(promise).then(
    (val) => {
      pulseStop();
      return val;
    },
    (err) => {
      pulseStop();
      throw err;
    }
  );
}
