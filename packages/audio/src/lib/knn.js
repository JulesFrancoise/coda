/*
 * Original code from:
 *
 * ml.js KNN implementation
 *
 * https://github.com/mljs/knn/
 *
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
import { euclidean } from 'ml-distance-euclidean';
import KDTree from './kdtree';

/**
 * @ignore
 */
export default class KNN {
  /**
   * @param {Array} dataset
   * @param {object} options
   * @param {number} [options.k=1] - Number of neighbors to classify.
   * @param {function} [options.distance=euclideanDistance] - Distance function that takes
   * two parameters.
   */
  constructor(dataset, options = {}) {
    const { distance = euclidean, k = 1 } = options;

    const points = new Array(dataset.length);
    for (let i = 0; i < points.length; i += 1) {
      points[i] = [...dataset[i], i];
    }

    this.kdTree = new KDTree(points, distance);
    this.k = k;
    this.isEuclidean = distance === euclidean;
  }

  /**
   * Create a new KNN instance with the given model.
   * @param {object} model
   * @param {function} distance=euclidean - distance function must be provided if the
   * model wasn't trained with euclidean distance.
   * @return {KNN}
   */
  static load(model, distance = euclidean) {
    if (model.name !== 'KNN') {
      throw new Error(`invalid model: ${model.name}`);
    }
    if (!model.isEuclidean && distance === euclidean) {
      throw new Error('a custom distance function was used to create the model. Please provide it again');
    }
    if (model.isEuclidean && distance !== euclidean) {
      throw new Error('the model was created with the default distance function. Do not load it with another one');
    }
    const knn = new KNN([], {
      k: model.k,
      distance,
    });
    knn.kdTree = new KDTree(model.kdTree, distance);
    knn.k = model.k;
    knn.isEuclidean = model.isEuclidean;
    return knn;
  }

  /**
   * Return a JSON containing the kd-tree model.
   * @return {object} JSON KNN model.
   */
  toJSON() {
    return {
      name: 'KNN',
      kdTree: this.kdTree,
      k: this.k,
      classes: Array.from(this.classes),
      isEuclidean: this.isEuclidean,
    };
  }

  /**
   * Predicts the output given the matrix to predict.
   * @param {Array} dataset
   * @return {Array} predictions
   */
  predict(frame) {
    return this.kdTree
      .nearest((typeof frame === 'number') ? [frame] : frame, this.k)
      .map(x => ({
        data: x[0].slice(0, x[0].length - 1),
        index: x[0][x[0].length - 1],
        distance: x[1],
      }));
  }
}
