const Challenge = require("../models/Challenge");
const User = require("../models/User");
const Record = require("../models/Record");
const hashUtils = require("../utils/hashUtils");
const env = require("../config/env");
const jwt = require("jsonwebtoken");
const climbingCenter = require("../models/climbingCenter");

//Challenge 등록
async function register(ChallengeData) {
  //date "2024-01-01"
  const sdate = new Date(ChallengeData.date);
  let edate = new Date(ChallengeData.date);
  edate.setDate(sdate.getDate()+7);

  const climbingCenters = await climbingCenter.findOne({
    center : ChallengeData.center,
  },
  { thumbnail : 1,address : 1}
);
  
  const ChallengeDoc = await Challenge.create({
    challengename: ChallengeData.challengename,
    id: ChallengeData.id,
    center: ChallengeData.center,
    address: climbingCenters.address,
    date: [sdate,edate],
    members: [ChallengeData.id],
    thumbnail : climbingCenters.thumbnail
  });
  return ChallengeData;
}

//challenge 참가등록
async function challegeEnter(ChallengeData) {
  const ChallengeDoc = await Challenge.findOne({
    challengename: ChallengeData.challengename,
  });
  if (!ChallengeDoc) {
    return { message: "nochallenge" };
  }
  const ChallengeDoc2 = await ChallengeDoc.updateOne({
    $addToSet: { members: ChallengeData.members },
  });

  return ChallengeData;
}

//challengeMyList 챌린지 나의 목록
async function challengeMyList(ChallengeData) {
  try {
    let records = null;
    if (ChallengeData.member_id != null && ChallengeData.member_id != "") {
      if (ChallengeData.STATE == "TOT") {
        //전체 챌린지 리스트
        records = await Challenge.find({ members: ChallengeData.member_id })
          .sort({ _id: -1 })
          .lean()
          .exec();
      } else if (ChallengeData.STATE == "NOW") {
        //현재 챌린지 리스트
        records = await Challenge.find({
          "date.1": { $gte: new Date() },
          members: ChallengeData.member_id,
        })
          .sort({ _id: -1 })
          .lean()
          .exec();
      } else {
        //과거 챌린지 리스트
        records = await Challenge.find({
          "date.1": { $lt: new Date() },
          members: ChallengeData.member_id,
        })
          .sort({ _id: -1 })
          .lean()
          .exec();
      }
    }

    if (!records) {
      return { message: "no Challenges List" };
    }

    for (let index = 0; index < records.length; index++) {
      const date = records[index].date.slice();
      const sdate = date[0];
      const edate = date[1];
      records[index].state = retState(date);
      //front에서 바인딩 하기 쉽게 날짜 포멧팅
      records[index].start_date = sdate.toISOString().split("T")[0];
      records[index].end_date = edate.toISOString().split("T")[0];
      records[index].date_string = records[index].start_date + " ~ " + records[index].end_date;      
    }
    return records;
  } catch (error) {
    //console.error("error", error);
    //throw error;
    return { message: "Challenges find mongoDB error" };
  }
}

//challengeTotList 챌린지 전체 목록
async function challengeTotList(ChallengeData) {
  try {
    let records = null;
    if (ChallengeData.STATE == "TOT") {
      //전체 챌린지 리스트
      records = await Challenge.find().sort({ _id: -1 }).lean().exec();
    } else if (ChallengeData.STATE == "NOW") {
      //현재 챌린지 리스트
      records = await Challenge.find({ "date.1": { $gte: new Date() } })
        .sort({ _id: -1 })
        .lean()
        .exec();
    } else {
      //과거 챌린지 리스트
      records = await Challenge.find({ "date.1": { $lt: new Date() } })
        .sort({ _id: -1 })
        .lean()
        .exec();
    }

    if (!records) {
      return { message: "no Challenges List" };
    }
    for (let index = 0; index < records.length; index++) {
      const date = records[index].date.slice();
      const sdate = date[0];
      const edate = date[1];
      records[index].state = retState(date);
      //front에서 바인딩 하기 쉽게 날짜 포멧팅
      records[index].start_date = sdate.toISOString().split("T")[0];
      records[index].end_date = edate.toISOString().split("T")[0];
      records[index].date_string = records[index].start_date + " ~ " + records[index].end_date;
    }
    return records;
  } catch (error) {
    //console.error("error", error);
    //throw error;
    return { message: "Challenges find mongoDB error" };
  }
}

//challengeMemberList 챌린지 멤버 목록
async function challengeMemberList(ChallengeData) {
  try {
    let records = await Challenge.find(
      { challengename: ChallengeData.challengename },
      { members: 1 }
    )
      .sort({ _id: -1 })
      .lean()
      .exec();

    if (!records) {
      return { message: "no Challenges List" };
    }
  
    const usersList = [];
    //User에서 id,nick,thumbnail가져온다
    for (let index = 0; index < records.length; index++) {
      const members = records[index].members.slice();
      if (members != null && members.length > 0) {
        for (let k = 0; k < members.length; k++) {
          //console.log(members[k]);
          const userDoc = await User.findOne({ id: members[k] });
          if (userDoc) {
            const challengeUser = {
              id: userDoc.id,
              nick: userDoc.nick,
              thumbnail: userDoc.thumbnail,
            };
            usersList.push(challengeUser);
          }
        }
      }
    }

    return usersList;
  } catch (error) {
    //console.error("error", error);
    //throw error;
    return { message: "challengeUser find mongoDB error" };
  }
}

//챌린지별 랭킹 목록 순위목록
async function challengeRanking(ChallengeData) {
  try {
    const challenge = await Challenge.findOne(
      { challengename: ChallengeData.challengename },
      { center: 1 }
    );
    let levelList = null;
    if (challenge) {
      levelList = await Record.aggregate([
        {$match : { center : challenge.center }},
        {$group : {_id : "$userId", total : {$sum : "$levelsum"}}},
        {$sort : {"total" : -1}}
      ])

      if (!levelList) {
        return { message: "no Record List" };
      }   

      if (levelList) {
        for (let i = 0; i < levelList.length; i++) {
          const userDoc = await User.findOne({ id: levelList[i]._id });
          levelList[i].rank = i + 1;
          if (userDoc) {
            levelList[i].nick = userDoc.nick;
            levelList[i].thumbnail = userDoc.thumbnail;
          } else {
            levelList[i].nick = "";
            levelList[i].thumbnail = null;
          }
        }
      }
    }
    return levelList;
  } catch (error) {
    //console.error("error", error);
    //throw error;
    return { message: "challengeRanking find mongoDB error" };
  }
}

//challengeInfo 상세페이지 상단 챌린지 정보
async function challengeInfo(ChallengeData) {
  try {
    const records = await Challenge.findOne({
      challengename: ChallengeData.challengename,
    })
      .lean()
      .exec();
    if (!records) {
      return { message: "no Challenges List" };
    }    
    return records;
  } catch (error) {
    //console.error("error", error);
    //throw error;
    return { message: "Challenges find mongoDB error" };
  }
}

//종료일을 기준으로 상태(NOW,PAST)를 return 한다
function retState(date) {
  let str = "true";
  const enddate = date[1];

  const ndate = new Date();
  //if (sdate < ndate) {
    if (enddate < ndate) {
    str = "false";
  }

  return str;
}

// 유저의 events 배열 안의 _id와 맞는 챌린지리스트 조회 - 송성우
async function userChallengeList(userData) {
  try {
    const chalList = await Challenge.find({ _id: { $in: userData } });
    if (!chalList) {
      return { message: "no Challenges List" };
    }

    return chalList;
  } catch (err) {
    return { message: "Challenges find mongoDB error" };
  }
}

module.exports = {
  register,
  challegeEnter,
  challengeMyList,
  challengeTotList,
  challengeMemberList,
  challengeInfo,
  challengeRanking,
  userChallengeList,
};
