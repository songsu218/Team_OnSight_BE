const Record = require('../models/Record');

const saveRecord = async (recordData) => {
  try {
    const record = new Record(recordData);
    console.log('갑자기 왜 돼', recordData);
    await record.save();
    console.log('success', record);
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const getAllRecords = async () => {
  try {
    const records = await Record.find();
    return records;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

module.exports = {
  saveRecord,
  getAllRecords,
};
