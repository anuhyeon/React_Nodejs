const aws = require('aws-sdk');
const multer = require('multer'); // multer는 파일 업로드를 위해 사용되는 multipart/form-data를 다루기 위한 node.js의 미들웨어임. -> multer를 거치면 req.file 이나 req.files로 내용을 넘겨주는 방식임.
const multerS3 = require('multer-s3');
const moment = require('moment');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY, // 생성한 s3의 accesskey 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // 생성한 s3의 secret key 
  region: 'ap-northeast-2'  // 지역설정 
})

const allowedExtensions = ['.png','.jpg','jpeg','.bmp']

const s3uploader = multer({ // multer 미들웨어를 설정하는 객체. 파일 업로드를 처리하기 위해 multer를 사용
  storage: multerS3({ // multer-s3를 사용하여 파일을 AWS S3에 업로드할 수 있도록 설정
      s3: s3, // multer-s3가 사용할 AWS S3 인스턴스를 지정. 이 인스턴스는 AWS SDK를 통해 설정된 S3 객체임.
      bucket: 'bucket',  // 사용할 버킷의 이름
      // 콜백 함수는 multerS3의 key 속성 안에서 정의해줘야함. multerS3의 key 속성은 업로드된 파일의 키(경로와 파일 이름)를 결정하기 위해 콜백 함수를 사용
      key : (req,file, cb) => { // s3에 업로드할 파일의 키(경로와 파일 이름)을 지정하는 함수. -> 이 함수는 req(요청 객체),file(업로드된 파일 객체),cb(callback함수)를 매개변수로 받음
        const uploadDirectory = req.query.uploadDirectory ?? ''
        const extensions = path.extname(file.originalname) // 업롣된 파일의 확장자를 추출 -> file.originalname은 원본 파일 이름을 의미하며, path.extname 메서드를 사용하여 파일의 확장자를 가져옴
        if(!allowedExtensions.includes(extensions)){ // 출한 확장자가 allowedExtensions 배열에 포함되어 있는지 확인. 포함되지 않은 경우, 업로드를 거부
          return cb(new Error('wrong extension')) // 파일 확장자가 허용되지 않는 경우, cb 콜백 함수를 호출하여 오류를 반환하고 업로드를 중단
        }
        cb(null,`${uploadDirectory}/${Date.now()}_${file.originalname}`) // 파일 확장자가 허용되는 경우, 파일의 키(경로와 이름)를 설정. 여기서 uploadDirectory는 업로드할 디렉터리 경로를 의미하며, 파일 이름은 현재 시간(Date.now())과 원본 파일 이름(file.originalname)을 조합하여 고유하게 만듬
      },
      acl: 'public-read-write' //  업로드된 파일의 ACL(액세스 제어 목록)을 설정. 여기서는 'public-read-write'로 설정하여 업로드된 파일이 공개적으로 읽기와 쓰기가 가능하도록 설정
  }),
});

module.exports = s3uploader;

// const storage = multerS3({
//   s3: s3,
//   bucket: 'bucketname', // s3 생성시 버킷명
//   acl: 'public-read',   // 업로드 된 데이터를 URL로 읽을 때 설정하는 값입니다. 업로드만 한다면 필요없습니다.
//   metadata: function (req, file, cb) {
//     cb(null, {fieldName: file.fieldname}); // 파일 메타정보를 저장합니다.
//   },
//   key: function (req, file, cb) {
//     cb(null, moment().format('YYYYMMDDHHmmss') + "_" + file.originalname) // key... 저장될 파일명과 같이 해봅니다.
//   }
// })

// const upload = multer({ storage: storage }).single("file");

// module.exports = upload;