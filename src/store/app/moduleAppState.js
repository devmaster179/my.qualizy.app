var date = new Date()
date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
var from = new Date(date.getTime() - (10 * 24 * 60 * 60 * 1000));

let tempDate = new Date();
tempDate.setFullYear(2000);

export default {
  sensorDatas: [],
  analytics: [],
  labels: [],
  labelsFiltered: [],
  templateTypes: [],
  templateImages: [],
  templates: [],
  publicTemplates: [],
  publicTemplatesFiltered: [],
  users: [],
  teams: [],
  locations: [],
  schedules: [],
  currentTeams: [],
  logs: [],
  items: [],
  documents: [],
  allergens: [],
  chats: [],
  logFilters: [{
    key: 'from',
    value: from
  },
  {
    key: 'to',
    value: ''
  },
  {
    key: 'template',
    value: ''
  },
  {
    key: 'label',
    value: ''
  },
  {
    key: 'status',
    value: ''
  },
  {
    key: 'users',
    value: ''
  },
  {
    key: 'teams',
    value: ''
  },

  ],
  currentUser: {},
  knowledge: [],
  notifications: [],
  iots: [],
  locationList: [],
  chatFileUploading: {
    uploading: false,
    file: "",
    src: "",
    progress: 0
  },
  reports: [],
  suppliers: [],
  tempTemplate: {},
  tempTemplate1: {},
  typedTemplateType: [],
  tempClosedAnswer: [],
  editAnswerIndexes: {
    page: 0,
    question: 0,
    answer: 0
  },
  editType: false,
  editAction: false,
  editScore: false,
  ipInfo: {},
  auth: {},
  report_schedule: [],
  subscription: {
    subscribed: false,
    subscriptionId: false,
    invoiceId: false,
    currBillingDate: tempDate,
    nextBillingDate: new Date(),
  },
  currentPricePlan: {
    numberOfLogs: 0,
    isFreePlan: false,
  },
  preventLogging: false
}