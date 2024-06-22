const Record = require("../models/Record");

const saveRecord = async (recordData) => {
  try {
    const record = new Record(recordData);
    console.log("갑자기 왜 돼", recordData);
    await record.save();
    console.log("success", record);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

const getAllRecords = async () => {
  try {
    const records = await Record.find();
    return records;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

// 유저의 id와 맞는 기록 조회 - 송성우
async function userRecodeList(userData) {
  try {
    const recordList = await Record.find({ userId: { $in: userData } });
    if (!recordList) {
      return { message: "no recode List" };
    }

    return recordList;
  } catch (err) {
    return { message: "recode find mongoDB error" };
  }
}

module.exports = {
  saveRecord,
  getAllRecords,
  userRecodeList,
};
