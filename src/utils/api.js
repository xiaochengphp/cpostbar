// 配置Api接口
// doc https://www.kancloud.cn/q86849180/tieba_miniprogram/648565
// sql http://120.24.240.216:888/phpmyadmin_F6D67EFF
// account  sql183944
// password b19d6add
let Api = {
    // 接口Url
    BaseUrl: 'https://miniprogram.xtow.net/api/',
    // 我的班级
    my: 'class_room/my',
    // 登录
    login: 'user/login',
    // 获取信息
    info: 'user/info',
    // 注册
    reg: 'user/register',
    // 创建班级
    createClassRoom: 'class_room/create',
    // 编辑班级
    eaitClass_room: 'class_room/edit',
    // 获取班级信息,  
    getClassRoom: 'class_room/info',
    // 任课老师加入班级
    addTeacher: 'class_room/joinTeacher',
    // 学生加入班级
    addStudent: 'class_room/joinStudent',
    // 学生家长加入班级
    addGuardian: 'class_room/joinGuardian',
    // 获取课程列表
    subject: 'data/subject',
    // 发布作业
    addArticle: 'article/add',
    // 上传图片
    uploadImg: 'data/upload',
    // 删除图片
    delImg: 'data/deleteImg',
    // 获取班级的课程列表
    getSubject: 'article/subject',
    // 帖子列表
    getArticles: 'article/index',
    // 给帖子点赞
    articleStar: 'article/star',
    // 给帖子点已收到状态
    articleReceive: 'article/receive',
    // 给帖子点已完成状态
    articleSuccess: 'article/success',
    // 帖子详情
    articlesInfo: 'article/info',
    // 回复帖子
    articleReply: 'article/reply',
    // 回复列表
    articleReplyList: 'article/replyList',
    // 获取编辑作业帖的信息
    articleEdit: 'article/edit',
    // 搜索班级
    searchDclassroom: 'class_room/search',
    // 个人中心
    userIndex: 'user/index',
    // 获取班级成员列表
    userlist: 'class_room/memberList',
    // 删除班级成员
    userlistDel: 'class_room/memberDelete'
};

export default Api;
