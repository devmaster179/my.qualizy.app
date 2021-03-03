const generateUniqueId = require("generate-unique-id");

export default {
  SET_SENSOR_DATA(state, query) {
    state.sensorDatas = query
  },
  SET_ANALYTICS(state, query) {
    state.analytics = query
  },
  SET_REPORT_SCHEDULE(state, query) {
    state.report_schedule = query
  },
  SET_AUTH(state, query) {
    state.auth = query
  },
  CHN_AUTH(state, query) {
    const value = !state.auth[query.key][query.role][query.action]
    state.auth[query.key][query.role][query.action] = value

    if (query.action == 'view' && !value) {
      state.auth[query.key][query.role].edit = false
      state.auth[query.key][query.role].create = false
      state.auth[query.key][query.role].delete = false
    } else if (query.action != 'view' && value && !state.auth[query.key][query.role].view) {
      state.auth[query.key][query.role].view = true
    }
  },
  SET_IP_INFO(state, query) {
    state.ipInfo = query
  },
  SET_LABEL(state, query) {
    state.labels = query;
  },
  SET_LABEL_FILTERED(state, query) {
    state.labelsFiltered = query;
  },
  SET_TEMPLATE_TYPE(state, query) {
    state.templateTypes = query;
  },
  SET_TEMPLATE_IMAGES(state, query) {
    state.templateImages = query;
  },
  ADD_TEMPLATE_IMAGE(state, query) {
    state.templateImages = [...state.templateImages, query];
  },
  SET_TEMPLATE(state, query) {
    state.templates = query;
  },
  SET_USERS(state, query) {
    state.users = query;
  },
  SET_LOCATIONS(state, query) {
    state.locations = query
  },
  SET_TEAMS(state, query) {
    state.teams = query;
  },
  SET_SCHEDULES(state, query) {
    state.schedules = query
  },
  SET_CURRENTTEAMS(state, query) {
    state.currentTeams = query
  },
  SET_LOGS(state, query) {
    state.logs = query
  },
  UPDATE_LOG(state, query) {
    var index = state.logs.findIndex(item => item.id == query.id)
    if (index > -1) {
      state.logs[index] = query
    }
    else {
      state.logs.push(query)
    }
    var temp = state.logs
    state.logs = []
    state.logs = temp

  },
  DELETE_LOG(state, query) {
    state.logs = state.logs.filter(item => item.id != query)
  },
  SET_ITEMS(state, query) {
    state.items = query
  },
  UPDATE_LOG_FILTER(state, query) {
    var logFilters = state.logFilters
    var _logFilter = logFilters.find(item => {
      return item.key == query.key
    })

    var index = state.logFilters.indexOf(_logFilter)

    state.logFilters[index].value = query.value
  },
  SET_LOG_FILTER(state) {
    state.logFilters = [{
      key: 'from',
      value: ''
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
    }, {
      key: 'users',
      value: ''
    }, {
      key: 'teams',
      value: ''
    },

    ]
  },
  SET_DOCUMENTS(state, query) {
    state.documents = query
  },
  SET_ALLERGENS(state, query) {
    state.allergens = query
  },
  SET_CHATS(state, query) {
    state.chats = query
  },
  SET_CURRENT_USER(state, query) {
    state.currentUser = query
  },
  SET_KNOWLEDGE(state, query) {
    state.knowledge = query
  },
  SET_NOTIFICATIONS(state, query) {
    state.notifications = query
  },
  SET_IOTS(state, query) {
    state.iots = query
  },

  REMOVE_LOCATION_LIST(state, query) {
    var locationList = state.locationList.filter(item => item != query)
    state.locationList = locationList
  },
  ADD_LOCATION_LIST(state, query) {
    state.locationList.push(query)
  },
  SET_LOCATION_LIST(state, query) {
    state.locationList = query
  },
  SET_PUBLIC_TEMPLATES(state, query) {
    state.publicTemplates = query
  },
  SET_PUBLIC_TEMPLATES_FILTERED(state, query) {
    state.publicTemplatesFiltered = query
  },
  SET_CHAT_FILE_UPLOADING(state, query) {
    state.chatFileUploading = {
      uploading: true,
      file: query.file,
      src: query.src,
      progress: 0
    }
  },
  SET_CHAT_FILE_UPLOADING_PROGRESS(state, query) {
    state.chatFileUploading.progress = query
  },
  INIT_FILE_UPLOAD(state) {
    state.chatFileUploading = {
      uploading: false,
      file: '',
      src: '',
      progress: 0
    }
  },

  SET_REPORTS(state, query) {
    state.reports = query
  },

  SET_SUPPLIERS(state, query) {
    state.suppliers = query
  },


  SET_TEMPTEMPLATE(state, query) {
    state.tempTemplate1 = JSON.parse(query)
    state.tempTemplate = JSON.parse(query)
  },
  CHN_TEMPLATE_IMAGE(state, query) {
    state.tempTemplate.content.templateImage = query
  },
  CHN_TEMPLATE_LOCATION(state, query) {
    state.tempTemplate.content.location = []
    query.map(location => {
      state.tempTemplate.content.location.push(location.id)
    })
  },
  CHN_TEMPLATE_COMMENT(state, query) {
    state.tempTemplate.content.templateComment = query
  },
  CHN_TEMPLATE_TAG(state, query) {
    state.tempTemplate.content.templateLabel = query
  },
  ADD_TAG(state, query) {
    state.tempTemplate.content.templateLabel.push(query)
  },
  CHN_TEMPLATE_SD(state, query) {
    state.tempTemplate.content.templateSD = query
  },
  CHN_TEMPLATE_TEAMS(state, query) {
    state.tempTemplate.content.teams = query
  },
  SET_TYPED_TEMPLATE_TYPE(state, query) {
    state.typedTemplateType = query
  },
  CHN_TEMP_CLOSED_ANSWER(state, query) {
    state.tempClosedAnswer = query
  },
  ADD_RESPONSE(state, query) {
    state.tempClosedAnswer.push(query)
  },
  CHN_TEMPLATE_TITLE(state, query) {
    state.tempTemplate.content.templateTitle = query
  },
  CHN_EDIT_CLOSED_ANSWER_ORDER(state, query) {
    let movedItem = state.tempClosedAnswer.find((item, index) => index == query.removedIndex)
    let remainItems = state.tempClosedAnswer.filter((item, index) => index != query.removedIndex)
    let reorderedItems = []
    remainItems.forEach((item, index) => {
      if (index === query.addedIndex) {
        reorderedItems.push(movedItem)
        reorderedItems.push(item)
      } else
        reorderedItems.push(item)

    });
    if (query.addedIndex == remainItems.length) reorderedItems.push(movedItem)
    state.tempClosedAnswer = reorderedItems
  },
  CHN_CLOSED_ANSWER_COLOR(state, query) {
    state.tempClosedAnswer[query.index].color = query.color
  },
  CHN_CLOSED_ANSWER_NAME(state, query) {
    state.tempClosedAnswer[query.index].name = query.name
  },
  REMOVE_CLOSED_ANSWER(state, query) {
    state.tempClosedAnswer = state.tempClosedAnswer.filter((item, index) => index != query)
  },
  CHN_TEMP_TEMPLATE(state, query) {
    if (query.target == "answer") {
      let allAnswers
      let answer
      if (state.tempTemplate.content.pages[query.index.page].questions[query.index.question] != undefined) {
        allAnswers = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers
        answer = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer]
      }

      if (query.key == "instruction") {
        answer.type = { id: answer.type.id, instruction: query.val }
      }
      else if (query.key == "title") {
        answer.title = query.val
      }
      else if (query.key == "type") {
        if (answer.type.id === undefined) {
          answer.type = { id: query.val }
        }
        else
          answer.type.id = query.val
        if (query.answerType !== undefined) {

          if (query.answerType.content == "automatic date and time stamp")
            answer.loged = new Date()

          else if (query.answerType.content == "automatic user stamp")
            answer.loged = JSON.parse(localStorage.getItem('userInfo')).id
          else if (query.answerType.content == "score")
            answer.loged = 0
          else if (query.answerType.content == "photo" || query.answerType.content == "receipts")
            answer.loged = []

          else
            answer.loged = ""
        }
        else
          answer.loged = ""
        answer.mandatory = false

      }
      else if (query.key == "date&time") {
        answer.type = { id: answer.type.id, dateType: query.val }
      }
      else if (query.key == "dropdown") {
        answer.type = { id: answer.type.id, dropdown: query.val }
      }
      else if (query.key == "tempUnit") {
        answer.type = Object.assign({}, answer.type, { tempUnit: query.val })
      }
      else if (query.key == "macAddress") {
        answer.type = Object.assign({}, answer.type, { macAddress: query.val })
      }
      else if (query.key == "failedAnswer") {
        answer.type = { id: answer.type.id, failedAnswer: query.val }
      }
      else if (query.key == "mandatory") {
        answer.mandatory = query.val
      }
      else if (query.key == "hasCondLogic") {
        answer.hasCondLogic = query.val
      }
      else if (query.key == "answerId") {
        answer.id = query.val
      }
      else if (query.key == 'duplicate') {
        allAnswers.push(
          JSON.parse(query.val)
        )
      }
      else if (query.key == 'addQuestion') {
        allAnswers.push({
          id: generateUniqueId(),
          title: "",
          type: {},
          action: {},
          mandatory: false,
          hasCondLogic: false,
          score: [],
          loged: ""
        })
      }
      else if (query.key == 'addLogicQuestion') {
        allAnswers.push({
          id: generateUniqueId(),
          parent: query.parent,
          tabId: query.tabId,
          title: "",
          type: {},
          action: {},
          mandatory: false,
          hasCondLogic: false,
          score: [],
          loged: "",
          isLogicQuestion: true
        })
      }
      else if (query.key == "disableConditionalLogic") {
        // mark false
        answer.hasCondLogic = false
        // remove logic questions which are contained in this answer
        allAnswers = allAnswers.filter(item => item.parent != answer.id)
        // remove tabs
        let conditionTabs = state.tempTemplate.content.conditionTabs
        conditionTabs = conditionTabs.filter(item => item.createdByAnswer != answer.id)
        state.tempTemplate.content.conditionTabs = conditionTabs
      }
      else if (query.key == "chnlogicAnswers") {
        answer.logicAnswers = query.val
      }
      else if (query.key == "chnAnswerOrder") {
        let movedItem = allAnswers.find((item, index) => index == query.val.removedIndex)
        let remainItems = allAnswers.filter((item, index) => index != query.val.removedIndex)
        let reorderedItems = []
        remainItems.forEach((item, index) => {
          if (index === query.val.addedIndex) {
            reorderedItems.push(movedItem)
            reorderedItems.push(item)
          } else
            reorderedItems.push(item)
        });
        if (query.val.addedIndex == remainItems.length) {
          reorderedItems.push(movedItem)
        }
        allAnswers = reorderedItems
      }
      else if (query.key == 'delete') {
        allAnswers = allAnswers.filter(item => item.id != query.val.answerId)
        console.log('allAnswers delete', allAnswers, query)
      }
      else if (query.key == 'action') {
        let action = answer.action;
        if (!Array.isArray(action)) { action = [action]; }
        answer.action = [...action, query.val]
      }
      else if (query.key == 'score') {
        answer.score = query.val
      }
      else if (query.key == 'addSection') {
        state.tempTemplate.content.pages[query.index.page].questions.push({
          title: "",
          answers: [
            {
              title: "",
              type: {},
              action: {},
              mandatory: false,
              hasCondLogic: false,
              score: [],
              loged: ""
            }
          ]
        })
      }
      else if (query.key == "chnSectionTitle") {
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].title = query.val
      }
      else if (query.key == "duplicateSection") {
        state.tempTemplate.content.pages[query.index.page].questions.push(JSON.parse(query.val))
      }
      else if (query.key == "deleteSection") {
        state.tempTemplate.content.pages[query.index.page].questions = state.tempTemplate.content.pages[query.index.page].questions.filter((item, index) => index != query.val)
      } else if (query.key == "chnAnswers") {
        allAnswers = query.val
      }

      if (state.tempTemplate.content.pages[query.index.page].questions[query.index.question] != undefined) {
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers = allAnswers
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer] = answer
      }
    }
    else if (query.target == "page") {
      if (query.key == "addPage") {
        state.tempTemplate.content.pages.push(query.val)
      }
      else if (query.key == "chnTitle") {
        state.tempTemplate.content.pages[query.index.page].title = query.val
      }
      else if (query.key == "deletePage") {
        state.tempTemplate.content.pages = state.tempTemplate.content.pages.filter((item, index) => index !== query.val)
      }
    }
    else if (query.target == "conditionTabs") {
      let conditionTabs = state.tempTemplate.content.conditionTabs
      if (!Array.isArray(conditionTabs)) {
        conditionTabs = []
      }
      if (query.key == "add") {
        conditionTabs.push(query.val)

      } else if (query.key == "chnTitle") {
        const tab = conditionTabs.find(tab => tab.id == query.tabId)
        tab.title = query.val;

      } else if (query.key == "chnCondition") {
        const tab = conditionTabs.find(tab => tab.id == query.tabId)
        tab.condition = query.val;

      } else if (query.key == "chnAnswers") {
        const tab = conditionTabs.find(tab => tab.id == query.tabId)
        tab.answers = query.val;

      } else if (query.key == "delete") {
        conditionTabs = conditionTabs.filter(item => item.id != query.val.tabId)
      }

      state.tempTemplate.content.conditionTabs = conditionTabs

    } else if (query.target == "template") {
      if (query.key == "chnTitle") {
        state.tempTemplate.content.templateTitle = query.val
      }
      else if (query.key == "chnComment") {
        state.tempTemplate.content.templateComment = query.val
      }
    }
  },
  LOG_VALUE(state, query) {
    if (state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged === undefined)
      state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer] = Object.assign({}, state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer], { loged: query.val })
    else state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = query.val
  },
  LOG_VALUE_IMAGE_ADD(state, query) {
    state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged.push(query.val)
  },
  LOG_VALUE_IMAGE_REMOVE(state, query) {
    state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged.filter(item => item.url != query.val)
  },
  SET_EDIT_ANSWER_INDEXES(state, query) {
    state.editAnswerIndexes = query
  },
  SET_EDIT_TYPE(state, query) {
    state.editType = query
  },
  SET_EDIT_ACTION(state, query) {
    state.editAction = query
  },
  SET_EDIT_SCORE(state, query) {
    state.editScore = query
  },
  SET_SUBSCRIPTION(state, query) {
    state.subscription = { ...state.subscription, ...query }
  },
  SET_CURRENT_PRICE_PLAN(state, query) {
    state.currentPricePlan = { ...state.currentPricePlan, ...query }
  },

}
