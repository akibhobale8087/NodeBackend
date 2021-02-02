"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchController = void 0;

var _Response = _interopRequireDefault(require("../utils/Response"));

var _constants = require("../constants");

var _models = require("../models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const searchController = {
  search
};
exports.searchController = searchController;

async function search(req, res) {
  try {
    // return await UserModel.updateMany(
    // 	{},
    // 	{
    // 		$set: {
    // 			"location.coordinates.0": 73.243256,
    // 			"location.coordinates.1": 16.704987,
    // 		},
    // 	},
    // 	{ location: 1 }
    // );
    let {
      latitude,
      longitude
    } = JSON.parse(req.query.startlocation); // let { _id } = req.user;
    // let { filter } = await UserModel.findById(_id, { filter: 1 });
    // let {
    // 	looking_for = null,
    // 	carType = null,
    // 	range = null,
    // 	location = null,
    // } = filter;
    // let $and = [];
    // if (looking_for) $and.push({ gender: looking_for });
    // if(carType)$and.push({ carType: looking_for });
    // if(carType)$and.push({ carType: looking_for });

    let result = await _models.UserModel.aggregate([{
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        //distanceMultiplier: 0.001,
        maxDistance: 20,
        spherical: true,
        distanceField: "calcDistance" // distanceField: "dist.calculated",
        //distanceField: "distance",

      }
    }]);
    return res.status(200).json(result);
  } catch (error) {
    return res.send(_Response.default.sendResponse(false, null, error.message, _constants.StatusCode.INTERNAL_SERVER_ERROR));
  }
}