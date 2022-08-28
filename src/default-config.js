
module.exports = {
  segments: {
    final: {
      elements: ["final", "fin"],
      directory: "fin"
    },
    gray: {
      elements: ["greyscale", "grey", "gray", "grayscale"],
      not:["final"],
      directory: "grayscale"
    },
    crop: {
      elements: ["crop", "cropped"],
      not:["final"],
      directory: "cropped"
    },
    threshold: {
      elements: ["thresh", "threshold"],
      not:["final"],
      directory: "threshold"
    },
    no_segs: {
      directory: "raw"
    }
  },
  fileExtensions: ["png", "jpg", "jpeg", "webp"]
}