const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// 파일 이름을 URL-safe 문자열로 변환하는 함수
const sanitizeFileName = (fileName) => {
  return fileName
    .normalize("NFD") // 유니코드 정규화
    .replace(/[\u0300-\u036f]/g, "") // 결합 문자를 제거
    .replace(/[^\w.-]/g, ""); // 알파벳, 숫자, 점, 하이픈을 제외한 모든 문자를 제거
};

const createMulterStorage = () => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      const sanitizedFileName = sanitizeFileName(file.originalname);
      cb(null, `${uniqueSuffix}_${sanitizedFileName}`);
    },
  });
};

const upload = multer({ storage: createMulterStorage() });

module.exports = upload;
