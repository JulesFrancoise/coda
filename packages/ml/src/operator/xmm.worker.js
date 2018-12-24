import * as xmm from 'xmm';

function recreateTrainingSet(trainingSet) {
  const ts = xmm.TrainingSet({
    inputDimension: trainingSet.inputDimension,
    outputDimension: trainingSet.outputDimension,
    columnNames: trainingSet.columnNames,
  });
  Object.keys(trainingSet.phrases).forEach((phraseIndex) => {
    const p = trainingSet.phrases[phraseIndex];
    const phrase = ts.push(phraseIndex, p.label);
    phrase.inputData = p.inputData;
    phrase.outputData = p.outputData;
    phrase.length = p.length;
  });
  return ts;
}

function trainGMM(trainingSet, configuration) {
  try {
    const params = xmm.trainMulticlassGMM(
      recreateTrainingSet(trainingSet),
      configuration,
    );
    return params;
  } catch (e) {
    postMessage({
      type: 'error',
      message: `An error occurred during the training: ${e}`,
    });
  }
  return null;
}

function trainHMM(trainingSet, configuration) {
  try {
    const params = xmm.trainMulticlassHMM(
      recreateTrainingSet(trainingSet),
      configuration,
    );
    return params;
  } catch (e) {
    postMessage({
      type: 'error',
      message: `[XMM Worker] An error occurred during the training: ${e}`,
    });
  }
  return null;
}

onmessage = function onmessage(e) {
  if (!e.data || !e.data.type) {
    postMessage({
      type: 'error',
      message: '[XMM Worker] Invalid message',
    });
  }
  if (e.data.type === 'connect') {
    postMessage({
      type: 'connection',
    });
  } else if (e.data.type === 'train') {
    const { trainingSet, configuration, modelType } = e.data;
    const f = modelType === 'gmm' ? trainGMM : trainHMM;
    const params = f(trainingSet, configuration);
    postMessage({
      type: 'model',
      params,
    });
  } else {
    postMessage({
      type: 'error',
      message: '[XMM Worker] Invalid message type',
    });
  }
};
