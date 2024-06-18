// const mongoose = require('mongoose');
// const ClimbingCenter = require('./models/climbingCenter');

// const connectUrl =
//   'mongodb+srv://sungu:sungu1111@cluster0.gxj08vx.mongodb.net/onsight?retryWrites=true&w=majority&appName=Cluster0';

// const centers = [
//   {
//     center: '구로클라임장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '예술로 123, 4층',
//     latlng: { lat: 37.491234, lng: 126.889765 },
//     contact: '02-1234-5678',
//     detail: '구로구에 위치한 최고의 클라이밍장입니다.',
//     website: 'http://www.guroclimb.com',
//     thumbnail: 'http://www.guroclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '한강클라임센터',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '디지털로 300, 5층',
//     latlng: { lat: 37.485678, lng: 126.897654 },
//     contact: '02-9876-5432',
//     detail: '한강을 바라보며 즐기는 클라이밍장입니다.',
//     website: 'http://www.hangangclimb.com',
//     thumbnail: 'http://www.hangangclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '천왕산암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '고척로 56, 3층',
//     latlng: { lat: 37.484321, lng: 126.845679 },
//     contact: '02-5432-1098',
//     detail: '천왕산 자락에 위치한 암벽장으로 유명합니다.',
//     website: 'http://www.cheonwangclimb.com',
//     thumbnail: 'http://www.cheonwangclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '신도림스카이월드',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '경인로 1234, 6층',
//     latlng: { lat: 37.507891, lng: 126.881234 },
//     contact: '02-6543-2109',
//     detail: '신도림에 위치한 클라이밍장으로 높은 체험을 제공합니다.',
//     website: 'http://www.sindorimskyworld.com',
//     thumbnail: 'http://www.sindorimskyworld.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '온누리암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '오류로 789, 2층',
//     latlng: { lat: 37.496543, lng: 126.855432 },
//     contact: '02-8901-2345',
//     detail: '온누리공원 내에 위치한 암벽장입니다.',
//     website: 'http://www.onnuriclimb.com',
//     thumbnail: 'http://www.onnuriclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '구로산암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '구일로 567, 4층',
//     latlng: { lat: 37.488765, lng: 126.830987 },
//     contact: '02-6789-0123',
//     detail: '구로산에서 즐기는 암벽 등반을 위한 장소입니다.',
//     website: 'http://www.gurosanclimb.com',
//     thumbnail: 'http://www.gurosanclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '구일산암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '구일로 321, 3층',
//     latlng: { lat: 37.485432, lng: 126.837654 },
//     contact: '02-5432-8765',
//     detail: '구일산에 자리한 자연 친화적인 클라이밍 장소입니다.',
//     website: 'http://www.guilsanclimb.com',
//     thumbnail: 'http://www.guilsanclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '푸른언덕암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '가마산로 567, 5층',
//     latlng: { lat: 37.502109, lng: 126.84321 },
//     contact: '02-2109-8765',
//     detail: '가마산 자연보호구역 내에 위치한 암벽장입니다.',
//     website: 'http://www.pureunamclimb.com',
//     thumbnail: 'http://www.pureunamclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '구로골암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '구로동 123-4',
//     latlng: { lat: 37.49321, lng: 126.889012 },
//     contact: '02-7654-3210',
//     detail: '구로골에 자리한 자연친화적인 클라이밍 장소입니다.',
//     website: 'http://www.gurogolclimb.com',
//     thumbnail: 'http://www.gurogolclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '포동암벽장',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '포동로 456, 4층',
//     latlng: { lat: 37.498765, lng: 126.865432 },
//     contact: '02-4321-9876',
//     detail: '포동 공원 내에 위치한 암벽장으로 편리한 접근성을 제공합니다.',
//     website: 'http://www.podongclimb.com',
//     thumbnail: 'http://www.podongclimb.com/thumbnail.jpg',
//     level: { 1: 'red', 2: 'blue' },
//   },
//   {
//     center: '구로트램폴린센터',
//     si: '서울특별시',
//     gu: '구로구',
//     address: '구로구 디지털로 32, 2층',
//     latlng: { lat: 37.485743, lng: 126.891234 },
//     contact: '02-3456-7890',
//     detail: '트램폴린과 클라이밍을 한 곳에서 즐길 수 있는 센터입니다.',
//     website: 'http://www.gurotrampoline.com',
//     thumbnail: 'http://www.gurotrampoline.com/thumbnail.jpg',
//     level: { 1: 'blue', 2: 'yellow' },
//   },
// ];

// mongoose
//   .connect(connectUrl)
//   .then(async () => {
//     try {
//       const result = await ClimbingCenter.insertMany(centers);
//       console.log('Data inserted:', result);
//       mongoose.connection.close();
//     } catch (error) {
//       console.error('Error inserting data:', error);
//     }
//   })
//   .catch((err) => console.error('Database connection error:', err));
