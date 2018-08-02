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
      message: `An error occurred during the training: ${e}`,
    });
  }
  return null;
}

onmessage = function onmessage(e) {
  const { trainingSet, configuration, type } = e.data;
  const f = type === 'gmm' ? trainGMM : trainHMM;
  const params = f(trainingSet, configuration);
  postMessage({
    type: 'model',
    params,
  });
};
