export default {
  SET_REPORT_SCHEDULE(state,query) {
    state.report_schedule = query
  },
  SET_AUTH(state ,query) {
    state.auth = query
  },
  CHN_AUTH(state, query) {
    const value = !state.auth[query.key][query.role][query.action]
    state.auth[query.key][query.role][query.action] = value

    if(query.action == 'view' && !value) {
      state.auth[query.key][query.role].edit = false
      state.auth[query.key][query.role].create = false
      state.auth[query.key][query.role].delete = false
    } else if (query.action != 'view' && value && !state.auth[query.key][query.role].view) {
      state.auth[query.key][query.role].view = true
    }
  },
  SET_IP_INFO(state , query) {
    state.ipInfo = query
  },
  SET_LABEL(state, query) {
    state.labels = query;
  },
  SET_TEMPLATE_TYPE(state, query) {
    state.templateTypes = query;
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
  UPDATE_LOG(state,query) {
    var index = state.logs.findIndex(item => item.id == query.id)
    if(index>-1) {
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
    state.logs = state.logs.filter(item=>item.id != query)
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
  CHN_TEMPLATE_TEAMS(state,query) {
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
    console.log('CHN_TEMP_TEMPLATE1:', query);
    if (query.target == "answer") {
      if (query.key == "instruction")
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = { id: state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type.id, instruction: query.val }
      else if (query.key == "title")
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].title = query.val
      else if (query.key == "type") {
        if (state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type.id === undefined) {
          state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = { id: query.val }
        }
        else
          state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type.id = query.val
        if (query.answerType !== undefined) {

          if (query.answerType.content == "automatic date and time stamp")
            state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = new Date()

          else if (query.answerType.content == "automatic user stamp")
            state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = JSON.parse(localStorage.getItem('userInfo')).id
          else if (query.answerType.content == "score")
            state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = 0
          else if (query.answerType.content == "photo" || query.answerType.content == "receipts")
            state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = []

          else
            state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = ""
        }
        else
          state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].loged = ""
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].mandatory = false

      }
      else if (query.key == "date&time") {
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = { id: state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type.id, dateType: query.val }
      }
      else if (query.key == "dropdown") {
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = { id: state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type.id, dropdown: query.val }
      }
      else if (query.key == "tempUnit") {
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = Object.assign({}, state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type, { tempUnit: query.val })
      }
      else if (query.key == "macAddress") {
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = Object.assign({}, state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type, { macAddress: query.val })
      }

      else if (query.key == "failedAnswer")
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type = { id: state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].type.id, failedAnswer: query.val }
      else if (query.key == "mandatory")
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].mandatory = query.val
      else if (query.key == 'duplicate')
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers.push(
          JSON.parse(query.val)
        )
      else if (query.key == 'addQuestion')
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers.push({
          title: "",
          type: {},
          action: {},
          mandatory: false,
          score: [],
          loged: ""
        })
      else if (query.key == "chnAnswerOrder") {
        let movedItem = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers.find((item, index) => index == query.val.removedIndex)
        let remainItems = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers.filter((item, index) => index != query.val.removedIndex)
        let reorderedItems = []
        remainItems.forEach((item, index) => {
          if (index === query.val.addedIndex) {
            reorderedItems.push(movedItem)
            reorderedItems.push(item)
          } else
            reorderedItems.push(item)
        });
        if (query.val.addedIndex == remainItems.length)
          reorderedItems.push(movedItem)
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers = reorderedItems
      }
      else if (query.key == 'delete')
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers.filter((item, index) => index !== query.index.answer)
      else if (query.key == 'action') {
        let action = state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].action;
        if (!Array.isArray(action)) action = [action];
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].action = [...action, query.val]
      }
      else if (query.key == 'score')
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers[query.index.answer].score = query.val
      else if (query.key == 'addSection') {
        state.tempTemplate.content.pages[query.index.page].questions.push({
          title: "",
          answers: [
            {
              title: "",
              type: {},
              action: {},
              mandatory: false,
              score: [],
              loged: ""
            }
          ]
        })
      }
      else if (query.key == "chnSectionTitle")
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].title = query.val
      else if (query.key == "duplicateSection")
        state.tempTemplate.content.pages[query.index.page].questions.push(JSON.parse(query.val))
      else if (query.key == "deleteSection")
        state.tempTemplate.content.pages[query.index.page].questions = state.tempTemplate.content.pages[query.index.page].questions.filter((item, index) => index != query.val)
      else if (query.key == "chnAnswers")
        state.tempTemplate.content.pages[query.index.page].questions[query.index.question].answers = query.val
    }
    else if (query.target == "page") {
      if (query.key == "addPage")
        state.tempTemplate.content.pages.push(query.val)
      else if (query.key == "chnTitle")
        state.tempTemplate.content.pages[query.index.page].title = query.val
      else if (query.key == "deletePage") {
        state.tempTemplate.content.pages = state.tempTemplate.content.pages.filter((item, index) => index !== query.val)
      }
    }
    else if (query.target == "template") {
      if (query.key == "chnTitle")
        state.tempTemplate.content.templateTitle = query.val
      else if (query.key == "chnComment")
        state.tempTemplate.content.templateComment = query.val
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
  }

}
