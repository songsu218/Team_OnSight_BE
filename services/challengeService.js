const Challenge = require("../models/Challenge");
const User = require("../models/User");
const Record = require("../models/Record");
const hashUtils = require("../utils/hashUtils");
const env = require("../config/env");
const jwt = require("jsonwebtoken");

//Challenge 등록
async function register(ChallengeData) {
  const ChallengeDoc = await Challenge.create({
    challengename: ChallengeData.challengename,
    id: ChallengeData.id,
    name: ChallengeData.name,
    center: ChallengeData.center,
    address: ChallengeData.address,
    date: ChallengeData.date,
    members: ChallengeData.members,
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
          .limit(100)
          .lean()
          .exec();
      } else if (ChallengeData.STATE == "NOW") {
        //현재 챌린지 리스트
        records = await Challenge.find({
          "date.1": { $lte: strNowDate() },
          members: ChallengeData.member_id,
        })
          .sort({ _id: -1 })
          .limit(100)
          .lean()
          .exec();
      } else {
        //과거 챌린지 리스트
        records = await Challenge.find({
          "date.1": { $gt: strNowDate() },
          members: ChallengeData.member_id,
        })
          .sort({ _id: -1 })
          .limit(100)
          .lean()
          .exec();
      }
    }

    /* center Collection 생성되면 주석풀고 테스트 해보자                                         
    const centers = await Center.find();
    records.aggregate([
      {
          $lookup: {
            from: "center"
            , localField: "center"
            , foreignField: "center"
            , as: "thumbnail"
          }
      }
      ]);
     */

    for (let index = 0; index < records.length; index++) {
      const date = records[index].date.slice();
      records[index].state = retState(date);
      //front에서 바인딩 하기 쉽게 날짜 포멧팅
      setDateString(records, index, date);
      //Center가 언제 개발될지 모르니 현재는 그냥 아무거나
      //Center완료되면 고치자
      records[index].thumbnail = "1718345738645.jpg";
    }

    //challengeLevel(recordData)
    //Center별로 1등을 찾자.
    /*
    for (let index = 0; index < records.length; index++) {
      const center = records[index].center.slice();
      let ret = null;
      records[index].topmember = "";
      if(center != null && center != ""){
         ret = challengeLevel(center);
         if(ret.length > 0){
          const id = ret[0].id.slice();
          const ids = await User.findOne({'id': id},{nick : 1}).lean().exec();
          if(ids){
            records[index].topmember = ids.nick;
          }
         }
        }   
    }
    */
    return records;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

//challengeTotList 챌린지 전체 목록
async function challengeTotList(ChallengeData) {
  try {
    let records = null;
    if (ChallengeData.STATE == "TOT") {
      //전체 챌린지 리스트
      records = await Challenge.find().limit(100).lean().exec();
    } else if (ChallengeData.STATE == "NOW") {
      //현재 챌린지 리스트
      records = await Challenge.find({ "date.1": { $lte: strNowDate() } })
        .sort({ _id: -1 })
        .limit(100)
        .lean()
        .exec();
    } else {
      //과거 챌린지 리스트
      records = await Challenge.find({ "date.1": { $gt: strNowDate() } })
        .sort({ _id: -1 })
        .limit(100)
        .lean()
        .exec();
    }

    /* center Collection 생성되면 주석풀고 테스트 해보자                                         
    const centers = await Center.find();
    records.aggregate([
      {
          $lookup: {
            from: "center"
            , localField: "center"
            , foreignField: "center"
            , as: "thumbnail"
          }
      }
      ]);
     */
    for (let index = 0; index < records.length; index++) {
      const date = records[index].date.slice();
      records[index].state = retState(date);
      //front에서 바인딩 하기 쉽게 날짜 포멧팅
      setDateString(records, index, date);
      //Center가 언제 개발될지 모르니 현재는 그냥 아무거나
      //Center완료되면 고치자
      records[index].thumbnail = "1718345738645.jpg";
    }
    //challengeLevel(recordData)
    //Center별로 1등을 찾자.
    /*
    for (let index = 0; index < records.length; index++) {
      const center = records[index].center.slice();
      let ret = null;
      records[index].topmember = "";
      if(center != null && center != ""){
         ret = challengeLevel(center);
         if(ret.length > 0){
          const id = ret[0].id.slice();
          const ids = await User.findOne({'id': id},{nick : 1}).lean().exec();
          if(ids){
            records[index].topmember = ids.nick;
          }
         }
        }   
    }
    */
    return records;
  } catch (error) {
    console.error("error", error);
    throw error;
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
      .limit(100)
      .lean()
      .exec();
    const usersList = [];
    //User에서 id,nick,thumbnail가져온다
    for (let index = 0; index < records.length; index++) {
      const members = records[index].members.slice();
      if (members != null && members.length > 0) {
        for (let k = 0; k < members.length; k++) {
          console.log(members[k]);
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
    console.error("error", error);
    throw error;
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
      levelList = await challengeLevel(challenge.center);
      if (levelList) {
        for (let i = 0; i < levelList.length; i++) {
          const userDoc = await User.findOne({ id: levelList[i].id });
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
    console.error("error", error);
    throw error;
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
    /* center Collection 생성되면 주석풀고 테스트 해보자                                         
      const centers = await Center.find();
      records.aggregate([
        {
            $lookup: {
              from: "center"
              , localField: "center"
              , foreignField: "center"
              , as: "thumbnail"
            }
        }
        ]);
      */
    return records;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

//center,id별로 levelcount 합산
async function challengeLevel(center) {
  try {
    let temp = null;
    let result = null;
    let records = await Record.find({ center: center }).lean().exec();
    for (let index = 0; index < records.length; index++) {
      const element = levelCalc(records[index].level);
      //const element = levelCalc(records[index].level.slice());
      records[index].total = element;
    }

    //id별로 Group by sum
    /**  이부분 오류있어 주석하였습니다. */
    // if(records.length > 0){

    //   temp = records.reduce(function(res, obj) {
    //   if (!(obj.id in res))
    //       //res.push(res[obj.id] = obj);
    //     res.push(obj);
    //   else {
    //       res[obj.id].total += obj.total;
    //   }
    //   return temp;
    //  });

    //  //result = temp.sort(arrOrderDesc("total"));
    //  //result = sortByKeyDesc(temp, 'total');
    //  result = records; //임시
    // }
    result = records;
    return result;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

//level+점수 합산
function levelCalc(level) {
  let temp = 0;
  let sum = 0;
  for (const key in level) {
    if (level.hasOwnProperty(key)) {
      //console.log(`${key} ${level[key]}`);
      temp = Number(key) * Number(level[key]);
      sum = sum + temp;
    }
  }
  /*
  for(let k=0;k<level.length;k++){
    const val1 = arLevel[k][0];
    const val2 = arLevel[k][1];
    temp = Number(val1) * Number(val2);
    sum = sum + temp;
  }
  */
  return sum;
}

//순위정렬(내림차수)
function arrOrderDesc(key) {
  return function (a, b) {
    if (b[key] > a[key]) {
      return 1;
    } else if (b[key] < a[key]) {
      return -1;
    }

    return 0;
  };
}
// 특정 키를 기준으로 내림차순 정렬하는 함수
function sortByKeyDesc(array, key) {
  return array.sort((a, b) => {
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });
}

//현재일 가져오기(string)
function strNowDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  return "${year}${month}${day}";
}

//종료일을 기준으로 상태(NOW,PAST)를 return 한다
function retState(date) {
  let str = "NOW";
  const enddate = date[1];

  if (enddate != null && enddate.length == 8 && checkDate(enddate) == true) {
    const sdate = new Date(
      Number(enddate.substring(0, 4)),
      Number(enddate.substring(4, 6)) - 1,
      Number(enddate.substring(6, 8))
    );
    //const sdate = Date.parse(enddate);
    const ndate = new Date();

    if (sdate < ndate) {
      str = "PAST";
    }
  }
  return str;
}
function checkDate(strDate) {
  //var chkdate=Date.parse(strDate)
  const chkdate = new Date(
    Number(strDate.substring(0, 4)),
    Number(strDate.substring(4, 6)) - 1,
    Number(strDate.substring(6, 8))
  );
  if (isNaN(chkdate) == false) {
    var d = new Date(chkdate);
    return true;
  } else {
    return false;
  }
}

function setDateString(records, index, date) {
  const sdate = date[0];
  const edate = date[1];
  if (sdate != null && sdate.length == 8 && checkDate(sdate) == true) {
    records[index].start_date = sdate;
  } else {
    records[index].start_date = "";
  }
  if (edate != null && edate.length == 8 && checkDate(edate) == true) {
    records[index].end_date = edate;
  } else {
    records[index].end_date = "";
  }
  //date_string : '2024.06.16 ~ 2024.06.23'
  if (records[index].start_date != "" && records[index].end_date) {
    records[index].date_string =
      sdate.substring(0, 4) +
      "." +
      sdate.substring(4, 6) +
      "." +
      sdate.substring(6, 8) +
      " ~ " +
      edate.substring(0, 4) +
      "." +
      edate.substring(4, 6) +
      "." +
      edate.substring(6, 8);
  } else {
    records[index].date_string = "";
  }
}

// 유저의 events 배열 안의 _id와 맞는 챌린지리스트 조회 - 송성우
async function userChallengesList(userData) {
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
  challengeLevel,
  userChallengesList,
};
