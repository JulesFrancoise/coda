/* esdoc-ignore */
import { Stream } from '@coda/prelude';
import leap_ from './leapmotion';

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

// eslint-disable-next-line import/prefer-default-export
export const leapmotion = ({ period = 0 } = {}) => {
  const l = leap_({ period });
  return {
    hands: {
      left: streamifyHand(l.hands.left),
      right: streamifyHand(l.hands.right),
    },
    raw: new Stream(l.raw),
  };
};
