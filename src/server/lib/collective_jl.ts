import * as _ from "lodash";

// tslint:disable-next-line:no-var-requires
const collectiveJl = require("../../../build/Release/collective_jl");

export interface IFeatureResult {
  description: string;
  probability: number;
  satisfied: string[];
}

export const buildCorpus: (words: string[]) => void = collectiveJl.buildCorpus;
export const analyze: (words: string[]) => IFeatureResult[] = collectiveJl.analyze;

export function sortAndFilter(results: IFeatureResult[], maxResults: number = 10): IFeatureResult[] {
  return _.chain(results)
    .sortBy("probability")
    .take(maxResults)
    .value();
}
