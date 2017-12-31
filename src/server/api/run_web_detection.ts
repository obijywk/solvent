import { Express } from "express";

import { badRequest, internalServerError } from "./error_response";

// tslint:disable:no-var-requires
const vision = require("@google-cloud/vision");
// tslint:enable:no-var-requires
const visionClient = new vision.ImageAnnotatorClient();

import {
  RUN_WEB_DETECTION_URL,
  RunWebDetectionRequest,
  RunWebDetectionResponse,
  RunWebDetectionResult,
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
      runWebDetectionResponse.results = [];
      for (const webEntity of response[0].webDetection.webEntities) {
        runWebDetectionResponse.results.push({
          description: webEntity.description,
          score: webEntity.score,
        });
      }
      res.send(runWebDetectionResponse);
    }).catch((err: Error) => {
      internalServerError(res, err.toString());
    });
  });
}
