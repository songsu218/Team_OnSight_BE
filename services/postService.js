const Record = require("../models/Record");
const User = require("../models/User");

const saveRecord = async (recordData) => {
  try {
    const record = await Record.create(recordData);
    console.log("Record saved:", record);

    const user = await User.findOneAndUpdate(
      { id: recordData.userId },
      { $inc: { recordcount: 1 } },
      { new: true }
    );

    if (!user) {
      console.error(`User not found with userId: ${recordData.userId}`);
      return { status: 404, message: "사용자를 찾을 수 없습니다." };
    }

    return {
      status: 200,
      message: "기록이 성공적으로 저장되었습니다.",
      record,
    };
  } catch (error) {
    console.error("기록 저장 중 오류 발생:", error);
    if (error.name === "ValidationError") {
      return { status: 400, message: error.message };
    }
    return {
      status: 500,
      message: "서버 오류가 발생했습니다. 다시 시도해 주세요.",
    };
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

// 암장상세 - 이주비
const getCenterRecords = async (center) => {
  try {
    const records = await Record.find({ center });
    return records;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

// 유저 정보를 포함한 기록 조회
const getCenterRecordsWithUser = async (center) => {
  console.log();
  try {
    const records = await Record.find({ center });
    const recordsWithUserDetails = await Promise.all(
      records.map(async (record) => {
        const user = await User.findOne({ id: record.userId });
        if (user) {
          return {
            ...record.toObject(),
            userThumbnail: user.thumbnail,
            userRecordCount: user.recordcount,
          };
        }
        return {
          ...record.toObject(),
          userThumbnail: null,
          userRecordCount: 0,
        };
      })
    );
    return recordsWithUserDetails;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

async function postList(centerId) {
  console.log("centerId", centerId);
  try {
    const records = await Record.find({ center: centerId });
    if (!records) {
      return { message: "no record List" };
    }

    const recordsWithUserDetails = await Promise.all(
      records.map(async (record) => {
        const user = await User.findOne({ id: record.userId });
        if (user) {
          return {
            ...record.toObject(),
            userThumbnail: user.thumbnail,
            userRecordCount: user.recordcount,
          };
        }
        return {
          ...record.toObject(),
          userThumbnail: null,
          userRecordCount: 0,
        };
      })
    );
    return recordsWithUserDetails;
  } catch (err) {
    console.log("postList 에러남");
    return { message: err.message };
  }
}

module.exports = {
  saveRecord,
  getAllRecords,
  userRecodeList,
  getCenterRecords,
  getCenterRecordsWithUser,
  postList,
};
