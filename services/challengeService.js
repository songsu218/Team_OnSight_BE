const Challenge = require('../models/Challenge');
const User = require('../models/User');
const hashUtils = require('../utils/hashUtils');
const env = require('../config/env');
const jwt = require('jsonwebtoken');

//Challenge 등록
async function register(ChallengeData) {
  const ChallengeDoc = await Challenge.create({
    challengename: ChallengeData.challengename,
    id: ChallengeData.id,
    name: ChallengeData.name,
    center: ChallengeData.center,
    address: ChallengeData.address,
    date : ChallengeData.date,
    members: ChallengeData.members,
  });
  return ChallengeData;
}

//challenge 참가등록
async function challegeEnter(ChallengeData) {
  const ChallengeDoc = await Challenge.findOne({ challengename: ChallengeData.challengename });
  if (!ChallengeDoc) {
    return { message: 'nochallenge' };
  }
  const ChallengeDoc2 = await ChallengeDoc.updateOne({
    $addToSet: { members: ChallengeData.members } ,
  });

  return ChallengeData;
}

//challengeNowList 챌린지 현재 전체(나의) 목록
async function challengeNowList(ChallengeData) {
  try {
    let records = null
    if(ChallengeData.member_id != null && ChallengeData.member_id != ""){
      records = await Challenge.find({'date.1': {'$gte': ChallengeData.date},'members': ChallengeData.member_id},{challengename : 1,center :1,date:1}).sort({ _id: -1 }).limit(100).lean().exec();
    }
    else{
      records = await Challenge.find({'date.1': {'$gte': ChallengeData.date}},{challengename : 1,center :1,date:1}).sort({ _id: -1 }).limit(100).lean().exec();
    }
/** center Collection 생성되면 주석풀고 테스트 해보자                                         
    const centers = await Center.find();
    records.aggregate([
      {
          $lookup: {
            from: "centers"
            , localField: "center"
            , foreignField: "center"
            , as: "thumnail"
          }
      }
      ]);
 */      
    return records;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//challengePastList 챌린지 현재 전체(나의) 목록
async function challengePastList(ChallengeData) {
  try {
    let records = null
    if(ChallengeData.member_id != null && ChallengeData.member_id != ""){
      records = await Challenge.find({'date.1': {'$lt': ChallengeData.date},'members': ChallengeData.member_id},{challengename : 1,center :1,date : 1}).sort({ _id: -1 }).limit(100).lean().exec();
    }
    else{
      records = await Challenge.find({'date.1': {'$lt': ChallengeData.date}},{challengename : 1,center :1,date : 1}).sort({ _id: -1 }).limit(100).lean().exec();
    }
/** center Collection 생성되면 주석풀고 테스트 해보자                                         
    const centers = await Center.find();
    records.aggregate([
      {
          $lookup: {
            from: "centers"
            , localField: "center"
            , foreignField: "center"
            , as: "thumnail"
          }
      }
      ]);
 */      
    //challengeLevel(recordData)
    //Center별로 1등을 찾자.
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

    return records;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//challengeNowDetail 챌린지 현재 상세
async function challengeNowDetail(ChallengeData) {
  try {
    let records = await Challenge.find({'challengename': ChallengeData.challengename},{members : 1}).sort({ _id: -1 }).limit(100).lean().exec();
    const usersList = [];
    //Center별로 1등을 찾자.
    for (let index = 0; index < records.length; index++) {
      const members = records[index].members.slice();
      if(members != null && members.length > 0)
        {
          for (let k = 0; k < members.length; k++) {
            console.log(members[k]);
            const userDoc = await User.findOne({ id: members[k] });
            if (userDoc) {
              const challengeUser = {"id":userDoc.id,"nick": userDoc.nick,"thumbnail":userDoc.thumbnail};
              usersList.push(challengeUser);
            }
          }
        }
    }

    return usersList;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//challengePastDetail 챌린지 과거 상세
async function challengePastDetail(ChallengeData) {
  try {
    const challenge = await Challenge.findOne({'challengename': ChallengeData.challengename},{center : 1});
    let levelList = null;
    if(challenge){
     levelList = challengeLevel(challenge.center);
      if(levelList){
        for(let i=0;i<levelList.length;i++){
          const userDoc = await User.findOne({ id: levelList[i].id });
          if(userDoc){
          levelList[i].nick = userDoc.nick;
          levelList[i].thumbnail = userDoc.thumbnail;
          }
          else
          {
            levelList[i].nick = "";
            levelList[i].thumbnail = null;
          }
        }
  }
  }
    return levelList;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}


//challengeNowTotalList 챌린지 현재 전체 목록
async function challengeLevel(center) {
  try {
    let result = null;
    let records = await records.find({'center': center}).lean().exec();
    for (let index = 0; index < records.length; index++) {
      const element = levelCalc(records[index].level.slice());
      records[index].total = element;
    }

    //id별로 Group by sum
    if(records.length > 0){
     result = records.reduce(function(res, obj) {
      if (!(obj.id in res))
          //res.push(res[obj.id] = obj);
        res.push(obj);
      else {
          res[obj.id].total += obj.total;
      }
      return result;
  });

  result.sort(arrOrderDesc("total"));
    }
    return result;

  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

function levelCalc(level){
  let ret = 0;
  let temp = 0;
  let sum = 0;
  for(let k=0;k<level.length;k++){
    const val1 = level[k][0];
    const val2 = level[k][1];
    temp = val1 * val2;
    sum = sum + temp;
  }
  ret = sum;
  return ret;
}

//순위정렬(내림차수)
function arrOrderDesc(key) {
  return function(a, b) {
      if (b[key] > a[key]) {    
          return 1;    
      } else if (b[key] < a[key]) {    
          return -1;    
      } 
      
      return 0;    
  }    
}

module.exports = {
  register,
  challegeEnter,
  challengeNowList,
  challengePastList,
  challengeNowDetail,
  challengePastDetail,
  challengeLevel,
};
