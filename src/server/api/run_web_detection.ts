import { Express } from "express";

import { badRequest, internalServerError } from "./error_response";

// tslint:disable:no-var-requires
const vision = require("@google-cloud/vision");
// tslint:enable:no-var-requires
const visionClient = new vision.ImageAnnotatorClient();

import {
  EntityResult,
  RUN_WEB_DETECTION_URL,
  RunWebDetectionRequest,
  RunWebDetectionResponse,
} from "../../api/run_web_detection";

export function install(app: Express) {
  app.post(RUN_WEB_DETECTION_URL, (req, res) => {
    const runWebDetectionRequest = req.body as RunWebDetectionRequest;
    const request = {
      features: [
        {
          maxResults: 20,
          type: "WEB_DETECTION",
        },
      ],
      image: {
        content: runWebDetectionRequest.imageContent,
      },
    };
    visionClient.annotateImage(request).then((response: any) => {
      const runWebDetectionResponse = new RunWebDetectionResponse();

      runWebDetectionResponse.entityResults = [];
      for (const webEntity of response[0].webDetection.webEntities) {
        runWebDetectionResponse.entityResults.push({
          description: webEntity.description,
          score: webEntity.score,
        });
      }

      runWebDetectionResponse.pageResults = [];
      for (const webPage of response[0].webDetection.pagesWithMatchingImages) {
        runWebDetectionResponse.pageResults.push(webPage.url);
      }

      res.send(runWebDetectionResponse);
    }).catch((err: Error) => {
      internalServerError(res, err.toString());
    });
  });
}
