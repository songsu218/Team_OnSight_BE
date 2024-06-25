const Record = require('../models/Record');
const User = require('../models/User');

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

// 유저의 id와 맞는 기록 조회 - 송성우
async function userRecodeList(userData) {
  try {
    const recordList = await Record.find({ userId: { $in: userData } });
    if (!recordList) {
      return { message: 'no recode List' };
    }

    return recordList;
  } catch (err) {
    return { message: 'recode find mongoDB error' };
  }
}

// 암장상세->기록에 보여지는 닉네임, 기록수, 프사 - 이주비
const getCenterRecords = async (center) => {
  try {
    const records = await Record.find({ center });
    return records;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

// 유저 정보를 포함한 기록 조회
const getCenterRecordsWithUser = async (center) => {
  try {
    const records = await Record.find({ center }).populate({
      path: 'userId',
      select: 'thumbnail nick recordcount',
      options: { lean: true },
    });
    // 기본값 0으로 설정
    records.forEach((record) => {
      if (!record.userId.recordcount) {
        record.userId.recordcount = 0;
      }
    });

    return records;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

module.exports = {
  saveRecord,
  getAllRecords,
  userRecodeList,
  getCenterRecords,
  getCenterRecordsWithUser,
};
