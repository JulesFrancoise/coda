/* esdoc-ignore */
import { Stream } from '@coda/prelude';
import myo_ from './myo';

// eslint-disable-next-line import/prefer-default-export
export const myo = (name) => {
  const m = myo_(name);
  return {
    emg: new Stream(m.emg),
    acc: new Stream(m.acc),
    gyro: new Stream(m.gyro),
    quat: new Stream(m.quat),
    pose: new Stream(m.pose),
    pose_off: new Stream(m.pose_off),
  };
};
