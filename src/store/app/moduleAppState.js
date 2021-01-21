var date = new Date()
date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
var from = new Date(date.getTime() - (10 * 24 * 60 * 60 * 1000));
export default {
  sensorDatas: [],
  analytics: [],
  labels: [],
  labelsFiltered: [],
  templateTypes: [],
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
  report_schedule: []
}