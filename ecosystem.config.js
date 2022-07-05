module.exports = {
  apps: [
    {
      name: "app",
      script: "./app.js",
      instances: 0, // '0'으로 설정시 CPU 코어 수 만큼 프로세스를 실행
      exec_mode: "cluster", // 클러스트 모드로 실행
      watch: true, // 파일 변경되었을 때 재시작
    },
  ],
};
