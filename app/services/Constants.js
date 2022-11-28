
export default {
    OrganizationApi: 'http://iam.almscloud.com/api/v1/organizations',
    LanguageResourceApi: '/api/organization/languageresources?',
    AuthUrl: '/connect/token',
    AnnouncementUrl: '/api/announcement/',
    AnnouncementDetail:'/api/announcement/getannouncementbyid/',
    UserIdentity: '/api/organization/useridentity',
    FileSettings: '/api/organization/getfilesettings',
    EnrolledCourses: '/api/course/enrolledcourses',
    TeacherCourses: '/api/course/teachercourses',
    CourseAnnouncement: '/api/announcement/announcements',
    IncomingActivities: '/api/class/incomingactivity',
    CourseWeeks: '/api/term/courseweeks',
    CourseWeeksActivities: '/api/activity/byweekactivitiy',
    CourseActivityList: '/api/activity/activitylist',
    MessageGroups: '/api/messages/getgroups',
    MessageSend: '/api/message/send',
    MessageDetail: '/api/messages/getmessages',
    MessageDelete: '/api/message/delete',
    MyClassMates: '/api/messages/getmyclassmates',
    Schedule: '/api/calendar/my',
    Menu: '/api/organization/mainmenu?Mobile=true',
    NewAnnouncement: '/api/announcement/new',
    SearchAnnouncementReceiver: '/api/organization/search',
    AnnouncementChangeState: '/api/announcement/changestate',
    GetTags: '/api/tag/gettags',
    GetConditionalActivities: '/api/get/conditionalactivities',
    GetClassInformation: '/api/class/classes',
    UploadFile: '/api/file/upload',
    Search: '/api/organization/search',
    AssignmentAdd: '/api/assignment/add',
    DocumentAdd: '/api/document/add',
    LinkActivityAdd: '/api/link/add',
    VideoActivityAdd: '/api/video/add',
    EnrollmentProgress: '/api/enrollment/get',
    VideoSaveTracking: '/api/video/savetracking',
    TopCompletedActivity:'/api/class/topcompletedactivity',
    AssignmentSendAnswer:'/api/assignment/send',
    ForgottenPassword: '/Account/RetrievePassword',
    PrivacyPolicy: '/kvkk',
    ApiResponseQuantity: 10,
    HomepageLessonQuantity:5,
    MessageApiResponseQuantity: 10000,
    CalendarApiResponseQuantity: 20,
    DailyCalendarQuantity: 5,
    ActivityDictionaryWordQuantity: 4,
    ApiPort: 3000,
    DefaultTimeout: 60000,
    AnnouncementTypes: {
        All: -1,
        Draft: 0,
        Sent: 1,
        Trash: 2,
        Deleted: 3,
        Inbox: 4,
    },
    AnnouncementContextTypes: {
        System: 1,
        Organization: 2,
        Program: 4,
        Course: 8,
        Class: 16,
        Group: 32

    },
    UserTypes: {
        Student: 8,
        Instructor: 4,
    },
    CourseTypes: {
        Active: 1,
        Passive: 0
    },

    ActivityType: {
        Elesson: 'Elesson',
        LTI: '18',
        Video: 'Video',
        Document: 'Document',
        Survey: 'Survey',
        Exam: 'Exam',
        Dictionary: 'Dictionary',
        LinkActivity: 'LinkActivity',
        Assignment: 'Assignment',
        VirtualClass: "VirtualClass",
        Forum:"Forum"
    },
    ActivityListType: {
        GetActivityBySelectedActivity: 1,
        GetActivitiesBySelectedWeek: 2,
        GetActivitiesBySelectedCourse: 3
    },
    ActivitySurveyQuestionTypes: {
        SingleChoise: 0,
        MultiChoise: 1,
        MultiLineQuestion: 2,
        Matris: 3,
        SurveyTitle: 4,
        SurveyParagraph: 5,
        OneLineQuestion: 6
    },
    AssignmentCompletionTypes: {
        Text: 1,
        UploadFile: 6
    },
    ActivityCompletionTypes: {
        None: 0,
        View: 1, // Video, Document, E-Lesson, Exam, Forum, Assignment (Aktivite görüntüleme)
        Progress: 2, // Video, E-Lesson (İlerleme)
        Complete: 3, // Exam, Survey, E-lesson (Tamamlama)
        ComposeMessage: 4, //Forum (Mesaj yazma)
        DownloadAttachment: 5, // Document, Assignment (Eki indirme)
        Upload: 6, // Assignment (dosya yükleme)
        AttendLiveSession: 7, // VirtualClass (Canlı oturuma katılma)
        ViewRecordedSession: 8, // VirtualClass (Arşivden oturumu izleme)
        ProgressLive: 9, // VirtualClass (Canlı ilerleme)
        ProgressLiveOrArchive: 10, // VirtualClass (Canlı oturuma katılma ve oturumu arşivden izleme)
        Grade: 11 // ALL (Notlandırma)
    },
    ActivityCompletedStatus: {
        UnCompleted: 1, //tamamlanmadı
        Completed: 2, // tamamlandı
        Grading: 3, //not verildi,
    },
    ActivityTags: {
        None: 0,
        Credits: 1, // Sahibi,activity credits, question credits, etc.
        QuestionKeyword: 2, //Soru keywordler
        Topic: 3, // question topic, course topic, etc. 
        QuestionCategory: 4,
        CourseCategory: 5, // MasterCourseCategory , etc.
        Audience: 6, // MasterCoursesAudience , 
        etcActivityUnit: 7  //Uniteler
    },
    ActivityVideoQesutionTypes: {
        SingleChoise: 0,
        MultiChoise: 1
    },
    DocumentExtenstion: {
        Video: '.mp4',
        Pdf: '.pdf',
    },
    NewActivityConstant: {
        CommonActivity: 1, //Genel Aktivite
        ClassActivity: 0 //Sınıf Aktivitesi
    },
    ActivityViewCriterion: {
        ByWeek: 0, // Haftaya Göre Görüntüle
        ByDateRange: 1,// Seçilen tarih aralığına Göre Görüntüle
        ByActivity: 2 // Activity'e Göre Görüntüle
    },
    SupportedLanguage: {
        TR: 'TR',
        EN: 'EN',
    },
    MessagesTargetTypes: { //bireysel 3 geldi.., ders mesajı 1 geldi..
        ClassGroup: 1,
        NonGroup: 3,
    },
    MessagesSendTargetTypes: {
        User: 0,
        Class: 1,
        Program: 2,
    },
    MessagesStatusType:{
        Read:3,
        UnRead:1
    },
    MessageReceiverTypes: {
        User: 'User',
        Class: 'Class',
        Course: 'Course',
        Program: 'Program',
        Group: 'Group',
    },
    VideoTypes: {
        Local: 0,
        Youtube: 1,
        Vimeo: 2,
        OtherEmbedded: 3,
    },
    IOSMimeTypes: [
        'public.jpeg',
        'public.png',
        'com.adobe.pdf',
        'com.microsoft.word.doc',
        'org.openxmlformats.wordprocessingml.document', //docx
        'org.openxmlformats.spreadsheetml.sheet', //xlsx
        //'org.openxmlformats.presentationml.presentation', //ppt
        'com.microsoft.excel.xls',
        'public.mpeg-4',
    ],
    AndroidMimeTypes: [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //xlsx
        'video/mp4'
    ],

    MimeTypes: {
        jpg: 'image/jpeg',
        png: 'image/png',
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        mp4: 'video/mp4'
    }
}