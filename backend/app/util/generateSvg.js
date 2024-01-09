
const exporter = require('highcharts-export-server');

const generateSvg = async (settings) => {
  // Set the new options and merge it with the default options
  const options = exporter.setOptions(settings);

  // Initialize a pool of workers
  await exporter.initPool(options);

  // Perform an export
  exporter.startExport(settings, async function (res, err) {
    exporter.killPool();
    return res.data;
  });
}

module.exports = {
  generateSvg,
}
