import { Stream } from '@coda/prelude';
import leap_ from './leapmotion';
import myo_ from './myo';
import devicemotion_ from './devicemotion';
import smartphone_ from './smartphone';
import riot_ from './riot';

function streamifyFinger(f) {
  return {
    carpPosition: new Stream(f.carpPosition),
    dipPosition: new Stream(f.dipPosition),
    mcpPosition: new Stream(f.mcpPosition),
    pipPosition: new Stream(f.pipPosition),
    tipPosition: new Stream(f.tipPosition),
    tipVelocity: new Stream(f.tipVelocity),
    stabilizedTipPosition: new Stream(f.stabilizedTipPosition),
    direction: new Stream(f.direction),
    extended: new Stream(f.extended),
    length: new Stream(f.length),
    width: new Stream(f.width),
  };
}

function streamifyHand(h) {
  return {
    visible: new Stream(h.visible),
    confidence: new Stream(h.confidence),
    direction: new Stream(h.direction),
    grabStrength: new Stream(h.grabStrength),
    palmPosition: new Stream(h.palmPosition),
    palmVelocity: new Stream(h.palmVelocity),
    palmNormal: new Stream(h.palmNormal),
    pinchStrength: new Stream(h.pinchStrength),
    sphereCenter: new Stream(h.sphereCenter),
    sphereRadius: new Stream(h.sphereRadius),
    thumb: streamifyFinger(h.thumb),
    index: streamifyFinger(h.index),
    middle: streamifyFinger(h.middle),
    pinky: streamifyFinger(h.pinky),
    ring: streamifyFinger(h.ring),
  };
}

export function leapmotion({ period = 0 } = {}) {
  const l = leap_({ period });
  return {
    hands: {
      left: streamifyHand(l.hands.left),
      right: streamifyHand(l.hands.right),
    },
    raw: new Stream(l.raw),
  };
}

export async function myo(name) {
  const m = await myo_(name);
  return {
    emg: new Stream(m.emg),
    acc: new Stream(m.acc),
    gyro: new Stream(m.gyro),
    quat: new Stream(m.quat),
    pose: new Stream(m.pose),
    pose_off: new Stream(m.pose_off),
  };
}

export function devicemotion() {
  const dm = devicemotion_();
  return {
    accG: new Stream(dm.accG),
    acc: new Stream(dm.acc),
    gyro: new Stream(dm.gyro),
  };
}

export function smartphone(name) {
  const sm = smartphone_(name);
  return {
    acc: new Stream(sm.acc),
    accG: new Stream(sm.accG),
    gyro: new Stream(sm.gyro),
  };
}

export function riot(name) {
  const sm = riot_(name);
  return {
    acc: new Stream(sm.acc),
    gyro: new Stream(sm.gyro),
    magneto: new Stream(sm.magneto),
    quat: new Stream(sm.quat),
    euler: new Stream(sm.euler),
  };
}
